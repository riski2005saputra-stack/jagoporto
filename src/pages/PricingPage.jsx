import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Check,
  Shield,
  Zap,
  Star,
  Layers,
  Award,
  ArrowRight,
  HelpCircle,
  CreditCard,
  Building,
  QrCode,
  Lock,
  ChevronDown,
  Monitor,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import CheckoutModal from '../components/CheckoutModal';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DarkRedMetalBackground from '../components/DarkRedMetalBackground';

export default function PricingPage() {
  const { templates, pricingPackages, pricingFaqs } = usePortfolio();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const packages = (pricingPackages && pricingPackages.length > 0) ? pricingPackages.filter(p => p.isActive !== false) : [];
  const faqs = (pricingFaqs && pricingFaqs.length > 0) ? pricingFaqs : [];

  const handleOpenOrder = (pkg) => {
    setSelectedPackage(pkg);
    setShowCheckout(true);
  };

  return (
    <div className="min-h-screen bg-[#05080D] text-slate-100 flex flex-col selection:bg-amber-900 selection:text-white relative">
      {/* Standard Header without redundant Buy button */}
      <Navbar showBuyButton={false} />

      <main className="flex-grow pt-24 pb-20 px-4 sm:px-8 relative overflow-hidden">
        {/* Background Metal Layer */}
        <DarkRedMetalBackground />

        <div className="max-w-7xl mx-auto relative z-10 space-y-16">
          {/* ========================================================
              1. HERO SECTION PRICING
              ======================================================== */}
          <div className="text-center max-w-3xl mx-auto space-y-4 pt-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/40 text-amber-300 text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>OFFICIAL TEMPLATE STORE • RISKI PROJEK</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight font-sans">
              Miliki Website Portofolio <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-amber-200">Engineering & Tech</span> Siap Jual
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Tingkatkan nilai profesionalisme Anda di hadapan HRD dan klien industri dengan website portofolio interaktif 3D berbasis master template karya Riski Saputra.
            </p>
          </div>

          {/* ========================================================
              2. PRICING TIERS CARDS
              ======================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {packages.map((pkg) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                  pkg.isPopular
                    ? 'bg-gradient-to-b from-[#2a0914] via-[#14030A] to-[#0A0407] border-2 border-amber-500 shadow-[0_0_50px_rgba(245,158,11,0.25)] scale-[1.03] z-10'
                    : 'bg-[#090E17]/90 border border-white/15 hover:border-white/30 shadow-xl'
                }`}
              >
                <div>
                  {/* Top Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-[10.5px] font-mono font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                        pkg.isPopular
                          ? 'bg-amber-500 text-black font-extrabold shadow-md'
                          : 'bg-white/10 text-amber-300 border border-white/10'
                      }`}
                    >
                      {pkg.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-white uppercase font-sans tracking-tight mb-2">
                    {pkg.name}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-6">
                    {pkg.description}
                  </p>

                  {/* Price */}
                  <div className="pb-6 mb-6 border-b border-white/10">
                    <div className="text-xs font-mono text-slate-400">Investasi Lisensi Sekali Bayar</div>
                    <div className="text-3xl sm:text-4xl font-black text-amber-300 font-mono mt-1">
                      Rp {pkg.price.toLocaleString('id-ID')}
                    </div>
                    <div className="text-[11px] text-emerald-400 font-mono mt-1">
                      ✓ Akses Selamanya Tanpa Biaya Bulanan
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 mb-8">
                    <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                      Semua yang Anda Dapatkan:
                    </div>
                    {pkg.features.map((f, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                        <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  type="button"
                  onClick={() => handleOpenOrder(pkg)}
                  className={`w-full py-3.5 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-xl flex items-center justify-center gap-2 ${
                    pkg.isPopular
                      ? 'bg-gradient-to-r from-amber-500 via-rose-600 to-rose-700 hover:from-amber-400 hover:to-rose-600 text-black font-extrabold hover:scale-[1.02]'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:scale-[1.02]'
                  }`}
                >
                  <span>{pkg.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>

          {/* ========================================================
              3. GUARANTEE & TRUST PILLARS
              ======================================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
            <div className="p-5 rounded-2xl bg-[#090E17]/80 border border-white/10 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white font-sans">Aktivasi Instan</h4>
                <p className="text-xs text-slate-400">Akun editor & portofolio langsung dibuat otomatis.</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#090E17]/80 border border-white/10 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/50 flex items-center justify-center text-blue-300 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white font-sans">Locked Guardrail</h4>
                <p className="text-xs text-slate-400">Desain 3D terlindungi & tidak akan rusak saat edit.</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#090E17]/80 border border-white/10 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300 shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white font-sans">Bantuan Langsung</h4>
                <p className="text-xs text-slate-400">Panduan konfigurasi langsung dari Riski Saputra.</p>
              </div>
            </div>
          </div>

          {/* ========================================================
              4. FAQ ACCORDION SECTION
              ======================================================== */}
          <div className="max-w-3xl mx-auto space-y-6 pt-10">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>PERTANYAAN UMUM</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-sans tracking-tight">
                Pertanyaan yang Sering Diajukan
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl bg-[#090E17]/90 border border-white/10 overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-3 text-xs sm:text-sm font-bold text-white hover:text-amber-300 transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${
                          isOpen ? 'rotate-180 text-amber-400' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 sm:px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Corporate Footer */}
      <Footer />

      {/* Interactive Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        selectedPackage={selectedPackage}
      />
    </div>
  );
}
