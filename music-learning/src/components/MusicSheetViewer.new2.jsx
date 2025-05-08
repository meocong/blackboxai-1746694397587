import { useEffect, useRef, useState } from 'react';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import { musicalTerms } from '../data/musicalTerms';
import { useAudio } from '../context/AudioContext';
import * as Tone from 'tone';

export default function MusicSheetViewer({ isPreviewMode = false }) {
  const containerRef = useRef(null);
  const osmdRef = useRef(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);
  const { playNote, initializeAudioContext } = useAudio();

  // ... rest of your existing code ...

  const handleClick = async (event) => {
    try {
      // Resume audio context on first user interaction
      if (Tone.context.state !== 'running') {
        await Tone.context.resume();
        console.log('AudioContext resumed on user interaction');
      }

      // Initialize audio context if not started
      if (!audioStarted) {
        const started = await initializeAudioContext();
        if (!started) {
          console.warn('Failed to initialize audio context');
          return;
        }
        setAudioStarted(true);
        // Add a small delay to ensure audio context is fully initialized
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Rest of your existing click handler code...
    } catch (err) {
      console.warn('Error finding note for playback:', err);
    }
  };

  // ... rest of your existing code ...
}
