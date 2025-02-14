import React from 'react';

interface FileSelectorProps {
  onFileLoaded: (content: string | null) => void;
}

const FileSelector: React.FC<FileSelectorProps> = ({ onFileLoaded }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      onFileLoaded(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      onFileLoaded(text);
    };
    reader.readAsText(file);
  };

  return (
    <div className="file-input-container">
      <label htmlFor="gpx-file" className="file-input-label">
        GPXファイルを選択:
      </label>
      <input id="gpx-file" type="file" accept=".gpx" onChange={handleFileChange} />
    </div>
  );
};

export default FileSelector;
