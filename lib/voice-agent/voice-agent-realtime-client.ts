/** Browser-side WebRTC connection to the OpenAI Realtime API for the /voice-agent OSCE coach. */

import type { VoiceAgentMode } from "@/lib/voice-agent/voice-agent-types";

export interface VoiceAgentRealtimeSession {
  peerConnection: RTCPeerConnection;
  dataChannel: RTCDataChannel;
  audioElement: HTMLAudioElement;
  micStream: MediaStream;
  audioSender: RTCRtpSender | null;
  nativeSpeed: number;
  close: () => void;
}

const REALTIME_CALLS_URL = "https://api.openai.com/v1/realtime/calls";

async function fetchEphemeralKey(
  mode: VoiceAgentMode,
  options?: { followup?: boolean; voice?: string; speed?: number; quality?: string },
): Promise<string> {
  const response = await fetch("/api/voice-agent/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mode,
      followup: options?.followup === true,
      voice: options?.voice,
      speed: options?.speed,
      quality: options?.quality,
    }),
  });
  const data = await response.json().catch(() => null);

  if (!response.ok || !data) {
    throw new Error(data?.error || "Could not start the voice agent session.");
  }

  const value: unknown = data.value ?? data.client_secret?.value;
  if (typeof value !== "string" || !value) {
    throw new Error("Voice agent session response was missing a client secret.");
  }

  return value;
}

export async function connectVoiceAgentRealtimeSession(
  mode: VoiceAgentMode = "practice",
  options?: { followup?: boolean; voice?: string; speed?: number; quality?: string },
): Promise<VoiceAgentRealtimeSession> {
  const ephemeralKey = await fetchEphemeralKey(mode, options);

  const peerConnection = new RTCPeerConnection();

  const audioElement = document.createElement("audio");
  audioElement.autoplay = true;
  audioElement.setAttribute("playsinline", "true");
  audioElement.style.display = "none";
  document.body.appendChild(audioElement);
  const nativeSpeed =
    typeof options?.speed === "number" && Number.isFinite(options.speed) ? options.speed : 1;
  audioElement.playbackRate = 1;
  peerConnection.ontrack = (event) => {
    audioElement.srcObject = event.streams[0];
  };

  let micStream: MediaStream;
  try {
    micStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: false,
        channelCount: 1,
      },
    });
  } catch {
    peerConnection.close();
    audioElement.remove();
    throw new Error("Microphone access is required for the OSCE voice coach.");
  }

  const audioTrack = micStream.getAudioTracks()[0] ?? null;
  const audioSender = audioTrack ? peerConnection.addTrack(audioTrack, micStream) : null;
  micStream.getTracks().forEach((track) => {
    if (track === audioTrack) return;
    peerConnection.addTrack(track, micStream);
  });

  const dataChannel = peerConnection.createDataChannel("oai-events");

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  let sdpResponse: Response;
  try {
    sdpResponse = await fetch(REALTIME_CALLS_URL, {
      method: "POST",
      body: offer.sdp,
      headers: {
        Authorization: `Bearer ${ephemeralKey}`,
        "Content-Type": "application/sdp",
      },
    });
  } catch {
    peerConnection.close();
    micStream.getTracks().forEach((track) => track.stop());
    audioElement.remove();
    throw new Error("Could not reach the voice agent. Check your connection and try again.");
  }

  if (!sdpResponse.ok) {
    peerConnection.close();
    micStream.getTracks().forEach((track) => track.stop());
    audioElement.remove();
    throw new Error("Could not negotiate the voice session with OpenAI.");
  }

  const answerSdp = await sdpResponse.text();
  await peerConnection.setRemoteDescription({ type: "answer", sdp: answerSdp });

  const close = () => {
    try {
      dataChannel.close();
    } catch {
      /** already closed */
    }
    try {
      peerConnection.close();
    } catch {
      /** already closed */
    }
    micStream.getTracks().forEach((track) => track.stop());
    audioElement.srcObject = null;
    audioElement.remove();
  };

  return { peerConnection, dataChannel, audioElement, micStream, audioSender, nativeSpeed, close };
}

export function sendRealtimeEvent(dataChannel: RTCDataChannel, event: Record<string, unknown>) {
  if (dataChannel.readyState !== "open") return;
  dataChannel.send(JSON.stringify(event));
}

export function setVoiceAgentMicEnabled(session: VoiceAgentRealtimeSession, enabled: boolean) {
  session.micStream.getAudioTracks().forEach((track) => {
    track.enabled = enabled;
  });
}

export function detachVoiceAgentMic(session: VoiceAgentRealtimeSession) {
  if (session.audioSender) void session.audioSender.replaceTrack(null);
}

export function attachVoiceAgentMic(session: VoiceAgentRealtimeSession) {
  const track = session.micStream.getAudioTracks()[0];
  if (!track || !session.audioSender) return;
  void session.audioSender.replaceTrack(track);
}

export function setVoiceAgentPlaybackRate(session: VoiceAgentRealtimeSession, speed: number) {
  const native = session.nativeSpeed > 0 ? session.nativeSpeed : 1;
  session.audioElement.playbackRate = speed / native;
}
