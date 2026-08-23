import React, { useState, useEffect } from 'react';

export default function SurpriseButton({ onClick, text }) {
  const [ripples, setRipples] = useState([]);

  // Clean up ripples after animation finishes
  useEffect(() => {
    if (ripples.length > 0) {
      const timer = setTimeout(() => {
        setRipples((prev) => prev.slice(1));
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [ripples]);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setRipples((prev) => [
      ...prev,
      { x, y, id: Date.now() + Math.random() }
    ]);

    if (onClick) {
      // Small delay for the click transition to feel satisfying
      setTimeout(() => {
        onClick();
      }, 300);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="group relative select-none overflow-hidden rounded-full p-[3px] focus:outline-none focus:ring-2 focus:ring-purple-500/50 active:scale-95 transition-all duration-300"
    >
      {/* Outer Glowing Border Backdrop */}
      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 opacity-80 blur-md group-hover:opacity-100 group-hover:blur-lg transition-all duration-300 animate-pulse-slow"></span>
      
      {/* Moving gradient border border */}
      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500"></span>
      
      {/* Inner Button Content */}
      <span className="relative block px-8 py-4 rounded-full bg-slate-950/90 text-white font-medium text-lg tracking-wide transition-all duration-300 group-hover:bg-slate-900/60 group-hover:text-pink-100">
        <span className="relative z-10 flex items-center justify-center gap-2">
          {text}
        </span>
        
        {/* Ripple effects */}
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute bg-white/20 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 animate-ping"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: '100px',
              height: '100px',
              animationDuration: '0.8s',
            }}
          />
        ))}
      </span>
    </button>
  );
}
