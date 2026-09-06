import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  Search,
  Building,
  QrCode,
  MessageSquare,
  TrendingUp,
  DollarSign,
  Trash2,
  Check,
  ExternalLink,
  Save,
  ShieldCheck,
  Filter,
  Plus,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { Link } from 'react-router-dom';

export default function AdminPayments() {
  const {
    transactions,
    customers,
    paymentSettings,
    verifyPayment,
    rejectPayment,
    deleteTransaction,
    updatePaymentSettings,
  } = usePortfolio();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [saveToast, setSaveToast] = useState('');

  // Payment Settings Local Form State
  const [settingsForm, setSettingsForm] = useState(paymentSettings);

  const triggerToast = (msg) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(''), 3500);
  };

  // Metrics
  const metrics = useMemo(() => {
    const totalCount = transactions.length;
    const lunasCount = transactions.filter((t) => t.status === 'lunas').length;
    const pendingCount = transactions.filter((t) => t.status === 'pending').length;
    const ditolakCount = transactions.filter((t) => t.status === 'ditolak').length;
    const totalRevenue = transactions
      .filter((t) => t.status === 'lunas')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    return { totalCount, lunasCount, pendingCount, ditolakCount, totalRevenue };
  }, [transactions]);

  // Filtered Transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchSearch =
        tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.buyerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tx.customerId && tx.customerId.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (tx.templateName && tx.templateName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (tx.paymentMethod && tx.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchStatus = statusFilter === 'all' || tx.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [transactions, searchQuery, statusFilter]);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updatePaymentSettings(settingsForm);
    triggerToast('Pengaturan rekening & QRIS berhasil disimpan!');
  };

  const handleSendApprovalWA = (tx, cust) => {
    const waNumber = (tx.buyerWhatsapp || cust?.profile?.whatsapp || '').replace(/[^0-9]/g, '');
    const cleanNumber = waNumber.startsWith('0') ? `62${waNumber.slice(1)}` : waNumber;
    const pin = cust?.accessPin || tx.accessPin || '1234';
    const message = encodeURIComponent(
      `Halo ${tx.buyerName},\n\n` +
      `✅ *PEMBAYARAN DISETUJUI & AKUN AKTIF*\n` +
      `Pesanan lisensi template portofolio Anda (${tx.templateName}) telah DISETUJUI oleh Admin Master Riski Saputra.\n\n` +
      `📌 *Kredensial Login Editor Anda:*\n` +
      `• Link Login: ${window.location.origin}/customer/login\n` +
      `• ID Pelanggan: ${tx.customerId}\n` +
      `• PIN Akses / Sandi: ${pin}\n\n` +
      `🌐 *Web Portofolio Publik Anda:*\n` +
      `${window.location.origin}/portfolio/${cust?.slug || tx.customerId.toLowerCase()}\n\n` +
      `Silakan login dan mulai mengisi karya portofolio Anda. Terima kasih!`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      <AnimatePresence>
        {saveToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-950/95 border border-emerald-500/50 text-emerald-200 text-xs font-mono font-bold shadow-2xl backdrop-blur-xl"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{saveToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-400/40 text-emerald-300 text-xs font-mono font-bold mb-2">
            <CreditCard className="w-3.5 h-3.5" />
            <span>PUSAT KEUANGAN & PERSETUJUAN PEMBAYARAN</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-sans">
            Verifikasi Pembayaran & Persetujuan Akun
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
            Setujui pembayaran pelanggan agar customer dapat login ke panel editor portofolio. Pembeli baru berstatus <em>Pending</em> hingga Anda menyetujuinya di sini.
          </p>
        </div>

        <Link
          to="/pricing"
          target="_blank"
          className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-900 hover:from-emerald-500 hover:to-teal-600 border border-emerald-400/50 text-xs font-bold text-white transition-all shadow-lg cursor-pointer shrink-0 hover:scale-105"
        >
          <span>Buka Halaman Pricing Publik ↗</span>
        </Link>
      </div>

      {/* ========================================================
          1. REVENUE & ORDER METRICS
          ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#090E17]/90 border border-emerald-500/30 shadow-lg">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
            Total Omset Penjualan
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
            Rp {metrics.totalRevenue.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pendapatan lisensi disetujui</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#090E17]/90 border border-white/10 shadow-lg">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
            Total Transaksi
          </div>
          <div className="text-3xl font-black text-white font-mono">{metrics.totalCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Seluruh pesanan masuk</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#090E17]/90 border border-emerald-500/20 shadow-lg">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
            Disetujui & Aktif (Lunas)
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono">{metrics.lunasCount}</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Customer bisa login</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#090E17]/90 border border-amber-500/40 shadow-lg relative overflow-hidden">
          {metrics.pendingCount > 0 && (
            <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-amber-400 animate-ping m-3" />
          )}
          <div className="text-xs font-mono text-amber-300 uppercase tracking-wider mb-1 font-bold">
            Menunggu Persetujuan
          </div>
          <div className="text-3xl font-black text-amber-400 font-mono">{metrics.pendingCount}</div>
          <div className="text-[11px] text-amber-300/80 mt-1">Perlu disetujui agar customer bisa login</div>
        </div>
      </div>

      {/* ========================================================
          2. TRANSACTIONS TABLE SECTION
          ======================================================== */}
      <div className="p-6 rounded-2xl bg-[#090E17]/90 border border-white/15 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider font-sans">
              Riwayat Transaksi & Persetujuan Akun ({filteredTransactions.length})
            </h2>
          </div>

          {/* Search & Status Filter */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari ID, pembeli, email, CUST..."
                className="pl-8 pr-3 py-1.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-400"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-emerald-400 cursor-pointer font-mono"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Menunggu Persetujuan (Pending)</option>
              <option value="lunas">Disetujui / Lunas</option>
              <option value="ditolak">Ditolak</option>
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-black/50 text-[11px] font-mono uppercase text-slate-400 border-b border-white/10">
              <tr>
                <th className="py-3 px-4">ID Transaksi / Customer</th>
                <th className="py-3 px-4">Pembeli & Kontak</th>
                <th className="py-3 px-4">Paket / Template</th>
                <th className="py-3 px-4">Total Bayar</th>
                <th className="py-3 px-4">Metode</th>
                <th className="py-3 px-4">Status Akun Login</th>
                <th className="py-3 px-4">Waktu</th>
                <th className="py-3 px-4 text-right">Aksi Persetujuan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 font-mono">
                    Tidak ada transaksi yang cocok dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const cust = customers.find((c) => c.id === tx.customerId);
                  const isCustActive = cust?.status === 'active';
                  const isPending = tx.status === 'pending';

                  return (
                    <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4 font-mono whitespace-nowrap">
                        <div className="font-bold text-white">{tx.id}</div>
                        {tx.customerId && (
                          <div className="text-[11px] text-blue-400 font-bold flex items-center gap-1 mt-0.5">
                            <span>ID: {tx.customerId}</span>
                            <span className="text-slate-500 font-normal">PIN: {cust?.accessPin || tx.accessPin || '1234'}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-white">{tx.buyerName}</div>
                        <div className="text-[11px] font-mono text-slate-400">{tx.buyerEmail}</div>
                        <div className="text-[10px] font-mono text-slate-500">{tx.buyerWhatsapp}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-white font-medium">{tx.packageName}</div>
                        <div className="text-[11px] font-mono text-purple-300">{tx.templateName}</div>
                      </td>
                      <td className="py-3 px-4 font-mono font-black text-amber-300 whitespace-nowrap">
                        Rp {(tx.amount || 0).toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-300 whitespace-nowrap">
                        {tx.paymentMethod}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {tx.status === 'lunas' || isCustActive ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-mono font-bold uppercase">
                              <Check className="w-3 h-3" />
                              <span>DISETUJUI (AKTIF)</span>
                            </span>
                            <div className="text-[10px] font-mono text-emerald-400">✓ Bisa Login ke Editor</div>
                          </div>
                        ) : tx.status === 'ditolak' ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-300 text-[10px] font-mono font-bold uppercase">
                              <Trash2 className="w-3 h-3" />
                              <span>DITOLAK</span>
                            </span>
                            <div className="text-[10px] font-mono text-rose-400">❌ Akses Ditolak</div>
                          </div>
                        ) : (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-[10px] font-mono font-bold uppercase animate-pulse">
                              <Clock className="w-3 h-3" />
                              <span>MENUNGGU PERSETUJUAN</span>
                            </span>
                            <div className="text-[10px] font-mono text-amber-400/90">⏳ Belum Bisa Login</div>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                        {tx.createdAt}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {isPending && (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  verifyPayment(tx.id);
                                  triggerToast(`Akun ${tx.buyerName} (${tx.customerId}) BERHASIL DISETUJUI! Customer sekarang sudah bisa login.`);
                                }}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-[11px] font-bold transition-all shadow-md cursor-pointer hover:scale-105"
                                title="Setujui Pembayaran & Aktifkan Login Customer"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                                <span>Setujui & Aktifkan</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Tolak transaksi #${tx.id}? Customer tidak akan dapat login.`)) {
                                    rejectPayment(tx.id);
                                    triggerToast(`Transaksi #${tx.id} ditolak.`);
                                  }
                                }}
                                className="px-2 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-500/30 text-rose-300 hover:text-white text-[11px] font-bold transition-all cursor-pointer"
                                title="Tolak Transaksi"
                              >
                                Tolak
                              </button>
                            </>
                          )}

                          {/* WhatsApp Notification Button */}
                          <button
                            type="button"
                            onClick={() => handleSendApprovalWA(tx, cust)}
                            className="p-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-800 border border-emerald-500/30 text-emerald-300 hover:text-white transition-all cursor-pointer"
                            title="Kirim Notifikasi Login ke WhatsApp Pembeli"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>

                          {tx.customerId && (
                            <Link
                              to={`/editor/${tx.customerId}`}
                              target="_blank"
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-all"
                              title="Buka Editor Customer"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Hapus catatan transaksi #${tx.id}?`)) {
                                deleteTransaction(tx.id);
                                triggerToast(`Transaksi #${tx.id} telah dihapus.`);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900 text-rose-300 hover:text-white transition-all cursor-pointer"
                            title="Hapus Transaksi"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================
          3. MASTER PAYMENT GATEWAY CONFIGURATION
          ======================================================== */}
      <div className="p-6 rounded-2xl bg-[#090E17]/90 border border-white/15 shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
                Pengaturan Rekening Bank & QRIS Admin Master
              </h3>
              <span className="text-[10.5px] font-mono text-slate-400">
                Informasi rekening ini akan tampil pada formulir checkout pembeli
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {settingsForm.bankAccounts.map((acc, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-[#060B12] border border-slate-700 space-y-2.5"
              >
                <div className="text-xs font-bold text-amber-300 font-sans">{acc.bank}</div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-0.5">Nomor Rekening</label>
                  <input
                    type="text"
                    value={acc.accountNumber}
                    onChange={(e) => {
                      const updated = [...settingsForm.bankAccounts];
                      updated[index].accountNumber = e.target.value;
                      setSettingsForm({ ...settingsForm, bankAccounts: updated });
                    }}
                    className="w-full px-3 py-1.5 rounded-lg bg-black border border-slate-700 text-xs text-white font-mono outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-0.5">Atas Nama (Owner)</label>
                  <input
                    type="text"
                    value={acc.accountName}
                    onChange={(e) => {
                      const updated = [...settingsForm.bankAccounts];
                      updated[index].accountName = e.target.value;
                      setSettingsForm({ ...settingsForm, bankAccounts: updated });
                    }}
                    className="w-full px-3 py-1.5 rounded-lg bg-black border border-slate-700 text-xs text-white font-mono outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                No. WhatsApp Penerima Order (Format: 62859...)
              </label>
              <input
                type="text"
                value={settingsForm.whatsappNumber}
                onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white font-mono outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                URL Gambar / Data QRIS Code
              </label>
              <input
                type="text"
                value={settingsForm.qrisUrl}
                onChange={(e) => setSettingsForm({ ...settingsForm, qrisUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white font-mono outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-white/10">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-xs font-bold text-white shadow-lg cursor-pointer transition-all hover:scale-105"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Pengaturan Pembayaran</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
