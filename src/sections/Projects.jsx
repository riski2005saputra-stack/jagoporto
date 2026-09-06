import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ArrowRight, X, Compass, Cpu, Wrench, MessageSquare, Sparkles, Globe, Code2 } from 'lucide-react';
import { PROJECT_CATEGORIES, PROJECTS_DATA } from '../data/projects';
import DarkRedMetalBackground from '../components/DarkRedMetalBackground';
import { usePortfolio } from '../context/PortfolioContext';

export default function Projects({ customData }) {
  const { ownerData } = usePortfolio();
  const data = customData || ownerData;
  const fullName = data?.profile?.fullName || 'Riski Saputra';
  const hazardText = data?.profile?.projectsHazardText || `• PORTO FOLIO ${fullName.toUpperCase()} • PORTO FOLIO ${fullName.toUpperCase()} • PORTO FOLIO ${fullName.toUpperCase()} •`;
  const projectsBadge = data?.profile?.projectsBadge || '03 / PROJECT SHOWCASE';
  const projectsTitle = data?.profile?.projectsTitle || 'COMPLETED WORKS';
  const projectsSubtitle = data?.profile?.projectsSubtitle || 'From Mechanical Engineering, Modern Web Apps to CV Portfolio Templates';
  const projectsFooterSummary = data?.profile?.projectsFooterSummary || 'MESIN, WEB APPS & TEMPLATE CV';

  const [activeCategory, setActiveCategory] = useState('Semua');
  const [selectedProject, setSelectedProject] = useState(null);

  const isCustomPortfolio = !!customData;
  const projectsList = isCustomPortfolio
    ? (Array.isArray(customData.projects) ? customData.projects : [])
    : (data?.projects && data.projects.length > 0 ? data.projects : PROJECTS_DATA);

  // Determine available categories dynamically
  const availableCategories = data?.projectCategories && data.projectCategories.length > 0
    ? ['Semua', ...data.projectCategories]
    : ['Semua', ...Array.from(new Set(projectsList.map((p) => p.filterCategory || p.category).filter(Boolean)))];

  const filteredProjects = activeCategory === 'Semua'
    ? projectsList
    : projectsList.filter((p) => (p.filterCategory || p.category) === activeCategory || p.category === activeCategory);

  return (
    <section
      id="projects"
      className="relative min-h-screen w-full select-none py-24 sm:py-28 px-4 sm:px-8 bg-[#14030A] overflow-hidden z-20 -mt-[100vh] shadow-[0_-40px_100px_rgba(0,0,0,0.98),0_-15px_40px_rgba(165,29,53,0.4)]"
    >
      {/* ========================================================================= */}
      {/* 100% CODE-GENERATED "ABSTRACT DARK RED METAL" BACKGROUND */}
      {/* ========================================================================= */}
      <DarkRedMetalBackground />

      {/* ========================================================================= */}
      {/* CORNER DIAGONAL MOVING HAZARD TAPES (SUDUT MIRING HALAMAN 3) */}
      {/* TEXT: PORTO FOLIO RISKI SAPUTRA (DYNAMIC) */}
      {/* Responsif: Di Mobile berada di sudut atas agar tidak menumpuk/menutupi teks judul */}
      {/* ========================================================================= */}
      {/* Top-Left / Left Angled Hazard Tape */}
      <div 
        className="absolute pointer-events-none z-[1] overflow-hidden select-none shadow-[0_0_25px_rgba(255,255,255,0.35)] w-[580px] sm:w-[800px] md:w-[1000px] -top-3 sm:top-6 md:top-[130px] -left-[260px] sm:-left-[240px] md:-left-[220px] -rotate-[18deg] sm:-rotate-[26deg] md:-rotate-[32deg] origin-center opacity-75 sm:opacity-100"
      >
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: 160,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="flex w-max shrink-0 bg-[#FFB800] border-y-2 border-white/60"
        >
          {[1, 2].map((idx) => (
            <div key={idx} className="flex flex-col shrink-0">
              <div 
                className="h-2 sm:h-2.5 md:h-3 w-full"
                style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, #000000 0, #000000 12px, #FFB800 12px, #FFB800 24px)',
                }}
              />
              <div className="py-1 sm:py-1.5 md:py-2 px-6 sm:px-8 md:px-10 flex items-center whitespace-nowrap bg-[#FFB800]">
                <span className="text-black font-black font-mono tracking-[0.22em] text-xs sm:text-sm md:text-lg uppercase leading-none">
                  {hazardText}
                </span>
              </div>
              <div 
                className="h-2 sm:h-2.5 md:h-3 w-full"
                style={{
                  backgroundImage: 'repeating-linear-gradient(-45deg, #000000 0, #000000 12px, #FFB800 12px, #FFB800 24px)',
                }}
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Top-Right / Right Angled Hazard Tape */}
      <div 
        className="absolute pointer-events-none z-[1] overflow-hidden select-none shadow-[0_0_25px_rgba(255,255,255,0.35)] w-[580px] sm:w-[800px] md:w-[1000px] -top-3 sm:top-6 md:top-[130px] -right-[260px] sm:-right-[240px] md:-right-[220px] rotate-[18deg] sm:rotate-[26deg] md:rotate-[32deg] origin-center opacity-75 sm:opacity-100"
      >
        <motion.div
          animate={{ x: ['-50%', '0%'] }}
          transition={{
            duration: 160,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="flex w-max shrink-0 bg-[#FFB800] border-y-2 border-white/60"
        >
          {[1, 2].map((idx) => (
            <div key={idx} className="flex flex-col shrink-0">
              <div 
                className="h-2 sm:h-2.5 md:h-3 w-full"
                style={{
                  backgroundImage: 'repeating-linear-gradient(-45deg, #000000 0, #000000 12px, #FFB800 12px, #FFB800 24px)',
                }}
              />
              <div className="py-1 sm:py-1.5 md:py-2 px-6 sm:px-8 md:px-10 flex items-center whitespace-nowrap bg-[#FFB800]">
                <span className="text-black font-black font-mono tracking-[0.22em] text-xs sm:text-sm md:text-lg uppercase leading-none">
                  {hazardText}
                </span>
              </div>
              <div 
                className="h-2 sm:h-2.5 md:h-3 w-full"
                style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, #000000 0, #000000 12px, #FFB800 12px, #FFB800 24px)',
                }}
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Main Content Stage */}
      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col">
        
        {/* ========================================================================= */}
        {/* SECTION HEADER: COMPLETED WORKS */}
        {/* ========================================================================= */}
        <div className="flex flex-col items-center text-center mb-10 sm:mb-12 relative z-10 px-2">
          
          {/* Engineering Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#641326] bg-[#240812]/80 backdrop-blur-md mb-3 shadow-[0_0_20px_rgba(165,29,53,0.35)]"
          >
            <span className="w-2 h-2 rounded-full bg-[#D7354D] animate-pulse shadow-[0_0_8px_#D7354D]" />
            <span className="text-[11px] font-mono font-bold tracking-widest text-[#D7354D] uppercase">
              {projectsBadge}
            </span>
          </motion.div>

          {/* Main Title: COMPLETED WORKS */}
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl sm:text-4xl md:text-5xl lg:text-[52px] font-black text-white uppercase tracking-tight font-sans drop-shadow-[0_4px_25px_rgba(165,29,53,0.45)] leading-tight mb-2"
          >
            {projectsTitle}
          </motion.h2>

          {/* Subtitle: From Design, Analysis to Fabrication */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="text-xs sm:text-base md:text-lg text-slate-300 font-medium tracking-wide max-w-2xl font-sans"
          >
            {projectsSubtitle}
          </motion.p>

          {/* Glowing Metallic Red Accent Bar */}
          <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-transparent via-[#D7354D] to-transparent rounded-full mt-2.5 sm:mt-3 shadow-[0_0_12px_#D7354D]" />

          {/* ========================================================================= */}
          {/* 3 CLEAN CATEGORY FILTER TABS */}
          {/* ========================================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 mt-5 sm:mt-8 max-w-3xl"
          >
            {availableCategories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-xl text-[11px] sm:text-[13px] font-bold transition-all duration-300 cursor-pointer backdrop-blur-xl ${
                    isActive
                      ? 'bg-gradient-to-r from-[#641326] via-[#A51D35] to-[#641326] text-white shadow-[0_0_25px_rgba(165,29,53,0.6)] border border-[#D7354D]/80 scale-[1.03]'
                      : 'bg-[#15030A]/90 text-slate-300 hover:text-white hover:bg-[#240812] border border-[#3D0B18]/80 hover:border-[#641326]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </motion.div>
        </div>

        {/* ========================================================================= */}
        {/* RESPONSIVE 3-COLUMN CARDS GRID (3 Desktop, 2 Tablet, 1 Mobile) */}
        {/* ========================================================================= */}
        {projectsList.length === 0 ? (
          <div className="p-8 sm:p-14 rounded-3xl bg-[#120409]/60 border border-[#3D0B18]/80 text-center space-y-3 sm:space-y-4 max-w-xl mx-auto mb-12 shadow-2xl backdrop-blur-xl">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500">
              <Code2 className="w-7 h-7 text-[#D7354D]/70" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white font-sans">
              Belum Ada Projek yang Ditambahkan
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              Karya dan dokumentasi projek dapat ditambahkan dan diatur oleh pemilik akun melalui Menu Editor.
            </p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-8 sm:p-12 rounded-2xl bg-[#120409]/60 border border-[#3D0B18]/60 text-center space-y-2 max-w-md mx-auto mb-12">
            <p className="text-xs sm:text-sm text-slate-400">
              Belum ada projek dalam kategori <strong>"{activeCategory}"</strong>.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 mb-12">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, idx) => {
                const projectNumber = String(idx + 1).padStart(2, '0');
                const isWeb = project.type === 'webapp' || project.type === 'template';

                return (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 35, scale: 0.94 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.45,
                      delay: idx * 0.04,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    onClick={() => setSelectedProject(project)}
                    className="group relative rounded-2xl bg-[#120409]/80 backdrop-blur-2xl border border-[#3D0B18]/80 hover:border-[#A51D35] transition-all duration-400 flex flex-col justify-between overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.85)] hover:shadow-[0_0_35px_rgba(165,29,53,0.4)] hover:-translate-y-2 cursor-pointer"
                  >
                    {/* Subtle Background Radial Glow on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#641326]/10 to-[#A51D35]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    {/* TOP HALF: 16:9 IMAGE HERO WITH DYNAMIC BADGES */}
                    <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-black/60">
                      {project.coverImage ? (
                        <img
                          src={project.coverImage}
                          alt={project.title}
                          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 font-mono text-xs gap-1">
                          <Code2 className="w-8 h-8 opacity-40" />
                          <span>Dokumentasi Teknis</span>
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-[#120409] via-transparent to-black/30" />

                      {/* Number Badge Top Left */}
                      <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-lg bg-black/80 border border-[#641326] text-[10px] font-mono font-bold text-slate-300 backdrop-blur-md">
                        #{projectNumber}
                      </div>

                      {/* Category Badge Top Right */}
                      <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-lg bg-[#641326]/90 border border-[#A51D35] text-[10px] font-mono font-bold text-white uppercase tracking-wider backdrop-blur-md">
                        {project.category}
                      </div>

                      {/* Live Url indicator badge */}
                      {project.liveUrl && (
                        <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-emerald-950/90 border border-emerald-500/50 text-[9.5px] font-mono font-bold text-emerald-300 flex items-center gap-1">
                          <Globe className="w-3 h-3 text-emerald-400" />
                          <span>LIVE</span>
                        </div>
                      )}
                    </div>

                    {/* BOTTOM HALF: SPECS & 3 PILLARS */}
                    <div className="p-4 sm:p-5 flex flex-col justify-between flex-grow space-y-3.5">
                      <div>
                        {/* Sub Category */}
                        <div className="text-[10.5px] font-mono font-bold text-[#D7354D] uppercase tracking-wider mb-1">
                          {project.subCategory || project.category}
                        </div>

                        {/* Title */}
                        <h4 className="text-sm sm:text-base font-bold text-white font-sans leading-snug group-hover:text-[#D7354D] transition-colors line-clamp-2">
                          {project.title}
                        </h4>

                        {/* Short Description */}
                        <p className="text-xs text-slate-300 font-sans mt-1.5 line-clamp-2 leading-relaxed">
                          {project.shortDesc}
                        </p>
                      </div>

                      {/* 3 ENGINEERING PILLARS */}
                      <div className="space-y-1.5 pt-2 border-t border-[#3D0B18]/60">
                        {/* 1. PLANNING BADGE */}
                        <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#240812]/50 border border-[#3D0B18]/50 text-[10.5px]">
                          <span className="font-mono font-bold text-[#D7354D] uppercase flex items-center gap-1.5">
                            <Compass className="w-3 h-3 text-[#D7354D]" />
                            {isWeb ? 'ARCHITECTURE' : 'PLANNING'}
                          </span>
                          <span className="font-medium text-slate-300 font-sans truncate max-w-[170px] text-right">
                            {isWeb ? 'System Design & Wireframe' : '3D CAD & Geometric Design'}
                          </span>
                        </div>

                        {/* 2. ANALYSIS BADGE */}
                        <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#240812]/50 border border-[#3D0B18]/50 text-[10.5px]">
                          <span className="font-mono font-bold text-rose-300 uppercase flex items-center gap-1.5">
                            <Cpu className="w-3 h-3 text-rose-300" />
                            {isWeb ? 'TESTING' : 'ANALYSIS'}
                          </span>
                          <span className="font-medium text-slate-300 font-sans truncate max-w-[170px] text-right">
                            {isWeb ? 'Security & Performance Audit' : 'FEA Simulation & Stress Test'}
                          </span>
                        </div>

                        {/* 3. FABRICATION BADGE */}
                        <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#240812]/50 border border-[#3D0B18]/50 text-[10.5px]">
                          <span className="font-mono font-bold text-amber-300 uppercase flex items-center gap-1.5">
                            <Wrench className="w-3 h-3 text-amber-300" />
                            {isWeb ? 'DEPLOYMENT' : 'FABRICATION'}
                          </span>
                          <span className="font-medium text-slate-300 font-sans truncate max-w-[170px] text-right">
                            {isWeb ? 'Cloud Production Live' : 'Machining • Welding • Assembly'}
                          </span>
                        </div>
                      </div>

                      {/* ACTION FOOTER */}
                      <div className="pt-2.5 border-t border-[#3D0B18]/60 flex items-center justify-between text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">
                        <span className="font-mono text-[11px] text-[#D7354D] group-hover:underline flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-[#D7354D]" />
                          {isWeb ? 'Lihat Detail & Link Web' : 'Eksplorasi Blueprint Teknis'}
                        </span>
                        <ArrowRight className="w-4 h-4 text-[#D7354D] group-hover:translate-x-1.5 transition-transform duration-300" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* BOTTOM METALLIC FOOTER SUMMARY */}
        <div className="flex flex-col items-center text-center pt-6 border-t border-[#3D0B18]/60">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A51D35]" />
            <span>TOTAL {projectsList.length} PROJEK TERVERIFIKASI ({projectsFooterSummary.toUpperCase()})</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#A51D35]" />
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* DETAILED PROJECT MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedProject && (() => {
          const rawPhone = data?.contact?.whatsapp || data?.profile?.phone || '6285923320768';
          const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
          const waUrl = `https://wa.me/${cleanPhone}?text=Halo%20${encodeURIComponent(fullName)},%20saya%20tertarik%20dengan%20projek%20${encodeURIComponent(selectedProject.title)}`;

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 25 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 25 }}
                transition={{ duration: 0.25 }}
                className="relative w-full max-w-2xl bg-gradient-to-b from-[#240812] via-[#15030A] to-[#080609] rounded-2xl border-2 border-[#641326] shadow-[0_0_50px_rgba(165,29,53,0.45)] overflow-hidden text-white flex flex-col max-h-[90vh]"
              >
                {/* Modal Banner Image */}
                <div className="relative h-48 sm:h-56 w-full bg-black overflow-hidden shrink-0">
                  <img
                    src={selectedProject.coverImage}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#15030A] via-black/40 to-transparent" />
                  
                  {/* Close Button */}
                  <button
                    type="button"
                    onClick={() => setSelectedProject(null)}
                    className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/80 border border-[#641326] text-white flex items-center justify-center hover:bg-[#A51D35] hover:border-[#D7354D] transition-all cursor-pointer shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Floating Category Badge */}
                  <div className="absolute bottom-3 left-4 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-md bg-[#641326]/90 border border-[#A51D35] text-[10.5px] font-mono font-bold text-white uppercase tracking-wider shadow-md">
                      {selectedProject.subCategory || selectedProject.category}
                    </span>
                    {selectedProject.liveUrl && (
                      <span className="px-2.5 py-1 rounded-md bg-amber-500/20 border border-amber-400 text-[10.5px] font-mono font-bold text-amber-300 uppercase tracking-wider shadow-md flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        Live Website Available
                      </span>
                    )}
                  </div>
                </div>

                {/* Modal Body Content */}
                <div className="p-5 sm:p-6 overflow-y-auto flex-1 custom-scrollbar">
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-2 leading-tight uppercase font-sans">
                    {selectedProject.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5 font-sans">
                    {selectedProject.shortDesc}
                  </p>

                  {/* 3 Pillars */}
                  <div className="grid grid-cols-1 gap-3 mb-5">
                    <div className="p-3.5 rounded-xl bg-[#240812]/60 border border-[#3D0B18] flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#A51D35]/20 border border-[#A51D35]/50 text-[#D7354D] flex items-center justify-center shrink-0 mt-0.5">
                        <Compass className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <h5 className="text-[11px] font-mono font-bold text-[#D7354D] uppercase tracking-wider">
                          Tahap 1: Perencanaan & Desain
                        </h5>
                        <p className="text-xs text-slate-200 font-sans mt-0.5">
                          {selectedProject.planning}
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#240812]/60 border border-[#3D0B18] flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-400/50 text-rose-300 flex items-center justify-center shrink-0 mt-0.5">
                        <Cpu className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <h5 className="text-[11px] font-mono font-bold text-rose-300 uppercase tracking-wider">
                          Tahap 2: Analisis & Pengujian Teknis
                        </h5>
                        <p className="text-xs text-slate-200 font-sans mt-0.5">
                          {selectedProject.analysis}
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#240812]/60 border border-[#3D0B18] flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/50 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                        <Wrench className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <h5 className="text-[11px] font-mono font-bold text-amber-300 uppercase tracking-wider">
                          Tahap 3: Fabrikasi / Implementasi Produksi
                        </h5>
                        <p className="text-xs text-slate-200 font-sans mt-0.5">
                          {selectedProject.fabrication}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Software & Tools Tag Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {(selectedProject.tools || []).map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-0.5 rounded-md bg-[#240812] border border-[#641326] text-white text-[10.5px] font-mono font-semibold"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons (Live Web Link & WhatsApp Consultation) */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3.5 border-t border-[#3D0B18]">
                    <span className="text-[11px] text-slate-400 font-mono">
                      ID: {selectedProject.id} • {fullName}
                    </span>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
                      {selectedProject.liveUrl && (
                        <a
                          href={selectedProject.liveUrl}
                          target={selectedProject.liveUrl.startsWith('http') ? '_blank' : '_self'}
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 border border-amber-300 shadow-md transition-all cursor-pointer"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>Kunjungi Live Website ↗</span>
                        </a>
                      )}

                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#641326] via-[#A51D35] to-[#641326] hover:from-[#A51D35] hover:to-[#D7354D] border border-[#D7354D]/50 shadow-[0_0_20px_rgba(165,29,53,0.5)] transition-all cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Konsultasi WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </section>
  );
}
