import { useState } from 'react';
import MusicSheetViewer from './components/MusicSheetViewer.fixed';
import { AudioProvider } from './context/AudioContext.new3';
import './App.css';

function App() {
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  return (
    <AudioProvider>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Học Nhạc Tương Tác
            </h1>
            <p className="mt-2 text-gray-600">
              Tải lên bản nhạc và tương tác với từng nốt nhạc
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 min-h-[600px]">
            <MusicSheetViewer isPreviewMode={isPreviewMode} />
          </div>
        </div>
      </div>
    </AudioProvider>
  );
}

export default App;
