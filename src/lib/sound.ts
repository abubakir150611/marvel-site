// Lightweight synthesized UI sound effects using the Web Audio API.
// No external audio assets required — everything is generated on the fly.

let audioCtx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new Ctor();
  }
  return audioCtx;
}

function beep(freq: number, duration: number, type: OscillatorType, volume: number) {
  const ctx = getContext();
  if (!ctx) return;
  if (ctx.state === "suspended") ctx.resume();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

export const sound = {
  hover: () => beep(880, 0.06, "sine", 0.03),
  click: () => beep(220, 0.12, "square", 0.05),
  open: () => beep(440, 0.2, "triangle", 0.04),
  whoosh: () => beep(120, 0.3, "sawtooth", 0.03),
};
