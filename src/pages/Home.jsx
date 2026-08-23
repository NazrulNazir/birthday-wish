import React, { useState, useEffect } from 'react';
import SurpriseButton from '../components/SurpriseButton';
import { Heart } from 'lucide-react';

export default function Home({ onOpenSurprise }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [stars, setStars] = useState([]);

  // Generate background stars on client mount
  useEffect(() => {
    const starCount = 40;
    const generatedStars = Array.from({ length: starCount }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 3 + 1}px`,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 4 + 3}s`,
    }));
    setStars(generatedStars);
  }, []);

  const handleOpen = () => {
    setIsTransitioning(true);
    // Let the glow expand and page fade, then trigger route navigation after 700ms
    setTimeout(() => {
      onOpenSurprise();
    }, 700);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-950 px-4">
      {/* Background Starfield */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white opacity-40"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              animation: `glimmer ${star.duration} ease-in-out infinite`,
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>

      {/* Floating Background Soft Colored Glows */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none animate-float-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-pink-600/10 rounded-full blur-[120px] pointer-events-none animate-float-medium [animation-delay:2s]"></div>

      {/* Landing Card Panel */}
      <div
        className={`relative z-10 text-center max-w-lg mx-auto transition-all duration-700 ${
          isTransitioning 
            ? 'opacity-0 scale-90 blur-md translate-y-[-20px]' 
            : 'opacity-100 scale-100 translate-y-0'
        }`}
      >
        {/* Heart Icon Header */}
        <div className="flex justify-center mb-6">
          <div className="relative w-16 h-16 flex items-center justify-center rounded-2xl glass-card text-pink-500 shadow-lg animate-float-medium">
            <Heart className="w-8 h-8 fill-current animate-pulse" />
            <div className="absolute inset-0 rounded-2xl border border-pink-500/30 blur-sm animate-pulse-slow"></div>
          </div>
        </div>

        {/* Text Headers */}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
          I Have A Little <br />
          <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent drop-shadow">
            Surprise For You ❤️
          </span>
        </h1>

        <p className="text-slate-400 text-lg md:text-xl font-light mb-10 tracking-wide max-w-sm mx-auto">
          Something special is waiting for you...
        </p>

        {/* Surprise Button Trigger */}
        <div className="flex justify-center">
          <SurpriseButton text="Open Your Surprise 🎁" onClick={handleOpen} />
        </div>
      </div>

      {/* Full-Screen Magical Transition Overlay */}
      <div
        className={`absolute inset-0 bg-slate-950 transition-all duration-700 pointer-events-none z-50 ${
          isTransitioning ? 'opacity-70 scale-105' : 'opacity-0 scale-100'
        }`}
      />
    </div>
  );
}
