import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tag,
  CreditCard,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  Sparkles,
  Layers,
  Save,
  RotateCcw,
  Star,
  Check,
  X,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export default function AdminPricing() {
  const {
    pricingPackages,
    pricingFaqs,
    updatePricingPackage,
    addPricingPackage,
    deletePricingPackage,
    updatePricingFaqs,
    addPricingFaq,
    deletePricingFaq,
    resetPricingToDefault,
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState('packages'); // 'packages' | 'faqs'
  const [editingPackage, setEditingPackage] = useState(null);
  const [editingFaq, setEditingFaq] = useState(null);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Open edit package modal
  const handleEditPackage = (pkg) => {
    setEditingPackage({
      ...pkg,
      featuresText: Array.isArray(pkg.features) ? pkg.features.join('\n') : '',
    });
    setShowPackageModal(true);
  };

  // Open add new package modal
  const handleAddNewPackage = () => {
    setEditingPackage({
      id: `pkg-${Date.now().toString().slice(-4)}`,
      name: 'Custom Package Edition',
      price: 599000,
      badge: 'PROMO KHUSUS',
      isPopular: false,
      description: 'Deskripsi paket lisensi portofolio baru.',
      featuresText: '1 Lisensi Portofolio\nAkses Editor Mandiri\nPIN Akses Rahasia\nGaransi Selamanya',
      ctaText: 'Pesan Paket Ini',
      isActive: true,
      isNew: true,
    });
    setShowPackageModal(true);
  };

  // Save package changes
  const handleSavePackage = (e) => {
    e.preventDefault();
    if (!editingPackage.name.trim()) return;

    const formattedFeatures = (editingPackage.featuresText || '')
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const packageData = {
      id: editingPackage.id,
      name: editingPackage.name.trim(),
      price: Number(editingPackage.price) || 0,
      badge: editingPackage.badge.trim(),
      isPopular: Boolean(editingPackage.isPopular),
      description: editingPackage.description.trim(),
      features: formattedFeatures,
      ctaText: editingPackage.ctaText.trim() || 'Pesan Sekarang',
      isActive: editingPackage.isActive !== false,
    };

    if (editingPackage.isNew) {
      addPricingPackage(packageData);
      triggerToast(`Paket "${packageData.name}" berhasil ditambahkan!`);
    } else {
      updatePricingPackage(packageData.id, packageData);
      triggerToast(`Paket "${packageData.name}" berhasil diperbarui!`);
    }

    setShowPackageModal(false);
    setEditingPackage(null);
  };

  // Delete package
  const handleDeletePackage = (pkg) => {
    if (confirm(`Yakin ingin menghapus paket "${pkg.name}" dari halaman Pricing?`)) {
      deletePricingPackage(pkg.id);
      triggerToast(`Paket "${pkg.name}" berhasil dihapus.`);
    }
  };

  // Edit FAQ
  const handleEditFaq = (faq) => {
    setEditingFaq({ ...faq });
    setShowFaqModal(true);
  };

  // Add FAQ
  const handleAddFaq = () => {
    setEditingFaq({
      id: `faq-${Date.now().toString().slice(-4)}`,
      q: '',
      a: '',
      isNew: true,
    });
    setShowFaqModal(true);
  };

  // Save FAQ
  const handleSaveFaq = (e) => {
    e.preventDefault();
    if (!editingFaq.q.trim() || !editingFaq.a.trim()) return;

    if (editingFaq.isNew) {
      addPricingFaq({ id: editingFaq.id, q: editingFaq.q.trim(), a: editingFaq.a.trim() });
      triggerToast('Pertanyaan FAQ berhasil ditambahkan!');
    } else {
      const updated = pricingFaqs.map((f) =>
        f.id === editingFaq.id ? { ...f, q: editingFaq.q.trim(), a: editingFaq.a.trim() } : f
      );
      updatePricingFaqs(updated);
      triggerToast('Pertanyaan FAQ berhasil diperbarui!');
    }

    setShowFaqModal(false);
    setEditingFaq(null);
  };

  // Delete FAQ
  const handleDeleteFaq = (faq) => {
    if (confirm('Hapus pertanyaan FAQ ini?')) {
      deletePricingFaq(faq.id);
      triggerToast('Pertanyaan FAQ berhasil dihapus.');
    }
  };

  const handleReset = () => {
    if (confirm('Kembalikan paket harga dan FAQ ke pengaturan bawaan awal?')) {
      resetPricingToDefault();
      triggerToast('Paket harga & FAQ berhasil direset ke bawaan.');
    }
  };

  return (
    <div className="space-y-8">
      {/* ========================================================
          1. HEADER BANNER
          ======================================================== */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#240812] via-[#15030A] to-[#0A0E17] border-2 border-rose-500/30 p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold shadow-sm">
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              <span>KELOLA TOKO & PAKET LISENSI TEMPLATE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-sans">
              Pengaturan Paket Harga (/pricing)
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Ubah harga lisensi, nama paket, fitur per paket, badge promo, dan daftar Tanya-Jawab (FAQ) yang tampil di halaman pembelian template publik.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <a
              href="/pricing"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-rose-700 hover:from-amber-500 hover:to-rose-600 text-white text-xs font-bold transition-all shadow-lg cursor-pointer"
            >
              <span>Lihat Halaman Pricing Live</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-mono font-bold transition-all cursor-pointer"
              title="Reset ke harga & FAQ default"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Reset Default</span>
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-emerald-950/90 border border-emerald-400/60 text-emerald-200 text-xs font-mono font-bold flex items-center gap-2 shadow-2xl backdrop-blur-md"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================
          2. NAVIGATION TABS (PACKAGES VS FAQS)
          ======================================================== */}
      <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('packages')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'packages'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-950/50'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Daftar Paket Lisensi ({pricingPackages.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('faqs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'faqs'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-950/50'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Tanya Jawab / FAQ ({pricingFaqs.length})</span>
          </button>
        </div>

        {activeTab === 'packages' ? (
          <button
            type="button"
            onClick={handleAddNewPackage}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Paket Baru</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleAddFaq}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah FAQ Baru</span>
          </button>
        )}
      </div>

      {/* ========================================================
          3. TAB 1: PRICING PACKAGES LIST (CARDS)
          ======================================================== */}
      {activeTab === 'packages' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingPackages.map((pkg, idx) => {
            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className={`p-6 rounded-2xl border backdrop-blur-xl flex flex-col justify-between relative transition-all ${
                  pkg.isPopular
                    ? 'bg-gradient-to-b from-[#1c0812] via-[#0e1626] to-[#060b13] border-amber-500/70 shadow-[0_0_35px_rgba(245,158,11,0.25)]'
                    : 'bg-[#090E17]/90 border-white/15 shadow-xl'
                }`}
              >
                {/* Popular Glow Indicator */}
                {pkg.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-600 text-black text-[10px] font-black uppercase tracking-wider shadow-md">
                    {pkg.badge || 'PALING DIMINATI ★'}
                  </div>
                )}

                <div className="space-y-4">
                  {/* Top Badge & Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-amber-300 border border-white/10">
                      {pkg.badge || 'LISENSI RESMI'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      ID: {pkg.id}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-lg font-black text-white font-sans uppercase tracking-tight">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {pkg.description}
                    </p>
                  </div>

                  {/* Price Tag */}
                  <div className="pt-2 border-t border-white/10">
                    <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      Investasi Lisensi Sekali Bayar
                    </div>
                    <div className="text-2xl font-black text-amber-400 font-mono tracking-tight mt-0.5">
                      Rp {(Number(pkg.price) || 0).toLocaleString('id-ID')}
                    </div>
                    <div className="text-[11px] font-mono text-emerald-400 mt-0.5">
                      ✓ Akses Selamanya Tanpa Biaya Bulanan
                    </div>
                  </div>

                  {/* Features Bullet List */}
                  <div className="space-y-2 pt-3 border-t border-white/10">
                    <div className="text-[11px] font-mono font-bold text-slate-300 uppercase">
                      Fitur Termasuk ({pkg.features?.length || 0}):
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {(pkg.features || []).map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Bottom Actions */}
                <div className="pt-5 border-t border-white/10 mt-6 space-y-2.5">
                  <div className="w-full py-2 text-center rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300 font-bold">
                    CTA: "{pkg.ctaText || 'Pesan Lisensi'}"
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEditPackage(pkg)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Paket Ini</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeletePackage(pkg)}
                      className="p-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 hover:text-white transition-all cursor-pointer"
                      title="Hapus Paket"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ========================================================
          4. TAB 2: FAQS LIST
          ======================================================== */}
      {activeTab === 'faqs' && (
        <div className="space-y-4">
          {pricingFaqs.map((faq, idx) => (
            <div
              key={faq.id || idx}
              className="p-5 rounded-2xl bg-[#090E17]/90 border border-white/15 flex items-start justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
                  <span>Q#{idx + 1}:</span>
                  <h4 className="text-sm font-bold text-white font-sans">{faq.q}</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-6">{faq.a}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleEditFaq(faq)}
                  className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all cursor-pointer"
                  title="Edit Pertanyaan"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteFaq(faq)}
                  className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 hover:text-white transition-all cursor-pointer"
                  title="Hapus Pertanyaan"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================
          5. MODAL EDIT / TAMBAH PAKET HARGA
          ======================================================== */}
      <AnimatePresence>
        {showPackageModal && editingPackage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0e1626] border-2 border-rose-500/40 p-6 sm:p-7 shadow-2xl space-y-6 text-white"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-950 border border-rose-500/40 flex items-center justify-center text-rose-300 font-bold">
                    <Tag className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-white font-sans uppercase">
                    {editingPackage.isNew ? 'Tambah Paket Lisensi Baru' : `Edit Paket: ${editingPackage.name}`}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPackageModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSavePackage} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Package Name */}
                  <div>
                    <label className="block text-xs font-mono text-slate-300 font-bold mb-1.5">
                      Nama Paket Lisensi
                    </label>
                    <input
                      type="text"
                      required
                      value={editingPackage.name}
                      onChange={(e) => setEditingPackage({ ...editingPackage, name: e.target.value })}
                      placeholder="Contoh: Personal Engineer License"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#04080F] border border-slate-700 text-white text-xs font-sans outline-none focus:border-rose-400"
                    />
                  </div>

                  {/* Price in Rupiah */}
                  <div>
                    <label className="block text-xs font-mono text-slate-300 font-bold mb-1.5">
                      Harga Lisensi (Rp)
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="1000"
                      value={editingPackage.price}
                      onChange={(e) => setEditingPackage({ ...editingPackage, price: e.target.value })}
                      placeholder="499000"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#04080F] border border-slate-700 text-white text-xs font-mono outline-none focus:border-rose-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Badge Text */}
                  <div>
                    <label className="block text-xs font-mono text-slate-300 font-bold mb-1.5">
                      Badge / Tag Promosi
                    </label>
                    <input
                      type="text"
                      value={editingPackage.badge || ''}
                      onChange={(e) => setEditingPackage({ ...editingPackage, badge: e.target.value })}
                      placeholder="Contoh: STARTER REKOMENDASI / PALING DIMINATI ★"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#04080F] border border-slate-700 text-white text-xs font-sans outline-none focus:border-rose-400"
                    />
                  </div>

                  {/* CTA Button Text */}
                  <div>
                    <label className="block text-xs font-mono text-slate-300 font-bold mb-1.5">
                      Teks Tombol Pesan (CTA)
                    </label>
                    <input
                      type="text"
                      value={editingPackage.ctaText || ''}
                      onChange={(e) => setEditingPackage({ ...editingPackage, ctaText: e.target.value })}
                      placeholder="Pesan Lisensi Personal"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#04080F] border border-slate-700 text-white text-xs font-sans outline-none focus:border-rose-400"
                    />
                  </div>
                </div>

                {/* Popular Toggle */}
                <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="text-xs font-bold text-white">Tandai Sebagai Paket Terpopuler (Featured)</div>
                      <div className="text-[10.5px] text-slate-400">Memberikan bingkai emas & glow khusus di halaman pricing</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={Boolean(editingPackage.isPopular)}
                    onChange={(e) => setEditingPackage({ ...editingPackage, isPopular: e.target.checked })}
                    className="w-4 h-4 rounded text-rose-600 cursor-pointer"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 font-bold mb-1.5">
                    Deskripsi Ringkas Paket
                  </label>
                  <textarea
                    rows={2}
                    value={editingPackage.description || ''}
                    onChange={(e) => setEditingPackage({ ...editingPackage, description: e.target.value })}
                    placeholder="Jelaskan untuk siapa paket ini cocok..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#04080F] border border-slate-700 text-white text-xs font-sans outline-none focus:border-rose-400"
                  />
                </div>

                {/* Features (One per line) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-mono text-slate-300 font-bold">
                      Daftar Fitur Paket (1 Baris = 1 Poin Fitur)
                    </label>
                    <span className="text-[10.5px] font-mono text-emerald-400">
                      Gunakan Enter untuk baris baru
                    </span>
                  </div>
                  <textarea
                    rows={7}
                    required
                    value={editingPackage.featuresText}
                    onChange={(e) => setEditingPackage({ ...editingPackage, featuresText: e.target.value })}
                    placeholder="1 Lisensi Portofolio Siap Pakai&#10;Akses Editor Mandiri (6 Tab Lengkap)&#10;PIN Akses Editor Pribadi&#10;ID Card 3D Gantung Interaktif"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#04080F] border border-slate-700 text-white text-xs font-mono outline-none focus:border-rose-400 leading-relaxed"
                  />
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPackageModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-bold"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-800 hover:from-rose-500 hover:to-rose-700 text-white text-xs font-bold shadow-lg cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Perubahan Paket</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================
          6. MODAL EDIT / TAMBAH FAQ
          ======================================================== */}
      <AnimatePresence>
        {showFaqModal && editingFaq && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl bg-[#0e1626] border-2 border-rose-500/40 p-6 shadow-2xl space-y-5 text-white"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-sm font-bold uppercase font-sans">
                  {editingFaq.isNew ? 'Tambah Pertanyaan FAQ' : 'Edit Pertanyaan FAQ'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowFaqModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveFaq} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 font-bold mb-1.5">
                    Pertanyaan (Question)
                  </label>
                  <input
                    type="text"
                    required
                    value={editingFaq.q}
                    onChange={(e) => setEditingFaq({ ...editingFaq, q: e.target.value })}
                    placeholder="Contoh: Apakah saya bisa mengedit data sendiri?"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#04080F] border border-slate-700 text-white text-xs font-sans outline-none focus:border-rose-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 font-bold mb-1.5">
                    Jawaban (Answer)
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={editingFaq.a}
                    onChange={(e) => setEditingFaq({ ...editingFaq, a: e.target.value })}
                    placeholder="Tuliskan jawaban yang jelas dan informatif..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#04080F] border border-slate-700 text-white text-xs font-sans outline-none focus:border-rose-400 leading-relaxed"
                  />
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowFaqModal(false)}
                    className="px-3.5 py-2 rounded-xl bg-white/10 text-slate-300 text-xs font-bold"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan FAQ</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
