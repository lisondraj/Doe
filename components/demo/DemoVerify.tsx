"use client";

/**
 * /demo/verify/<token>: the identity check a patient's agent sends them after connecting to the clinic. Their name is
 * already filled in; they confirm their date of birth, attach a photo of their driver's licence, and submit with Face ID
 * (a WebAuthn platform check: Face ID on iPhone, Touch ID on a Mac). Then: "Thank you, your agent will continue from
 * here", and a button back to Messages.
 */
import { useRef, useState } from "react";

import { DISPLAY, DemoFrame } from "@/components/demo/DemoFrame";

type State =
  | { error: "missing" | "expired" }
  | { done: true; userName: string; agentName: string }
  | { done: false; userName: string; agentName: string; challenge: string; clinic: string };

type Attached = { dataUrl: string; fileName: string; size: number; preview: string | null };

/** Licence photos come off the camera at several MB; this keeps them sharp enough to read and small to send. */
const MAX_SIDE = 1600;

const b64url = (buf: ArrayBuffer) => {
  let s = "";
  new Uint8Array(buf).forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
const fromB64url = (s: string) => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4)), (c) => c.charCodeAt(0));

async function shrink(file: File): Promise<Attached> {
  if (file.type === "application/pdf") {
    const dataUrl = await new Promise<string>((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(String(r.result));
      r.onerror = rej;
      r.readAsDataURL(file);
    });
    return { dataUrl, fileName: file.name, size: file.size, preview: null };
  }
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = url;
    });
    const scale = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
    const name = file.name.replace(/\.[^.]+$/, "") || "drivers-licence";
    return { dataUrl, fileName: `${name}.jpg`, size: Math.round((dataUrl.length - 23) * 0.75), preview: dataUrl };
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Face ID: a platform credential with user verification for the server's challenge. Null when the device has none. */
async function faceId(challenge: string, userName: string) {
  if (typeof window === "undefined" || !window.PublicKeyCredential) return null;
  const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().catch(() => false);
  if (!available) return null;
  const cred = (await navigator.credentials.create({
    publicKey: {
      challenge: fromB64url(challenge),
      rp: { name: "Doe", id: window.location.hostname },
      user: { id: crypto.getRandomValues(new Uint8Array(16)), name: userName, displayName: userName },
      pubKeyCredParams: [
        { type: "public-key", alg: -7 },
        { type: "public-key", alg: -257 },
      ],
      authenticatorSelection: { authenticatorAttachment: "platform", userVerification: "required", residentKey: "discouraged" },
      attestation: "none",
      timeout: 60_000,
    },
  })) as PublicKeyCredential | null;
  if (!cred) throw new Error("cancelled");
  const res = cred.response as AuthenticatorAttestationResponse;
  const authData = typeof res.getAuthenticatorData === "function" ? b64url(res.getAuthenticatorData()) : undefined;
  return { clientDataJSON: b64url(res.clientDataJSON), authenticatorData: authData };
}

function FaceIdGlyph({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9 9.5v1.2M15 9.5v1.2M12 9.5v3.6h-1M9.5 15.6c1.4 1.1 3.6 1.1 5 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** A green rounded square with a white speech bubble, standing in for the Messages app. */
function MessagesGlyph() {
  return (
    <span className="w-[30px] h-[30px] shrink-0 flex items-center justify-center rounded-[8px] bg-gradient-to-b from-[#67E86B] to-[#1FC33D]" aria-hidden="true">
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path d="M12 4.5c-4.7 0-8.5 3.1-8.5 7 0 2.1 1.1 4 2.9 5.3-.2 1.2-.8 2.3-1.6 3.1 1.8-.1 3.3-.8 4.4-1.7.9.2 1.8.3 2.8.3 4.7 0 8.5-3.1 8.5-7s-3.8-7-8.5-7z" fill="#fff" />
      </svg>
    </span>
  );
}

function Done({ agentName }: { agentName: string }) {
  return (
    <main className="doe-menu-in mx-auto w-full max-w-[460px] px-[18px] pt-[36px] pb-[64px] flex flex-col items-center text-center">
      <span className="w-[88px] h-[88px] flex items-center justify-center rounded-full bg-[#DCE5D0]">
        <svg width="40" height="40" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#2F3B2A" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <h1 className={`${DISPLAY} mt-[22px] text-[32px] leading-[36px] tracking-[-0.02em]`}>Thank you, your agent will continue from here.</h1>
      <p className="mt-[10px] text-[15px] leading-[21px] text-[#2819109E]">{agentName} has what it needs to finish your booking.</p>
      <a href="sms:" className="mt-[28px] w-full h-[58px] flex items-center justify-center gap-[12px] rounded-[16px] bg-[#3A2516] text-[#FFFCF1] text-[16px] font-[700]">
        <MessagesGlyph />
        Return to Messages
      </a>
      <p className="mt-[12px] text-[12.5px] text-[#28191080]">Or close this page.</p>
    </main>
  );
}

export function DemoVerify({ token, state }: { token: string; state: State }) {
  const [dob, setDob] = useState("");
  const [file, setFile] = useState<Attached | null>(null);
  const [busy, setBusy] = useState<null | "photo" | "faceid" | "send">(null);
  const [error, setError] = useState<string | null>(null);
  const [skipFace, setSkipFace] = useState(false);
  const [done, setDone] = useState("done" in state && state.done);
  const input = useRef<HTMLInputElement>(null);

  if ("error" in state) {
    return (
      <DemoFrame>
        <main className="mx-auto max-w-[460px] px-[18px] pt-[40px] text-center">
          <h1 className={`${DISPLAY} text-[30px] leading-[34px]`}>{state.error === "expired" ? "Link expired" : "Link not found"}</h1>
          <p className="mt-[10px] text-[15px] leading-[21px] text-[#281910CC]">Ask your agent for a new link to confirm it&apos;s you.</p>
        </main>
      </DemoFrame>
    );
  }
  if (done) {
    return (
      <DemoFrame>
        <Done agentName={state.agentName} />
      </DemoFrame>
    );
  }
  const s = state as Extract<State, { done: false }>;

  const submit = async () => {
    setError(null);
    if (!dob) return setError("Enter your date of birth.");
    if (!file) return setError("Attach a photo of your driver's licence.");
    let webauthn: Awaited<ReturnType<typeof faceId>> = null;
    if (!skipFace) {
      setBusy("faceid");
      try {
        webauthn = await faceId(s.challenge, s.userName);
      } catch {
        setBusy(null);
        return setError("Face ID didn't finish. Tap Confirm to try again.");
      }
    }
    setBusy("send");
    const res = await fetch(`/api/demo/verify/${token}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ dob, license: { dataUrl: file.dataUrl, fileName: file.fileName }, ...(webauthn ? { webauthn } : {}) }),
    }).catch(() => null);
    const data = res ? await res.json().catch(() => ({})) : {};
    setBusy(null);
    if (!res?.ok) return setError((data as { error?: string }).error ?? "Couldn't send that. Check your connection and try again.");
    setDone(true);
  };

  const label = "text-[12.5px] font-[600] text-[#28191099]";
  return (
    <DemoFrame>
      <main className="mx-auto w-full max-w-[480px] px-[16px] pt-[6px] pb-[48px] flex flex-col gap-[12px]">
        <div className="px-[4px]">
          <p className="text-[13px] font-[500] text-[#2819109E]">
            {s.agentName} · {s.clinic}
          </p>
          <h1 className={`${DISPLAY} mt-[4px] text-[34px] leading-[38px] tracking-[-0.02em]`}>Confirm it&apos;s you</h1>
          <p className="mt-[6px] text-[14.5px] leading-[21px] text-[#281910CC]">Before {s.agentName} books for you, the clinic needs to know it&apos;s really you. This takes a few seconds.</p>
        </div>

        <div className="flex flex-col gap-[4px] p-[5px] rounded-[24px] bg-[#F4EEDF]">
          <div className="flex items-center gap-[12px] min-h-[60px] px-[16px] rounded-[19px] bg-[#FFFCF1]">
            <span className="grow min-w-0">
              <span className={`block ${label}`}>Name</span>
              <span className="block text-[17px] font-[600] truncate">{s.userName}</span>
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" aria-label="Filled in by your agent" className="shrink-0 text-[#2819107A]">
              <rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </div>
          <label className="flex flex-col justify-center gap-[2px] min-h-[64px] px-[16px] rounded-[19px] bg-[#FFFCF1]">
            <span className={label}>Date of Birth</span>
            <input
              type="date"
              value={dob}
              max={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setDob(e.target.value)}
              className="w-full min-h-[30px] bg-transparent outline-none text-[17px] text-[#281910] [color-scheme:light]"
            />
          </label>
          <div className="flex flex-col gap-[10px] p-[14px_16px] rounded-[19px] bg-[#FFFCF1]">
            <span className={label}>Driver&apos;s Licence</span>
            {file ? (
              <div className="flex items-center gap-[12px]">
                {file.preview ? (
                  // eslint-disable-next-line @next/next/no-img-element -- a local preview of the user's own photo
                  <img src={file.preview} alt="Your driver's licence" className="w-[96px] h-[62px] shrink-0 rounded-[8px] object-cover border border-solid border-[#2819101F]" />
                ) : (
                  <span className="w-[96px] h-[62px] shrink-0 flex items-center justify-center rounded-[8px] bg-[#F4EEDF] text-[12px] font-[700]">PDF</span>
                )}
                <span className="grow min-w-0">
                  <span className="flex items-center gap-[6px] text-[14.5px] font-[600] text-[#2F3B2A]">
                    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Attached
                  </span>
                  <span className="block truncate text-[12.5px] text-[#2819109E]">
                    {file.fileName} · {Math.max(1, Math.round(file.size / 1024))} KB
                  </span>
                </span>
                <button type="button" onClick={() => input.current?.click()} className="shrink-0 h-[36px] px-[12px] rounded-full bg-[#F4EEDF] text-[13px] font-[600]">
                  Replace
                </button>
              </div>
            ) : (
              <button
                type="button"
                disabled={busy === "photo"}
                onClick={() => input.current?.click()}
                className="h-[52px] flex items-center justify-center gap-[10px] rounded-[14px] border-[1.5px] border-dashed border-[#28191040] text-[15px] font-[600] disabled:opacity-60"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="6" width="18" height="13" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="9" cy="12.5" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M13.5 11h4.5M13.5 14h3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                {busy === "photo" ? "Preparing photo…" : "Upload Driver's Licence"}
              </button>
            )}
            <input
              ref={input}
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                e.target.value = "";
                if (!f) return;
                setBusy("photo");
                setError(null);
                try {
                  setFile(await shrink(f));
                } catch {
                  setError("Couldn't read that photo. Try another, or take a new one.");
                }
                setBusy(null);
              }}
            />
          </div>
        </div>

        {error && <p className="px-[6px] text-[13.5px] font-[600] text-[#B4532F]">{error}</p>}

        <button
          type="button"
          disabled={Boolean(busy)}
          onClick={() => void submit()}
          className="h-[58px] flex items-center justify-center gap-[10px] rounded-[16px] bg-[#3A2516] text-[#FFFCF1] text-[16px] font-[700] disabled:opacity-60 enabled:active:scale-[0.99] transition-transform"
        >
          {!skipFace && <FaceIdGlyph />}
          {busy === "faceid" ? "Waiting for Face ID…" : busy === "send" ? "Sending…" : skipFace ? "Submit" : "Submit with Face ID"}
        </button>
        {error?.startsWith("Face ID") && !skipFace && (
          <button type="button" onClick={() => setSkipFace(true)} className="self-center text-[13px] font-[500] text-[#2819109E] underline underline-offset-2">
            My device doesn&apos;t have Face ID
          </button>
        )}

        <p className="px-[6px] text-[12px] leading-[17px] text-[#28191080]">
          Your date of birth and licence go only to {s.clinic}, to confirm it&apos;s you. Face ID stays on your phone; Doe never sees your face.
        </p>
      </main>
    </DemoFrame>
  );
}
