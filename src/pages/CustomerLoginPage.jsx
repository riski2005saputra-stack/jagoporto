import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  UserCheck,
  Sparkles,
  Layers,
  ChevronRight,
  ShieldCheck,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { useAuth } from '../context/AuthContext';

export default function CustomerLoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefillId = searchParams.get('id') || '';

  const { customers, templates } = usePortfolio();
  const { loginCustomer } = useAuth();

  const [customIdInput, setCustomIdInput] = useState(prefillId);
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [pendingCustomer, setPendingCustomer] = useState(null);

  // Active customer object if found
  const activeCustomer = customers.find(
    (c) => c.id.toLowerCase() === (customIdInput || '').toLowerCase()
  );
  const assignedTemplate = templates.find((t) => t.id === activeCustomer?.templateId) || templates[0];

  const handleIdInputChange = (e) => {
    const val = e.target.value.toUpperCase();
    setCustomIdInput(val);
    setErrorMsg('');
    setPendingCustomer(null);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setPendingCustomer(null);

    const targetId = (customIdInput || '').trim();
    if (!targetId) {
      setErrorMsg('Silakan masukkan ID Pelanggan Anda.');
      return;
    }

    const targetCustomer = customers.find(
      (c) => c.id.toLowerCase() === targetId.toLowerCase()
    );

    if (!targetCustomer) {
      setErrorMsg(`Akun pelanggan dengan ID "${targetId}" tidak ditemukan.`);
      return;
    }

    if (!pin.trim()) {
      setErrorMsg('Silakan masukkan PIN Akses Customer Anda.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = loginCustomer(targetCustomer.id, pin, targetCustomer);
      if (res.success) {
        setSuccessMsg('Autentikasi Berhasil! Membuka panel editor...');
        setTimeout(() => {
          navigate(`/editor/${targetCustomer.id}`);
        }, 600);
      } else {
        if (res.isPending) {
          setPendingCustomer(targetCustomer);
        }
        setErrorMsg(res.message || 'PIN Akses tidak valid.');
        setIsLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen w-full bg-[#05080E] text-slate-100 flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden font-sans selection:bg-blue-900 selection:text-white">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/6 left-1/4 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/6 right-1/4 w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-rose-900/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Header Branding */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-2 relative z-10">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-900 via-indigo-900 to-[#0c182b] border-2 border-blue-400/50 flex items-center justify-center text-blue-200 font-mono font-black shadow-lg shadow-blue-950/60 group-hover:scale-105 transition-transform">
            RS
          </div>
          <div>
            <div className="text-sm font-black text-white uppercase tracking-wider font-sans flex items-center gap-1.5">
              <span>PORTAL EDITOR PELANGGAN</span>
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-[10px] font-mono text-slate-400">
              Sistem Web Portofolio Mandiri
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/pricing"
            className="text-xs font-semibold text-slate-400 hover:text-white transition-colors hidden sm:inline"
          >
            Beli Template
          </Link>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="max-w-xl w-full mx-auto my-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="p-7 sm:p-10 rounded-3xl bg-gradient-to-b from-[#0e1a2c] via-[#09121f] to-[#050b14] border-2 border-blue-500/40 shadow-[0_25px_80px_rgba(0,0,0,0.95)] backdrop-blur-2xl space-y-7"
        >
          {/* Top Title & Icon */}
          <div className="text-center space-y-2.5">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-900 border-2 border-blue-300/60 flex items-center justify-center text-white shadow-xl shadow-blue-950/80 mb-2">
              <Lock className="w-8 h-8" />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/90 border border-blue-400/40 text-blue-300 text-xs font-mono font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>MASUK KE PANEL EDITOR PELANGGAN</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white font-sans tracking-tight">
              Login Editor Portofolio
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              Masukkan <strong>ID Pelanggan</strong> dan <strong>PIN Keamanan</strong> Anda untuk mulai mengelola isi portofolio per halaman.
            </p>
          </div>

          {/* Error & Pending Approval Banner */}
          <AnimatePresence>
            {pendingCustomer && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 rounded-2xl bg-amber-950/90 border-2 border-amber-500/60 text-amber-200 text-xs font-sans space-y-3 shadow-xl"
              >
                <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                  <span>⏳ AKUN MENUNGGU PERSETUJUAN ADMIN MASTER</span>
                </div>
                <p className="text-slate-200 leading-relaxed">
                  Akun Anda (<strong>{pendingCustomer.id}</strong> - {pendingCustomer.name}) telah terdaftar, namun <strong>belum disetujui</strong> oleh Admin Master. Setelah verifikasi pembayaran disetujui di panel master, Anda akan dapat login menggunakan PIN Anda.
                </p>
                <a
                  href={`https://wa.me/6285923320768?text=${encodeURIComponent(
                    `Halo Admin Master Riski Saputra,\n\nSaya ingin menanyakan persetujuan pembayaran akun portofolio saya:\n` +
                    `• ID Customer: ${pendingCustomer.id}\n` +
                    `• Nama: ${pendingCustomer.name}\n\n` +
                    `Mohon verifikasi & setujui akun saya di http://localhost:3000/admin/payments agar saya dapat login. Terima kasih!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 text-white font-bold text-xs shadow-lg transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Konfirmasi Cepat ke WhatsApp Admin Master ↗</span>
                </a>
              </motion.div>
            )}

            {!pendingCustomer && errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs font-mono flex items-center gap-2.5 shadow-lg"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-mono flex items-center gap-2.5 shadow-lg"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Customer ID Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono text-slate-300 font-bold">
                  1. ID Customer Anda
                </label>
                <span className="text-[10.5px] font-mono text-slate-400">
                  Contoh: CUST-003
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={customIdInput}
                  onChange={handleIdInputChange}
                  placeholder="CUST-001 / CUST-002 / CUST-003"
                  className="w-full px-4 py-3 rounded-xl bg-[#04080f] border-2 border-slate-700 focus:border-blue-400 text-white font-mono font-bold text-sm outline-none transition-all uppercase tracking-wider"
                />
              </div>
            </div>

            {/* PIN Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono text-slate-300 font-bold">
                  2. PIN Akses Rahasia
                </label>
              </div>

              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  required
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Ketik PIN Keamanan Anda"
                  className="w-full pl-4 pr-12 py-3 rounded-xl bg-[#04080f] border-2 border-slate-700 focus:border-blue-400 text-white font-mono font-bold text-sm outline-none transition-all tracking-widest"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Active Customer License Preview Banner */}
            {activeCustomer && (
              <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300 font-mono font-black text-xs">
                    {activeCustomer.id.replace('CUST-', 'C')}
                  </div>
                  <div>
                    <div className="font-bold text-white font-sans">
                      {activeCustomer.name}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      {activeCustomer.profile?.jobTitle || 'Customer Portfolio'}
                    </div>
                  </div>
                </div>

                <div className="text-right space-y-0.5">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    activeCustomer.status === 'active'
                      ? 'text-emerald-300 bg-emerald-950 border-emerald-500/40'
                      : 'text-amber-300 bg-amber-950 border-amber-500/40'
                  }`}>
                    {activeCustomer.status === 'active' ? '✓ Disetujui (Aktif)' : '⏳ Menunggu Persetujuan'}
                  </span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 hover:from-blue-500 hover:to-purple-600 border border-blue-400/60 text-white text-xs font-black uppercase tracking-wider transition-all shadow-xl shadow-blue-950/70 cursor-pointer disabled:opacity-50 hover:scale-[1.01]"
            >
              <span>{isLoading ? 'Memverifikasi Akses...' : 'Masuk ke Editor Portofolio'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="text-center text-[11px] font-mono text-slate-500 py-3 relative z-10">
        © {new Date().getFullYear()} Riski Saputra • Platform Portofolio & Multi-Tenant Template Editor
      </footer>
    </div>
  );
}
