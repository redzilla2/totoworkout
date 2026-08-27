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
 * Plays one or more sawtooth tones together as a single blast (no external
 * asset files required) — shared by the countdown stab and the final horn.
 */
function playBlast(frequencies, duration, peakGain = 0.35) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const gain = ctx.createGain();

    const oscillators = frequencies.map(freq => {
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.connect(gain);
      return osc;
    });

    const releaseStart = Math.max(ctx.currentTime + 0.03, ctx.currentTime + duration - 0.08);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(peakGain, ctx.currentTime + 0.03);
    gain.gain.setValueAtTime(peakGain, releaseStart);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    gain.connect(ctx.destination);

    oscillators.forEach(osc => {
      osc.start();
      osc.stop(ctx.currentTime + duration + 0.02);
    });
  } catch (err) {
    console.warn('Web Audio error:', err);
  }
}

/**
 * Short, deep "stab" for the 3-2-1 countdown ticks leading up to the end of rest.
 */
export function playCountdownStab() {
  playBlast([165], 0.15); // deep single tone, quick blast
}

/**
 * Longer, slightly higher-pitched two-tone horn for when rest actually ends (0).
 */
export function playHornSound() {
  playBlast([233, 294], 0.6); // higher than the stab tone, sustained air-horn blast
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

      if (this.secondsLeft > 0 && this.secondsLeft <= 3) {
        playCountdownStab();
      }

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
