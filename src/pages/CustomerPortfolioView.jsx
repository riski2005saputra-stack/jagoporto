import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  AlertTriangle,
  FileQuestion,
  Edit,
  ExternalLink,
  Shield,
  ArrowLeft,
  Sparkles,
  Lock,
  Globe,
  FileEdit,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { useAuth } from '../context/AuthContext';

// Core Master Template Components
import Navbar from '../components/Navbar';
import Hero from '../sections/Hero';
import About from '../sections/About';
import Projects from '../sections/Projects';
import Contact from '../sections/Contact';
import Footer from '../components/Footer';

export default function CustomerPortfolioView() {
  const { slug } = useParams();
  const { customers, templates, togglePublishCustomer } = usePortfolio();
  const { isCustomerAuthorized, isMasterAuthenticated } = useAuth();

  // Find customer by slug or customerId (case-insensitive)
  const customer = customers.find(
    (c) =>
      c.slug?.toLowerCase() === slug?.toLowerCase() ||
      c.id?.toLowerCase() === slug?.toLowerCase() ||
      c.name?.toLowerCase().replace(/\s+/g, '-') === slug?.toLowerCase()
  );

  const assignedTemplate = templates.find((t) => t.id === customer?.templateId) || templates[0];
  const isAuthorizedOwner = customer ? isCustomerAuthorized(customer.id) || isMasterAuthenticated : false;
  const isDraft = customer ? customer.isPublished === false : false;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // ========================================================
  // 1. STATE: CUSTOMER NOT FOUND (404)
  // ========================================================
  if (!customer) {
    return (
      <div className="min-h-screen bg-[#05080D] text-white flex items-center justify-center p-4 selection:bg-rose-900 selection:text-white">
        <div className="max-w-lg w-full p-8 sm:p-10 rounded-3xl bg-[#090E17]/95 border-2 border-white/15 text-center space-y-5 shadow-2xl backdrop-blur-xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 border border-white/20 flex items-center justify-center text-slate-400">
            <FileQuestion className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-mono text-rose-400 bg-rose-950/80 px-2.5 py-0.5 rounded-full border border-rose-500/40">
              404 • NOT FOUND
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase font-sans">
              Portofolio Tidak Ditemukan
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Alamat portofolio <code>/portfolio/{slug}</code> belum terdaftar di sistem atau tautan yang Anda masukkan keliru.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-900 to-[#5c0b25] hover:from-rose-800 hover:to-rose-900 border border-rose-400/50 text-xs font-bold text-white transition-all shadow-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Website Utama</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // 2. STATE: CUSTOMER SUSPENDED / INACTIVE
  // ========================================================
  if (customer.status !== 'active') {
    return (
      <div className="min-h-screen bg-[#05080D] text-white flex items-center justify-center p-4 selection:bg-rose-900 selection:text-white">
        <div className="max-w-lg w-full p-8 sm:p-10 rounded-3xl bg-[#090E17]/95 border-2 border-rose-500/40 text-center space-y-5 shadow-2xl backdrop-blur-xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-950/80 border border-rose-500/40 flex items-center justify-center text-rose-300 animate-pulse">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-mono text-rose-300 bg-rose-950/80 px-2.5 py-0.5 rounded-full border border-rose-500/40 font-bold">
              STATUS: DITANGGUHKAN
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase font-sans">
              Portofolio Ini Sedang Ditangguhkan
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Portofolio milik <strong>{customer.name}</strong> saat ini dinonaktifkan oleh administrator master.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-slate-400 font-mono text-left space-y-1">
            <div>• ID Pelanggan: <code>{customer.id}</code></div>
            <div>• Edisi Template: <code>{assignedTemplate?.name}</code></div>
            <div>• Bantuan / Pemulihan: Hubungi Admin Riski Saputra</div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all"
            >
              <span>Website Master</span>
            </Link>

            <Link
              to={`/editor/${customer.id}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-800 text-xs font-bold text-white transition-all"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Buka Editor Pelanggan</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // 3. STATE: DRAFT MODE (Visitor is NOT Authorized)
  // ========================================================
  if (isDraft && !isAuthorizedOwner) {
    return (
      <div className="min-h-screen bg-[#05080D] text-white flex items-center justify-center p-4 selection:bg-amber-900 selection:text-white">
        <div className="max-w-lg w-full p-8 sm:p-10 rounded-3xl bg-[#090E17]/95 border-2 border-amber-500/40 text-center space-y-5 shadow-2xl backdrop-blur-xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-300">
            <FileEdit className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-mono text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-500/40 font-bold">
              STATUS: DRAFT (BELUM DIPUBLIKASIKAN)
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase font-sans">
              Portofolio Masih Dalam Penyusunan
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Portofolio milik <strong>{customer.name}</strong> sedang dalam proses penyuntingan dan belum dipublikasikan untuk umum.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-slate-400 font-mono text-left space-y-1">
            <div>• Pemilik Akun: <code>{customer.name}</code></div>
            <div>• Mode Akses Publik: Terkunci (Draft Mode)</div>
            <div>• Jika Anda adalah pemilik portofolio ini, silakan masuk ke editor untuk mempublikasikannya.</div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all"
            >
              <span>Website Master</span>
            </Link>

            <Link
              to={`/editor/${customer.id}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-xs font-bold text-white transition-all"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Login ke Editor</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // 4. STATE: LIVE / AUTHORIZED PREVIEW PORTFOLIO VIEW
  // ========================================================
  return (
    <div className="min-h-screen bg-[#05080D] text-slate-100 flex flex-col selection:bg-rose-900 selection:text-white relative">
      {/* Top Banner Notice if in Draft Mode (Only shown to authorized owner/admin) */}
      {isDraft && isAuthorizedOwner && (
        <div className="sticky top-0 z-50 bg-amber-950/95 border-b border-amber-500/50 backdrop-blur-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-200 shadow-xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="font-mono">
              <strong>⚠️ MODE PREVIEW DRAFT:</strong> Portofolio ini belum live ke publik. Hanya Anda (pemilik akun) yang dapat melihat halaman ini.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => togglePublishCustomer(customer.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-all shadow-md cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Publish ke Publik Sekarang</span>
            </button>
          </div>
        </div>
      )}

      {/* Sticky Header Navigation (Customer Portfolio - No Buy Button) */}
      <Navbar customData={customer} showBuyButton={false} />

      {/* Main Sections */}
      <main className="flex-grow">
        <Hero customData={customer} />
        <About customData={customer} />
        <Projects customData={customer} />
        <Contact customData={customer} />
      </main>

      {/* Corporate Footer */}
      <Footer customData={customer} />
    </div>
  );
}
