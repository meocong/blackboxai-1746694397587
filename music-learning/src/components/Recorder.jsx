import { useState, useRef, useEffect } from 'react';
import { useAudio } from '../context/AudioContext';

export default function Recorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [recordings, setRecordings] = useState([]);
  const [permissionError, setPermissionError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const { initializeAudioContext } = useAudio();

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      await initializeAudioContext();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        const timestamp = new Date().toISOString();
        setRecordings(prev => [...prev, { url, timestamp, duration }]);
        chunksRef.current = [];
        setDuration(0);
      };

      chunksRef.current = [];
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setIsPaused(false);
      startTimer();
      setPermissionError(null);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setPermissionError(
        'Không thể truy cập microphone. Vui lòng kiểm tra quyền truy cập và thử lại.'
      );
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (!isPaused) {
        mediaRecorderRef.current.pause();
        stopTimer();
      } else {
        mediaRecorderRef.current.resume();
        startTimer();
      }
      setIsPaused(!isPaused);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      stopTimer();
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  const deleteRecording = (index) => {
    setRecordings(prev => {
      const newRecordings = [...prev];
      URL.revokeObjectURL(newRecordings[index].url);
      newRecordings.splice(index, 1);
      return newRecordings;
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Recording Controls */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-col items-center space-y-6">
          {/* Timer Display */}
          <div className="text-4xl font-mono font-bold text-indigo-600">
            {formatTime(duration)}
          </div>

          {/* Control Buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={startRecording}
              disabled={isRecording}
              className={`p-4 rounded-full shadow-lg transition-all duration-200 transform
                ${isRecording 
                  ? 'bg-gray-200 cursor-not-allowed' 
                  : 'bg-red-500 hover:bg-red-600 hover:shadow-xl hover:-translate-y-0.5'}`}
            >
              <i className="fas fa-microphone text-white text-xl"></i>
            </button>

            <button
              onClick={pauseRecording}
              disabled={!isRecording}
              className={`p-4 rounded-full shadow-lg transition-all duration-200 transform
                ${!isRecording 
                  ? 'bg-gray-200 cursor-not-allowed' 
                  : 'bg-indigo-500 hover:bg-indigo-600 hover:shadow-xl hover:-translate-y-0.5'}`}
            >
              <i className={`fas fa-${isPaused ? 'play' : 'pause'} text-white text-xl`}></i>
            </button>

            <button
              onClick={stopRecording}
              disabled={!isRecording}
              className={`p-4 rounded-full shadow-lg transition-all duration-200 transform
                ${!isRecording 
                  ? 'bg-gray-200 cursor-not-allowed' 
                  : 'bg-indigo-500 hover:bg-indigo-600 hover:shadow-xl hover:-translate-y-0.5'}`}
            >
              <i className="fas fa-stop text-white text-xl"></i>
            </button>
          </div>

          {/* Status Text */}
          <div className="text-sm text-gray-500">
            {isRecording 
              ? isPaused 
                ? 'Đã tạm dừng ghi âm' 
                : 'Đang ghi âm...' 
              : 'Sẵn sàng ghi âm'}
          </div>
        </div>
      </div>

      {/* Permission Error */}
      {permissionError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <i className="fas fa-exclamation-circle text-red-500"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{permissionError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Recordings List */}
      {recordings.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Bản ghi âm của bạn
          </h3>
          <div className="space-y-4">
            {recordings.map((recording, index) => (
              <div 
                key={recording.timestamp}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => {
                      const audio = new Audio(recording.url);
                      audio.play();
                    }}
                    className="p-2 text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    <i className="fas fa-play"></i>
                  </button>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Bản ghi {index + 1}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatTime(recording.duration)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <a
                    href={recording.url}
                    download={`recording-${index + 1}.webm`}
                    className="p-2 text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    <i className="fas fa-download"></i>
                  </a>
                  <button
                    onClick={() => deleteRecording(index)}
                    className="p-2 text-red-600 hover:text-red-700 transition-colors"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
