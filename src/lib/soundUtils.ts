// Simple sound effects using Web Audio API
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

// Play a star collection sound
export function playStarSound() {
  try {
    const ctx = getAudioContext();
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.frequency.setValueAtTime(987.77, ctx.currentTime); // B5
    osc2.frequency.setValueAtTime(1318.51, ctx.currentTime); // E6

    osc1.type = 'sine';
    osc2.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

    osc1.start(ctx.currentTime);
    osc2.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.2);
    osc2.stop(ctx.currentTime + 0.2);
  } catch (error) {
    console.warn('Could not play star sound:', error);
  }
}

// Play a heart loss sound
export function playHeartLossSound() {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(200, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.1);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  } catch (error) {
    console.warn('Could not play heart loss sound:', error);
  }
}




// Play countdown beep
export function playCountdownBeep() {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  } catch (error) {
    console.warn('Could not play countdown beep:', error);
  }
}

// Background music state
let menuMusicInterval: number | null = null;
let menuMusicGainNode: GainNode | null = null;
let menuMusicTimeout: number | null = null;
let activeOscillators: OscillatorNode[] = [];
let isPlaying = false;

// Play cheerful menu music (looping melody)
export function playMenuMusic() {
  // Stop any existing music completely
  stopMenuMusic();
  
  try {
    const ctx = getAudioContext();
    
    // Create fresh gain node
    menuMusicGainNode = ctx.createGain();
    menuMusicGainNode.gain.setValueAtTime(0.04, ctx.currentTime);
    menuMusicGainNode.connect(ctx.destination);
    
    // Reset state
    isPlaying = true;
    activeOscillators = [];

    // Simple, melodic tune (not a scale) - peaceful with exciting ending
    const melody = [
      { note: 659.25, duration: 0.5 },  // E5 - smooth
      { note: 783.99, duration: 0.5 },  // G5 - smooth
      { note: 659.25, duration: 0.5 },  // E5 - smooth
      { note: 523.25, duration: 0.9 },  // C5 - smooth
      { note: 0, duration: 0.4 },       // Rest
      
      { note: 587.33, duration: 0.5 },  // D5 - smooth
      { note: 698.46, duration: 0.5 },  // F5 - smooth
      { note: 783.99, duration: 0.7 },  // G5
      { note: 587.33, duration: 0.9 },  // D5
      { note: 0, duration: 0.8 },       // Rest
      
      { note: 783.99, duration: 0.5 },  // G5 - smooth
      { note: 659.25, duration: 0.5 },  // E5 - smooth
      { note: 523.25, duration: 1.0 },  // C5
      { note: 0, duration: 0.4 },       // Rest
      
      // Exciting buildup to ending!
      { note: 659.25, duration: 0.4 },  // E5
      { note: 783.99, duration: 0.4 },  // G5
      { note: 880.00, duration: 0.4 },  // A5
      { note: 987.77, duration: 0.5 },  // B5
      { note: 1046.5, duration: 0.6 },  // C6 - climax!
      { note: 987.77, duration: 0.4 },  // B5
      { note: 880.00, duration: 0.4 },  // A5
      { note: 783.99, duration: 0.5 },  // G5
      { note: 659.25, duration: 0.8 },  // E5
      { note: 523.25, duration: 1.2 },  // C5 - resolution
      { note: 0, duration: 2.5 },       // Very long pause before loop
    ];
    




    const playMelody = () => {
      if (!menuMusicGainNode || !isPlaying) {
        return;
      }

      const currentGainNode = menuMusicGainNode;
      const startTime = ctx.currentTime;
      
      let noteTime = 0;
      melody.forEach((noteData) => {
        if (noteData.note > 0) {
          const noteGain = ctx.createGain();
          noteGain.connect(currentGainNode);
          
          const attackTime = 0.015;
          const releaseTime = 0.18;
          const noteDuration = noteData.duration * 0.9;
          
          noteGain.gain.setValueAtTime(0, startTime + noteTime);
          noteGain.gain.linearRampToValueAtTime(1, startTime + noteTime + attackTime);
          noteGain.gain.setValueAtTime(1, startTime + noteTime + noteDuration - releaseTime);
          noteGain.gain.linearRampToValueAtTime(0, startTime + noteTime + noteDuration);
          
          const oscillator = ctx.createOscillator();
          oscillator.connect(noteGain);
          oscillator.frequency.setValueAtTime(noteData.note, startTime + noteTime);
          oscillator.type = 'sine';

          const filter = ctx.createBiquadFilter();

          oscillator.start(startTime + noteTime);
          oscillator.stop(startTime + noteTime + noteDuration);
          
          activeOscillators.push(oscillator);
          
          oscillator.onended = () => {
            const index = activeOscillators.indexOf(oscillator);
            if (index > -1) {
              activeOscillators.splice(index, 1);
            }
          };
        }
        
        noteTime += noteData.duration;
      });
    };

    // Play the melody once
    playMelody();

    // Schedule next loop after melody completes (prevents overlap)
    const totalDuration = melody.reduce((sum, note) => sum + note.duration, 0);
    
    const scheduleNextLoop = () => {
      menuMusicTimeout = window.setTimeout(() => {
        if (menuMusicGainNode && isPlaying) { // Only continue if music hasn't been stopped
          playMelody();
          scheduleNextLoop(); // Schedule the next iteration
        }
      }, totalDuration * 1000);
    };
    
    scheduleNextLoop();

  } catch (error) {
    console.warn('Could not play menu music:', error);
  }
}

// Stop menu music
export function stopMenuMusic() {
  isPlaying = false;
  
  if (menuMusicInterval !== null) {
    clearInterval(menuMusicInterval);
    menuMusicInterval = null;
  }
  if (menuMusicTimeout !== null) {
    clearTimeout(menuMusicTimeout);
    menuMusicTimeout = null;
  }
  
  // Clear oscillators array but don't try to stop them
  // (they're scheduled to stop themselves)
  activeOscillators = [];
  
  if (menuMusicGainNode) {
    try {
      const ctx = getAudioContext();
      // Quick fade to silence on the master gain
      menuMusicGainNode.gain.cancelScheduledValues(ctx.currentTime);
      menuMusicGainNode.gain.setValueAtTime(menuMusicGainNode.gain.value, ctx.currentTime);
      menuMusicGainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.05);
      
      const nodeToDisconnect = menuMusicGainNode;
      setTimeout(() => {
        try {
          nodeToDisconnect.disconnect();
        } catch (e) {
          // Already disconnected
        }
      }, 100);
      
      menuMusicGainNode = null;
    } catch (e) {
      menuMusicGainNode = null;
    }
  }
}
