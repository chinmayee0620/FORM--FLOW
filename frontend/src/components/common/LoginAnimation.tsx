import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';

interface LoginAnimationProps {
  onComplete?: () => void;
  autoPlay?: boolean;
}

export const LoginAnimation: React.FC<LoginAnimationProps> = ({ 
  onComplete, 
  autoPlay = true 
}) => {
  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    if (!autoPlay) return;

    // Sequence stages:
    // 0: Initial
    // 1: Document outline appears
    // 2: Flowing line writes through
    // 3: Checkmark appears
    // 4: FormFlow logo reveals
    const timer1 = setTimeout(() => setStep(1), 200);
    const timer2 = setTimeout(() => setStep(2), 900);
    const timer3 = setTimeout(() => setStep(3), 1700);
    const timer4 = setTimeout(() => {
      setStep(4);
      if (onComplete) onComplete();
    }, 2400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [autoPlay, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center p-8 select-none">
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Step 1 & 2: Document outline and flowing pen line */}
        <svg
          viewBox="0 0 100 120"
          className="w-32 h-40 transition-all duration-700 ease-out"
          style={{
            transform: step >= 4 ? 'scale(0.85) translateY(-8px)' : 'scale(1)',
            opacity: step >= 1 ? 1 : 0,
          }}
        >
          {/* Document Background with subtle drop shadow */}
          <rect
            x="10"
            y="10"
            width="80"
            height="100"
            rx="8"
            fill={step >= 3 ? '#EAF8F1' : '#FFFFFF'}
            stroke={step >= 3 ? '#087F5B' : '#0B3D2E'}
            strokeWidth="3"
            strokeDasharray={step >= 1 ? '400' : '0'}
            strokeDashoffset={step >= 1 ? '0' : '400'}
            className="transition-all duration-700"
          />

          {/* Document Header fold */}
          <path
            d="M66 10 L90 34 L66 34 Z"
            fill={step >= 3 ? '#BDE9D4' : '#F6EFE4'}
            stroke={step >= 3 ? '#087F5B' : '#0B3D2E'}
            strokeWidth="2"
          />

          {/* Line 1 */}
          <line
            x1="22"
            y1="40"
            x2="55"
            y2="40"
            stroke="#064E3B"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="60"
            strokeDashoffset={step >= 2 ? '0' : '60'}
            style={{ transition: 'stroke-dashoffset 0.5s ease-out 0.1s' }}
          />

          {/* Line 2 */}
          <line
            x1="22"
            y1="54"
            x2="72"
            y2="54"
            stroke="#65BFAF"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="70"
            strokeDashoffset={step >= 2 ? '0' : '70'}
            style={{ transition: 'stroke-dashoffset 0.5s ease-out 0.3s' }}
          />

          {/* Line 3 */}
          <line
            x1="22"
            y1="68"
            x2="65"
            y2="68"
            stroke="#65BFAF"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="70"
            strokeDashoffset={step >= 2 ? '0' : '70'}
            style={{ transition: 'stroke-dashoffset 0.5s ease-out 0.5s' }}
          />

          {/* Flowing animated ribbon wave (Step 2) */}
          {step >= 2 && (
            <path
              d="M18 84 C30 76, 50 92, 78 82"
              fill="none"
              stroke="#087F5B"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="100"
              strokeDashoffset={step >= 2 ? '0' : '100'}
              style={{ transition: 'stroke-dashoffset 0.7s cubic-bezier(0.4, 0, 0.2, 1)' }}
            />
          )}

          {/* Step 3: Completion checkmark badge */}
          {step >= 3 && (
            <g className="transition-all duration-500 scale-100 origin-center">
              <circle cx="70" cy="85" r="14" fill="#087F5B" />
              <path
                d="M64 85 L68 89 L76 81"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          )}
        </svg>

        {/* Ambient mint glow */}
        <div 
          className="absolute inset-0 rounded-full bg-[#BDE9D4]/40 blur-2xl -z-10 transition-opacity duration-700 pointer-events-none"
          style={{ opacity: step >= 2 ? 0.8 : 0 }}
        />
      </div>

      {/* Step 4: FormFlow Logo reveal with smooth fade-in */}
      <div 
        className="transition-all duration-600 mt-2"
        style={{
          opacity: step >= 4 ? 1 : 0,
          transform: step >= 4 ? 'translateY(0)' : 'translateY(10px)',
        }}
      >
        <Logo variant="light" size="lg" showTagline />
      </div>
    </div>
  );
};
