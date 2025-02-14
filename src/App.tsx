import React, { useState } from 'react';
import Header from './components/Header';
import MapView from './components/MapView';
import Footer from './components/Footer';
import FileSelector from './components/FileSelector';
import './App.css';

const App: React.FC = () => {
  const [gpxContent, setGpxContent] = useState<string | null>(null);

  return (
    <div className="app-container">
      <Header />
      {/* ファイル選択コンポーネントを配置 */}
      <FileSelector onFileLoaded={setGpxContent} />
      <main className="main">
        <MapView gpxContent={gpxContent} />
      </main>
      <Footer />
    </div>
  );
};

export default App;
