import React from 'react';

export const HeroIllustration: React.FC = () => {
  return (
    <div className="relative w-full max-w-[320px] sm:max-w-[420px] h-[170px] sm:h-[210px] flex items-center justify-center select-none pointer-events-none">
      {/* Mint Atmospheric Background Glow */}
      <div className="absolute w-56 sm:w-72 h-36 sm:h-48 rounded-full bg-gradient-to-tr from-[#BDE9D4]/60 via-[#65BFAF]/40 to-transparent blur-3xl -z-10" />

      {/* Floating Sparkles & Stars */}
      <div className="absolute top-2 left-4 text-[#65BFAF] animate-pulse">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
        </svg>
      </div>
      <div className="absolute bottom-4 right-4 text-[#087F5B] opacity-40">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
        </svg>
      </div>

      <svg
        viewBox="0 0 420 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          <linearGradient id="cardGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F8FDFB" />
          </linearGradient>
          <linearGradient id="cardGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F3FAF6" />
          </linearGradient>
          <filter id="shadow1" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#064E3B" floodOpacity="0.08" />
          </filter>
        </defs>

        {/* Back Card (Left Tilted) */}
        <g transform="translate(60, 45) rotate(-10)" filter="url(#shadow1)">
          <rect width="115" height="145" rx="10" fill="url(#cardGrad1)" stroke="#E8DFC8" strokeWidth="1.2" />
          <line x1="16" y1="24" x2="60" y2="24" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
          <line x1="16" y1="36" x2="90" y2="36" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="16" y1="46" x2="80" y2="46" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="16" y1="56" x2="70" y2="56" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M90 0 L115 25 L90 25 Z" fill="#F1F5F9" />
        </g>

        {/* Center Main Card (Featured with Green Checkmark Shield) */}
        <g transform="translate(170, 20) rotate(4)" filter="url(#shadow1)">
          <rect width="130" height="165" rx="12" fill="#FFFFFF" stroke="#65BFAF" strokeWidth="1.5" />
          <line x1="20" y1="28" x2="70" y2="28" stroke="#0B3D2E" strokeWidth="4" strokeLinecap="round" />
          <line x1="20" y1="42" x2="105" y2="42" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
          <line x1="20" y1="54" x2="95" y2="54" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="20" y1="66" x2="85" y2="66" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />

          {/* Large Center Green Checkmark Badge */}
          <g transform="translate(65, 105)">
            <circle cx="0" cy="0" r="22" fill="#0B3D2E" />
            <path
              d="M-8 0 L-2 6 L9 -6"
              fill="none"
              stroke="#BDE9D4"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          <line x1="20" y1="145" x2="110" y2="145" stroke="#E2F5E9" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Right Smaller Document Card */}
        <g transform="translate(285, 60) rotate(14)" filter="url(#shadow1)">
          <rect width="90" height="120" rx="8" fill="url(#cardGrad2)" stroke="#E8DFC8" strokeWidth="1" />
          <circle cx="20" cy="22" r="5" fill="#65BFAF" />
          <line x1="32" y1="22" x2="70" y2="22" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="16" y1="38" x2="74" y2="38" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
          <line x1="16" y1="48" x2="68" y2="48" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
          <line x1="16" y1="58" x2="60" y2="58" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Floating Digital Stylus / Pen */}
        <g transform="translate(300, 30) rotate(-45)">
          <rect x="0" y="0" width="8" height="50" rx="4" fill="#0B3D2E" />
          <polygon points="0,50 8,50 4,58" fill="#65BFAF" />
          <circle cx="4" cy="5" r="2" fill="#BDE9D4" />
        </g>
      </svg>
    </div>
  );
};
