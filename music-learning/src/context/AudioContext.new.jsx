import { createContext, useContext, useState, useCallback } from 'react';
import * as Tone from 'tone';

const AudioContext = createContext(null);

export function AudioProvider({ children }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [synth, setSynth] = useState(null);

  const initializeAudioContext = useCallback(async () => {
    try {
      // Create synth if it doesn't exist
      if (!synth) {
        const newSynth = new Tone.Synth().toDestination();
        setSynth(newSynth);
        console.log('New synth created');
      }

      // Start and resume Tone.js context
      await Tone.start();
      await Tone.context.resume();
      console.log('Audio context initialized:', {
        contextState: Tone.context.state,
        hasSynth: !!synth
      });

      setIsInitialized(true);
      return true;
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
      return false;
    }
  }, [synth]);

  const playNote = useCallback(async ({ pitch, duration }) => {
    try {
      // Ensure we have a synth
      if (!synth) {
        const newSynth = new Tone.Synth().toDestination();
        setSynth(newSynth);
        console.log('Created new synth for playback');
      }

      // Ensure context is running
      if (!isInitialized || Tone.context.state !== 'running') {
        await initializeAudioContext();
      }

      console.log('Playing note:', { pitch, duration });
      synth.triggerAttackRelease(pitch, duration);
    } catch (error) {
      console.error('Error playing note:', error);
    }
  }, [synth, isInitialized, initializeAudioContext]);

  return (
    <AudioContext.Provider 
      value={{ 
        isInitialized,
        initializeAudioContext,
        playNote
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
