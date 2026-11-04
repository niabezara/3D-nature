/**
 * Procedural night ambience: detuned drones, filtered wind and sparse chimes.
 * Starts muted; the AudioContext is only created on the first toggle (a user gesture).
 */
export class AmbientSound {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private lowpass: BiquadFilterNode | null = null;
  private chimeTimer: ReturnType<typeof setTimeout> | undefined;
  private muffled = false;
  muted = true;

  /** Toggle sound. Returns the new muted state. */
  toggleMute(): boolean {
    const ctx = this.init();
    void ctx.resume();
    this.muted = !this.muted;
    const now = ctx.currentTime;
    const g = this.master!.gain;
    g.cancelScheduledValues(now);
    g.setValueAtTime(g.value, now);
    g.linearRampToValueAtTime(this.muted ? 0 : 0.6, now + (this.muted ? 0.8 : 2));
    return this.muted;
  }

  /** Muffle through the low-pass filter (used by the hover transition). */
  muffle(on: boolean) {
    this.muffled = on;
    if (!this.ctx || !this.lowpass) return;
    const now = this.ctx.currentTime;
    const f = this.lowpass.frequency;
    f.cancelScheduledValues(now);
    f.setValueAtTime(f.value, now);
    f.exponentialRampToValueAtTime(on ? 380 : 16000, now + (on ? 1.2 : 1.6));
  }

  dispose() {
    clearTimeout(this.chimeTimer);
    void this.ctx?.close();
    this.ctx = null;
  }

  private init(): AudioContext {
    if (this.ctx) return this.ctx;
    const ctx = (this.ctx = new AudioContext());

    const master = (this.master = ctx.createGain());
    master.gain.value = 0;
    const lp = (this.lowpass = ctx.createBiquadFilter());
    lp.type = "lowpass";
    lp.frequency.value = this.muffled ? 380 : 16000;
    lp.Q.value = 0.7;
    lp.connect(master);
    master.connect(ctx.destination);

    // feedback delay as a cheap reverb
    const delay = ctx.createDelay(2);
    const feedback = ctx.createGain();
    const wet = ctx.createGain();
    delay.delayTime.value = 0.42;
    feedback.gain.value = 0.45;
    wet.gain.value = 0.35;
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(wet);
    wet.connect(lp);

    // drones with slow swells
    const drones: [number, OscillatorType, number][] = [
      [110, "sine", 0.1], [164.81, "triangle", 0.035], [220.4, "sine", 0.05], [329.2, "sine", 0.025], [55, "sine", 0.08],
    ];
    drones.forEach(([freq, type, level], i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      osc.detune.value = i % 2 ? 7 : -5;
      gain.gain.value = level;
      lfo.frequency.value = 0.05 + i * 0.023;
      lfoGain.gain.value = level * 0.8;
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);
      osc.connect(gain);
      gain.connect(lp);
      gain.connect(delay);
      osc.start();
      lfo.start();
    });

    // wind: band-passed brown noise with a wandering centre frequency
    const length = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < length; i++) {
      last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
      data[i] = last * 3.5;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 420;
    band.Q.value = 0.6;
    const windGain = ctx.createGain();
    windGain.gain.value = 0.22;
    const windLfo = ctx.createOscillator();
    const windLfoGain = ctx.createGain();
    windLfo.frequency.value = 0.07;
    windLfoGain.gain.value = 260;
    windLfo.connect(windLfoGain);
    windLfoGain.connect(band.frequency);
    noise.connect(band);
    band.connect(windGain);
    windGain.connect(lp);
    noise.start();
    windLfo.start();

    // sparse pentatonic chimes
    const notes = [659.25, 783.99, 880, 987.77, 1174.66, 1318.5];
    const chime = () => {
      if (!this.ctx) return;
      if (!this.muted) {
        const t = ctx.currentTime;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = notes[(Math.random() * notes.length) | 0];
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.035, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 3.5);
        osc.connect(g);
        g.connect(lp);
        g.connect(delay);
        osc.start(t);
        osc.stop(t + 3.6);
      }
      this.chimeTimer = setTimeout(chime, 1800 + Math.random() * 4200);
    };
    chime();

    return ctx;
  }
}
