// ── Shared sound system ────────────────────────────────────
// Imported by pomodoro.js and stopwatch.js.
// The toggle button lives in the Pomodoro card; both modules
// read the same `soundEnabled` state.

export let soundEnabled = true;
let audioCtx = null;

function getAudioCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
}

export function playTone(freq, duration, type, gain) {
    if (!soundEnabled) return;
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gainNode.gain.setValueAtTime(gain || 0.18, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
}

// Named events used by Pomodoro
export function playSound(event) {
    if (event === 'session') {
        playTone(523, 0.18, 'sine', 0.16);
        setTimeout(() => playTone(659, 0.25, 'sine', 0.14), 160);
    } else if (event === 'break') {
        playTone(392, 0.22, 'sine', 0.14);
        setTimeout(() => playTone(330, 0.3, 'sine', 0.12), 180);
    } else if (event === 'end') {
        playTone(440, 0.15, 'sine', 0.15);
        setTimeout(() => playTone(440, 0.15, 'sine', 0.13), 200);
        setTimeout(() => playTone(440, 0.22, 'sine', 0.11), 400);
    }
}

// Stopwatch-specific sounds — subtle single tones
export function playSwSound(event) {
    if (event === 'start') {
        // Single soft tick upward
        playTone(600, 0.12, 'sine', 0.12);
    } else if (event === 'stop') {
        // Slightly lower, gentle
        playTone(480, 0.12, 'sine', 0.11);
    } else if (event === 'lap') {
        // Quick light double-tick
        playTone(700, 0.08, 'sine', 0.1);
        setTimeout(() => playTone(700, 0.1, 'sine', 0.08), 100);
    } else if (event === 'clear') {
        // Very soft low sweep — optional, quiet
        playTone(320, 0.18, 'sine', 0.08);
    }
}

// Called by the Pomodoro sound toggle button
export function setSoundEnabled(val) {
    soundEnabled = val;
}
