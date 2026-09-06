import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserPlus, Copy, CheckCircle2 } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export default function CustomersPlaceholder() {
  const { customers, addCustomer, toggleCustomerStatus } = usePortfolio();
  const [copiedId, setCopiedId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCust, setNewCust] = useState({ name: '', email: '', jobTitle: '', whatsapp: '' });

  const handleCopyLink = (cust) => {
    const editorUrl = `${window.location.origin}/editor/${cust.id}`;
    navigator.clipboard.writeText(editorUrl);
    setCopiedId(cust.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newCust.name) return;
    addCustomer(newCust);
    setNewCust({ name: '', email: '', jobTitle: '', whatsapp: '' });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-950/80 border border-blue-500/40 text-blue-300 text-xs font-mono font-bold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>CUSTOMER MANAGEMENT • MULTI-TENANT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-sans">
            Daftar Pelanggan Template
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Kelola pelanggan, terbitkan link editor terisolasi, dan pantau status aktif portfolio pelanggan.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 border border-blue-400/50 text-xs font-bold text-white transition-all shadow-md cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Customer Baru</span>
        </button>
      </div>

      {/* Customer List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {customers.map((c) => (
          <div
            key={c.id}
            className="p-5 rounded-2xl bg-[#090E17]/90 border border-white/15 shadow-xl space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-rose-400 bg-rose-950/80 border border-rose-500/40 px-2 py-0.5 rounded">
                  {c.id}
                </span>
                <button
                  type="button"
                  onClick={() => toggleCustomerStatus(c.id)}
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase transition-all cursor-pointer ${
                    c.status === 'active'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                      : 'bg-slate-700/40 text-slate-400 border border-slate-600'
                  }`}
                >
                  {c.status} (Klik Toggle)
                </button>
              </div>

              <h3 className="text-base font-bold text-white font-sans">{c.name}</h3>
              <div className="text-xs text-slate-300 font-medium">{c.profile?.jobTitle || '-'}</div>
              <div className="text-[11px] font-mono text-slate-400 mt-1">{c.email}</div>
            </div>

            <div className="space-y-2 pt-3 border-t border-white/10">
              <div className="text-[10.5px] font-mono text-slate-400 truncate">
                Editor Link: <code>/editor/{c.id}</code>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyLink(c)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white/5 hover:bg-white/15 border border-white/15 text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer"
                >
                  {copiedId === c.id ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Link Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-rose-400" />
                      <span>Copy Editor Link</span>
                    </>
                  )}
                </button>
                <Link
                  to={`/editor/${c.id}`}
                  className="px-3 py-2 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-500/30 text-rose-200 hover:text-white text-xs font-semibold transition-all"
                >
                  Buka Editor
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md p-6 rounded-2xl bg-[#090E17] border border-white/20 shadow-2xl text-white space-y-4">
            <h3 className="text-base font-bold uppercase tracking-wider font-sans">
              Tambah Pelanggan Baru
            </h3>
            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={newCust.name}
                  onChange={(e) => setNewCust({ ...newCust, name: e.target.value })}
                  placeholder="Contoh: Rudi Hermawan"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Profesi / Jabatan</label>
                <input
                  type="text"
                  value={newCust.jobTitle}
                  onChange={(e) => setNewCust({ ...newCust, jobTitle: e.target.value })}
                  placeholder="Contoh: Electrical Engineer"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Email</label>
                <input
                  type="email"
                  value={newCust.email}
                  onChange={(e) => setNewCust({ ...newCust, email: e.target.value })}
                  placeholder="rudi@example.com"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-blue-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-md"
                >
                  Simpan Pelanggan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
