import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  QrCode,
  Building,
  MessageSquare,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  Lock,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  X,
  FileText,
  User,
  Mail,
  Phone,
  Globe,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { Link } from 'react-router-dom';
import qrisCardImg from '../assets/qris-card.png';
import qrisFullImg from '../assets/qris-riski.jpg';

export default function CheckoutModal({ isOpen, onClose, selectedPackage, preselectedTemplateId }) {
  const { templates, paymentSettings, createOrder } = usePortfolio();

  const [step, setStep] = useState(1); // 1: Form, 2: Payment, 3: Success
  const [copiedKey, setCopiedKey] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    buyerName: '',
    buyerEmail: '',
    buyerWhatsapp: '',
    jobTitle: 'Mechanical Engineer',
    slug: '',
    templateId: preselectedTemplateId || templates[0]?.id || 'TMPL-001',
    paymentMethod: 'QRIS Instant', // 'QRIS Instant' | 'Bank Transfer (BNI)' | 'Bank Transfer (Mandiri)' | 'WhatsApp Order'
  });

  // Success Result
  const [orderResult, setOrderResult] = useState(null);

  useEffect(() => {
    if (preselectedTemplateId) {
      setFormData((prev) => ({ ...prev, templateId: preselectedTemplateId }));
    }
  }, [preselectedTemplateId]);

  if (!isOpen) return null;

  const currentTemplate = templates.find((t) => t.id === formData.templateId) || templates[0];
  const packagePrice = selectedPackage?.price || currentTemplate?.price || 499000;
  const packageName = selectedPackage?.name || `${currentTemplate?.name} (${currentTemplate?.version})`;

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleFormNext = (e) => {
    e.preventDefault();
    if (!formData.buyerName || !formData.buyerEmail) return;
    setStep(2);
  };

  const handleCompletePayment = async (overrideMethod) => {
    setIsProcessing(true);
    const methodToUse = overrideMethod || formData.paymentMethod;

    try {
      const result = await createOrder({
        buyerName: formData.buyerName,
        buyerEmail: formData.buyerEmail,
        buyerWhatsapp: formData.buyerWhatsapp,
        jobTitle: formData.jobTitle,
        slug: formData.slug || formData.buyerName,
        templateId: formData.templateId,
        templateName: currentTemplate.name,
        packageName: packageName,
        amount: packagePrice,
        paymentMethod: methodToUse,
        accessPin: '1234',
      });

      setOrderResult(result);
      setStep(3);
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWhatsAppCheckout = () => {
    const waText = encodeURIComponent(
      `Halo Riski Saputra (Riski Projek),\n\nSaya ingin memesan Template Portofolio:\n` +
      `• Paket: ${packageName}\n` +
      `• Template: ${currentTemplate.name} (${currentTemplate.version})\n` +
      `• Harga: Rp ${packagePrice.toLocaleString('id-ID')}\n` +
      `• Nama Pembeli: ${formData.buyerName}\n` +
      `• Email: ${formData.buyerEmail}\n` +
      `• WhatsApp: ${formData.buyerWhatsapp}\n` +
      `• Slug Portofolio: /portfolio/${formData.slug || formData.buyerName.toLowerCase().replace(/\\s+/g, '-')}\n\n` +
      `Mohon instruksi pembayaran & aktivasi lisensi. Terima kasih!`
    );
    window.open(`https://wa.me/${paymentSettings.whatsappNumber || '6285923320768'}?text=${waText}`, '_blank');
    handleCompletePayment('WhatsApp Order');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl text-white select-none overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          className="relative w-full max-w-2xl rounded-3xl bg-[#090E17] border-2 border-amber-500/40 shadow-[0_25px_80px_rgba(0,0,0,0.95)] p-6 sm:p-8 overflow-hidden my-8 max-h-[90vh] overflow-y-auto custom-scrollbar"
        >
          {/* Top Decorative Glow */}
          <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_rgba(245,158,11,0.8)]" />

          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white uppercase font-sans tracking-tight">
                  Checkout Lisensi Template
                </h2>
                <div className="text-xs text-amber-300/90 font-mono">
                  Langkah {step} dari 3 • {step === 1 ? 'Data Pembeli' : step === 2 ? 'Metode Pembayaran' : 'Akses Diterbitkan'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ========================================================
              STEP 1: BUYER INFORMATION & TEMPLATE CHOOSER
              ======================================================== */}
          {step === 1 && (
            <form onSubmit={handleFormNext} className="space-y-4">
              {/* Order Summary Pill */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-rose-950/30 to-black border border-amber-500/30 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] font-mono text-amber-300 uppercase tracking-wider font-bold">
                    Paket yang Dipilih:
                  </div>
                  <div className="text-sm sm:text-base font-black text-white font-sans">
                    {packageName}
                  </div>
                  <div className="text-xs text-slate-300 font-mono">
                    Template: {currentTemplate.name} ({currentTemplate.version})
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg sm:text-2xl font-black text-amber-300 font-mono">
                    Rp {packagePrice.toLocaleString('id-ID')}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono">
                    ✓ Lisensi Seumur Hidup
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>Nama Lengkap Pembeli *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.buyerName}
                    onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                    placeholder="Contoh: Ahmad Dani, S.T."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>Alamat Email Aktif *</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.buyerEmail}
                    onChange={(e) => setFormData({ ...formData, buyerEmail: e.target.value })}
                    placeholder="nama@perusahaan.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>No. WhatsApp Aktif *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.buyerWhatsapp}
                    onChange={(e) => setFormData({ ...formData, buyerWhatsapp: e.target.value })}
                    placeholder="+62 812-3456-7890"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-amber-400" />
                    <span>Slug Link Portofolio yang Diinginkan</span>
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="nama-anda (otomatis jika kosong)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              {/* Template Choice Dropdown */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Pilih Varian Template Desain
                </label>
                <select
                  value={formData.templateId}
                  onChange={(e) => setFormData({ ...formData, templateId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-amber-400 cursor-pointer"
                >
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.version}) — {t.edition} {t.isDefault ? '⭐ Master Default' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Security & Feature Guarantee */}
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 text-xs text-slate-300 space-y-1 font-mono">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Garansi Sistem Siap Pakai & Link Editor Instan</span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  • Setelah pembayaran, akun editor langsung dibuat otomatis dengan PIN akses.
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-300 transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-rose-700 to-rose-900 hover:from-amber-500 hover:to-rose-800 text-xs font-bold text-white shadow-lg cursor-pointer transition-all hover:scale-105"
                >
                  <span>Lanjut ke Pembayaran</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* ========================================================
              STEP 2: PAYMENT METHOD CHOSEN (QRIS / BANK / WA)
              ======================================================== */}
          {step === 2 && (
            <div className="space-y-5">
              {/* Total Summary */}
              <div className="p-4 rounded-2xl bg-black/60 border border-amber-500/40 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-mono">Total Tagihan:</div>
                  <div className="text-2xl font-black text-amber-300 font-mono">
                    Rp {packagePrice.toLocaleString('id-ID')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-white">{formData.buyerName}</div>
                  <div className="text-[11px] font-mono text-slate-400">{formData.buyerEmail}</div>
                </div>
              </div>

              {/* Payment Tabs Selection */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'QRIS Instant' })}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    formData.paymentMethod === 'QRIS Instant'
                      ? 'bg-amber-950/80 border-amber-400 text-amber-200 shadow-lg scale-[1.02]'
                      : 'bg-[#060B12] border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <QrCode className="w-5 h-5 mx-auto mb-1 text-amber-400" />
                  <div className="text-xs font-bold font-sans">QRIS Instant</div>
                  <div className="text-[10px] font-mono text-slate-400">All E-Wallet / Bank</div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'Bank Transfer (BNI)' })}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    formData.paymentMethod.includes('Bank')
                      ? 'bg-blue-950/80 border-blue-400 text-blue-200 shadow-lg scale-[1.02]'
                      : 'bg-[#060B12] border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <Building className="w-5 h-5 mx-auto mb-1 text-blue-400" />
                  <div className="text-xs font-bold font-sans">Transfer Bank</div>
                  <div className="text-[10px] font-mono text-slate-400">BNI, Mandiri, BRI</div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'WhatsApp Order' })}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    formData.paymentMethod === 'WhatsApp Order'
                      ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200 shadow-lg scale-[1.02]'
                      : 'bg-[#060B12] border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
                  <div className="text-xs font-bold font-sans">WhatsApp</div>
                  <div className="text-[10px] font-mono text-slate-400">Pesan Langsung</div>
                </button>
              </div>

              {/* PAYMENT DETAILS CONTENT ACCORDING TO TAB */}
              {formData.paymentMethod === 'QRIS Instant' && (
                <div className="p-5 rounded-2xl bg-[#060B12] border border-amber-500/30 text-center space-y-3.5">
                  <div className="text-xs font-mono text-amber-300 font-bold">
                    Scan QRIS Resmi RISKI PROJEK (Semua Bank & E-Wallet)
                  </div>

                  {/* QRIS Display Container */}
                  <div className="p-3 bg-gradient-to-b from-sky-500 to-blue-600 rounded-2xl max-w-[240px] mx-auto shadow-2xl border-2 border-white/20">
                    <div className="bg-white p-2.5 rounded-xl shadow-inner">
                      <img
                        src={qrisCardImg || paymentSettings.qrisUrl || '/qris-card.png'}
                        alt="QRIS Resmi Riski Projek"
                        className="w-full h-auto aspect-square object-contain mx-auto rounded-lg"
                      />
                    </div>
                    <div className="pt-2 text-center">
                      <div className="text-[11px] font-mono font-black text-white tracking-wider">
                        NMID: ID1020038948291
                      </div>
                      <div className="text-[10px] font-sans text-sky-100 font-semibold">
                        A.N. RISKI SAPUTRA / RISKI PROJEK
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-slate-300">
                    <a
                      href={qrisFullImg || '/qris-riski.jpg'}
                      target="_blank"
                      rel="noreferrer"
                      className="text-amber-400 hover:text-white underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Lihat / Unduh Gambar QR Penuh ↗</span>
                    </a>
                  </div>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleCompletePayment('QRIS Instant')}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-xs font-bold text-white transition-all shadow-lg cursor-pointer hover:scale-[1.01]"
                  >
                    {isProcessing ? 'Memproses Aktivasi...' : '✓ Saya Sudah Menyelesaikan Pembayaran QRIS'}
                  </button>
                </div>
              )}

              {formData.paymentMethod.includes('Bank') && (
                <div className="p-5 rounded-2xl bg-[#060B12] border border-blue-500/30 space-y-3">
                  <div className="text-xs font-mono text-blue-300 font-bold mb-2">
                    Silakan Transfer ke Salah Satu Rekening Resmi Riski Saputra:
                  </div>

                  {paymentSettings.bankAccounts.map((acc, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="text-xs font-bold text-white font-sans">{acc.bank}</div>
                        <div className="text-sm font-mono font-black text-amber-300">{acc.accountNumber}</div>
                        <div className="text-[10px] font-mono text-slate-400">a.n. {acc.accountName}</div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopy(acc.accountNumber, `bank-${i}`)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-slate-200 transition-all cursor-pointer"
                      >
                        {copiedKey === `bank-${i}` ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-blue-400" />
                            <span>Salin No. Rekening</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleCompletePayment('Bank Transfer (Manual)')}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-xs font-bold text-white transition-all shadow-lg cursor-pointer hover:scale-[1.01] mt-2"
                  >
                    {isProcessing ? 'Memproses Pesanan...' : '✓ Konfirmasi Saya Sudah Transfer Bank'}
                  </button>
                </div>
              )}

              {formData.paymentMethod === 'WhatsApp Order' && (
                <div className="p-5 rounded-2xl bg-[#060B12] border border-emerald-500/30 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 mx-auto flex items-center justify-center text-emerald-400">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Order Cepat via WhatsApp Langsung</h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    Kirim rincian pesanan langsung ke nomor WhatsApp pribadi Riski Saputra untuk mendapatkan verifikasi manual dan panduan setup kustom.
                  </p>

                  <button
                    type="button"
                    onClick={handleWhatsAppCheckout}
                    className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 text-xs font-bold text-white transition-all shadow-lg cursor-pointer hover:scale-[1.01]"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Buka WhatsApp & Kirim Pesanan Sekarang</span>
                  </button>
                </div>
              )}

              {/* Back to Step 1 */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Kembali ubah biodata</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================
              STEP 3: ORDER SUBMITTED & WAITING ADMIN MASTER APPROVAL
              ======================================================== */}
          {step === 3 && orderResult && (
            <div className="space-y-5 text-center">
              <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border-2 border-amber-400/60 mx-auto flex items-center justify-center text-amber-300 animate-pulse">
                <ShieldCheck className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <span className="text-[10.5px] font-mono text-amber-300 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-500/40 font-bold uppercase tracking-wider">
                  ⏳ PESANAN BERHASIL DICATAT • MENUNGGU PERSETUJUAN ADMIN MASTER
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white uppercase font-sans pt-1">
                  Terima Kasih, {orderResult.customer.name}!
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  Pesanan dan kredensial akses Anda telah dibuat. Sesuai kebijakan keamanan, akun Anda <strong>harus disetujui oleh Admin Master</strong> terlebih dahulu sebelum Anda dapat login ke panel editor.
                </p>
              </div>

              {/* Digital Invoice Credentials Box */}
              <div className="p-5 rounded-2xl bg-[#060B12] border-2 border-amber-500/40 text-left space-y-3 font-mono text-xs shadow-2xl">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 text-slate-400">
                  <span>INVOICE #{orderResult.transaction.id}</span>
                  <span className="text-amber-400 font-bold">STATUS: MENUNGGU PERSETUJUAN</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                  <div>• ID Pelanggan (Username): <strong className="text-white bg-blue-950/80 px-2 py-0.5 rounded border border-blue-500/30">{orderResult.customer.id}</strong></div>
                  <div>• PIN Akses / Sandi: <strong className="text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">{orderResult.customer.accessPin || '1234'}</strong></div>
                  <div>• Paket / Edisi: <strong className="text-white">{orderResult.transaction.templateName}</strong></div>
                  <div>• Total Nominal: <strong className="text-emerald-400">Rp {orderResult.transaction.amount.toLocaleString('id-ID')}</strong></div>
                </div>

                {/* Important Notice */}
                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-[11px] text-amber-200/90 font-sans space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-amber-300">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Perhatian: Simpan ID & PIN Anda</span>
                  </div>
                  <div>
                    Setelah Admin Master menyetujui verifikasi pembayaran Anda di <code>/admin/payments</code>, Anda dapat langsung login menggunakan ID: <strong>{orderResult.customer.id}</strong> dan PIN: <strong>{orderResult.customer.accessPin || '1234'}</strong>.
                  </div>
                </div>

                {/* Direct Action Links */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between bg-white/[0.03] p-2.5 rounded-xl border border-white/10">
                    <span className="text-[11px] text-slate-300 truncate">
                      Halaman Login Editor: <code>/customer/login</code>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(`${window.location.origin}/customer/login?id=${orderResult.customer.id}`, 'res-login')}
                      className="text-blue-400 hover:text-white text-[11px] shrink-0 font-bold cursor-pointer"
                    >
                      {copiedKey === 'res-login' ? '✓ Tersalin' : 'Salin Link Login'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href={`https://wa.me/${paymentSettings.whatsappNumber || '6285923320768'}?text=${encodeURIComponent(
                    `Halo Admin Master Riski Saputra,\n\nSaya telah menyelesaikan pembayaran untuk lisensi template portofolio:\n` +
                    `• ID Pelanggan: ${orderResult.customer.id}\n` +
                    `• Nama: ${orderResult.customer.name}\n` +
                    `• No Invoice: ${orderResult.transaction.id}\n` +
                    `• Total: Rp ${orderResult.transaction.amount.toLocaleString('id-ID')}\n\n` +
                    `Mohon verifikasi dan setujui akun saya agar saya dapat login ke editor. Terima kasih!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-700 hover:from-emerald-500 hover:to-green-600 text-xs font-bold text-white shadow-xl transition-all hover:scale-105"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Konfirmasi via WhatsApp ke Admin Master ↗</span>
                </a>

                <Link
                  to={`/customer/login?id=${orderResult.customer.id}`}
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-200 transition-all cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Buka Halaman Login</span>
                </Link>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/15 text-xs font-bold text-slate-400 hover:text-white transition-all cursor-pointer w-full sm:w-auto"
                >
                  Tutup
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
