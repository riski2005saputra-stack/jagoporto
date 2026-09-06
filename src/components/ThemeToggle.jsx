import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({
  variant = 'button', // 'button' | 'icon' | 'full'
  className = '',
}) {
  const { isDark, toggleTheme } = useTheme();

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`p-2 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center ${
          isDark
            ? 'bg-white/5 hover:bg-white/10 text-amber-300 border border-white/10 hover:border-amber-400/40 shadow-sm'
            : 'bg-amber-100/90 hover:bg-amber-200 text-amber-900 border border-amber-300/80 shadow-sm'
        } ${className}`}
        title={isDark ? 'Beralih ke Mode Siang (Terang)' : 'Beralih ke Mode Malam (Gelap)'}
        aria-label="Toggle Theme"
      >
        <motion.div
          key={isDark ? 'dark' : 'light'}
          initial={{ rotate: -90, scale: 0.7, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0.7, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-700" />}
        </motion.div>
      </button>
    );
  }

  if (variant === 'full') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
          isDark
            ? 'bg-white/[0.04] hover:bg-white/[0.10] border-white/10 text-slate-300 hover:text-white'
            : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
        } ${className}`}
        title={isDark ? 'Beralih ke Mode Siang (Terang)' : 'Beralih ke Mode Malam (Gelap)'}
      >
        <div className="flex items-center gap-2 text-xs font-semibold">
          {isDark ? (
            <Sun className="w-3.5 h-3.5 text-amber-400" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-indigo-600" />
          )}
          <span>{isDark ? 'Mode Siang (Terang)' : 'Mode Malam (Gelap)'}</span>
        </div>
        <span
          className={`text-[9.5px] font-mono px-2 py-0.5 rounded-full font-bold ${
            isDark
              ? 'bg-amber-950/80 border border-amber-500/40 text-amber-300'
              : 'bg-indigo-100 border border-indigo-300 text-indigo-800'
          }`}
        >
          {isDark ? 'GELAP' : 'TERANG'}
        </span>
      </button>
    );
  }

  // Default 'button' variant
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all duration-200 cursor-pointer shadow-sm hover:scale-[1.02] ${
        isDark
          ? 'bg-slate-900/90 hover:bg-slate-800 text-amber-300 border-white/15 hover:border-amber-400/40'
          : 'bg-white hover:bg-amber-50 text-slate-800 border-slate-300 shadow-slate-200/50 hover:border-amber-400'
      } ${className}`}
      title={isDark ? 'Ubah ke Mode Siang (Light)' : 'Ubah ke Mode Malam (Dark)'}
    >
      <motion.div
        key={isDark ? 'dark' : 'light'}
        initial={{ rotate: -90, scale: 0.8 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {isDark ? (
          <Sun className="w-3.5 h-3.5 text-amber-400" />
        ) : (
          <Moon className="w-3.5 h-3.5 text-indigo-600" />
        )}
      </motion.div>
      <span className="font-mono text-[11px]">
        {isDark ? 'Mode Siang' : 'Mode Malam'}
      </span>
    </button>
  );
}
