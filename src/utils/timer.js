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
 *
 * Counts down against an absolute end timestamp rather than decrementing a
 * seconds-left counter once per tick. That distinction matters a lot on
 * mobile: browsers throttle (or fully suspend) setInterval while the screen
 * is locked or the tab is backgrounded, so a counter-based timer simply
 * loses whatever ticks it missed — the countdown looks "paused," and then
 * effectively restarts from wherever it happened to be when the phone woke
 * back up, instead of reflecting how much rest time actually passed. Ticking
 * against `endTime` sidesteps that entirely: however long the JS was
 * suspended for, the very next tick (or the forced one below) recomputes the
 * correct remaining time from real elapsed wall-clock time.
 */
export class RestTimer {
  constructor(onTick, onComplete) {
    this.onTick = onTick;
    this.onComplete = onComplete;
    this.endTime = 0;
    this.timerId = null;
    this.stabsPlayed = null;
    this.completed = false;
    // Also force an immediate recompute the instant the tab/screen becomes
    // visible again, rather than waiting for the next scheduled tick — which
    // itself may have been delayed by the same throttling, so the display
    // could otherwise sit stale for a while even after you're looking at it.
    this._onVisible = () => {
      if (!document.hidden) this._tick();
    };
  }

  // `endTime`, if given, resumes an already-running countdown (e.g. one
  // restored from a persisted session after a reload) — otherwise a fresh
  // one is computed from `seconds`.
  start(seconds, endTime) {
    this.stop();
    this.endTime = endTime || (Date.now() + seconds * 1000);
    this.stabsPlayed = new Set();
    this.completed = false;
    this._tick();
    this.timerId = setInterval(() => this._tick(), 1000);
    document.addEventListener('visibilitychange', this._onVisible);
  }

  _tick() {
    if (this.completed) return;
    const secondsLeft = Math.max(0, Math.ceil((this.endTime - Date.now()) / 1000));
    if (this.onTick) this.onTick(secondsLeft);

    // Guarded by stabsPlayed so a delayed/throttled tick that jumps several
    // seconds at once (e.g. right after the screen wakes) can't replay every
    // stab it "missed" in a burst — it just picks up wherever the real
    // countdown actually is.
    if (secondsLeft > 0 && secondsLeft <= 3 && !this.stabsPlayed.has(secondsLeft)) {
      this.stabsPlayed.add(secondsLeft);
      playCountdownStab();
    }

    if (secondsLeft <= 0) {
      this.completed = true;
      this.stop();
      playHornSound();
      if (this.onComplete) this.onComplete();
    }
  }

  stop() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    document.removeEventListener('visibilitychange', this._onVisible);
  }

  addTime(seconds) {
    this.endTime += seconds * 1000;
    this.completed = false;
    this._tick();
  }

  getEndTime() {
    return this.endTime;
  }
}
