import { createContext, useContext, useState, useCallback, useRef } from 'react';
import * as Tone from 'tone';

const AudioContext = createContext(null);

export function AudioProvider({ children }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const synthRef = useRef(null);

  const initializeAudioContext = useCallback(async () => {
    try {
      // Create synth if it doesn't exist
      if (!synthRef.current) {
        synthRef.current = new Tone.Synth().toDestination();
        console.log('New synth created');
      }

      // Start and resume Tone.js context
      await Tone.start();
      await Tone.context.resume();
      
      console.log('Audio context initialized:', {
        contextState: Tone.context.state,
        hasSynth: !!synthRef.current
      });

      setIsInitialized(true);
      return true;
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
      return false;
    }
  }, []);

  const playNote = useCallback(async ({ pitch, duration }) => {
    try {
      // Ensure we have a synth
      if (!synthRef.current) {
        synthRef.current = new Tone.Synth().toDestination();
        console.log('Created new synth for playback');
      }

      // Ensure context is running
      if (!isInitialized || Tone.context.state !== 'running') {
        await initializeAudioContext();
      }

      console.log('Playing note:', { 
        pitch, 
        duration,
        synthState: synthRef.current?.context.state,
        contextState: Tone.context.state
      });
      
      synthRef.current.triggerAttackRelease(pitch, duration);
    } catch (error) {
      console.error('Error playing note:', error);
    }
  }, [isInitialized, initializeAudioContext]);

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
