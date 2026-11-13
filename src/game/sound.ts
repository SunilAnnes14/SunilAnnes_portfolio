/** Tiny synthesized sound kit: no audio files to load. */

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** Call from a user gesture so browsers allow playback later. */
export function unlockAudio() {
  audio();
}

function noiseBuffer(c: AudioContext, seconds: number) {
  const buf = c.createBuffer(1, Math.floor(c.sampleRate * seconds), c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

function burst(
  c: AudioContext,
  at: number,
  { dur, freq, q = 1, type = "lowpass", gain = 1 }: { dur: number; freq: number; q?: number; type?: BiquadFilterType; gain?: number },
) {
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c, dur);
  const filter = c.createBiquadFilter();
  filter.type = type;
  filter.frequency.setValueAtTime(freq, at);
  filter.Q.value = q;
  const g = c.createGain();
  g.gain.setValueAtTime(gain, at);
  g.gain.exponentialRampToValueAtTime(0.001, at + dur);
  src.connect(filter).connect(g).connect(c.destination);
  src.start(at);
  src.stop(at + dur);
  return filter;
}

function tone(c: AudioContext, at: number, { from, to, dur, gain = 0.2, type = "sine" }: { from: number; to: number; dur: number; gain?: number; type?: OscillatorType }) {
  const osc = c.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(from, at);
  osc.frequency.exponentialRampToValueAtTime(to, at + dur);
  const g = c.createGain();
  g.gain.setValueAtTime(gain, at);
  g.gain.exponentialRampToValueAtTime(0.001, at + dur);
  osc.connect(g).connect(c.destination);
  osc.start(at);
  osc.stop(at + dur);
}

export const sfx = {
  blast(delay = 0) {
    const c = audio();
    if (!c) return;
    const t = c.currentTime + delay;
    const f = burst(c, t, { dur: 0.9, freq: 3000, gain: 1.2 });
    f.frequency.exponentialRampToValueAtTime(180, t + 0.6);
    tone(c, t, { from: 120, to: 35, dur: 0.5, gain: 0.9 });
  },
  click(delay = 0) {
    const c = audio();
    if (!c) return;
    const t = c.currentTime + delay;
    burst(c, t, { dur: 0.04, freq: 2500, q: 8, type: "bandpass", gain: 0.9 });
    burst(c, t + 0.07, { dur: 0.03, freq: 1800, q: 8, type: "bandpass", gain: 0.5 });
  },
  rack(delay = 0) {
    const c = audio();
    if (!c) return;
    const t = c.currentTime + delay;
    burst(c, t, { dur: 0.08, freq: 1400, q: 4, type: "bandpass", gain: 0.9 });
    burst(c, t + 0.18, { dur: 0.1, freq: 900, q: 4, type: "bandpass", gain: 1 });
  },
  shellDrop(delay = 0) {
    const c = audio();
    if (!c) return;
    const t = c.currentTime + delay;
    tone(c, t, { from: 2400, to: 1900, dur: 0.12, gain: 0.05, type: "triangle" });
  },
  blip(delay = 0) {
    const c = audio();
    if (!c) return;
    const t = c.currentTime + delay;
    tone(c, t, { from: 520, to: 880, dur: 0.14, gain: 0.08, type: "square" });
  },
  sip(delay = 0) {
    const c = audio();
    if (!c) return;
    const t = c.currentTime + delay;
    tone(c, t, { from: 330, to: 660, dur: 0.25, gain: 0.12 });
    tone(c, t + 0.15, { from: 440, to: 880, dur: 0.3, gain: 0.1 });
  },
  thud(delay = 0) {
    const c = audio();
    if (!c) return;
    const t = c.currentTime + delay;
    tone(c, t, { from: 90, to: 45, dur: 0.25, gain: 0.5 });
  },
};
