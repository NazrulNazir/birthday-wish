import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Birthday from './pages/Birthday';
import { birthdayData } from './data/birthdayData';

function AppContent() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize standard Audio API
    const audioObj = new Audio(birthdayData.music);
    audioObj.loop = true;
    audioRef.current = audioObj;

    const handleAudioError = (e) => {
      console.warn(
        "Audio file issue (missing file or unsupported codec). Background music disabled.", 
        e
      );
      setAudioError(true);
      setIsPlaying(false);
    };

    audioObj.addEventListener('error', handleAudioError);

    // Cleanup audio threads on unmount
    return () => {
      audioObj.pause();
      audioObj.removeEventListener('error', handleAudioError);
      audioRef.current = null;
    };
  }, []);

  const handleOpenSurprise = () => {
    // Trigger audio playback inside user interaction callback
    if (audioRef.current && !audioError) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn("Autoplay block caught. Waiting for user to manually play/unmute.", err);
          setIsPlaying(false);
        });
    }
    // Perform route transition to birthday page
    navigate('/birthday');
  };

  const togglePlay = () => {
    if (!audioRef.current || audioError) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error("Audio failed to start:", err);
        });
    }
  };

  return (
    <Routes>
      <Route path="/" element={<Home onOpenSurprise={handleOpenSurprise} />} />
      <Route 
        path="/birthday" 
        element={
          <Birthday 
            isPlaying={isPlaying} 
            togglePlay={togglePlay} 
            audioError={audioError} 
          />
        } 
      />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
