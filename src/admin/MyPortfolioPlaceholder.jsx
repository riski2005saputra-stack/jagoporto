import React from 'react';
import { Link } from 'react-router-dom';
import { UserCheck, ArrowRight, Sparkles, FolderKanban, Award, FileText, Share2, Layers } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export default function MyPortfolioPlaceholder() {
  const { ownerData } = usePortfolio();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold mb-2">
            <UserCheck className="w-3.5 h-3.5" />
            <span>MY PORTFOLIO • OWNER-001</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-sans">
            Portofolio Utama Riski Saputra
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Data pada modul ini langsung terhubung dengan halaman website utama (<code>/</code>).
          </p>
        </div>

        <Link
          to="/"
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-900 to-[#5c0b25] hover:from-rose-800 hover:to-rose-700 border border-rose-400/50 text-xs font-bold text-white transition-all shadow-md shrink-0"
        >
          <span>Buka Website Master ↗</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-[#090E17]/90 border border-white/15 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase font-mono">1. Profile & Bio</span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Aktif</span>
          </div>
          <div className="text-sm font-bold text-slate-200">{ownerData.profile.fullName}</div>
          <p className="text-xs text-slate-400 line-clamp-2">{ownerData.profile.bio}</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#090E17]/90 border border-white/15 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase font-mono">2. Total Projek</span>
            <span className="text-[10px] font-mono text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded">{ownerData.projects.length} Projek</span>
          </div>
          <div className="text-sm font-bold text-slate-200">10 Mesin • 2 Web Apps • 1 CV Template</div>
          <p className="text-xs text-slate-400">Termasuk Bimbel Bina Juara, Service On Call, dan Mesin Conveyor.</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#090E17]/90 border border-white/15 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase font-mono">3. Technical Skills</span>
            <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded">{ownerData.skills.length} Keahlian</span>
          </div>
          <div className="text-sm font-bold text-slate-200">CAD • FEA • CNC • Web Apps</div>
          <p className="text-xs text-slate-400">Autodesk Inventor, SolidWorks, FEA Simulation, Kinematic Assembly.</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#090E17]/90 border border-white/15 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase font-mono">4. Sertifikat Resmi</span>
            <span className="text-[10px] font-mono text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded">{ownerData.certificates.length} Sertifikat</span>
          </div>
          <div className="text-sm font-bold text-slate-200">Dassault Systèmes, Autodesk, Pertamina</div>
          <p className="text-xs text-slate-400">Kredensial teknik dan keselamatan industri terverifikasi.</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#090E17]/90 border border-white/15 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase font-mono">5. Curriculum Vitae</span>
            <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded">PDF Ready</span>
          </div>
          <div className="text-sm font-bold text-slate-200">{ownerData.cv.fileName}</div>
          <p className="text-xs text-slate-400">Tersedia untuk diunduh langsung pengunjung pada 3D ID Card.</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#090E17]/90 border border-white/15 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase font-mono">6. Social Media & Kontak</span>
            <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded">WhatsApp Active</span>
          </div>
          <div className="text-sm font-bold text-slate-200">LinkedIn, Instagram, WhatsApp, Email</div>
          <p className="text-xs text-slate-400">{ownerData.socialMedia.whatsapp} • {ownerData.profile.email}</p>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#18040E] to-[#2E0715] border border-rose-500/40 text-center space-y-2">
        <div className="text-xs font-mono text-rose-300 font-bold uppercase tracking-wider">
          💡 FITUR EDIT LENGKAP AKAN DIHUBUNGKAN PADA TAHAP "TASK 3: BUAT MY PORTFOLIO"
        </div>
        <p className="text-xs text-slate-300 max-w-xl mx-auto">
          Formulir editor langsung untuk menambahkan project baru, mengubah teks bio, dan upload foto profil akan diaktifkan secara komprehensif pada TASK 3.
        </p>
      </div>
    </div>
  );
}
