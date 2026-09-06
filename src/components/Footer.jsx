import React from 'react';
import { ChevronUp } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export default function Footer({ customData }) {
  const { ownerData } = usePortfolio();
  const data = customData || ownerData;
  const authorName = data?.profile?.fullName || 'Riski Saputra';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative overflow-hidden py-6 sm:py-7 px-4 sm:px-8 border-t border-white/30 bg-white/[0.10] backdrop-blur-2xl shadow-[0_-10px_40px_rgba(255,255,255,0.06)] z-20">
      {/* Radiant Bright White & Maroon Translucent Glow Layer */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/[0.08] via-[#5c0b25]/20 to-white/[0.08] pointer-events-none" />
      
      {/* Bright Soft Ambient Light Flares */}
      <div className="absolute -top-12 left-1/4 w-[400px] h-[100px] bg-gradient-to-r from-white/25 via-rose-500/20 to-white/20 rounded-full blur-[40px] pointer-events-none" />
      <div className="absolute -bottom-10 right-1/4 w-[350px] h-[100px] bg-gradient-to-r from-rose-900/30 via-white/25 to-rose-900/20 rounded-full blur-[40px] pointer-events-none" />
      
      {/* Top Bright White Light Beam */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/70 to-transparent pointer-events-none shadow-[0_0_10px_rgba(255,255,255,0.8)]" />

      {/* Footer Content */}
      <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2.5">
          {/* Glowing Yellow Dot */}
          <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.95)] animate-pulse" />
          
          {/* Yellow / Amber Text */}
          <p className="text-xs sm:text-[13px] font-medium text-amber-200/90 tracking-wide">
            © 2026 <span className="text-amber-300 font-bold drop-shadow-xs">{authorName}</span>. All rights reserved.
          </p>
        </div>

        {/* Glassmorphic Bright Frosted Scroll To Top Button */}
        <button
          onClick={scrollToTop}
          aria-label="Back to top"
          className="group relative p-2.5 rounded-xl border border-white/40 bg-white/15 hover:bg-gradient-to-r hover:from-rose-900 hover:to-[#5c0b25] text-amber-300 hover:text-white shadow-lg shadow-black/20 hover:shadow-rose-950/40 hover:border-amber-400/60 backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <ChevronUp className="w-4 h-4 transition-transform duration-200 group-hover:-translate-y-0.5 text-amber-300 group-hover:text-white" />
        </button>
      </div>
    </footer>
  );
}
