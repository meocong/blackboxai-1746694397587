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

  useEffect(() => {
    const loadSampleSheet = async () => {
      if (!containerRef.current || !osmdRef.current) return;

      try {
        setIsLoading(true);
        const response = await fetch('/sample.musicxml');
        const xmlText = await response.text();
        await osmdRef.current.load(xmlText);
        await osmdRef.current.render();
        setupInteractions();
        console.log('Sample music sheet loaded successfully');
      } catch (err) {
        console.error('Error loading sample music sheet:', err);
        setError('Không thể tải bản nhạc mẫu. Vui lòng thử lại.');
      } finally {
        setIsLoading(false);
      }
    };

    if (containerRef.current) {
      osmdRef.current = new OpenSheetMusicDisplay(containerRef.current);
      osmdRef.current.setOptions({
        autoResize: true,
        drawTitle: true,
        drawSubtitle: true,
        drawComposer: true,
        drawLyricist: true,
        followCursor: true,
        disableCursor: false,
        defaultColorNotehead: "#000000",
        drawingParameters: "default",
        cursorsOptions: [{
          type: 0,
          color: "#4F46E5",
          alpha: 0.5,
          follow: true
        }]
      });

      loadSampleSheet();
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('mouseover', handleMouseOver);
        containerRef.current.removeEventListener('mouseout', handleMouseOut);
        containerRef.current.removeEventListener('click', handleClick);
      }
    };
  }, []);

  const handleClick = async (event) => {
    console.log('Click event:', {
      clientX: event.clientX,
      clientY: event.clientY,
      target: event.target,
      targetClasses: Array.from(event.target.classList || [])
    });

    try {
      // Initialize audio context if needed
      if (!audioStarted) {
        console.log('Starting audio initialization...');
        const started = await initializeAudioContext();
        if (!started) {
          console.warn('Failed to initialize audio context');
          return;
        }
        setAudioStarted(true);
        console.log('Audio initialization successful');
        
        // Add a small delay to ensure everything is ready
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Get click coordinates relative to the container
      const rect = containerRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Find all SVG elements that might be notes
      const svgElements = containerRef.current.getElementsByTagName('path');
      const noteElements = Array.from(svgElements).filter(el => {
        // Check if the element is part of a note
        const parent = el.parentElement;
        return parent && (
          parent.classList.contains('note') ||
          parent.classList.contains('vf-note') ||
          parent.classList.contains('vf-notehead') ||
          parent.getAttribute('class')?.includes('note')
        );
      });

      console.log('Found potential note elements:', noteElements.length);

      // Find closest note to click position
      let closestElement = null;
      let minDistance = Infinity;
      let closestRect = null;

      noteElements.forEach(noteEl => {
        const noteRect = noteEl.getBoundingClientRect();
        // Convert client coordinates to container-relative coordinates
        const noteX = noteRect.left - rect.left + (noteRect.width / 2);
        const noteY = noteRect.top - rect.top + (noteRect.height / 2);
        
        console.log('Note position:', {
          element: noteEl,
          x: noteX,
          y: noteY,
          rect: noteRect
        });

        const distance = Math.sqrt(
          Math.pow(noteX - x, 2) + 
          Math.pow(noteY - y, 2)
        );

        console.log('Distance to note:', distance);

        if (distance < minDistance) {
          minDistance = distance;
          closestElement = noteEl;
          closestRect = noteRect;
        }
      });

      if (closestElement && minDistance < 50) { // Increased threshold
        console.log('Found closest note:', {
          element: closestElement,
          distance: minDistance,
          rect: closestRect,
          classList: Array.from(closestElement.classList || [])
        });

        // Get the staff line position
        const staffElement = closestElement.closest('[class*="staff"], [class*="vf-staff"]');
        if (staffElement) {
          console.log('Found staff element:', {
            element: staffElement,
            classList: Array.from(staffElement.classList || []),
            rect: staffElement.getBoundingClientRect()
          });
        } else {
          console.warn('No staff element found for note');
        }

        const staffRect = staffElement?.getBoundingClientRect();
        const noteRect = closestElement.getBoundingClientRect();
        
        console.log('Note and staff measurements:', {
          staffRect,
          noteRect,
          staffBottom: staffRect?.bottom,
          noteTop: noteRect.top
        });

        const relativePos = staffRect ? 
          (staffRect.bottom - noteRect.top) / staffRect.height : 
          0.5;

        console.log('Calculated relative position:', relativePos);

        // Map position to pitch
        const pitches = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
        const pitchIndex = Math.floor(relativePos * (pitches.length - 1));
        const pitch = pitches[Math.max(0, Math.min(pitches.length - 1, pitchIndex))];

        console.log('Mapped to pitch:', {
          relativePos,
          pitchIndex,
          pitch,
          allPitches: pitches
        });

        // Play the note with a small delay to ensure synth is ready
        const note = {
          pitch,
          duration: '4n'
        };

        console.log('Attempting to play note:', note);
        try {
          await playNote(note);
          console.log('Note played successfully');
        } catch (err) {
          console.error('Error playing note:', {
            error: err,
            note,
            element: closestElement,
            staffElement
          });
        }

        // Visual feedback
        closestElement.classList.add('playing');
        setTimeout(() => closestElement.classList.remove('playing'), 400);
      } else {
        console.warn('No note found near click position');
      }
    } catch (err) {
      console.warn('Error finding note for playback:', err);
    }
  };

  const handleMouseOver = (event) => {
    const element = event.target;
    const elementType = identifyMusicElement(element);
    if (elementType) {
      setSelectedElement(elementType);
      const subtype = getSubtype(element, elementType);
      const termInfo = getMusicalTermInfo(elementType, subtype);
      if (termInfo) {
        const rect = element.getBoundingClientRect();
        setSelectedTerm({
          ...termInfo,
          position: {
            left: rect.left + rect.width / 2,
            top: rect.top
          }
        });
        highlightElement(element);
      }
    }
  };

  const handleMouseOut = () => {
    setSelectedElement(null);
    setSelectedTerm(null);
    removeHighlight();
  };

  const identifyMusicElement = (element) => {
    if (!element) return null;
    const classList = element.classList;
    if (classList.contains('note') || classList.contains('vf-note') || classList.contains('vf-notehead') || element.tagName === 'path' && element.getAttribute('class')?.includes('note')) return 'notes';
    if (classList.contains('clef') || classList.contains('vf-clef')) return 'clefs';
    if (classList.contains('time-signature') || classList.contains('vf-timesig')) return 'timeSignatures';
    if (classList.contains('key-signature') || classList.contains('vf-keysig')) return 'keySignatures';
    if (classList.contains('dynamics') || classList.contains('vf-dynamics')) return 'dynamics';
    if (classList.contains('articulation') || classList.contains('vf-articulation')) return 'articulations';
    return null;
  };

  const getSubtype = (element, elementType) => {
    if (!element) return null;
    switch (elementType) {
      case 'notes':
        return element.getAttribute('data-duration') || 'quarter';
      case 'clefs':
        return element.getAttribute('data-clef') || 'treble';
      case 'timeSignatures':
        return element.getAttribute('data-time') || 'common';
      default:
        return null;
    }
  };

  const getMusicalTermInfo = (elementType, subtype) => {
    if (!elementType) return null;
    const category = musicalTerms[elementType];
    if (!category) return null;
    if (subtype && category[subtype]) {
      return category[subtype];
    }
    const firstKey = Object.keys(category)[0];
    return category[firstKey] || null;
  };

  const highlightElement = (element) => {
    if (!element) return;
    element.classList.add('highlighted');
  };

  const removeHighlight = () => {
    const highlighted = containerRef.current?.getElementsByClassName('highlighted');
    if (highlighted) {
      Array.from(highlighted).forEach(el => el.classList.remove('highlighted'));
    }
  };

  const setupInteractions = () => {
    if (containerRef.current) {
      containerRef.current.addEventListener('mouseover', handleMouseOver);
      containerRef.current.addEventListener('mouseout', handleMouseOut);
      containerRef.current.addEventListener('click', handleClick);
    }
  };

  const closeError = () => setError(null);

  return (
    <div className="w-full h-full flex flex-col music-container">
      {error && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                <i className="fas fa-exclamation-circle text-red-500 mr-2"></i>
                Lỗi
              </h3>
              <button 
                onClick={closeError}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={closeError}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg 
                       hover:bg-indigo-700 transition-colors"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}
      
      <div 
        ref={containerRef} 
        className={`flex-1 border rounded-lg bg-white shadow-lg overflow-y-auto cursor-pointer
                   ${isLoading ? 'opacity-50' : ''} scrollbar-thin scrollbar-thumb-indigo-500 
                   scrollbar-track-indigo-100`}
        style={{ minHeight: document.fullscreenElement ? '80vh' : 'auto' }}
      >
        {!osmdRef.current && !isLoading && (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <i className="fas fa-music text-6xl mb-4"></i>
            <p className="text-lg">Tải lên bản nhạc để bắt đầu</p>
          </div>
        )}
        {isLoading && (
          <div className="h-full flex flex-col items-center justify-center text-indigo-600">
            <i className="fas fa-spinner fa-spin text-4xl mb-4"></i>
            <p>Đang tải bản nhạc...</p>
          </div>
        )}
      </div>
      
      {selectedElement && selectedTerm && (
        <div 
          className="music-tooltip"
          style={{
            left: selectedTerm.position?.left + 'px',
            top: selectedTerm.position?.top + 'px'
          }}
        >
          <h3>{selectedTerm.name}</h3>
          <p>{selectedTerm.description}</p>
        </div>
      )}
    </div>
  );
}
