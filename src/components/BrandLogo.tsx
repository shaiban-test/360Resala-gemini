import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  iconOnly?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
  iconOnly = false,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* 360Resala Orbital Emblem */}
      <div className={`relative flex items-center justify-center ${iconSizes[size]} shrink-0`}>
        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/30 to-teal-400/30 blur-md rounded-2xl" />
        
        {/* Core Container */}
        <div className="relative w-full h-full bg-gradient-to-b from-slate-900 to-[#071317] border border-emerald-500/40 rounded-2xl p-1.5 shadow-lg shadow-emerald-950/40 flex items-center justify-center overflow-hidden group">
          {/* Subtle 360° ring orbit */}
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-[0_0_8px_rgba(37,211,102,0.4)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#25D366" />
                <stop offset="50%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#0EA5E9" />
              </linearGradient>
            </defs>

            {/* Orbit paths */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="url(#orbitGrad)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="210 50"
              className="animate-[spin_12s_linear_infinite]"
            />
            <circle
              cx="50"
              cy="50"
              r="28"
              stroke="#059669"
              strokeWidth="2.5"
              strokeOpacity="0.4"
            />

            {/* WhatsApp Speech Bubble Symbol */}
            <path
              d="M33 50C33 40.61 40.61 33 50 33C59.39 33 67 40.61 67 50C67 59.39 59.39 67 50 67C46.85 67 43.91 66.14 41.39 64.63L33 67L35.43 58.74C33.89 56.17 33 53.19 33 50Z"
              fill="url(#orbitGrad)"
            />

            {/* Center "360" or Message Checkmark */}
            <path
              d="M44 50.5L48 54.5L57 45.5"
              stroke="#051317"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Brand Wordmark & Typography */}
      {!iconOnly && (
        <div className="flex flex-col text-right leading-none">
          <div className="flex items-center gap-1.5 font-['Plus_Jakarta_Sans',sans-serif]">
            <span className={`${textSizes[size]} font-extrabold tracking-tight text-white`}>
              360<span className="text-emerald-400">Resala</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              AI
            </span>
          </div>
          {showSubtitle && (
            <span className="text-[11px] text-slate-400 font-medium tracking-normal mt-0.5 font-['Cairo',sans-serif]">
              أتمتة وتجارة واتساب والموظف الذكي
            </span>
          )}
        </div>
      )}
    </div>
  );
};
