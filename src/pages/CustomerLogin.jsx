import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Lock,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  UserCheck,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { useAuth } from '../context/AuthContext';

export default function CustomerLogin({ onSuccess }) {
  const { customerId } = useParams();
  const { customers, templates } = usePortfolio();
  const { loginCustomer } = useAuth();

  const customer = customers.find((c) => c.id === customerId);
  const assignedTemplate = templates.find((t) => t.id === customer?.templateId) || templates[0];

  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!customer) {
    return (
      <div className="min-h-screen w-full bg-[#05080D] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#090E17] border border-rose-500/40 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 mx-auto rounded-xl bg-rose-950/80 border border-rose-500/40 flex items-center justify-center text-rose-300">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white font-sans">
            Akun Pelanggan Tidak Ditemukan
          </h2>
          <p className="text-xs text-slate-400">
            ID Customer <code>{customerId}</code> belum terdaftar di sistem kami atau telah dihapus oleh Admin Master.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all"
          >
            <span>Kembali ke Halaman Utama</span>
          </Link>
        </div>
      </div>
    );
  }

  const [isPendingApproval, setIsPendingApproval] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsPendingApproval(false);
    setIsLoading(true);

    setTimeout(() => {
      const res = loginCustomer(customerId, pin, customer);
      if (res.success) {
        if (onSuccess) onSuccess();
      } else {
        if (res.isPending) {
          setIsPendingApproval(true);
        }
        setErrorMsg(res.message);
        setIsLoading(false);
      }
    }, 350);
  };

  return (
    <div className="min-h-screen w-full bg-[#05080D] text-white flex items-center justify-center p-4 relative overflow-hidden selection:bg-rose-900 selection:text-white">
      {/* Glows */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md p-7 sm:p-9 rounded-3xl bg-[#090E17]/95 border-2 border-blue-500/40 shadow-[0_25px_70px_rgba(0,0,0,0.9)] backdrop-blur-2xl space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-blue-900 via-indigo-900 to-[#100b25] border border-blue-400/50 flex items-center justify-center text-blue-300 shadow-xl shadow-blue-950/60 mb-3">
            <Lock className="w-7 h-7" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-950/80 border border-blue-500/40 text-blue-300 text-xs font-mono font-bold">
            <UserCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>CUSTOMER ACCESS • {customer.id}</span>
          </div>

          <h1 className="text-2xl font-black text-white font-sans">
            {customer.name}
          </h1>
          <p className="text-xs text-purple-300 font-mono">
            Lisensi: {assignedTemplate?.name} ({assignedTemplate?.version})
          </p>
        </div>

        {isPendingApproval ? (
          <div className="p-4 rounded-2xl bg-amber-950/90 border-2 border-amber-500/60 text-amber-200 text-xs font-sans space-y-3 shadow-xl">
            <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span>⏳ MENUNGGU PERSETUJUAN ADMIN</span>
            </div>
            <p className="text-slate-200 leading-relaxed">
              Akun Anda (<strong>{customer.id}</strong>) telah terdaftar tetapi <strong>belum disetujui</strong> oleh Admin Master. Silakan hubungi Admin Master agar diverifikasi.
            </p>
            <a
              href={`https://wa.me/6285923320768?text=${encodeURIComponent(
                `Halo Admin Master Riski Saputra,\n\nSaya ingin menanyakan aktivasi akun portofolio saya (ID: ${customer.id} - ${customer.name}). Mohon verifikasi pembayaran saya di http://localhost:3000/admin/payments agar saya dapat login. Terima kasih!`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 text-white font-bold text-xs shadow-lg transition-all"
            >
              <span>Hubungi Admin Master via WhatsApp ↗</span>
            </a>
          </div>
        ) : errorMsg ? (
          <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-200 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">
              Masukkan PIN Akses Editor Anda
            </label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Ketik PIN Keamanan Anda"
                className="w-full pl-4 pr-11 py-3 rounded-xl bg-[#060B12] border border-slate-700 text-white font-mono text-sm outline-none focus:border-blue-400 transition-colors shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-rose-700 hover:from-blue-500 hover:to-rose-600 border border-blue-400/50 text-white text-xs font-black uppercase tracking-wider transition-all shadow-xl shadow-blue-950/60 cursor-pointer disabled:opacity-50"
          >
            <span>{isLoading ? 'Memverifikasi...' : 'Buka Editor Portofolio'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
