import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  FolderKanban,
  Layers,
  Activity,
  ArrowUpRight,
  UserCheck,
  Copy,
  ShieldCheck,
  Download,
  CheckCircle2,
  CreditCard,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { useTheme } from '../context/ThemeContext';

export default function AdminDashboard() {
  const { ownerData, customers, templateConfig, exportDatabaseBackup, transactions } = usePortfolio();
  const { isDark } = useTheme();

  const [copiedId, setCopiedId] = React.useState(null);

  const totalRevenue = (transactions || [])
    .filter((t) => t.status === 'lunas')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const handleCopyLink = (cust) => {
    const editorUrl = `${window.location.origin}/editor/${cust.id}`;
    navigator.clipboard.writeText(editorUrl);
    setCopiedId(cust.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const stats = [
    {
      title: 'Total Omset Penjualan',
      value: `Rp ${totalRevenue.toLocaleString('id-ID')}`,
      subText: `${(transactions || []).length} Transaksi Terdaftar`,
      icon: CreditCard,
      color: 'from-emerald-600 to-teal-900',
      borderColor: isDark ? 'border-emerald-500/40' : 'border-emerald-200',
      textColor: isDark ? 'text-emerald-300' : 'text-emerald-700',
      bgLight: 'bg-emerald-50/50',
    },
    {
      title: 'Total Pelanggan',
      value: `${customers.length} Akun`,
      subText: `${customers.filter((c) => c.status === 'active').length} Aktif • Multi-Tenant`,
      icon: Users,
      color: 'from-blue-600 to-indigo-900',
      borderColor: isDark ? 'border-blue-500/30' : 'border-blue-200',
      textColor: isDark ? 'text-blue-400' : 'text-blue-700',
      bgLight: 'bg-blue-50/50',
    },
    {
      title: 'Projek Master (Owner)',
      value: `${ownerData.projects.length} Projek`,
      subText: '10 Mesin • 2 Web Apps • 1 Template',
      icon: FolderKanban,
      color: 'from-rose-600 to-rose-950',
      borderColor: isDark ? 'border-rose-500/30' : 'border-rose-200',
      textColor: isDark ? 'text-rose-400' : 'text-rose-700',
      bgLight: 'bg-rose-50/50',
    },
    {
      title: 'Versi Master Template',
      value: templateConfig.version,
      subText: templateConfig.edition,
      icon: Layers,
      color: 'from-amber-600 to-amber-950',
      borderColor: isDark ? 'border-amber-500/30' : 'border-amber-200',
      textColor: isDark ? 'text-amber-400' : 'text-amber-700',
      bgLight: 'bg-amber-50/50',
    },
  ];

  return (
    <div className="space-y-8">
      {/* ========================================================
          1. WELCOME BANNER & OWNER STATUS
          ======================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#240812] via-[#15030A] to-[#0A0E17] border-2 border-rose-500/30 p-6 sm:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.85)]"
      >
        {/* Glow Flares */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>SISTEM KONTROL MASTER AKTIF (OWNER-001)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-sans">
              Selamat Datang, {ownerData.profile.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Anda berada di <strong>Pusat Kendali Admin Master</strong>. Dari sini Anda dapat mengelola portfolio pribadi Anda (<code>OWNER-001</code>), menambah pelanggan baru, menerbitkan link editor template, dan memastikan desain master tetap terlindungi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/admin/my-portfolio"
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-900 via-[#881337] to-rose-900 hover:from-rose-800 hover:to-rose-700 border border-rose-400/50 shadow-lg shadow-rose-950/50 transition-all hover:scale-105"
            >
              <UserCheck className="w-4 h-4 text-amber-300" />
              <span>Kelola My Portfolio</span>
            </Link>
            <Link
              to="/admin/customers"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-200 bg-white/10 hover:bg-white/20 border border-white/20 transition-all shadow-sm"
            >
              <Users className="w-4 h-4" />
              <span>Daftar Pelanggan</span>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ========================================================
          2. METRIC STATS CARDS
          ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className={`p-5 rounded-2xl border ${item.borderColor} backdrop-blur-xl shadow-lg flex flex-col justify-between transition-colors ${
                isDark ? 'bg-[#090E17]/90' : 'bg-white shadow-slate-200/50'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs font-bold font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {item.title}
                </span>
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-md`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
              </div>
              <div>
                <div className={`text-2xl font-black ${item.textColor} font-mono tracking-tight`}>
                  {item.value}
                </div>
                <div className={`text-[11px] font-medium mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {item.subText}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ========================================================
          3. QUICK ACTIONS & CUSTOMER MANAGEMENT PREVIEW
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Customers Table */}
        <div className={`lg:col-span-8 p-5 sm:p-6 rounded-2xl border shadow-xl space-y-5 transition-colors ${
          isDark ? 'bg-[#090E17]/90 border-white/15' : 'bg-white border-slate-200 shadow-slate-200/50'
        }`}>
          <div className={`flex items-center justify-between pb-4 border-b ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
            <div>
              <h3 className={`text-base font-black uppercase tracking-wider font-sans ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Pelanggan Template Terbaru
              </h3>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Setiap pelanggan memiliki link editor terisolasi yang tidak dapat merusak desain master.
              </p>
            </div>
            <Link
              to="/admin/customers"
              className="inline-flex items-center gap-1 text-xs font-bold text-rose-500 hover:text-rose-600 font-mono"
            >
              <span>Lihat Semua</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className={`border-b font-mono text-[11px] ${isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                  <th className="pb-3 font-semibold">ID / NAMA</th>
                  <th className="pb-3 font-semibold">PROFESI</th>
                  <th className="pb-3 font-semibold">STATUS</th>
                  <th className="pb-3 text-right font-semibold">AKSI CEPAT</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-slate-100'}`}>
                {customers.map((c) => (
                  <tr key={c.id} className={`transition-colors ${isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50'}`}>
                    <td className="py-3.5">
                      <div className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{c.name}</div>
                      <div className="text-[10px] font-mono text-rose-500 font-bold">{c.id}</div>
                    </td>
                    <td className={`py-3.5 font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {c.profile?.jobTitle || '-'}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                          c.status === 'active'
                            ? isDark
                              ? 'bg-emerald-500/15 border border-emerald-400/40 text-emerald-300'
                              : 'bg-emerald-50 border border-emerald-300 text-emerald-700'
                            : isDark
                            ? 'bg-slate-700/40 border border-slate-600 text-slate-400'
                            : 'bg-slate-100 border border-slate-300 text-slate-600'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            c.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'
                          }`}
                        />
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopyLink(c)}
                          className={`px-2.5 py-1.5 rounded-lg border font-mono text-[10.5px] transition-all cursor-pointer inline-flex items-center gap-1 ${
                            isDark
                              ? 'bg-white/5 hover:bg-white/15 border-white/15 text-slate-300 hover:text-white'
                              : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                          }`}
                        >
                          {copiedId === c.id ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                              <span className="text-emerald-500 font-bold">Tersalin</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-rose-500" />
                              <span>Copy Link</span>
                            </>
                          )}
                        </button>
                        <Link
                          to={`/editor/${c.id}`}
                          className={`px-2.5 py-1.5 rounded-lg border font-mono text-[10.5px] transition-all font-bold ${
                            isDark
                              ? 'bg-rose-950/60 hover:bg-rose-900 border border-rose-500/30 text-rose-200 hover:text-white'
                              : 'bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-700'
                          }`}
                        >
                          Editor
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Master Security & Protection Badge */}
        <div className="lg:col-span-4 space-y-6">
          {/* Master Locked Design Summary */}
          <div className={`p-5 sm:p-6 rounded-2xl border shadow-xl space-y-4 ${
            isDark
              ? 'bg-gradient-to-b from-[#18040E] to-[#0A0407] border-rose-500/40 text-slate-300'
              : 'bg-gradient-to-b from-rose-900 to-slate-950 border-rose-800 text-white shadow-rose-950/30'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-950 border border-rose-400/50 flex items-center justify-center text-rose-300 shadow-md">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-wider font-sans">
                  Sistem Proteksi Desain
                </h4>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">
                  MASTER TEMPLATE TERKUNCI
                </span>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-200">
              Semua customer hanya memiliki hak mengubah <strong>data/konten</strong> (Profile, Skills, Projects, Certificates, CV, Sosmed).
            </p>

            <div className="space-y-1.5 pt-2 border-t border-white/10 text-xs font-mono text-slate-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Background Metal & Canvas Aman</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Animasi 3D & Ribbon Terkunci</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tata Letak Grid Responsif Utuh</span>
              </div>
            </div>

            <Link
              to="/admin/template"
              className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all shadow-sm"
            >
              <span>Detail Komponen Template</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Quick Pricing Manager Card */}
          <div className={`p-5 rounded-2xl border space-y-3 ${
            isDark ? 'bg-[#090E17]/90 border-white/15' : 'bg-white border-slate-200 shadow-slate-200/50'
          }`}>
            <div className="flex items-center justify-between">
              <h4 className={`text-xs font-bold uppercase tracking-wider font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Paket Harga & Lisensi
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-500/30">
                /pricing
              </span>
            </div>
            <p className={`text-[11.5px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Atur harga paket lisensi, promo diskon, dan daftar FAQ halaman penjualan template.
            </p>
            <Link
              to="/admin/pricing"
              className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-rose-700 hover:from-amber-500 hover:to-rose-600 text-xs font-bold text-white transition-all shadow-md"
            >
              <span>Edit Paket & Harga Lisensi</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Quick Backup Utility */}
          <div className={`p-5 rounded-2xl border space-y-3 ${
            isDark ? 'bg-[#090E17]/90 border-white/15' : 'bg-white border-slate-200 shadow-slate-200/50'
          }`}>
            <h4 className={`text-xs font-bold uppercase tracking-wider font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Cadangkan Seluruh Database
            </h4>
            <p className={`text-[11.5px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Ekspor seluruh data portfolio master & pelanggan ke dalam satu berkas JSON aman.
            </p>
            <button
              type="button"
              onClick={exportDatabaseBackup}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-900 hover:from-emerald-600 hover:to-emerald-800 border border-emerald-400/40 text-xs font-bold text-white transition-all shadow-md cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-300" />
              <span>Unduh Backup Database (.json)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
