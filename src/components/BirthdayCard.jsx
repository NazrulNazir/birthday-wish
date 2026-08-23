import React, { useState } from 'react';
import { Gift, Heart } from 'lucide-react';

export default function BirthdayCard({ data }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="relative max-w-md w-full px-6 py-8 md:px-8 md:py-10 glass-card rounded-3xl animate-scale-in border border-white/10 text-center select-none shadow-2xl">
      {/* Outer Glow Decoration */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 blur-xl opacity-70 -z-10 animate-pulse-slow"></div>

      {/* Decorative Hearts */}
      <div className="absolute top-4 left-4 text-pink-500/40 animate-float-slow [animation-delay:1s]">
        <Heart className="w-5 h-5 fill-current" />
      </div>
      <div className="absolute bottom-4 right-4 text-purple-500/40 animate-float-slow [animation-delay:3s]">
        <Heart className="w-6 h-6 fill-current" />
      </div>

      {/* Profile Photo Frame */}
      <div className="relative mx-auto w-32 h-32 md:w-36 md:h-36 mb-6 group">
        {/* Glowing border ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-500 p-[3px] shadow-lg animate-spin-slow group-hover:animate-none">
          <div className="w-full h-full rounded-full bg-slate-950"></div>
        </div>
        
        {/* Photo Canvas */}
        <div className="absolute inset-[4px] rounded-full overflow-hidden border border-white/10 bg-slate-900 flex items-center justify-center">
          {!imgError && data.photo ? (
            <img
              src={data.photo}
              alt={data.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            /* Fallback avatar if image doesn't exist */
            <div className="w-full h-full bg-gradient-to-br from-purple-900 to-pink-900 flex flex-col items-center justify-center text-white">
              <Gift className="w-12 h-12 mb-1 animate-bounce text-pink-400" />
              <span className="text-xl font-bold font-sans tracking-wide">
                {data.name ? data.name.charAt(0).toUpperCase() : '🎂'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Greetings Heading */}
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-md animate-fade-in-up">
        🎉 Happy Birthday 🎉
      </h1>

      {/* Birthday Person's Name */}
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 font-sans drop-shadow">
        Happy Birthday, <span className="text-pink-400 font-extrabold">{data.name}</span> ❤️
      </h2>

      {/* Bengali Message */}
      <div className="relative px-3 py-4 rounded-2xl bg-white/5 border border-white/5 font-bengali text-base md:text-lg leading-relaxed text-slate-200 shadow-inner">
        <p className="whitespace-pre-line">
          {data.message}
        </p>
      </div>

      {/* Heart Sign */}
      <div className="mt-6 flex justify-center items-center gap-1.5 text-pink-500 animate-pulse">
        <span className="h-[1px] w-8 bg-pink-500/40"></span>
        <Heart className="w-4 h-4 fill-current" />
        <span className="h-[1px] w-8 bg-pink-500/40"></span>
      </div>
    </div>
  );
}
