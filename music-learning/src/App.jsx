import { AudioProvider } from './context/AudioContext';
import MusicSheetViewer from './components/MusicSheetViewer';
import Player from './components/Player';

export default function App() {
  const handleFileUpload = (file) => {
    // File upload will be handled by MusicSheetViewer
    const event = { target: { files: [file] } };
    const fileInput = document.querySelector('#sheet-upload');
    if (fileInput) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeInputValueSetter.call(fileInput, '');
      const ev2 = new Event('change', { bubbles: true });
      fileInput.dispatchEvent(ev2);
      
      setTimeout(() => {
        fileInput.files = event.target.files;
        const ev3 = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(ev3);
      }, 0);
    }
  };

  return (
    <AudioProvider>
      <div className="min-h-screen bg-gray-50 p-4 space-y-4">
        <header className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Học Nhạc Tương Tác
          </h1>
          <p className="text-gray-600">
            Tải lên bản nhạc và tương tác với từng nốt nhạc
          </p>
        </header>

        <main className="max-w-4xl mx-auto space-y-4">
          <MusicSheetViewer />
          <Player onFileUpload={handleFileUpload} />
        </main>

        <footer className="text-center text-sm text-gray-500">
          © 2024 Học Nhạc Tương Tác
        </footer>
      </div>
    </AudioProvider>
  );
}
