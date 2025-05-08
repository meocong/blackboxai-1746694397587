import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import * as Tone from 'tone';

const AudioContext = createContext(null);

export function AudioProvider({ children }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [synth, setSynth] = useState(null);
  const [volume, setVolume] = useState(-12); // Default volume in decibels

  // Initialize Tone.js and synth
  useEffect(() => {
    const setupAudio = async () => {
      try {
        // Create new synth
        const newSynth = new Tone.Synth().toDestination();
        newSynth.volume.value = volume;
        setSynth(newSynth);
        console.log('Synth created');

        // Start Tone.js context (this will be suspended until user interaction)
        await Tone.start();
        console.log('Tone.js context created');
      } catch (error) {
        console.error('Error setting up audio:', error);
      }
    };

    setupAudio();
  }, []); // Empty dependency array - only run once on mount

  const initializeAudioContext = useCallback(async () => {
    console.log('Initializing audio context...');
    
    try {
      if (!synth) {
        console.warn('No synth available, creating new one...');
        const newSynth = new Tone.Synth().toDestination();
        newSynth.volume.value = volume;
        setSynth(newSynth);
      }

      // Ensure Tone.js context is started
      if (Tone.context.state === 'suspended') {
        await Tone.start();
        console.log('Tone.js context started');
      }

      // Resume both Tone context and synth context
      await Promise.all([
        Tone.context.resume(),
        synth?.context.resume()
      ]);
      
      console.log('Audio contexts resumed:', {
        toneState: Tone.context.state,
        synthState: synth?.context.state
      });

      setIsInitialized(true);
      return true;
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
      return false;
    }
  }, [synth, volume]);

  const playNote = useCallback(async ({ pitch, duration }) => {
    console.log('playNote called with:', { pitch, duration });
    
    if (!synth) {
      console.warn('Synth not available. Current state:', {
        synth: !!synth,
        isInitialized,
        contextState: Tone.context.state
      });
      return;
    }

    if (!isInitialized) {
      console.warn('AudioContext not initialized, attempting to initialize...');
      const initialized = await initializeAudioContext();
      if (!initialized) {
        console.error('Failed to initialize AudioContext. State:', {
          contextState: Tone.context.state,
          synthState: synth.context.state
        });
        return;
      }
      console.log('AudioContext initialized successfully');
    }

    try {
      // Double-check context state
      if (Tone.context.state !== 'running') {
        console.log('Resuming Tone.context...');
        await Tone.context.resume();
        console.log('Tone.context resumed successfully');
      }

      console.log('Playing note:', {
        pitch,
        duration,
        synthState: synth.context.state,
        contextState: Tone.context.state
      });
      
      await synth.triggerAttackRelease(pitch, duration);
      console.log('Note played successfully');
    } catch (error) {
      console.error('Error playing note:', {
        error,
        synthState: synth?.context?.state,
        contextState: Tone.context.state,
        pitch,
        duration
      });
    }
  }, [synth, isInitialized, initializeAudioContext]);

  const setAudioVolume = useCallback((newVolume) => {
    if (synth) {
      const volumeInDb = Tone.gainToDb(newVolume);
      synth.volume.value = volumeInDb;
      setVolume(volumeInDb);
    }
  }, [synth]);

  return (
    <AudioContext.Provider 
      value={{ 
        isInitialized,
        initializeAudioContext,
        playNote,
        setAudioVolume,
        volume
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
