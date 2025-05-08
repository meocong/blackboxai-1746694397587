import { useEffect, useState } from 'react';
import { useAudio } from '../context/AudioContext';

export default function Player({ onPlayChange, onFileUpload }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const { initializeAudioContext, setAudioVolume } = useAudio();

  useEffect(() => {
    setAudioVolume(volume);
  }, [volume, setAudioVolume]);

  const togglePlay = async () => {
    const initialized = await initializeAudioContext();
    if (initialized) {
      setIsPlaying(!isPlaying);
      if (onPlayChange) {
        onPlayChange(!isPlaying);
      }
    } else {
      console.warn('AudioContext not initialized');
    }
  };

  const handleVolumeChange = (e) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
  };

  const toggleFullScreen = () => {
    const container = document.querySelector('.music-container');
    if (!document.fullscreenElement) {
      container.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (onFileUpload) {
        onFileUpload(file);
      }
      setShowUpload(false);
    }
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest('.volume-control') && !e.target.closest('.upload-control')) {
      setShowVolume(false);
      setShowUpload(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="w-full bg-white rounded-lg shadow p-2">
      <div className="flex items-center gap-3">
        <div className="upload-control relative">
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="p-1.5 text-gray-600 hover:text-indigo-600 transition-colors"
            title="Tải lên bản nhạc"
          >
            <i className="fas fa-cloud-upload-alt"></i>
          </button>
          {showUpload && (
            <div className="absolute bottom-full left-0 mb-2 bg-white p-2 rounded-lg shadow-lg w-48">
              <div className="space-y-2">
                <label className="block p-2 text-sm text-gray-700 hover:bg-indigo-50 rounded cursor-pointer transition-colors">
                  <input
                    type="file"
                    accept=".musicxml,.xml"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <i className="fas fa-file-code mr-2"></i>
                  Upload MusicXML
                </label>
                <label className="block p-2 text-sm text-gray-700 hover:bg-indigo-50 rounded cursor-pointer transition-colors">
                  <input
                    type="file"
                    accept=".mxl"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <i className="fas fa-file-archive mr-2"></i>
                  Upload MXL
                </label>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={togglePlay}
          className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors flex items-center justify-center w-8 h-8"
          title={isPlaying ? 'Tạm dừng' : 'Phát'}
        >
          <i className={`fas fa-${isPlaying ? 'pause' : 'play'}`}></i>
        </button>

        <div className="flex-1">
          <div className="w-full h-1.5 bg-gray-200 rounded-lg">
            <div className="h-full bg-indigo-600 rounded-lg" style={{ width: '0%' }}></div>
          </div>
        </div>

        <div className="volume-control relative">
          <button
            onClick={() => setShowVolume(!showVolume)}
            className="p-1.5 text-gray-600 hover:text-indigo-600 transition-colors"
            title="Âm lượng"
          >
            <i className={`fas fa-volume-${volume > 0 ? 'up' : 'mute'}`}></i>
          </button>
          {showVolume && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white p-2 rounded-lg shadow-lg w-32">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          )}
        </div>

        <button
          onClick={toggleFullScreen}
          className="p-1.5 text-gray-600 hover:text-indigo-600 transition-colors"
          title={isFullScreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
        >
          <i className={`fas fa-${isFullScreen ? 'compress' : 'expand'}`}></i>
        </button>

        <button
          onClick={() => setShowHelp(true)}
          className="p-1.5 text-gray-600 hover:text-indigo-600 transition-colors"
          title="Trợ giúp"
        >
          <i className="fas fa-question-circle"></i>
        </button>
      </div>

      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-4 max-w-md w-full">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-semibold">Hướng dẫn sử dụng</h3>
              <button 
                onClick={() => setShowHelp(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <ul className="space-y-1.5 text-xs text-gray-600">
              <li><i className="fas fa-cloud-upload-alt mr-2"></i> Nhấn để tải lên bản nhạc MusicXML hoặc MXL</li>
              <li><i className="fas fa-play mr-2"></i> Nhấn để phát/tạm dừng bản nhạc</li>
              <li><i className="fas fa-volume-up mr-2"></i> Nhấn để điều chỉnh âm lượng</li>
              <li><i className="fas fa-expand mr-2"></i> Nhấn để xem ở chế độ toàn màn hình</li>
              <li><i className="fas fa-music mr-2"></i> Nhấn vào nốt nhạc để nghe âm thanh tương ứng</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
