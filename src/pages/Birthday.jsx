import React, { useEffect, useState } from 'react';
import Fireworks from '../components/Fireworks';
import BirthdayCard from '../components/BirthdayCard';
import FloatingHearts from '../components/FloatingHearts';
import Confetti from '../components/Confetti';
import MusicControl from '../components/MusicControl';
import { birthdayData } from '../data/birthdayData';

export default function Birthday({ isPlaying, togglePlay, audioError }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Stagger the card entry animation slightly for premium feel
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-slate-950 px-4 py-16">
      {/* 1. Cinematic Background Fireworks Canvas */}
      <Fireworks />

      {/* 2. Soft Floating Hearts Canvas */}
      <FloatingHearts />

      {/* 3. Confetti Popper Burst on Mount */}
      <Confetti />

      {/* 4. Ambient Backdrop Darkness Filter */}
      {/* Dark tint makes text and profile cards readable above bright canvas particles */}
      <div className="absolute inset-0 bg-slate-950/40 pointer-events-none z-20"></div>

      {/* 5. Central Greetings Card Container */}
      <div 
        className={`relative z-30 w-full flex justify-center items-center transition-all duration-1000 transform ${
          mounted 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 translate-y-8'
        }`}
      >
        <BirthdayCard data={birthdayData} />
      </div>

      {/* 6. Audio controls */}
      <MusicControl 
        isPlaying={isPlaying} 
        togglePlay={togglePlay} 
        audioError={audioError} 
      />
    </div>
  );
}
