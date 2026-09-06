import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import riskiPortrait from '../assets/riski-portrait.jpg';
import { usePortfolio } from '../context/PortfolioContext';

export default function InteractiveIDCard({ customData }) {
  const { ownerData } = usePortfolio();
  const data = customData || ownerData;
  const [isDragging, setIsDragging] = useState(false);

  const fullName = data?.profile?.fullName || 'RISKI SAPUTRA';
  const jobTitle = data?.profile?.jobTitle || 'MECHANICAL ENGINEER';
  const avatar = data?.profile?.avatarUrl || riskiPortrait;

  // Fully customizable ID Card text elements
  const cardBadge = data?.profile?.cardBadge || 'RS';
  const cardRibbonText = data?.profile?.cardRibbonText || 'PORTFOLIO';
  const cardCompany = data?.profile?.cardCompany || 'YOUR COMPANY';
  const cardDepartment = data?.profile?.cardDepartment || 'ENGINEERING & DESIGN';
  const cardRoleTag = data?.profile?.cardRoleTag || 'DESIGNER';
  const idCardNo = data?.profile?.idCardNo || data?.id || (customData?.id ? customData.id : 'OWNER-001');
  const division = data?.profile?.division || jobTitle;
  const specialist = data?.profile?.specialist || 'Consultation Projek';
  const cardStatus = data?.profile?.cardStatus || 'Active / Verified';
  const cardBarcode = data?.profile?.cardBarcode || 'No : 12345678900000000000';

  // GPU motion values directly tied to cursor/touch drag
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth elastic 3D rotations calibrated for wide drag ranges
  const rotateZ = useSpring(useTransform(x, [-300, 300], [-32, 32]), {
    stiffness: 400,
    damping: 20,
    mass: 0.8,
  });

  const rotateY = useSpring(useTransform(x, [-300, 300], [-50, 50]), {
    stiffness: 380,
    damping: 20,
    mass: 0.8,
  });

  const rotateX = useSpring(useTransform(y, [-300, 300], [32, -32]), {
    stiffness: 380,
    damping: 20,
    mass: 0.8,
  });

  // Dynamic shadow that reacts to distance and height
  const cardShadow = useTransform(y, [-200, 0, 350], [
    '0 15px 30px -5px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.4) inset',
    '0 30px 60px -12px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.4) inset',
    '0 60px 100px -20px rgba(0,0,0,0.95), 0 0 0 1px rgba(255,255,255,0.4) inset',
  ]);

  // Dynamic light glare shifting on 3D tilt
  const glareOpacity = useTransform(x, [-250, 0, 250], [0.45, 0.08, 0.45]);

  // Real-time Bezier curve for the upper lanyard strap connected to ceiling anchor
  const strapPath = useTransform([x, y], ([latestX, latestY]) => {
    const anchorX = 160;   // Fixed ceiling anchor
    const anchorY = -250;  // High above screen viewport

    const targetX = 160 + latestX;
    const targetY = 318 + latestY; 

    const cp1X = anchorX + (latestX * 0.14);
    const cp1Y = Math.min(targetY * 0.38, 50 + (latestY * 0.14));
    const cp2X = targetX - (latestX * 0.05);
    const cp2Y = targetY - 40;

    return `M ${anchorX} ${anchorY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${targetX} ${targetY}`;
  });

  return (
    <div
      className="relative w-full max-w-[320px] h-[480px] sm:h-[550px] flex flex-col items-center justify-start select-none touch-none [perspective:1200px] scale-[0.88] sm:scale-100 origin-top"
    >
      {/* SHOCKWAVE CYCLIC NEON PULSE BURST */}
      <motion.div
        initial={{ scale: 0.2, opacity: 0.95 }}
        animate={{ scale: 2.3, opacity: 0 }}
        transition={{ duration: 1.2, delay: 0.45, ease: 'easeOut' }}
        className="absolute -top-12 w-28 h-28 rounded-full border-2 border-rose-400 pointer-events-none z-0 bg-rose-400/20 blur-sm"
      />

      {/* ========================================================
          LAYER 1: UPPER MAROON WOVEN LANYARD STRAP (FROM CEILING)
          ======================================================== */}
      <motion.svg
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="absolute -top-[300px] left-0 w-full h-[calc(100%+300px)] pointer-events-none z-10 overflow-visible"
        style={{ filter: 'drop-shadow(0px 8px 16px rgba(0,0,0,0.65))' }}
      >
        <defs>
          {/* Deep Maroon / Burgundy Woven Ribbon Gradient */}
          <linearGradient id="refLanyardMaroon" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1E030B" />
            <stop offset="15%" stopColor="#4A081D" />
            <stop offset="50%" stopColor="#7A1032" />
            <stop offset="85%" stopColor="#4A081D" />
            <stop offset="100%" stopColor="#1E030B" />
          </linearGradient>

          {/* Stitch Thread */}
          <linearGradient id="refStitchThread" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.6)" />
          </linearGradient>

          {/* Metallic Chrome Specular Gradient */}
          <linearGradient id="chromeRefMetal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="25%" stopColor="#94A3B8" />
            <stop offset="50%" stopColor="#F1F5F9" />
            <stop offset="75%" stopColor="#64748B" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>

          {/* Luxurious Gold Metallic Accent Gradient */}
          <linearGradient id="goldAccentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B45309" />
            <stop offset="25%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#FDE68A" />
            <stop offset="75%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
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
            stroke="url(#refLanyardMaroon)"
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
            stroke="url(#refStitchThread)"
            strokeWidth="1.2"
            strokeDasharray="3.5,3.5"
            style={{ transform: 'translateX(-4.5px)' }}
          />

          {/* Right Stitch Line */}
          <motion.path
            d={strapPath}
            fill="none"
            stroke="url(#refStitchThread)"
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
        initial={{ y: -500, opacity: 0, scale: 0.75, rotateZ: 25 }}
        animate={{
          y: 0,
          opacity: 1,
          scale: 1,
          rotateZ: [25, -18, 12, -6, 2.5, 0],
        }}
        transition={{
          y: {
            type: 'spring',
            stiffness: 200,
            damping: 14,
            mass: 1.15,
            delay: 0.2,
          },
          opacity: { duration: 0.35, delay: 0.15 },
          scale: { duration: 0.45, delay: 0.15 },
          rotateZ: {
            duration: 2.6,
            delay: 0.3,
            ease: 'easeOut',
          },
        }}
        className="relative w-[265px] cursor-grab active:cursor-grabbing z-20 flex flex-col items-center group [transform-style:preserve-3d]"
      >
        {/* ========================================================
            ORGANIC 3D SWIVEL & FLIP OSCILLATION (MEMBALIK KIRI & KANAN)
            ======================================================== */}
        <motion.div
          animate={
            isDragging
              ? { rotateY: 0, rotateZ: 0, x: 0 }
              : {
                  rotateY: [-30, 30, -30],
                  rotateZ: [-3, 3, -3],
                  rotateX: [2.5, -2, 2.5],
                  x: [-5, 5, -5],
                  y: [0, -4, 0],
                }
          }
          transition={{
            rotateY: {
              duration: 9.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 2.8,
            },
            rotateZ: {
              duration: 10.8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 2.8,
            },
            rotateX: {
              duration: 8.6,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 2.8,
            },
            x: {
              duration: 9.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 2.8,
            },
            y: {
              duration: 6.8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 2.8,
            },
          }}
          className="w-full flex flex-col items-center [transform-style:preserve-3d] origin-top"
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
            
            {/* Center Lock Core Channel with Gold Highlight */}
            <div className="w-4 h-4 bg-gradient-to-b from-[#22020a] to-[#150106] rounded-xs border border-amber-400/40 flex flex-col items-center justify-center gap-0.5 shadow-inner">
              <div className="w-2.5 h-[1.5px] bg-amber-400 rounded-full" />
              <div className="w-2.5 h-[1.5px] bg-amber-400 rounded-full" />
            </div>

            {/* Right Side Push Tab */}
            <div className="w-1 h-3.5 bg-[#6b0d2c] rounded-sm shadow-inner" />
          </div>

          {/* ========================================================
              2. LOWER WHITE WOVEN RIBBON (WITH LOGO & GOLD ACCENT LINE)
              ======================================================== */}
          <div className="relative w-[21px] h-14 bg-gradient-to-r from-slate-200 via-white to-slate-200 shadow-md border-x border-slate-300 flex flex-col items-center justify-between py-1 overflow-hidden">
            {/* Top Monogram Logo on Ribbon */}
            <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#5c0b25] to-[#881337] flex items-center justify-center text-[6px] font-black text-amber-300 shadow-xs border border-amber-400/50">
              {cardBadge}
            </div>

            {/* Vertical Company / Portfolio Text */}
            <span className="text-[6.5px] font-black tracking-widest text-[#4a081d] uppercase [writing-mode:vertical-rl] rotate-180 font-sans opacity-90">
              {cardRibbonText}
            </span>

            {/* Radiant Gold Accent Stripe */}
            <div className="w-full h-[2px] bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
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
              <rect x="13" y="1" width="6" height="5" rx="1.5" fill="url(#chromeRefMetal)" stroke="#475569" strokeWidth="0.8" />
              
              {/* Main Lobster Snap Body */}
              <path
                d="M16 6 C10 6 6 10 6 16 C6 22 10 26 12 30 L12 36 C12 37 14 38 16 38 C18 38 20 37 20 36 L20 30 C22 26 26 22 26 16 C26 10 22 6 16 6 Z"
                fill="url(#chromeRefMetal)"
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

        {/* ========================================================
            4. THE 3D DUAL-TONE ID CARD (SUBTLE FROSTED BLUR)
            ======================================================== */}
        <motion.div
          style={{
            boxShadow: cardShadow,
          }}
          className="relative w-full bg-white/10 backdrop-blur-[6px] rounded-[22px] border-2 border-white/50 text-slate-900 shadow-2xl overflow-hidden -mt-2 flex flex-col antialiased [text-rendering:geometricPrecision]"
        >
          {/* ==========================================
              TOP SECTION (SUBTLE FROSTED WHITE)
              ========================================== */}
          <div className="relative w-full bg-white/88 backdrop-blur-[4px] pt-3 pb-8 px-4 flex flex-col items-center">
            {/* Top Oval Punch Hole (Directly clasped by the hook) */}
            <div className="relative w-8 h-2.5 bg-slate-950 rounded-full mb-3 border border-slate-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.85)] flex items-center justify-center">
              {/* Hook tip metallic reflection inside hole */}
              <div className="w-3 h-1 bg-gradient-to-r from-slate-200 via-white to-slate-300 rounded-full shadow-sm" />
            </div>

            {/* Modern Corporate Header (Logo + Company/Name) */}
            <div className="w-full flex items-center justify-center gap-2 px-1">
              {/* Monogram / Geometric Logo */}
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#4A081D] to-[#7A1032] p-[1.5px] shadow-sm flex items-center justify-center border border-amber-400/60">
                <div className="w-full h-full bg-[#3B0616] rounded-[6px] flex items-center justify-center">
                  <span className="text-[10px] font-black text-amber-300 tracking-tighter">{cardBadge}</span>
                </div>
              </div>

              {/* Company / Brand Typography */}
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1 leading-none">
                  <span className="text-[13.5px] font-black text-[#3B0616] tracking-tight uppercase font-sans">
                    {cardCompany}
                  </span>
                </div>
                <span className="text-[8px] font-bold text-slate-700 tracking-wider">
                  {cardDepartment}
                </span>
              </div>
            </div>
          </div>

          {/* ==========================================
              MIDDLE S-CURVE WAVE DIVIDER (MAROON & GOLD ACCENT)
              ========================================== */}
          <div className="relative w-full -mt-6 z-10 pointer-events-none">
            <svg
              viewBox="0 0 265 50"
              className="w-full h-auto block"
              fill="none"
              preserveAspectRatio="none"
            >
              {/* Layer 1: Silver / Soft Grey Background Wave */}
              <path
                d="M 0 24 C 70 8, 195 42, 265 14 L 265 50 L 0 50 Z"
                fill="#CBD5E1"
                opacity="0.6"
              />

              {/* Layer 2: Radiant Gold Accent Wave Stripe */}
              <path
                d="M 0 28 C 70 12, 195 46, 265 18 L 265 50 L 0 50 Z"
                fill="url(#goldAccentGrad)"
                opacity="1"
              />

              {/* Layer 3: Deep Maroon Subtle Body */}
              <path
                d="M 0 32 C 70 16, 195 50, 265 22 L 265 50 L 0 50 Z"
                fill="#4A081D"
                opacity="0.95"
              />
            </svg>

            {/* ==========================================
                CIRCULAR PROFILE PHOTO (OVERLAYS THE WAVE)
                ========================================== */}
            <div className="absolute left-1/2 -top-4 -translate-x-1/2 z-20 pointer-events-auto">
              <div className="relative w-[86px] h-[86px] rounded-full p-[3px] bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 shadow-[0_8px_25px_rgba(245,158,11,0.45)] ring-2 ring-amber-400">
                <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-b from-[#4A081D] to-[#25030E] border border-amber-300">
                  <img
                    src={avatar}
                    alt={fullName}
                    className="w-full h-full object-cover object-[center_28%] filter brightness-[1.05] contrast-[1.05]"
                    draggable="false"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ==========================================
              BOTTOM SECTION (SUBTLE FROSTED DEEP MAROON)
              ========================================== */}
          <div className="relative w-full bg-gradient-to-b from-[#4A081D]/90 via-[#380616]/92 to-[#25030E]/94 backdrop-blur-[5px] pt-14 pb-4 px-4 flex flex-col items-center text-center">
            {/* Person Name - Razor Sharp High Contrast */}
            <h3 className="text-[17.5px] font-black text-white tracking-wider uppercase font-sans leading-tight">
              {fullName}
            </h3>

            {/* Designation / Role with Gold Accent */}
            <div className="flex items-center gap-1.5 mt-0.5 mb-3.5">
              <span className="text-[10px] font-extrabold text-amber-300 tracking-widest uppercase font-sans">
                {jobTitle}
              </span>
              <span className="text-amber-400 text-[8px]">•</span>
              <span className="text-[9px] font-bold text-amber-200 tracking-wider">
                {cardRoleTag}
              </span>
            </div>

            {/* Clean Solid High-Contrast Data Table */}
            <div className="w-full bg-[#150208]/92 backdrop-blur-[3px] rounded-lg p-2.5 border border-amber-400/40 mb-3 text-[9.5px] font-mono flex flex-col gap-1 text-left shadow-inner">
              <div className="flex justify-between items-center">
                <span className="w-20 font-bold text-amber-300">ID No</span>
                <span className="flex-1 text-white font-bold">: {idCardNo}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="w-20 font-bold text-amber-300">Division</span>
                <span className="flex-1 text-white font-bold">: {division}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="w-20 font-bold text-amber-300">Specialist</span>
                <span className="flex-1 text-white font-bold">: {specialist}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="w-20 font-bold text-amber-300">Status</span>
                <span className="flex-1 text-emerald-400 font-extrabold">: {cardStatus}</span>
              </div>
            </div>

            {/* Clean High-Density Crisp Barcode */}
            <div className="w-full pt-1.5 border-t border-amber-400/30 flex flex-col items-center gap-1">
              <div className="w-full h-5 flex items-end justify-between px-2 bg-white/92 rounded-[3px] py-0.5 shadow-md">
                {[4, 7, 3, 8, 5, 7, 4, 6, 8, 3, 7, 5, 8, 4, 7, 8, 5, 8, 3, 6, 7, 4, 8, 5, 7, 3, 8, 6, 3, 7, 5, 8].map((h, i) => (
                  <div
                    key={i}
                    className="bg-black rounded-[0.5px]"
                    style={{
                      width: i % 4 === 0 ? '2.2px' : i % 2 === 0 ? '1.2px' : '0.7px',
                      height: `${h * 1.1 + 3.5}px`,
                    }}
                  />
                ))}
              </div>

              {/* Barcode Serial Number */}
              <span className="text-[8px] font-mono text-amber-300 font-bold tracking-widest uppercase">
                {cardBarcode}
              </span>
            </div>
          </div>

          {/* Specular Glare Reflection on 3D Card Tilt */}
          <motion.div
            style={{
              background: 'linear-gradient(105deg, transparent 25%, rgba(255,255,255,0.4) 50%, transparent 75%)',
              opacity: glareOpacity,
            }}
            className="absolute inset-0 pointer-events-none rounded-[22px]"
          />

          {/* Initial Shiny Light Sweep */}
          <motion.div
            initial={{ x: '-100%', opacity: 0.85 }}
            animate={{ x: '200%', opacity: 0 }}
            transition={{ duration: 1.4, delay: 0.55, ease: 'easeInOut' }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 pointer-events-none"
          />
        </motion.div>

        {/* END OF 3D SWIVEL OSCILLATION INNER WRAPPER */}
        </motion.div>
      </motion.div>
    </div>
  );
}

