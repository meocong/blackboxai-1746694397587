import { useState } from 'react';
import MusicSheetViewer from './MusicSheetViewer';
import Player from './Player';
import { musicalTerms } from '../data/musicalTerms';

export default function Preview() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Hero Section with Music Background */}
      <div className="relative h-48 bg-indigo-900 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/668295/pexels-photo-668295.jpeg')`
          }}
        />
        <div className="relative z-10 h-full flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white text-center">
            Xem Trước Bài Học
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Sidebar - Musical Terms */}
          <div className="bg-white rounded-lg shadow-lg p-6 h-fit">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              <i className="fas fa-music mr-2"></i>
              Thuật Ngữ Âm Nhạc
            </h2>
            <div className="space-y-4">
              {Object.entries(musicalTerms.notes).map(([key, term]) => (
                <div key={key} className="p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                  <h3 className="font-medium text-indigo-900">
                    <i className="fas fa-note mr-2"></i>
                    {term.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{term.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-2 space-y-8">
            {/* Music Sheet Viewer */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                <i className="fas fa-sheet-music mr-2"></i>
                Bản Nhạc Tương Tác
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <MusicSheetViewer isPreviewMode={true} />
              </div>
            </div>

            {/* Player Controls */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                <i className="fas fa-play-circle mr-2"></i>
                Điều Khiển Phát Nhạc
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <Player isPreviewMode={true} onPlayingChange={setIsPlaying} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
