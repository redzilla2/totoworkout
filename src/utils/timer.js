/**
 * Plays a pleasant audio chime using Web Audio API (no external asset files required)
 */
export function playChimeSound(frequency = 880, duration = 0.3) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, ctx.currentTime + duration);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (err) {
    console.warn('Web Audio error:', err);
  }
}

/**
 * High-pitch completion chime
 */
export function playSuccessChime() {
  playChimeSound(523.25, 0.15); // C5
  setTimeout(() => playChimeSound(659.25, 0.15), 150); // E5
  setTimeout(() => playChimeSound(783.99, 0.3), 300); // G5
}

/**
 * Single two-tone "air horn" style blast (no external asset files required)
 */
function playHornBlast() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';
    osc1.frequency.setValueAtTime(233, ctx.currentTime); // low honk tone
    osc2.frequency.setValueAtTime(294, ctx.currentTime); // classic two-tone air-horn interval

    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.35, ctx.currentTime + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.5);
    osc2.stop(ctx.currentTime + 0.5);
  } catch (err) {
    console.warn('Web Audio error:', err);
  }
}

/**
 * "Honk-honk" rest-over alert — plays two horn blasts back to back.
 */
export function playHornSound() {
  playHornBlast();
  setTimeout(() => playHornBlast(), 550);
}

/**
 * Rest Timer Controller class
 */
export class RestTimer {
  constructor(onTick, onComplete) {
    this.onTick = onTick;
    this.onComplete = onComplete;
    this.secondsLeft = 0;
    this.timerId = null;
  }

  start(seconds) {
    this.stop();
    this.secondsLeft = seconds;
    if (this.onTick) this.onTick(this.secondsLeft);

    this.timerId = setInterval(() => {
      this.secondsLeft--;
      if (this.onTick) this.onTick(this.secondsLeft);

      if (this.secondsLeft <= 0) {
        this.stop();
        playHornSound();
        if (this.onComplete) this.onComplete();
      }
    }, 1000);
  }

  stop() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  addTime(seconds) {
    this.secondsLeft = Math.max(0, this.secondsLeft + seconds);
    if (this.onTick) this.onTick(this.secondsLeft);
  }
}
