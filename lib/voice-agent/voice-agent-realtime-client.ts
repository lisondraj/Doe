/** Browser-side WebRTC connection to the OpenAI Realtime API for the /voice-agent OSCE coach. */

export interface VoiceAgentRealtimeSession {
  peerConnection: RTCPeerConnection;
  dataChannel: RTCDataChannel;
  audioElement: HTMLAudioElement;
  micStream: MediaStream;
  close: () => void;
}

const REALTIME_CALLS_URL = "https://api.openai.com/v1/realtime/calls";

async function fetchEphemeralKey(): Promise<string> {
  const response = await fetch("/api/voice-agent/session", { method: "POST" });
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

export async function connectVoiceAgentRealtimeSession(): Promise<VoiceAgentRealtimeSession> {
  const ephemeralKey = await fetchEphemeralKey();

  const peerConnection = new RTCPeerConnection();

  const audioElement = document.createElement("audio");
  audioElement.autoplay = true;
  peerConnection.ontrack = (event) => {
    audioElement.srcObject = event.streams[0];
  };

  let micStream: MediaStream;
  try {
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch {
    peerConnection.close();
    throw new Error("Microphone access is required for the OSCE voice coach.");
  }

  micStream.getTracks().forEach((track) => peerConnection.addTrack(track, micStream));

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
    throw new Error("Could not reach the voice agent. Check your connection and try again.");
  }

  if (!sdpResponse.ok) {
    peerConnection.close();
    micStream.getTracks().forEach((track) => track.stop());
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
  };

  return { peerConnection, dataChannel, audioElement, micStream, close };
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
