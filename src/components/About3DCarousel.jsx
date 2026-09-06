import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, Folder, Award, Briefcase, Download, ArrowRight, Cpu } from 'lucide-react';
import riskiPortrait from '../assets/riski-about-portrait.jpg';
import { usePortfolio } from '../context/PortfolioContext';

export default function About3DCarousel({ onOpenModal, activeIndex: controlledIndex, onIndexChange, customData }) {
  const { ownerData } = usePortfolio();
  const data = customData || ownerData;
  const containerRef = useRef(null);

  const fullName = data?.profile?.fullName || 'RISKI SAPUTRA';
  const jobTitle = data?.profile?.jobTitle || 'Mechanical Engineer | Product Designer';
  const cvUrl = data?.cv?.fileUrl || '/CV%20Riski%20Saputra.pdf';
  const cvFileName = data?.cv?.fileName || 'CV Riski Saputra.pdf';

  const skillsSummary = data?.skills?.length > 0
    ? data.skills.slice(0, 4).map((s) => s.name).join(', ')
    : 'SolidWorks, Autodesk Inventor, ANSYS Structural, Kinematic Motion, DFM & Prototype.';

  const cards = [
    {
      id: 0,
      type: 'profile',
      badge: 'PROFIL',
      title: fullName.toUpperCase(),
      subtitle: jobTitle,
      description: data?.profile?.bio || 'Spesialis perancangan sistem mekanikal, 3D CAD modeling, dan analisis simulasi teknik.',
      buttonText: 'Download CV',
      buttonIcon: Download,
      action: () => {
        const link = document.createElement('a');
        link.href = cvUrl;
        link.download = cvFileName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
    },
    {
      id: 1,
      type: 'projects',
      badge: 'PORTFOLIO',
      title: data?.profile?.card1Title || 'VIEW PROJECTS',
      subtitle: `${data?.projects?.length || 0} Koleksi Karya Inovatif`,
      description: data?.profile?.card1Desc || 'Lihat semua projek yang pernah saya kerjakan dalam industri manufaktur, perancangan mesin, dan web apps.',
      buttonText: 'Lihat Projek',
      buttonIcon: ArrowRight,
      action: () => {
        const el = document.getElementById('projects');
        if (el) {
          const top = el.offsetTop - 70;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      },
    },
    {
      id: 2,
      type: 'certificate',
      badge: 'KREDENSIAL',
      title: data?.profile?.card2Title || 'CERTIFICATE',
      subtitle: `${data?.certificates?.length || 6} Sertifikat Resmi`,
      description: data?.profile?.card2Desc || 'Sertifikat keahlian resmi yang saya peroleh dari berbagai pelatihan industri, software engineering, dan asosiasi.',
      buttonText: 'Lihat Sertifikat',
      buttonIcon: ArrowRight,
      action: () => {
        if (onOpenModal) onOpenModal('certificate');
      },
    },
    {
      id: 3,
      type: 'works',
      badge: 'TRACK RECORD',
      title: data?.profile?.card3Title || 'COMPLETED WORKS',
      subtitle: data?.profile?.card3Subtitle || 'Hasil Pekerjaan Industri',
      description: data?.profile?.card3Desc || 'Dokumentasi berbagai pekerjaan teknis dan perancangan mesin yang telah sukses diselesaikan.',
      buttonText: 'Lihat Pekerjaan',
      buttonIcon: ArrowRight,
      action: () => {
        if (onOpenModal) onOpenModal('works');
      },
    },
    {
      id: 4,
      type: 'skills',
      badge: 'KEAHLIAN TEKNIK',
      title: data?.profile?.card4Title || 'TECHNICAL SKILLS',
      subtitle: `${data?.skills?.length || 8} Keahlian Terverifikasi`,
      description: skillsSummary,
      buttonText: 'Eksplorasi Skill',
      buttonIcon: ArrowRight,
      action: () => {
        if (onOpenModal) onOpenModal('skills');
      },
    },
  ];
  const isInView = useInView(containerRef, {
    amount: 0.45,
    once: false,
  });

  const [internalIndex, setInternalIndex] = useState(4);
  const activeIndex = controlledIndex !== undefined ? controlledIndex : internalIndex;
  const setActiveIndex = onIndexChange || setInternalIndex;

  const cardsData = cards;
  const total = cardsData.length;

  // Auto-scroll animation from Technical Skills (id: 4) to Profile Card (id: 0) when entering Page 2
  useEffect(() => {
    if (isInView) {
      // Start at Technical Skills (index 4)
      setActiveIndex(4);

      // Smoothly rotate to Profile Card (index 0) after brief entrance pause
      const timer = setTimeout(() => {
        setActiveIndex(0); // Rotates into Riski Saputra Profile
      }, 550);

      return () => clearTimeout(timer);
    } else {
      // Reset to 4 when leaving view so animation replays upon re-entry
      setActiveIndex(4);
    }
  }, [isInView]);

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % total;
    setActiveIndex(nextIdx);
  };

  const handlePrev = () => {
    const prevIdx = (activeIndex - 1 + total) % total;
    setActiveIndex(prevIdx);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const touchStartX = useRef(null);
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 40) {
      handleNext();
    } else if (diff < -40) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-[320px] sm:h-[410px] flex items-center justify-center select-none overflow-visible"
    >
      {/* 3D HOLOGRAPHIC LIGHTING BACKGROUND & RINGS */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible">
        {/* Deep ambient radial glow */}
        <div className="absolute w-[340px] sm:w-[420px] h-[340px] sm:h-[420px] rounded-full bg-rose-900/25 blur-[80px] animate-pulse" />

        {/* Central white neon halo */}
        <div className="absolute w-[240px] sm:w-[300px] h-[240px] sm:h-[300px] rounded-full bg-white/15 blur-[50px]" />

        {/* Holographic orbital ring 1 (outer dashed spinning ring) */}
        <div
          className="absolute w-[320px] sm:w-[390px] h-[320px] sm:h-[390px] rounded-full border border-white/30 [border-dasharray:10,10] animate-[spin_30s_linear_infinite]"
          style={{
            boxShadow: '0 0 30px rgba(255,255,255,0.2) inset, 0 0 30px rgba(255,255,255,0.2)',
          }}
        />

        {/* Holographic orbital ring 2 (inner glowing white border) */}
        <div
          className="absolute w-[250px] sm:w-[310px] h-[250px] sm:h-[310px] rounded-full border-2 border-white/40 animate-[spin_20s_linear_infinite_reverse]"
          style={{
            boxShadow: '0 0 20px rgba(255,255,255,0.35)',
          }}
        />

        {/* 3D Floor Pedestal Ellipse reflection */}
        <div
          className="absolute -bottom-4 w-[380px] sm:w-[460px] h-[120px] rounded-[100%] border border-white/30 bg-gradient-to-b from-white/10 via-rose-950/25 to-transparent"
          style={{
            transform: 'rotateX(75deg)',
            boxShadow: '0 0 35px rgba(255,255,255,0.25)',
          }}
        />
      </div>

      {/* 3D ROTATING CAROUSEL STAGE */}
      <div className="relative w-full h-full flex items-center justify-center [perspective:1400px] [transform-style:preserve-3d] z-20">
        {cardsData.map((card, i) => {
          let offset = (i - activeIndex) % total;
          if (offset > total / 2) offset -= total;
          if (offset < -total / 2) offset += total;

          const isActive = offset === 0;
          const isVisible = Math.abs(offset) <= 2;

          // 3D positioning along cylinder (dynamically adjusted for mobile vs desktop)
          const xOffset = offset * (isMobile ? 80 : 120);
          const zOffset = isActive ? (isMobile ? 50 : 75) : -Math.abs(offset) * (isMobile ? 45 : 60);
          const rotateY = offset * (isMobile ? -20 : -24);
          const scale = isActive ? 1.04 : Math.max(0.74, (isMobile ? 0.82 : 0.86) - Math.abs(offset) * 0.07);
          const opacity = isVisible ? (isActive ? 1 : Math.max(0.35, 0.9 - Math.abs(offset) * 0.28)) : 0;
          const zIndex = 50 - Math.abs(offset) * 10;

          return (
            <motion.div
              key={card.id}
              onClick={() => setActiveIndex(i)}
              animate={{
                x: xOffset,
                z: zOffset,
                rotateY: rotateY,
                scale: scale,
                opacity: opacity,
              }}
              transition={{
                type: 'spring',
                stiffness: 240,
                damping: 22,
                mass: 0.9,
              }}
              style={{
                zIndex: zIndex,
                transformStyle: 'preserve-3d',
              }}
              whileHover={!isActive ? { scale: scale * 1.05, opacity: 0.95 } : { scale: scale * 1.02 }}
              className={`absolute w-[185px] sm:w-[235px] h-[265px] sm:h-[325px] rounded-[18px] sm:rounded-[20px] cursor-pointer transition-colors duration-500 select-none overflow-hidden ${
                isActive
                  ? 'bg-gradient-to-b from-[#5c0b25] via-[#43071a] to-[#1a0209] border-2 border-white/80 shadow-[0_0_40px_rgba(255,255,255,0.35),0_0_20px_rgba(244,63,94,0.4),0_22px_45px_rgba(0,0,0,0.9)] text-white'
                  : 'bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#E2E8F0] border border-slate-300 shadow-[0_16px_32px_-6px_rgba(0,0,0,0.65)] text-slate-900'
              }`}
            >
              {/* TOP PUNCH SLOT & BADGE IDENTIFIER */}
              <div className="p-3.5 sm:p-4 h-full flex flex-col justify-between relative">
                
                {/* Punch Slot */}
                <div
                  className={`w-8 h-2 rounded-full mx-auto mb-1.5 border shadow-inner flex items-center justify-center ${
                    isActive
                      ? 'bg-black/60 border-white/40'
                      : 'bg-slate-900/90 border-slate-400/40'
                  }`}
                >
                  <div
                    className={`w-3 h-0.5 rounded-full ${
                      isActive ? 'bg-white/90' : 'bg-slate-700'
                    }`}
                  />
                </div>

                {/* CARD CONTENT */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    {/* Top Icon / Photo */}
                    {card.type === 'profile' ? (
                      <div className="relative w-20 sm:w-22 aspect-[3/4] rounded-xl overflow-hidden shadow-lg mb-2 bg-slate-950 border-2 border-white/60">
                        <img
                          src={data?.profile?.aboutAvatarUrl || data?.profile?.avatarUrl || riskiPortrait}
                          alt={fullName}
                          className="w-full h-full object-cover object-top filter brightness-[1.03] contrast-[1.04]"
                          draggable="false"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute top-0 right-0 w-6 h-full bg-gradient-to-bl from-white/30 via-white/10 to-transparent transform -skew-x-12 translate-x-2 pointer-events-none" />
                      </div>
                    ) : (
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 border shadow-sm transition-all duration-300 ${
                          isActive
                            ? 'bg-white/15 border-white/50 text-white shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                            : 'bg-rose-50 border-rose-100 text-rose-900'
                        }`}
                      >
                        {card.type === 'projects' && <Folder className="w-4.5 h-4.5" />}
                        {card.type === 'certificate' && <Award className="w-4.5 h-4.5" />}
                        {card.type === 'works' && <Briefcase className="w-4.5 h-4.5" />}
                        {card.type === 'skills' && <Cpu className="w-4.5 h-4.5" />}
                      </div>
                    )}

                    {/* Badge Category */}
                    <span
                      className={`text-[8.5px] font-bold font-mono tracking-wider uppercase block mb-0.5 ${
                        isActive ? 'text-rose-200' : 'text-slate-400'
                      }`}
                    >
                      {card.badge}
                    </span>

                    {/* Title */}
                    <h3
                      className={`text-[15px] sm:text-[16px] font-black tracking-tight leading-tight uppercase mb-1 ${
                        isActive ? 'text-white drop-shadow-md' : 'text-slate-950'
                      }`}
                    >
                      {card.title}
                    </h3>

                    {/* Description */}
                    <p
                      className={`text-[10px] sm:text-[10.5px] leading-snug line-clamp-3 ${
                        isActive ? 'text-rose-100' : 'text-slate-600'
                      }`}
                    >
                      {card.description}
                    </p>
                  </div>

                  {/* BOTTOM ACTION BUTTON */}
                  <div
                    className={`pt-2 mt-1 border-t ${
                      isActive ? 'border-white/25' : 'border-slate-200'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        card.action();
                      }}
                      className={`w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-[11px] font-bold transition-all duration-300 shadow-md ${
                        isActive
                          ? 'bg-gradient-to-r from-rose-900 via-rose-800 to-rose-900 hover:from-rose-800 hover:to-rose-700 text-white shadow-rose-950/40 border border-white/40 hover:scale-[1.02]'
                          : 'bg-rose-900 hover:bg-rose-800 active:bg-rose-950 text-white shadow-rose-950/30'
                      }`}
                    >
                      <span>{card.buttonText}</span>
                      {card.buttonIcon && <card.buttonIcon className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                {/* Specular Holographic Glare Overlay on Active Card */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/15 via-white/25 to-transparent pointer-events-none rounded-[20px]" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* NAVIGATION CONTROLS (< and > BUTTONS) */}
      <button
        type="button"
        onClick={handlePrev}
        aria-label="Previous card"
        className="absolute left-0 sm:left-2 z-40 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-rose-900 active:bg-rose-950 text-white border border-white/30 hover:border-white shadow-lg flex items-center justify-center transition-all duration-300 backdrop-blur-md hover:scale-110 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] group cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
      </button>

      <button
        type="button"
        onClick={handleNext}
        aria-label="Next card"
        className="absolute right-0 sm:right-2 z-40 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-rose-900 active:bg-rose-950 text-white border border-white/30 hover:border-white shadow-lg flex items-center justify-center transition-all duration-300 backdrop-blur-md hover:scale-110 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] group cursor-pointer"
      >
        <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
      </button>

      {/* CAROUSEL INDICATOR DOTS */}
      <div className="absolute -bottom-3 z-30 flex items-center gap-1.5 bg-black/50 px-2.5 py-0.5 rounded-full border border-white/10 backdrop-blur-md">
        {cardsData.map((_, dotIdx) => (
          <button
            key={dotIdx}
            type="button"
            onClick={() => setActiveIndex(dotIdx)}
            aria-label={`Go to slide ${dotIdx + 1}`}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              activeIndex === dotIdx
                ? 'w-5 h-1.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)]'
                : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
