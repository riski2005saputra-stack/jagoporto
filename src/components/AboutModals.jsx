import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Award,
  Briefcase,
  Cpu,
  CheckCircle2,
  Download,
  ArrowRight,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export default function AboutModals({
  activeModal,
  onClose,
  onNavigateProjects,
  onNavigateContact,
  customData,
}) {
  const { ownerData } = usePortfolio();
  const data = customData || ownerData;
  const cvUrl = data?.cv?.fileUrl || '/CV%20Riski%20Saputra.pdf';
  const cvFileName = data?.cv?.fileName || 'CV Riski Saputra.pdf';
  const fullName = data?.profile?.fullName || 'Riski Saputra';

  if (!activeModal) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop overlay with heavy blur and click-to-close */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-xl transition-opacity"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-[#090E17]/95 border-2 border-white/30 shadow-[0_25px_60px_rgba(0,0,0,0.9)] p-5 sm:p-7 text-white z-10 custom-scrollbar"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup Dialog"
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-rose-900 border border-white/20 text-slate-300 hover:text-white transition-all cursor-pointer shadow-md"
          >
            <X className="w-5 h-5" />
          </button>

          {/* =========================================================
              MODAL 1: CERTIFICATES & PROFESSIONAL CREDENTIALS
              ========================================================= */}
          {activeModal === 'certificate' && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-900 to-[#5c0b25] border border-white/30 flex items-center justify-center text-white shadow-lg">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-300">
                    {data?.profile?.certModalBadge || 'Kredensial Resmi'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    {data?.profile?.certModalTitle || 'Sertifikat'}
                  </h3>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 mb-5 leading-relaxed">
                {data?.profile?.certModalDesc ||
                  `Dokumentasi resmi sertifikat keahlian, uji kompetensi industri, dan kredensial profesional yang tercantum dalam portofolio ${fullName}.`}
              </p>

              {/* Certificate List from CV / Database */}
              <div className="space-y-3 mb-6 max-h-[55vh] overflow-y-auto pr-1 custom-scrollbar">
                {(data?.certificates && data.certificates.length > 0
                  ? data.certificates
                  : [
                      {
                        title: 'Sertifikasi TOEFL (Test of English as a Foreign Language)',
                        issuer: 'Official English Assessment & Proficiency',
                        year: '2026',
                        id: 'Kredensial: Bahasa Inggris Teknis & Global',
                        desc: 'Standar kecakapan bahasa Inggris untuk komunikasi teknik internasional, dokumentasi teknis, dan kerjasama industri global.',
                      },
                      {
                        title: 'Sertifikat PKL PT Kilang Pertamina Internasional RU II Dumai',
                        issuer: 'PT Kilang Pertamina Internasional RU II Dumai',
                        year: '2025',
                        id: 'Bidang: Operator Engineer MA 1',
                        desc: 'Praktek Kerja Lapangan intensif (>4 Bulan): Melaksanakan maintenance peralatan industri bidang stationary & rotating serta perancangan desain 2D/3D.',
                      },
                      {
                        title: 'Sertifikat LK 1 Himpunan Mahasiswa Mesin',
                        issuer: 'Himpunan Mahasiswa Teknik Mesin Universitas Riau (UNRI)',
                        year: '2024',
                        id: 'Periode: 2024 — 2025',
                        desc: 'Latihan Kepemimpinan & Manajemen Organisasi Teknik Mesin: Pengembangan soft skill, kepemimpinan tim proyek, dan tata kelola teknis.',
                      },
                      {
                        title: 'Sertifikasi Uji Kompetensi Keahlian',
                        issuer: 'Badan Nasional Sertifikasi Profesi',
                        year: '2023',
                        id: 'Uji Kompetensi Nasional',
                        desc: 'Uji kompetensi keahlian dan standardisasi profesional di bidang teknis.',
                      },
                    ]
                ).map((cert, idx) => (
                  <div
                    key={cert.id || idx}
                    className="p-3.5 sm:p-4 rounded-xl bg-white/[0.05] border border-white/15 hover:border-rose-400/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                        <h4 className="text-sm sm:text-base font-bold text-white leading-tight">
                          {cert.title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-300 mb-1.5">{cert.desc || cert.description}</p>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-400">
                        <span className="text-rose-300 font-semibold">{cert.issuer}</span>
                        <span>•</span>
                        <span className="text-amber-300 font-bold">{cert.year}</span>
                        {cert.id && (
                          <>
                            <span>•</span>
                            <span className="text-slate-400">{cert.id}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-mono font-bold self-start sm:self-center shrink-0">
                      <CheckCircle2 className="w-3 h-3" />
                      Terverifikasi
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-white/15">
                <a
                  href={cvUrl}
                  download={cvFileName}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-950/70 hover:bg-rose-900 border border-white/30 transition-all shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CV & Portofolio Lengkap (PDF)</span>
                </a>
              </div>
            </div>
          )}

          {/* =========================================================
              MODAL 2: COMPLETED WORKS & INDUSTRIAL TRACK RECORD
              ========================================================= */}
          {activeModal === 'works' && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-900 to-[#5c0b25] border border-white/30 flex items-center justify-center text-white shadow-lg">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-300">
                    {data?.profile?.worksModalBadge || 'Studi Kasus & Industri'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    {data?.profile?.worksModalTitle || 'Rekam Jejak Pekerjaan'}
                  </h3>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 mb-5 leading-relaxed">
                {data?.profile?.worksModalDesc ||
                  `Berbagai proyek yang telah diselesaikan oleh ${fullName} mencakup siklus komprehensif: Perencanaan, Analisis Kebutuhan Kerja, hingga Eksekusi & Finishing.`}
              </p>

              {/* Works List from Projects Data */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 max-h-[55vh] overflow-y-auto pr-1 custom-scrollbar">
                {(data?.projects && data.projects.length > 0
                  ? data.projects
                  : [
                      {
                        title: 'Mesin Conveyor',
                        category: 'Sistem Pemindahan Material',
                        shortDesc: 'Perancangan dan pembuatan sistem conveyor untuk membantu proses pemindahan material secara efektif.',
                        planning: '3D CAD Modeling',
                        analysis: 'Analisis komponen dan beban kerja',
                        fabrication: 'Pemesinan, pengelasan, perakitan.',
                      },
                      {
                        title: 'Drop Weight Impact Test',
                        category: 'Alat Uji Beban Tumbukan',
                        shortDesc: 'Perancangan alat uji jatuh beban untuk pengujian ketahanan terhadap beban kejut.',
                        planning: 'Desain 3D Assembly',
                        analysis: 'Analisis energi tumbukan',
                        fabrication: 'Pemesinan, pengeboran, pengelasan.',
                      },
                      {
                        title: 'Alat Pres Hidrolik',
                        category: 'Sistem Gaya Tekan',
                        shortDesc: 'Perancangan alat pres hidrolik untuk menghasilkan gaya tekan terukur.',
                        planning: 'Desain Rangka Presisi',
                        analysis: 'Analisis kekuatan konstruksi',
                        fabrication: 'Pengelasan, instalasi hidrolik.',
                      },
                      {
                        title: 'Mixer Adonan Industri',
                        category: 'Mesin Pengaduk Pangan',
                        shortDesc: 'Perancangan mixer adonan untuk pencampuran merata dan higienis.',
                        planning: 'Desain Komponen Food-grade',
                        analysis: 'Analisis sistem transmisi',
                        fabrication: 'Stainless steel welding & assembly.',
                      },
                    ]
                ).map((work, idx) => (
                  <div
                    key={work.id || idx}
                    className="p-3.5 rounded-xl bg-white/[0.05] border border-white/15 hover:border-white/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-mono font-bold text-rose-300 uppercase tracking-wider">
                          {work.category || work.subCategory || 'Kategori Projek'}
                        </span>
                        <span className="text-[10px] font-mono font-extrabold text-amber-300 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/30">
                          #{String(idx + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-white mb-1.5 leading-snug">
                        {work.title}
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed mb-3">
                        {work.shortDesc || work.desc}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-white/10 flex flex-col gap-1 text-[10px] font-sans">
                      <div className="flex items-start gap-1.5">
                        <span className="font-bold text-amber-300 shrink-0">Perencanaan:</span>
                        <span className="text-slate-200">{work.planning || work.tools?.join(', ') || '3D Modeling & Desain'}</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <span className="font-bold text-rose-300 shrink-0">Analisis:</span>
                        <span className="text-slate-300">{work.analysis || 'Analisis Teknis & Fungsi'}</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <span className="font-bold text-slate-400 shrink-0">Fabrikasi:</span>
                        <span className="text-slate-300">{work.fabrication || work.fab || 'Eksekusi, Perakitan & Finishing'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/15">
                <span className="text-xs text-slate-400 font-medium">
                  Lihat interaktif & render resolusi tinggi di Halaman Projek
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onNavigateProjects) onNavigateProjects();
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-900 to-[#5c0b25] hover:from-rose-800 hover:to-rose-900 border border-white/40 shadow-lg shadow-rose-950/50 cursor-pointer"
                >
                  <span>Buka Halaman Projek</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* =========================================================
              MODAL 3: TECHNICAL SKILLS & SOFTWARE STACK
              ========================================================= */}
          {activeModal === 'skills' && (() => {
            // Group skills dynamically by category
            const skillsList = (data?.skills && data.skills.length > 0)
              ? data.skills
              : [
                  { name: 'AutoCAD 2D & 3D', level: 'Expert', percent: 95, category: 'Design & Engineering Software' },
                  { name: 'Autodesk Inventor (3D CAD & Modeling)', level: 'Expert', percent: 92, category: 'Design & Engineering Software' },
                  { name: 'Microsoft Office (Word, Excel, PowerPoint)', level: 'Advanced', percent: 90, category: 'Design & Engineering Software' },
                  { name: 'Pemeliharaan Peralatan Rotating & Stationary', level: 'Expert', percent: 94, category: 'Keahlian Mekanikal & Maintenance Industri' },
                  { name: 'Sistem Hidrolik & Pneumatik Industri', level: 'Expert', percent: 92, category: 'Keahlian Mekanikal & Maintenance Industri' },
                  { name: 'Pemeliharaan Jenis-jenis Pompa & Sistem Pendingin AC', level: 'Advanced', percent: 88, category: 'Keahlian Mekanikal & Maintenance Industri' },
                  { name: 'Pengoperasian Mesin Produksi (Manual & CNC)', level: 'Expert', percent: 93, category: 'Pemesinan, Fabrikasi & Manufaktur' },
                  { name: 'Teknik Pengelasan & Fabrikasi Konstruksi Logam', level: 'Advanced', percent: 90, category: 'Pemesinan, Fabrikasi & Manufaktur' },
                  { name: 'Perancangan Komponen Mesin & Analisis Kebutuhan Kerja', level: 'Expert', percent: 92, category: 'Pemesinan, Fabrikasi & Manufaktur' },
                ];

            // Helper to get percentage number
            const getPercent = (sk) => {
              if (typeof sk.percent === 'number') return sk.percent;
              if (typeof sk.percent === 'string' && !isNaN(parseInt(sk.percent))) return parseInt(sk.percent);
              if (typeof sk.level === 'number') return sk.level;
              if (sk.level === 'Expert' || sk.level === 'Master') return 95;
              if (sk.level === 'Advanced') return 90;
              if (sk.level === 'Intermediate') return 80;
              if (sk.level === 'Beginner') return 65;
              return 90;
            };

            // Grouping logic
            const grouped = {};
            skillsList.forEach((sk) => {
              const cat = sk.category || 'Keahlian Utama';
              if (!grouped[cat]) grouped[cat] = [];
              grouped[cat].push(sk);
            });

            return (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-900 to-[#5c0b25] border border-white/30 flex items-center justify-center text-white shadow-lg">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-300">
                      {data?.profile?.skillsModalBadge || 'Kompetensi Rekayasa'}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                      {data?.profile?.skillsModalTitle || 'Skill & Technical Skill'}
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 mb-5 leading-relaxed">
                  {data?.profile?.skillsModalDesc ||
                    `Kompetensi teknis dan keahlian yang dikuasai ${fullName}, mencakup software profesional, metodologi kerja, dan keahlian praktis.`}
                </p>

                {/* Dynamic Skills Progress Matrix */}
                <div className="space-y-4 mb-6 max-h-[55vh] overflow-y-auto pr-1 custom-scrollbar">
                  {Object.entries(grouped).map(([categoryName, items], gIdx) => (
                    <div key={gIdx} className="p-3.5 rounded-xl bg-white/[0.04] border border-white/15">
                      <h4 className="text-xs font-mono font-bold text-rose-300 uppercase tracking-wider mb-2.5">
                        {categoryName}
                      </h4>
                      <div className="space-y-2.5">
                        {items.map((skill, sIdx) => {
                          const pct = getPercent(skill);
                          return (
                            <div key={skill.id || sIdx}>
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="font-semibold text-white">{skill.name}</span>
                                <span className="font-mono font-bold text-rose-200">{pct}%</span>
                              </div>
                              <div className="w-full h-2 rounded-full bg-slate-900 border border-white/15 overflow-hidden p-0.5">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${pct}%` }}
                                  transition={{ duration: 0.8, delay: sIdx * 0.08 }}
                                  className="h-full rounded-full bg-gradient-to-r from-rose-900 via-rose-500 to-white shadow-[0_0_8px_rgba(255,255,255,0.7)]"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-white/15">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/30 transition-all cursor-pointer"
                  >
                    Tutup
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (onNavigateContact) onNavigateContact();
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-900 to-[#5c0b25] hover:from-rose-800 hover:to-rose-900 border border-white/40 shadow-lg cursor-pointer"
                  >
                    <span>Hubungi {fullName}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })()}

          {/* =========================================================
              MODAL 4: CAREER JOURNEY & YEARS OF EXPERIENCE
              ========================================================= */}
          {activeModal === 'experience' && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-900 to-[#5c0b25] border border-white/30 flex items-center justify-center text-white shadow-lg">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-300">
                    {data?.profile?.expModalBadge || 'Pengalaman Kerja & Pendidikan'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    {data?.profile?.expModalTitle || 'Rekam Jejak Karir & Pendidikan'}
                  </h3>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 mb-5 leading-relaxed">
                {data?.profile?.expModalDesc ||
                  `Perjalanan akademik dan praktek profesional ${fullName} dalam bidang keahlian dan perancangan.`}
              </p>

              {/* Timeline from CV / Default */}
              <div className="space-y-4 mb-6 relative pl-6 border-l-2 border-rose-900/60 max-h-[55vh] overflow-y-auto pr-1 custom-scrollbar">
                {(data?.experience && data.experience.length > 0
                  ? data.experience
                  : [
                      {
                        period: '2025 (>4 Bulan)',
                        role: 'Praktek Kerja Lapangan — Operator Engineer MA 1',
                        company: 'PT KILANG PERTAMINA INTERNASIONAL RU II DUMAI',
                        desc: 'Melaksanakan maintenance pada peralatan industri di bidang stationary dan rotating equipment, serta merancang desain teknis 2D dan 3D.',
                      },
                      {
                        period: '2023 — 2026',
                        role: 'D3 Teknik Mesin — Ahli Madya Teknik (A.Md.T)',
                        company: 'UNIVERSITAS RIAU (UNRI)',
                        desc: 'Menyelesaikan pendidikan dengan fokus pada mechanical maintenance, fabrikasi mesin, dan desain teknik. Aktif dalam organisasi Himpunan Mahasiswa Teknik Mesin (HMM).',
                      },
                      {
                        period: '2022 (>4 Bulan)',
                        role: 'Praktek Kerja Lapangan — Operator & Drafter',
                        company: 'PT ALPHA PRECISION ENGINEERING (Batam, Kepulauan Riau)',
                        desc: 'Mengoperasikan mesin produksi manual dan CNC, serta merancang desain 2D dan 3D untuk komponen presisi manufaktur.',
                      },
                      {
                        period: '2019 — 2023',
                        role: 'Pendidikan Menengah Kejuruan — Teknik Pemesinan',
                        company: 'SMKN 2 TEMBILAHAN',
                        desc: 'Mendalami dasar permesinan bubut, frais, pengelasan, kelistrikan dasar mesin, dan gambar teknik manufaktur.',
                      },
                    ]
                ).map((item, idx) => (
                  <div key={item.id || idx} className="relative">
                    {/* Glowing Bullet */}
                    <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-rose-900 border-2 border-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                    <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/15">
                      <span className="text-[10px] font-mono font-bold text-rose-300 uppercase tracking-wider block mb-1">
                        {item.period || item.year}
                      </span>
                      <h4 className="text-sm font-bold text-white mb-0.5">{item.role || item.title}</h4>
                      <p className="text-xs font-mono text-amber-300 font-bold mb-2">{item.company || item.institution}</p>
                      <p className="text-xs text-slate-300 leading-relaxed">{item.desc || item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-white/15">
                <a
                  href={cvUrl}
                  download={cvFileName}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-950/70 hover:bg-rose-900 border border-white/30 transition-all shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Curriculum Vitae (PDF)</span>
                </a>
              </div>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
