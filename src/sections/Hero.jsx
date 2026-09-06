import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Mouse } from 'lucide-react';
import { LinkedinIcon, InstagramIcon } from '../components/SocialIcons';
import InteractiveIDCard from '../components/InteractiveIDCard';
import DarkRedMetalBackground from '../components/DarkRedMetalBackground';
import orangImg from '../assets/ORANG.png';
import { usePortfolio } from '../context/PortfolioContext';

export default function Hero({ customData }) {
  const { ownerData } = usePortfolio();
  const data = customData || ownerData;

  const linkedinUrl = data?.socialMedia?.linkedin || 'https://www.linkedin.com/in/riski2005saputra/';
  const instagramUrl = data?.socialMedia?.instagram || 'https://www.instagram.com/riskisaputra_1922/';
  const emailUrl = data?.profile?.email ? `mailto:${data.profile.email}` : 'mailto:riski2005saputra@gmail.com';

  // Dynamic values configured in Halaman 1
  const fullName = data?.profile?.fullName || 'RISKI SAPUTRA';
  const jobTitle = data?.profile?.jobTitle || 'MECHANICAL ENGINEER';
  const company = data?.profile?.cardCompany || 'YOUR COMPANY';
  const department = data?.profile?.cardDepartment || 'ENGINEERING & DESIGN';
  const ribbonText = data?.profile?.cardRibbonText || 'PORTFOLIO';

  // Construct dynamic moving banner text: Nama Lengkap, Jabatan, Nama Perusahaan, Departemen, dan Portofolio
  const topTapeElements = [fullName, jobTitle, company, department, ribbonText]
    .filter(Boolean)
    .map((s) => s.trim().toUpperCase());
  const topTapeSegment = `• ${topTapeElements.join(' • ')} `;
  const topTapeFullText = `${topTapeSegment}${topTapeSegment}${topTapeSegment}`;

  const bottomTapeElements = [ribbonText, company, department, fullName, jobTitle]
    .filter(Boolean)
    .map((s) => s.trim().toUpperCase());
  const bottomTapeSegment = `• ${bottomTapeElements.join(' • ')} `;
  const bottomTapeFullText = `${bottomTapeSegment}${bottomTapeSegment}${bottomTapeSegment}`;

  const handleScrollToAbout = (e) => {
    if (e) e.preventDefault();
    const el = document.getElementById('about');
    if (el) {
      const top = el.offsetTop - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="sticky top-0 min-h-[100dvh] sm:h-screen w-full flex flex-col justify-between pt-16 sm:pt-18 pb-6 sm:pb-8 px-4 sm:px-8 overflow-hidden bg-[#14030A] select-none z-0"
    >
      {/* ========================================================
          LAYER 0: 100% CODE-GENERATED "ABSTRACT DARK RED METAL" BACKGROUND
          ======================================================== */}
      <DarkRedMetalBackground />
      {/* ========================================================
          LAYER 1: SEAMLESS INDUSTRIAL HAZARD CAUTION TAPE (MOVING RIBBON)
          STYLE: 100% SOLID & VIBRANT, CRISP BLACK TEXT & HAZARD TEETH
          Z-INDEX: 1 (BEHIND PERSON AND CARD)
          ======================================================== */}
      <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden flex flex-col justify-between pt-20 sm:pt-28 pb-12 sm:pb-20">
        
        {/* Top Hazard Tape Track: Moving Seamlessly to the Left (Slow & Relaxed) */}
        <div className="w-full overflow-hidden flex select-none shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              duration: 150,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="flex w-max shrink-0 bg-[#FFB800] border-y border-white/30"
          >
            {/* 2 identical clones for infinite seamless scroll */}
            {[1, 2].map((idx) => (
              <div key={idx} className="flex flex-col shrink-0">
                {/* Top Black & Yellow Diagonal Hazard Stripes (Solid & Crisp) */}
                <div 
                  className="h-2.5 sm:h-3.5 w-full"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, #000000 0, #000000 12px, #FFB800 12px, #FFB800 24px)',
                  }}
                />

                {/* Center Yellow Band with Solid Black Typography */}
                <div className="py-1.5 sm:py-2.5 px-6 sm:px-8 flex items-center whitespace-nowrap bg-[#FFB800]">
                  <span className="text-black font-black font-mono tracking-[0.22em] text-xs sm:text-base md:text-lg lg:text-xl uppercase leading-none">
                    {topTapeFullText}
                  </span>
                </div>

                {/* Bottom Black & Yellow Diagonal Hazard Stripes (Solid & Crisp) */}
                <div 
                  className="h-2.5 sm:h-3.5 w-full"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(-45deg, #000000 0, #000000 12px, #FFB800 12px, #FFB800 24px)',
                  }}
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom Hazard Tape Track: Moving Seamlessly to the Right (Slow & Relaxed) */}
        <div className="w-full overflow-hidden flex select-none shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          <motion.div
            animate={{ x: ['-50%', '0%'] }}
            transition={{
              duration: 160,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="flex w-max shrink-0 bg-[#FFB800] border-y border-white/30"
          >
            {/* 2 identical clones for infinite seamless scroll */}
            {[1, 2].map((idx) => (
              <div key={idx} className="flex flex-col shrink-0">
                {/* Top Black & Yellow Diagonal Hazard Stripes (Solid & Crisp) */}
                <div 
                  className="h-2.5 sm:h-3.5 w-full"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(-45deg, #000000 0, #000000 12px, #FFB800 12px, #FFB800 24px)',
                  }}
                />

                {/* Center Yellow Band with Solid Black Typography */}
                <div className="py-1.5 sm:py-2.5 px-6 sm:px-8 flex items-center whitespace-nowrap bg-[#FFB800]">
                  <span className="text-black font-black font-mono tracking-[0.22em] text-xs sm:text-base md:text-lg lg:text-xl uppercase leading-none">
                    {bottomTapeFullText}
                  </span>
                </div>

                {/* Bottom Black & Yellow Diagonal Hazard Stripes (Solid & Crisp) */}
                <div 
                  className="h-2.5 sm:h-3.5 w-full"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, #000000 0, #000000 12px, #FFB800 12px, #FFB800 24px)',
                  }}
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ========================================================
          LAYER 2: ORANG.png (PERSON) WITH GENTLE WHITE AMBIENT BACKLIGHT
          Z-INDEX: 2 (IN FRONT OF TEXT, BEHIND / BESIDE CARD)
          ======================================================== */}
      <div className="absolute bottom-0 left-[0%] sm:left-[8%] lg:left-[14%] h-[55vh] sm:h-[80vh] lg:h-[88vh] z-[2] pointer-events-none flex items-end opacity-40 sm:opacity-100">
        {/* Tasteful Soft White Ambient Halo Aura behind person */}
        <div 
          className="absolute -inset-x-12 inset-y-0 bottom-0 blur-2xl pointer-events-none opacity-65"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.15) 35%, rgba(244,63,94,0.15) 60%, transparent 85%)',
          }}
        />

        {/* Person Image: Natural Brightness & Subtle Elegant White Rim Light */}
        <img
          src={data?.profile?.heroPersonUrl || orangImg}
          alt={fullName}
          className="relative h-full w-auto object-contain object-bottom drop-shadow-[0_0_18px_rgba(255,255,255,0.38)] drop-shadow-[0_0_35px_rgba(230,57,86,0.25)] filter brightness-[1.18] contrast-[1.04] saturate-[1.06]"
          draggable="false"
        />
      </div>

      {/* ========================================================
          LAYER 3 & 4: INTERACTIVE CARD & UI CONTROLS
          Z-INDEX: 10+ (IN FRONT OF TEXT AND PERSON)
          ======================================================== */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 items-center my-auto relative z-10">
        
        {/* Left Column: UI Controls & Actions (Aligned to the Left on Mobile to Avoid Lanyard Overlap) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="lg:col-span-6 flex flex-col items-start pt-1 sm:pt-8 lg:pt-0 pointer-events-auto z-20"
        >
          {/* Action CTA Button */}
          <a
            href="#about"
            onClick={handleScrollToAbout}
            id="hero-selengkapnya-btn"
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-rose-950/80 hover:bg-rose-900/90 border border-white/25 backdrop-blur-md transition-all duration-200 shadow-lg shadow-black/50 hover:shadow-rose-900/50 hover:translate-x-0.5 mb-2.5 sm:mb-6"
          >
            <span>Selengkapnya</span>
            <ArrowRight className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
          </a>

          {/* Social Media Icons (LinkedIn, Instagram, Gmail) */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn Profile"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg border border-white/20 bg-black/50 hover:bg-black/70 text-slate-200 hover:text-white flex items-center justify-center transition-all shadow-md backdrop-blur-md hover:scale-105"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram Profile"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg border border-white/20 bg-black/50 hover:bg-black/70 text-slate-200 hover:text-white flex items-center justify-center transition-all shadow-md backdrop-blur-md hover:scale-105"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a
              href={emailUrl}
              aria-label="Email Contact"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg border border-white/20 bg-black/50 hover:bg-black/70 text-slate-200 hover:text-white flex items-center justify-center transition-all shadow-md backdrop-blur-md hover:scale-105"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </motion.div>

        {/* Right Column: Hanging Interactive Draggable ID Card (Untouched & Fully Interactive) */}
        <div className="lg:col-span-6 flex items-center justify-center relative pointer-events-auto">
          <InteractiveIDCard customData={data} />
        </div>

      </div>

      {/* Layer 5: Center Bottom Scroll Indicator */}
      <button
        type="button"
        onClick={handleScrollToAbout}
        aria-label="Scroll to Tentang Saya"
        className="relative z-20 flex flex-col items-center justify-center text-white/90 hover:text-white gap-1 mt-4 select-none transition-all cursor-pointer mx-auto group pointer-events-auto"
      >
        <Mouse className="w-4 h-4 animate-bounce text-white group-hover:text-rose-200" />
        <span className="text-[10px] font-mono tracking-widest uppercase">Scroll</span>
      </button>
    </section>
  );
}
