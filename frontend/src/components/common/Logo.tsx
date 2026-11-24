import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark' | 'on-dark';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  variant = 'on-dark', 
  size = 'md', 
  showTagline = false,
  className = '' 
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  const isDarkBg = variant === 'on-dark';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Signature Flow Mark Icon */}
      <div className={`relative ${iconSizes[size]} shrink-0`}>
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xs">
          {/* Flow mark background curve */}
          <rect width="40" height="40" rx="10" fill={isDarkBg ? 'rgba(255,255,255,0.08)' : '#0B3D2E'} />
          {/* Flowing 'F' document ribbon */}
          <path
            d="M12 11C12 9.89543 12.8954 9 14 9H27C27.5523 9 28 9.44772 28 10V12C28 12.5523 27.5523 13 27 13H16V17H24C24.5523 17 25 17.4477 25 18V20C25 20.5523 24.5523 21 24 21H16V28C16 29.1046 15.1046 30 14 30H13C12.4477 30 12 29.5523 12 29V11Z"
            fill={isDarkBg ? '#FFFFFF' : '#BDE9D4'}
          />
          {/* Dynamic flow flourish */}
          <circle cx="28" cy="11" r="3" fill="#65BFAF" />
          <path
            d="M16 21C20.4183 21 24 24.5817 24 29"
            stroke="#BDE9D4"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Typography Wordmark */}
      <div className="flex flex-col">
        <span className={`font-semibold tracking-tight font-sans ${textSizes[size]} ${isDarkBg ? 'text-white' : 'text-[#0B3D2E]'}`}>
          FormFlow
        </span>
        {showTagline && (
          <span className={`text-[10px] tracking-wide uppercase font-medium ${isDarkBg ? 'text-[#BDE9D4]/80' : 'text-[#087F5B]'}`}>
            Your applications, Simplified.
          </span>
        )}
      </div>
    </div>
  );
};
