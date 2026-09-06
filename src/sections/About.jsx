import React, { useState, useRef } from 'react';
import { motion, useScroll } from 'framer-motion';
import { Briefcase, Folder, Users, Award, CheckCircle2 } from 'lucide-react';
import About3DCarousel from '../components/About3DCarousel';
import AboutModals from '../components/AboutModals';
import ScrollFrameCanvas from '../components/ScrollFrameCanvas';
import { usePortfolio } from '../context/PortfolioContext';

export default function About({ customData }) {
  const { ownerData } = usePortfolio();
  const data = customData || ownerData;
  const sectionRef = useRef(null);
  const [activeModal, setActiveModal] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Measure scroll progress across the 320vh height of Section 2
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const handleNavigateProjects = () => {
    const el = document.getElementById('projects');
    if (el) {
      const top = el.offsetTop - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const handleNavigateContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      const top = el.offsetTop - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const stats = [
    {
      icon: Briefcase,
      value: data?.profile?.experienceYears || '3+',
      label: data?.profile?.stat1Label || 'Tahun Pengalaman',
      hint: 'Lihat Karir',
      action: () => setActiveModal('experience'),
    },
    {
      icon: Folder,
      value: data?.profile?.stat2Value || `${data?.projects?.length || 10}+`,
      label: data?.profile?.stat2Label || 'Karya Mesin & Alat',
      hint: 'Buka Projek',
      action: handleNavigateProjects,
    },
    {
      icon: Users,
      value: data?.profile?.education || 'D3',
      label: data?.profile?.stat3Label || 'Pendidikan',
      hint: 'Pendidikan',
      action: () => setActiveModal('experience'),
    },
    {
      icon: Award,
      value: data?.profile?.certCount || `${data?.certificates?.length || 6}+`,
      label: data?.profile?.stat4Label || 'Sertifikasi Resmi',
      hint: 'Lihat Sertifikat',
      action: () => setActiveModal('certifications'),
    },
  ];

  const bullet1 = data?.profile?.aboutBullet1 || data?.skills?.[0]?.name || '3D CAD Modeling & Kinematic Assembly';
  const bullet2 = data?.profile?.aboutBullet2 || data?.skills?.[1]?.name || 'Finite Element Analysis (FEA) & Simulation';
  const bullet3 = data?.profile?.aboutBullet3 || data?.skills?.[2]?.name || 'Industrial Product R&D & Fabrication';

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-[380vh] w-full select-none z-10 bg-[#05080D] shadow-[0_-30px_70px_rgba(0,0,0,0.95)]"
    >
      {/* STICKY FULLSCREEN VIEWPORT CONTAINER */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between pt-16 sm:pt-20 pb-4 sm:pb-8 px-3.5 sm:px-8">
        
        {/* LAYER 1 & 2: SCROLL-DRIVEN 192-FRAME CINEMATIC CANVAS BACKGROUND */}
        <ScrollFrameCanvas scrollProgress={scrollYProgress} />

        {/* Ambient Colored Neon Flares */}
        <div className="absolute top-1/4 left-1/3 w-[450px] h-[450px] bg-rose-900/20 rounded-full blur-[110px] pointer-events-none z-5" />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-white/5 rounded-full blur-[90px] pointer-events-none z-5" />

        {/* LAYER 3: CONTENT (Heading, Interactive Bullets, 3D Carousel, Interactive Statistics) */}
        <div className="max-w-7xl mx-auto w-full flex flex-col justify-between z-10 my-auto relative">
          
          {/* Main 2-Column Grid: Left (Description) + Right (3D Holographic Orbit Carousel) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 lg:gap-8 items-center mb-2 sm:mb-6">
            
            {/* Left Column: Heading & Description */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5 flex flex-col items-start"
            >
              {/* Badge: 02 / TENTANG SAYA */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-white/30 bg-black/60 backdrop-blur-md mb-1.5 sm:mb-2.5 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-[10px] sm:text-[11px] font-mono font-semibold tracking-wider text-white">
                  {data?.profile?.aboutBadge || '02 / TENTANG SAYA'}
                </span>
              </div>

              <h2 className="text-xl sm:text-3xl lg:text-[38px] font-black text-white leading-tight tracking-tight mb-1 sm:mb-2 font-sans drop-shadow-md">
                {data?.profile?.aboutTitle || 'Lebih Dekat Dengan Saya'}
              </h2>

              {/* Glowing Radiant White & Maroon Line Accent */}
              <div className="w-10 sm:w-12 h-1 bg-gradient-to-r from-white via-rose-300 to-rose-900 rounded-full mb-2 sm:mb-3 shadow-[0_0_12px_rgba(255,255,255,0.8)]" />

              <p className="text-xs sm:text-[13px] text-slate-200 leading-relaxed max-w-lg mb-2 sm:mb-4 drop-shadow line-clamp-2 sm:line-clamp-none">
                {data?.profile?.bio || 'Saya berfokus pada perancangan produk, analisis kekuatan struktur, dan pengembangan solusi teknik yang inovatif untuk industri modern.'}
              </p>

              {/* Feature Bullet Points (Visible on tablet & desktop for clean mobile height) */}
              <div className="hidden sm:flex flex-col gap-1.5 sm:gap-2 mb-1 w-full max-w-md">
                <button
                  type="button"
                  onClick={() => {
                    setCarouselIndex(4);
                    setActiveModal('skills');
                  }}
                  className="flex items-center justify-between p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.12] border border-white/10 hover:border-white/40 text-xs sm:text-[12.5px] font-semibold text-slate-100 transition-all text-left group cursor-pointer shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0 group-hover:scale-110 transition-transform" />
                    <span>{bullet1}</span>
                  </div>
                  <span className="text-[10px] font-mono text-rose-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    Lihat Skill &rarr;
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCarouselIndex(4);
                    setActiveModal('skills');
                  }}
                  className="flex items-center justify-between p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.12] border border-white/10 hover:border-white/40 text-xs sm:text-[12.5px] font-semibold text-slate-100 transition-all text-left group cursor-pointer shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0 group-hover:scale-110 transition-transform" />
                    <span>{bullet2}</span>
                  </div>
                  <span className="text-[10px] font-mono text-rose-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    Lihat Skill &rarr;
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCarouselIndex(3);
                    setActiveModal('works');
                  }}
                  className="flex items-center justify-between p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.12] border border-white/10 hover:border-white/40 text-xs sm:text-[12.5px] font-semibold text-slate-100 transition-all text-left group cursor-pointer shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0 group-hover:scale-110 transition-transform" />
                    <span>{bullet3}</span>
                  </div>
                  <span className="text-[10px] font-mono text-rose-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    Rekam Jejak &rarr;
                  </span>
                </button>
              </div>
            </motion.div>

            {/* Right Column: 3D Holographic Rotating Cards Carousel Stage */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="lg:col-span-7 flex items-center justify-center relative w-full"
            >
              <About3DCarousel
                onOpenModal={setActiveModal}
                activeIndex={carouselIndex}
                onIndexChange={setCarouselIndex}
                customData={data}
              />
            </motion.div>

          </div>

          {/* Bottom Statistics Interactive Glass Container */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5 p-2.5 sm:p-3.5 rounded-xl bg-black/60 backdrop-blur-xl border border-white/20 shadow-[0_15px_40px_rgba(0,0,0,0.85)] mt-2 sm:mt-4"
          >
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={stat.action}
                  className="flex items-center gap-3 p-2 sm:p-2.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.12] border border-transparent hover:border-white/30 transition-all text-left group cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-lg bg-rose-950/60 group-hover:bg-rose-900 border border-white/20 group-hover:border-white/50 flex items-center justify-center text-white shadow-inner shrink-0 transition-all group-hover:scale-105">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg sm:text-xl font-black text-white font-mono leading-none">
                        {stat.value}
                      </span>
                      <span className="text-[9px] font-mono font-bold text-rose-300 opacity-0 group-hover:opacity-100 transition-opacity">
                        {stat.hint}
                      </span>
                    </div>
                    <div className="text-[11px] sm:text-xs font-medium text-slate-300 truncate">
                      {stat.label}
                    </div>
                  </div>
                </button>
              );
            })}
          </motion.div>

        </div>

      </div>

      {/* Global Interactive Modals for Page 2 */}
      <AboutModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        onNavigateProjects={handleNavigateProjects}
        onNavigateContact={handleNavigateContact}
        customData={data}
      />
    </section>
  );
}

