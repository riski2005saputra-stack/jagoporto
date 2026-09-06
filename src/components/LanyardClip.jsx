import React from 'react';

/**
 * Metal clasp & clip mechanism connecting the strap to the ID card slot
 */
export default function LanyardClip() {
  return (
    <div className="flex flex-col items-center select-none pointer-events-none z-20">
      {/* Upper Strap Loop Clip */}
      <div className="w-7 h-3 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 rounded-t-sm shadow-sm border border-slate-300 flex items-center justify-center">
        <div className="w-4 h-1 bg-slate-600/60 rounded-full" />
      </div>

      {/* Swivel Ring */}
      <div className="w-4 h-4 rounded-full border-2 border-slate-300 bg-gradient-to-b from-slate-400 via-slate-200 to-slate-500 shadow-sm flex items-center justify-center -my-1">
        <div className="w-2 h-2 rounded-full bg-slate-900/50" />
      </div>

      {/* Lobster Claw / Spring Hook */}
      <div className="w-6 h-6 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-slate-300 drop-shadow-md" fill="currentColor">
          <path d="M12 2C9.24 2 7 4.24 7 7v4.18C5.83 12.18 5 13.5 5 15c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4 0-1.5-.83-2.82-2-3.82V7c0-2.76-2.24-5-5-5zm-2 5c0-1.1.9-2 2-2s2 .9 2 2v4H10V7zm6.73 9.42C16.48 16.78 15.79 17 15 17H9c-.79 0-1.48-.22-1.73-.58C7.1 16.18 7 15.61 7 15c0-1.66 1.34-3 3-3h4c1.66 0 3 1.34 3 3 0 .61-.1 1.18-.27 1.42z" opacity="0.9"/>
          <rect x="10.5" y="15" width="3" height="6" rx="1.5" fill="#e2e8f0" />
        </svg>
      </div>

      {/* Card slot insert pin */}
      <div className="w-4 h-1.5 bg-gradient-to-r from-slate-500 via-slate-300 to-slate-500 rounded-full shadow-inner -mt-1" />
    </div>
  );
}
