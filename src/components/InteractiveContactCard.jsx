import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useInView } from 'framer-motion';
import { MapPin, Mail, Phone } from 'lucide-react';
import { LinkedinIcon, InstagramIcon } from './SocialIcons';
import { usePortfolio } from '../context/PortfolioContext';

export default function InteractiveContactCard({ customData }) {
  const { ownerData } = usePortfolio();
  const data = customData || ownerData;

  const email = data?.profile?.email || 'riski2005saputra@gmail.com';
  const whatsapp = data?.profile?.whatsapp || '+62 859-2332-0768';
  const whatsappUrl = data?.socialMedia?.whatsapp || (whatsapp ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}` : 'https://wa.me/6285923320768');
  const linkedinUrl = data?.socialMedia?.linkedin || 'https://www.linkedin.com/in/riski2005saputra/';
  const instagramUrl = data?.socialMedia?.instagram || 'https://www.instagram.com/riskisaputra_1922/';
  const fullName = data?.profile?.fullName || 'Riski Saputra';
  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const containerRef = useRef(null);
  const isInView = useInView(containerRef, {
    amount: 0.45,
    once: false,
  });

  const [isDragging, setIsDragging] = useState(false);

  // Exact motion values directly tied to cursor/touch drag
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth elastic 3D rotations calibrated for wide drag ranges
  const rotateZ = useSpring(useTransform(x, [-300, 300], [-30, 30]), {
    stiffness: 400,
    damping: 20,
    mass: 0.8,
  });

  const rotateY = useSpring(useTransform(x, [-300, 300], [-45, 45]), {
    stiffness: 380,
    damping: 20,
    mass: 0.8,
  });

  const rotateX = useSpring(useTransform(y, [-300, 300], [28, -28]), {
    stiffness: 380,
    damping: 20,
    mass: 0.8,
  });

  // Real-time dynamic Bezier curve for the upper lanyard strap connecting from the top boundary line directly into the buckle
  const strapPath = useTransform([x, y], ([latestX, latestY]) => {
    const anchorX = 160;     // Centered anchor under the boundary hazard tape
    const anchorY = 0;       // Top of SVG (positioned at top: -150px under the 1st line)

    const targetX = 160 + latestX;
    const targetY = 160 + latestY; // Exact top socket of the detachable buckle

    const cp1X = anchorX + (latestX * 0.25);
    const cp1Y = anchorY + (targetY - anchorY) * 0.38;
    const cp2X = targetX - (latestX * 0.08);
    const cp2Y = targetY - 24;

    return `M ${anchorX} ${anchorY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${targetX} ${targetY}`;
  });

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[320px] h-[480px] sm:h-[550px] flex flex-col items-center justify-start select-none touch-none [perspective:1200px] scale-[0.88] sm:scale-100 origin-top"
    >
      {/* ========================================================
          LAYER 1: UPPER MAROON WOVEN LANYARD STRAP (RAISED UNDER 1ST LINE)
          ======================================================== */}
      <motion.svg
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 1 : 0 }}
        transition={{ duration: 0.3, delay: isInView ? 0.15 : 0 }}
        className="absolute -top-[150px] left-0 w-full h-[calc(100%+150px)] pointer-events-none z-10 overflow-visible"
        style={{ filter: 'drop-shadow(0px 8px 16px rgba(0,0,0,0.65))' }}
      >
        <defs>
          {/* Deep Maroon / Burgundy Woven Ribbon Gradient */}
          <linearGradient id="contactLanyardMaroon" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1E030B" />
            <stop offset="15%" stopColor="#4A081D" />
            <stop offset="50%" stopColor="#7A1032" />
            <stop offset="85%" stopColor="#4A081D" />
            <stop offset="100%" stopColor="#1E030B" />
          </linearGradient>

          {/* Stitch Thread */}
          <linearGradient id="contactStitchThread" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.6)" />
          </linearGradient>

          {/* Metallic Chrome Specular Gradient */}
          <linearGradient id="contactChromeRefMetal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="25%" stopColor="#94A3B8" />
            <stop offset="50%" stopColor="#F1F5F9" />
            <stop offset="75%" stopColor="#64748B" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>
        </defs>

        <g>
          {/* Outer Border */}
          <motion.path
            d={strapPath}
            fill="none"
            stroke="#080104"
            strokeWidth="18"
            strokeLinecap="round"
          />

          {/* Main Maroon Ribbon */}
          <motion.path
            d={strapPath}
            fill="none"
            stroke="url(#contactLanyardMaroon)"
            strokeWidth="15.5"
            strokeLinecap="round"
          />

          {/* Center Ribbon Weave Sheen */}
          <motion.path
            d={strapPath}
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Left Stitch Line */}
          <motion.path
            d={strapPath}
            fill="none"
            stroke="url(#contactStitchThread)"
            strokeWidth="1.2"
            strokeDasharray="3.5,3.5"
            style={{ transform: 'translateX(-4.5px)' }}
          />

          {/* Right Stitch Line */}
          <motion.path
            d={strapPath}
            fill="none"
            stroke="url(#contactStitchThread)"
            strokeWidth="1.2"
            strokeDasharray="3.5,3.5"
            style={{ transform: 'translateX(4.5px)' }}
          />
        </g>
      </motion.svg>

      {/* ========================================================
          DRAGGABLE ASSEMBLY (BUCKLE + WHITE RIBBON + HOOK + CARD)
          ======================================================== */}
      <motion.div
        drag
        dragSnapToOrigin={true}
        dragElastic={0.7}
        dragTransition={{
          bounceStiffness: 420,
          bounceDamping: 18,
        }}
        style={{
          x,
          y,
          rotateZ,
          rotateY,
          rotateX,
          transformOrigin: '50% 0px',
          transformStyle: 'preserve-3d',
          marginTop: '10px',
        }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 1.04, cursor: 'grabbing' }}
        animate={
          isInView
            ? {
                y: 0,
                opacity: 1,
                scale: 1,
                rotateZ: [22, -16, 11, -5, 2, 0],
              }
            : {
                y: -480,
                opacity: 0,
                scale: 0.75,
                rotateZ: 22,
              }
        }
        transition={{
          y: {
            type: 'spring',
            stiffness: 200,
            damping: 14,
            mass: 1.15,
            delay: isInView ? 0.15 : 0,
          },
          opacity: { duration: isInView ? 0.35 : 0.2, delay: isInView ? 0.1 : 0 },
          scale: { duration: 0.45, delay: isInView ? 0.12 : 0 },
          rotateZ: {
            duration: 2.6,
            delay: isInView ? 0.28 : 0,
            ease: 'easeOut',
          },
        }}
        className="relative w-[265px] sm:w-[280px] cursor-grab active:cursor-grabbing z-20 flex flex-col items-center group [transform-style:preserve-3d]"
      >
        {/* ========================================================
            1. QUICK-RELEASE DETACHABLE MAROON PLASTIC BUCKLE
            ======================================================== */}
        <div className="flex flex-col items-center z-30 select-none pointer-events-none [transform:translateZ(8px)]">
          {/* Top Buckle Socket (Maroon Contoured Hard Plastic) */}
          <div className="relative w-8 h-4 bg-gradient-to-b from-[#5c0b25] via-[#43071a] to-[#2b0410] rounded-t-md border border-[#8b1538]/60 shadow-md flex items-center justify-center">
            {/* Upper Strap Loop Recess */}
            <div className="w-5 h-1 bg-black/60 rounded-full shadow-inner" />
          </div>

          {/* Center Side-Release Buckle Body with Side Push Prongs */}
          <div className="relative w-9 h-7 bg-gradient-to-b from-[#4a081d] via-[#350514] to-[#25030d] rounded-sm border-x border-[#8b1538]/50 shadow-lg flex items-center justify-between px-1 -my-0.5">
            {/* Left Side Push Tab */}
            <div className="w-1 h-3.5 bg-[#6b0d2c] rounded-sm shadow-inner" />
            
            {/* Center Lock Core Channel */}
            <div className="w-4 h-4 bg-gradient-to-b from-[#22020a] to-[#150106] rounded-xs border border-white/20 flex flex-col items-center justify-center gap-0.5 shadow-inner">
              <div className="w-2.5 h-[1.5px] bg-white/90 rounded-full" />
              <div className="w-2.5 h-[1.5px] bg-white/90 rounded-full" />
            </div>

            {/* Right Side Push Tab */}
            <div className="w-1 h-3.5 bg-[#6b0d2c] rounded-sm shadow-inner" />
          </div>

          {/* ========================================================
              2. LOWER WHITE WOVEN RIBBON (WITH LOGO & ACCENT LINE)
              ======================================================== */}
          <div className="relative w-[21px] h-14 bg-gradient-to-r from-slate-200 via-white to-slate-200 shadow-md border-x border-slate-300 flex flex-col items-center justify-between py-1 overflow-hidden">
            {/* Top Monogram Logo on Ribbon */}
            <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#5c0b25] to-[#881337] flex items-center justify-center text-[6px] font-black text-white shadow-xs">
              {initials}
            </div>

            {/* Vertical Company / Portfolio Text */}
            <span className="text-[6.5px] font-black tracking-widest text-[#4a081d] uppercase [writing-mode:vertical-rl] rotate-180 font-sans opacity-90">
              CONTACT
            </span>

            {/* Accent Stripe */}
            <div className="w-full h-[2px] bg-gradient-to-r from-slate-300 via-white to-slate-300 shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
          </div>

          {/* ========================================================
              3. CHROME D-RING & TRIGGER SNAP SWIVEL HOOK
              ======================================================== */}
          {/* Chrome Metal Oval D-Ring */}
          <div className="w-6 h-3 rounded-full border-2 border-slate-300 bg-gradient-to-r from-slate-400 via-white to-slate-400 -mt-0.5 shadow-sm flex items-center justify-center">
            <div className="w-4 h-1 bg-slate-900/60 rounded-full" />
          </div>

          {/* Heavy-Duty Chrome Swivel Snap Hook (Hooks directly into card) */}
          <div className="relative -mt-1 flex flex-col items-center">
            <svg viewBox="0 0 32 38" className="w-7 h-7 drop-shadow-md" fill="none">
              {/* Swivel Collar */}
              <rect x="13" y="1" width="6" height="5" rx="1.5" fill="url(#contactChromeRefMetal)" stroke="#475569" strokeWidth="0.8" />
              
              {/* Main Lobster Snap Body */}
              <path
                d="M16 6 C10 6 6 10 6 16 C6 22 10 26 12 30 L12 36 C12 37 14 38 16 38 C18 38 20 37 20 36 L20 30 C22 26 26 22 26 16 C26 10 22 6 16 6 Z"
                fill="url(#contactChromeRefMetal)"
                stroke="#334155"
                strokeWidth="1"
              />
              
              {/* Trigger Spring Core Opening */}
              <circle cx="16" cy="16" r="4.5" fill="#0f172a" opacity="0.85" />
              
              {/* Spring Lever Thumb Trigger */}
              <path d="M20 13 L15 19" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="21" cy="13" r="1.5" fill="#e2e8f0" />

              {/* Lower Clasp Tip passing through card */}
              <path d="M16 28 L16 37" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* ULTRA-CRISP WHITE PVC CARD BODY (100% SOLID, HIGH CONTRAST) */}
        <div className="relative w-full bg-white rounded-[20px] p-5 border-2 border-slate-300 text-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.85)] min-h-[340px] flex flex-col justify-between overflow-hidden -mt-2 [transform:translateZ(4px)]">
          {/* Top Punch Slot */}
          <div className="relative w-8 h-2.5 bg-slate-950/90 rounded-full mx-auto mb-4 border border-slate-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.85)] flex items-center justify-center">
            <div className="w-3 h-1 bg-gradient-to-r from-slate-200 via-white to-slate-300 rounded-full shadow-sm" />
          </div>

          {/* Clean Contact Content */}
          <div className="flex-1 flex flex-col justify-between py-1 text-left">
            <div className="space-y-4">
              
              {/* Lokasi */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-rose-900/10 border border-rose-900/20 text-rose-900 shrink-0 font-bold">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block font-mono">
                    Lokasi
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    Pekanbaru, Indonesia
                  </span>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                 <div className="p-2 rounded-lg bg-rose-900/10 border border-rose-900/20 text-rose-900 shrink-0 font-bold">
                   <Mail className="w-4 h-4" />
                 </div>
                 <div>
                   <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block font-mono">
                     Email
                   </span>
                   <a
                     href={`mailto:${email}`}
                     className="text-xs font-bold text-slate-900 hover:text-rose-900 transition-colors"
                   >
                     {email}
                   </a>
                 </div>
               </div>

              {/* Telepon / WhatsApp */}
              <div className="flex items-start gap-3">
                 <div className="p-2 rounded-lg bg-rose-900/10 border border-rose-900/20 text-rose-900 shrink-0 font-bold">
                   <Phone className="w-4 h-4" />
                 </div>
                 <div>
                   <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block font-mono">
                     Telepon / WhatsApp
                   </span>
                   <a
                     href={whatsappUrl}
                     target="_blank"
                     rel="noreferrer"
                     className="text-xs font-bold text-slate-900 hover:text-rose-900 transition-colors"
                   >
                     {whatsapp}
                   </a>
                 </div>
               </div>

              {/* LinkedIn */}
              <div className="flex items-start gap-3">
                 <div className="p-2 rounded-lg bg-rose-900/10 border border-rose-900/20 text-rose-900 shrink-0 font-bold">
                   <LinkedinIcon className="w-4 h-4" />
                 </div>
                 <div>
                   <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block font-mono">
                     LinkedIn
                   </span>
                   <a
                     href={linkedinUrl}
                     target="_blank"
                     rel="noreferrer"
                     className="text-xs font-bold text-slate-900 hover:text-rose-900 transition-colors"
                   >
                     {fullName}
                   </a>
                 </div>
               </div>

              {/* Instagram */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-rose-900/10 border border-rose-900/20 text-rose-900 shrink-0 font-bold">
                  <InstagramIcon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block font-mono">
                    Instagram
                  </span>
                  <a
                    href="https://www.instagram.com/riskisaputra_1922/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-slate-900 hover:text-rose-900 transition-colors"
                  >
                    @riskisaputra_1922
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
