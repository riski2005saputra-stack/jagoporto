import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Monitor,
  Tablet,
  Smartphone,
  RotateCw,
  ExternalLink,
  X,
  Globe,
  Lock,
  Sparkles,
  CheckCircle2,
  ZoomIn,
} from 'lucide-react';

export default function LivePreviewModal({
  isOpen,
  onClose,
  previewUrl,
  customerSlug,
  title = 'Live Preview Portofolio',
  isPublished = true,
  onTogglePublish,
}) {
  const [device, setDevice] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [scale, setScale] = useState(1);
  const [iframeKey, setIframeKey] = useState(0);
  const iframeRef = useRef(null);

  if (!isOpen) return null;

  const resolvedUrl = previewUrl || (customerSlug ? `/portfolio/${customerSlug}` : '/');

  const handleRefresh = () => {
    setIframeKey((prev) => prev + 1);
  };

  const getDeviceDimensions = () => {
    switch (device) {
      case 'mobile':
        return { width: '390px', height: '844px', label: 'iPhone 14 / Mobile (390px)' };
      case 'tablet':
        return { width: '768px', height: '960px', label: 'iPad / Tablet (768px)' };
      case 'desktop':
      default:
        return { width: '100%', height: '100%', label: 'Desktop View (100%)' };
    }
  };

  const dims = getDeviceDimensions();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex flex-col bg-[#03060A]/95 backdrop-blur-2xl text-white select-none">
        {/* ========================================================
            1. TOP TOOLBAR CONTROLS
            ======================================================== */}
        <header className="h-16 px-4 sm:px-6 bg-[#090E17] border-b border-white/15 flex items-center justify-between gap-3 shrink-0">
          {/* Left: Branding & Current Title */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-400/50 flex items-center justify-center text-blue-300 shrink-0">
              <Monitor className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-bold text-white truncate font-sans">
                {title}
              </h2>
              <div className="text-[10px] font-mono text-slate-400 truncate">
                {window.location.origin}{resolvedUrl}
              </div>
            </div>
          </div>

          {/* Center: Device Mode Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-black/60 border border-white/10">
            <button
              type="button"
              onClick={() => setDevice('desktop')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                device === 'desktop'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              title="Tampilan Desktop"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Desktop</span>
            </button>

            <button
              type="button"
              onClick={() => setDevice('tablet')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                device === 'tablet'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              title="Tampilan Tablet"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Tablet</span>
            </button>

            <button
              type="button"
              onClick={() => setDevice('mobile')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                device === 'mobile'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              title="Tampilan Smartphone Mobile"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Mobile</span>
            </button>
          </div>

          {/* Right: Actions (Publish Toggle, Reload, New Tab, Close) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Publish Toggle Button (if provided) */}
            {onTogglePublish && (
              <button
                type="button"
                onClick={onTogglePublish}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isPublished
                    ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-900'
                    : 'bg-amber-950/80 border border-amber-500/50 text-amber-300 hover:bg-amber-900'
                }`}
                title="Klik untuk mengubah status publikasi"
              >
                {isPublished ? (
                  <>
                    <Globe className="w-3.5 h-3.5 text-emerald-400" />
                    <span>PUBLISHED</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>DRAFT (Tersembunyi)</span>
                  </>
                )}
              </button>
            )}

            {/* Refresh Frame */}
            <button
              type="button"
              onClick={handleRefresh}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Reload Frame Preview"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Open in Full Tab */}
            <a
              href={resolvedUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Buka di Tab Baru"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 hover:text-white transition-all cursor-pointer"
              title="Tutup Preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* ========================================================
            2. DEVICE SIMULATION STAGE (IFRAME CONTAINER)
            ======================================================== */}
        <div className="flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center relative custom-scrollbar">
          {device === 'desktop' ? (
            /* Desktop 100% Full Viewport Frame */
            <div className="w-full h-full rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black">
              <iframe
                key={iframeKey}
                ref={iframeRef}
                src={resolvedUrl}
                title="Desktop Live Preview"
                className="w-full h-full border-0 bg-[#05080D]"
              />
            </div>
          ) : device === 'tablet' ? (
            /* Tablet Bezel Frame */
            <div className="relative p-4 rounded-[40px] bg-[#121824] border-4 border-slate-700 shadow-[0_25px_80px_rgba(0,0,0,0.9)] max-w-full">
              {/* Tablet Top Camera / Speaker Notch */}
              <div className="w-16 h-2 mx-auto rounded-full bg-slate-800 mb-3" />
              <div
                style={{ width: dims.width, height: dims.height, maxWidth: '100%' }}
                className="rounded-2xl overflow-hidden border border-white/15 bg-black"
              >
                <iframe
                  key={iframeKey}
                  ref={iframeRef}
                  src={resolvedUrl}
                  title="Tablet Live Preview"
                  className="w-full h-full border-0 bg-[#05080D]"
                />
              </div>
              <div className="text-[10px] font-mono text-center text-slate-500 mt-3">
                {dims.label}
              </div>
            </div>
          ) : (
            /* Smartphone Mobile Bezel Frame */
            <div className="relative p-3.5 rounded-[48px] bg-[#10141E] border-4 border-slate-700 shadow-[0_25px_80px_rgba(0,0,0,0.95)] max-w-full">
              {/* iPhone Dynamic Island */}
              <div className="w-24 h-5 mx-auto rounded-full bg-black border border-white/10 mb-3 flex items-center justify-end px-3">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" />
              </div>
              <div
                style={{ width: dims.width, height: dims.height, maxWidth: '100%' }}
                className="rounded-[32px] overflow-hidden border border-white/15 bg-black"
              >
                <iframe
                  key={iframeKey}
                  ref={iframeRef}
                  src={resolvedUrl}
                  title="Mobile Smartphone Live Preview"
                  className="w-full h-full border-0 bg-[#05080D]"
                />
              </div>
              {/* Home Indicator Bar */}
              <div className="w-28 h-1 rounded-full bg-slate-600 mx-auto mt-3" />
              <div className="text-[10px] font-mono text-center text-slate-500 mt-2">
                {dims.label}
              </div>
            </div>
          )}
        </div>
      </div>
    </AnimatePresence>
  );
}
