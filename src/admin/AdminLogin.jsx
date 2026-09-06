import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { loginMaster, isMasterLoggedIn } = useAuth();

  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, offer quick enter
  const handleDirectEnter = () => {
    navigate('/admin/dashboard');
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const res = loginMaster(pin);
      if (res.success) {
        navigate('/admin/dashboard');
      } else {
        setErrorMsg(res.message);
        setIsLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen w-full bg-[#05080D] text-white flex items-center justify-center p-4 relative overflow-hidden selection:bg-rose-900 selection:text-white">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-rose-900/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md p-7 sm:p-9 rounded-3xl bg-[#090E17]/95 border-2 border-rose-500/40 shadow-[0_25px_70px_rgba(0,0,0,0.9)] backdrop-blur-2xl space-y-6"
      >
        {/* Top Branding */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-rose-900 via-[#5c0b25] to-[#2b0410] border border-rose-400/50 flex items-center justify-center text-amber-300 shadow-xl shadow-rose-950/60 mb-3">
            <Lock className="w-7 h-7" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
            <span>OWNER-001 • MASTER ACCESS</span>
          </div>

          <h1 className="text-2xl font-black text-white uppercase tracking-tight font-sans">
            Admin Master Portal
          </h1>
          <p className="text-xs text-slate-300">
            Masukkan PIN Keamanan untuk membuka sistem kendali portofolio dan manajemen pelanggan.
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-200 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">
              Master Admin Security PIN
            </label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Masukkan PIN Admin"
                className="w-full pl-4 pr-11 py-3 rounded-xl bg-[#060B12] border border-slate-700 text-white font-mono text-sm outline-none focus:border-rose-400 transition-colors shadow-inner"
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
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-900 via-rose-800 to-[#5c0b25] hover:from-rose-800 hover:to-rose-900 border border-rose-400/50 text-white text-xs font-black uppercase tracking-wider transition-all shadow-xl shadow-rose-950/60 cursor-pointer disabled:opacity-50"
          >
            <span>{isLoading ? 'Memverifikasi...' : 'Buka Panel Admin'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Bottom Navigation */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Website Utama</span>
          </Link>

          {isMasterLoggedIn && (
            <button
              type="button"
              onClick={handleDirectEnter}
              className="text-emerald-400 hover:underline font-mono"
            >
              Masuk Langsung &rarr;
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
