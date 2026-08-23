import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function MusicControl({ isPlaying, togglePlay, audioError }) {
  if (audioError) {
    // If audio is broken or missing, don't show the control to keep the UI clean
    return null;
  }

  return (
    <button
      onClick={togglePlay}
      className="fixed top-6 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full glass-card hover:bg-slate-800/80 active:scale-90 border border-slate-100/10 shadow-lg cursor-pointer group transition-all duration-300"
      aria-label={isPlaying ? 'Mute Music' : 'Play Music'}
    >
      <div className="relative w-6 h-6 flex items-center justify-center">
        {isPlaying ? (
          <div className="flex items-end justify-center gap-[3px] w-5 h-5">
            {/* Animated Equalizer Bars */}
            <span className="w-[3px] bg-pink-500 rounded-full animate-bounce [animation-duration:0.8s] h-3"></span>
            <span className="w-[3px] bg-purple-500 rounded-full animate-bounce [animation-duration:0.5s] h-4"></span>
            <span className="w-[3px] bg-cyan-500 rounded-full animate-bounce [animation-duration:0.7s] h-2"></span>
            <span className="w-[3px] bg-pink-500 rounded-full animate-bounce [animation-duration:0.6s] h-4"></span>
          </div>
        ) : (
          <VolumeX className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
        )}
      </div>
    </button>
  );
}
