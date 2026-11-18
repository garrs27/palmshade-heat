let muted = false;
let audioContext;

export function mute(value) {
  muted = value;
}

// Short synthesized cues keep the game audio self-contained.
export function tone(kind = 'blip') {
  if (muted) return;
  try {
    audioContext ??= new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const now = audioContext.currentTime;
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.frequency.value = kind === 'siren' ? 520 : kind === 'success' ? 660 : kind === 'thud' ? 90 : 880;
    oscillator.type = kind === 'thud' ? 'sawtooth' : 'sine';
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    oscillator.start();
    oscillator.stop(now + 0.21);
  } catch {
    // Audio may be unavailable before the first user gesture.
  }
}
