// import logo from './logo.svg';
import './App.css';

import React, { useState, useEffect } from 'react';

function App() {
  const [files, setFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setFiles([...files, ...newFiles]);
  };

  const handlePlayPause = () => {
    if (currentFile) {
      const audio = new Audio(URL.createObjectURL(currentFile));
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
        audio.addEventListener('timeupdate', () => {
          setCurrentTime(audio.currentTime);
        });
        audio.addEventListener('ended', () => {
          const nextIndex = files.indexOf(currentFile) + 1;
          if (nextIndex < files.length) {
            setCurrentFile(files[nextIndex]);
            handlePlayPause(); // Automatically play next file
          }
        });
      }
    }
  };

  useEffect(() => {
    const storedFile = localStorage.getItem('currentFile');
    if (storedFile) {
      setCurrentFile(JSON.parse(storedFile));
      handlePlayPause(); // Resume playback from stored file
    }
  }, []);

  useEffect(() => {
    if (currentFile) {
      localStorage.setItem('currentFile', JSON.stringify(currentFile));
    } else {
      localStorage.removeItem('currentFile');
    }
  }, [currentFile]);

  return (
    <div>
      <h2>Audio Playlist</h2>
      <input type="file" multiple accept="audio/*" onChange={handleFileChange} />
      <ul>
        {files.map((file) => (
          <li key={file.name}>
            {file.name}
            {currentFile === file && (
              <span>
                {isPlaying ? 'Playing' : 'Paused'} ({currentTime.toFixed(2)}s)
              </span>
            )}
          </li>
        ))}
      </ul>
      <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
    </div>
  );
}

export default App;