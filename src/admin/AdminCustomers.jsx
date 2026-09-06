import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserPlus,
  Copy,
  CheckCircle2,
  Search,
  Trash2,
  RotateCcw,
  Globe,
  Check,
  AlertCircle,
  Monitor,
  Lock,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import LivePreviewModal from '../components/LivePreviewModal';

export default function AdminCustomers() {
  const {
    customers,
    templates,
    addCustomer,
    deleteCustomer,
    toggleCustomerStatus,
    approveCustomerDirectly,
    resetCustomerData,
    togglePublishCustomer,
  } = usePortfolio();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [templateFilter, setTemplateFilter] = useState('all');
  const [copiedLink, setCopiedLink] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [previewCustomer, setPreviewCustomer] = useState(null);

  // Form State
  const [newCust, setNewCust] = useState({
    name: '',
    jobTitle: '',
    email: '',
    whatsapp: '',
    slug: '',
    templateId: templates[0]?.id || 'TMPL-001',
    accessPin: '1234',
    status: 'active',
  });

  // Calculate Statistics
  const stats = useMemo(() => {
    const total = customers.length;
    const active = customers.filter((c) => c.status === 'active').length;
    const pending = customers.filter((c) => c.status === 'pending').length;
    const inactive = total - active - pending;
    return { total, active, pending, inactive };
  }, [customers]);

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((cust) => {
      const matchSearch =
        cust.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cust.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cust.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cust.slug && cust.slug.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && cust.status === 'active') ||
        (statusFilter === 'pending' && cust.status === 'pending') ||
        (statusFilter === 'inactive' && cust.status !== 'active' && cust.status !== 'pending');

      const matchTemplate =
        templateFilter === 'all' || cust.templateId === templateFilter;

      return matchSearch && matchStatus && matchTemplate;
    });
  }, [customers, searchQuery, statusFilter, templateFilter]);

  const handleCopyLink = (text, type, custId) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(`${type}-${custId}`);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newCust.name) return;

    await addCustomer({
      name: newCust.name,
      jobTitle: newCust.jobTitle || 'Professional Engineer',
      email: newCust.email,
      whatsapp: newCust.whatsapp,
      slug: newCust.slug,
      templateId: newCust.templateId,
      accessPin: newCust.accessPin || '1234',
      status: newCust.status || 'active',
    });

    setNewCust({
      name: '',
      jobTitle: '',
      email: '',
      whatsapp: '',
      slug: '',
      templateId: templates[0]?.id || 'TMPL-001',
      accessPin: '1234',
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-950/80 border border-blue-500/40 text-blue-300 text-xs font-mono font-bold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>CUSTOMER MANAGEMENT • MULTI-TENANT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-sans">
            Manajemen Pelanggan & Lisensi Template
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
            Kelola pembeli template portofolio, terbitkan link editor terisolasi, tetapkan paket template, dan kontrol status aktif.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-rose-700 hover:from-blue-500 hover:to-rose-600 border border-blue-400/50 text-xs font-bold text-white transition-all shadow-lg shadow-blue-950/50 cursor-pointer shrink-0 hover:scale-105"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Customer Baru</span>
        </button>
      </div>

      {/* ========================================================
          1. STATS OVERVIEW CARDS
          ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#090E17]/90 border border-white/15 shadow-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-slate-400">Total Customer</div>
            <div className="text-2xl font-black text-white font-mono mt-1">{stats.total} Akun</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-500/40 flex items-center justify-center text-blue-300">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#090E17]/90 border border-emerald-500/30 shadow-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-slate-400">Customer Aktif</div>
            <div className="text-2xl font-black text-emerald-400 font-mono mt-1">{stats.active} Aktif</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#090E17]/90 border border-amber-500/40 shadow-xl flex items-center justify-between relative overflow-hidden">
          {stats.pending > 0 && (
            <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-amber-400 animate-ping m-3" />
          )}
          <div>
            <div className="text-xs font-mono text-amber-300 font-bold">Menunggu Persetujuan</div>
            <div className="text-2xl font-black text-amber-400 font-mono mt-1">{stats.pending} Pending</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-300">
            <Lock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#090E17]/90 border border-rose-500/30 shadow-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-slate-400">Customer Nonaktif</div>
            <div className="text-2xl font-black text-rose-400 font-mono mt-1">{stats.inactive} Non-Aktif</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-500/40 flex items-center justify-center text-rose-300">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ========================================================
          2. SEARCH & FILTER TOOLBAR
          ======================================================== */}
      <div className="p-4 rounded-2xl bg-[#090E17]/90 border border-white/15 shadow-xl flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, ID, email, slug..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-blue-400 font-mono"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-slate-200 outline-none focus:border-blue-400 font-mono cursor-pointer"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif (Bisa Login)</option>
            <option value="pending">Menunggu Persetujuan (Pending)</option>
            <option value="inactive">Nonaktif</option>
          </select>

          {/* Template Filter */}
          <select
            value={templateFilter}
            onChange={(e) => setTemplateFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-slate-200 outline-none focus:border-blue-400 font-mono cursor-pointer"
          >
            <option value="all">Semua Template</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.version})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ========================================================
          3. CUSTOMER CARDS GRID
          ======================================================== */}
      {filteredCustomers.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#090E17]/60 border border-white/10 space-y-3">
          <Users className="w-8 h-8 text-slate-500 mx-auto" />
          <div className="text-sm font-bold text-white">Tidak ada customer yang cocok dengan filter</div>
          <p className="text-xs text-slate-400">Coba ubah kata kunci pencarian atau reset filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCustomers.map((c) => {
            const editorUrl = `${window.location.origin}/editor/${c.id}`;
            const portfolioUrl = `${window.location.origin}/portfolio/${c.slug || c.id}`;
            const assignedTemplate = templates.find((t) => t.id === c.templateId) || templates[0];
            const isPending = c.status === 'pending';

            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-2xl bg-[#090E17]/90 border shadow-xl flex flex-col justify-between space-y-5 transition-all ${
                  isPending
                    ? 'border-amber-500/50 shadow-amber-950/20'
                    : 'border-white/15 hover:border-white/30'
                }`}
              >
                <div>
                  {/* Top Bar: Customer ID & Status Badges */}
                  <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-mono font-black text-blue-300 bg-blue-950/80 border border-blue-500/40 px-2 py-0.5 rounded">
                        {c.id}
                      </span>
                      <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 border border-purple-500/30 px-2 py-0.5 rounded">
                        {assignedTemplate?.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {isPending ? (
                        <button
                          type="button"
                          onClick={() => approveCustomerDirectly(c.id)}
                          className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white shadow-md cursor-pointer transition-all hover:scale-105"
                          title="Klik untuk menyetujui akun dan mengizinkan customer login"
                        >
                          <Check className="w-3 h-3 text-white" />
                          <span>Setujui Akun</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => togglePublishCustomer(c.id)}
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md uppercase transition-all cursor-pointer ${
                            c.isPublished !== false
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900'
                              : 'bg-amber-950/80 text-amber-300 border border-amber-500/40 hover:bg-amber-900'
                          }`}
                          title="Klik untuk ubah status publish"
                        >
                          {c.isPublished !== false ? 'PUBLISHED' : 'DRAFT'}
                        </button>
                      )}

                      {/* Active / Inactive Status */}
                      <button
                        type="button"
                        onClick={() => toggleCustomerStatus(c.id)}
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md uppercase transition-all cursor-pointer ${
                          c.status === 'active'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-400/40 hover:bg-emerald-900'
                            : c.status === 'pending'
                            ? 'bg-amber-950 text-amber-300 border border-amber-500/40 hover:bg-amber-900'
                            : 'bg-rose-950 text-rose-300 border border-rose-500/40 hover:bg-rose-900'
                        }`}
                        title="Klik untuk mengubah status aktif/nonaktif akun"
                      >
                        ● {c.status === 'pending' ? 'MENUNGGU PERSETUJUAN' : c.status}
                      </button>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <h3 className="text-lg font-black text-white font-sans">{c.name}</h3>
                  <div className="text-xs text-slate-300 font-medium">{c.profile?.jobTitle || 'Professional'}</div>
                  <div className="text-[11px] font-mono text-slate-400 mt-1">
                    Email: {c.email || '-'} • PIN: <code className="text-amber-300 font-bold">{c.accessPin || '1234'}</code>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    Slug Publik: <code>/portfolio/{c.slug}</code>
                  </div>
                </div>

                {/* Direct Action Links & 1-Click Copy */}
                <div className="space-y-2.5 pt-4 border-t border-white/10">
                  {/* Action Row: Responsive Preview & Open Live */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewCustomer(c)}
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-xs font-bold text-purple-200 hover:text-white transition-all cursor-pointer"
                    >
                      <Monitor className="w-3.5 h-3.5 text-purple-400" />
                      <span>Preview Device</span>
                    </button>

                    <Link
                      to={`/portfolio/${c.slug || c.id}`}
                      target="_blank"
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/15 text-xs font-semibold text-slate-200 hover:text-white transition-all"
                    >
                      <Globe className="w-3.5 h-3.5 text-blue-400" />
                      <span>Buka Web ↗</span>
                    </Link>
                  </div>

                  {/* Copy Row 1: Editor Link */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyLink(editorUrl, 'editor', c.id)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/15 text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer"
                    >
                      {copiedLink === `editor-${c.id}` ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-mono">Link Editor Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-blue-400" />
                          <span>Copy Link Editor</span>
                        </>
                      )}
                    </button>

                    <Link
                      to={`/editor/${c.id}`}
                      target="_blank"
                      className="px-3 py-2 rounded-xl bg-blue-950/70 hover:bg-blue-900 border border-blue-500/40 text-blue-200 hover:text-white text-xs font-bold transition-all shrink-0"
                    >
                      Editor ↗
                    </Link>
                  </div>

                  {/* Copy Row 2: Portfolio Link */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyLink(portfolioUrl, 'portfolio', c.id)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/15 text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer"
                    >
                      {copiedLink === `portfolio-${c.id}` ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-mono">Link Website Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Globe className="w-3.5 h-3.5 text-purple-400" />
                          <span>Copy Link Portofolio Publik</span>
                        </>
                      )}
                    </button>

                    <Link
                      to={`/portfolio/${c.slug || c.id}`}
                      target="_blank"
                      className="px-3 py-2 rounded-xl bg-purple-950/70 hover:bg-purple-900 border border-purple-500/40 text-purple-200 hover:text-white text-xs font-bold transition-all shrink-0"
                    >
                      Buka Web ↗
                    </Link>
                  </div>

                  {/* Danger Controls: Reset & Delete */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Reset seluruh data ${c.name} kembali ke template awal?`)) {
                          resetCustomerData(c.id);
                        }
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset Data</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Hapus akun ${c.name} (${c.id}) secara permanen?`)) {
                          deleteCustomer(c.id);
                        }
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Hapus Customer</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ========================================================
          4. ADD CUSTOMER MODAL
          ======================================================== */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="relative w-full max-w-lg p-6 sm:p-7 rounded-2xl bg-[#090E17] border-2 border-blue-500/40 shadow-2xl text-white space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-blue-400" />
                  <h3 className="text-base font-bold uppercase tracking-wider font-sans">
                    Daftarkan Customer Baru
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={newCust.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const autoSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                      setNewCust({ ...newCust, name, slug: autoSlug });
                    }}
                    placeholder="Contoh: Rudi Hermawan"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-blue-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Profesi / Jabatan</label>
                    <input
                      type="text"
                      value={newCust.jobTitle}
                      onChange={(e) => setNewCust({ ...newCust, jobTitle: e.target.value })}
                      placeholder="Contoh: Electrical Engineer"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Pilihan Template *</label>
                    <select
                      value={newCust.templateId}
                      onChange={(e) => setNewCust({ ...newCust, templateId: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-blue-400 font-mono"
                    >
                      {templates.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.version})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Email</label>
                    <input
                      type="email"
                      value={newCust.email}
                      onChange={(e) => setNewCust({ ...newCust, email: e.target.value })}
                      placeholder="rudi@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Nomor WhatsApp</label>
                    <input
                      type="text"
                      value={newCust.whatsapp}
                      onChange={(e) => setNewCust({ ...newCust, whatsapp: e.target.value })}
                      placeholder="08123456789"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-blue-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">
                      Kustom Slug URL (otomatis)
                    </label>
                    <input
                      type="text"
                      value={newCust.slug}
                      onChange={(e) => setNewCust({ ...newCust, slug: e.target.value })}
                      placeholder="rudi-hermawan"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-blue-400 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">
                      PIN Akses Editor Customer
                    </label>
                    <input
                      type="text"
                      value={newCust.accessPin}
                      onChange={(e) => setNewCust({ ...newCust, accessPin: e.target.value })}
                      placeholder="1234"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-blue-400 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Status Akun Awal
                  </label>
                  <select
                    value={newCust.status || 'active'}
                    onChange={(e) => setNewCust({ ...newCust, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-blue-400 font-mono cursor-pointer"
                  >
                    <option value="active">Langsung Aktif (Customer Bisa Login)</option>
                    <option value="pending">Menunggu Persetujuan (Pending)</option>
                    <option value="inactive">Nonaktif</option>
                  </select>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 text-[11px] font-mono text-slate-400 space-y-1">
                  <div>• ID Otomatis: <code>CUST-{String(customers.length + 1).padStart(3, '0')}</code></div>
                  <div>• Link Editor: <code>/editor/CUST-{String(customers.length + 1).padStart(3, '0')}</code></div>
                  <div>• Link Portfolio: <code>/portfolio/{newCust.slug || 'user'}</code></div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-300"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-rose-700 hover:from-blue-500 hover:to-rose-600 text-xs font-bold text-white shadow-lg cursor-pointer"
                  >
                    Simpan Customer
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================
          MULTI-DEVICE LIVE PREVIEWER MODAL FOR ANY CUSTOMER
          ======================================================== */}
      {previewCustomer && (
        <LivePreviewModal
          isOpen={!!previewCustomer}
          onClose={() => setPreviewCustomer(null)}
          previewUrl={`${window.location.origin}/portfolio/${previewCustomer.slug || previewCustomer.id}`}
          title={`Preview Portofolio: ${previewCustomer.name}`}
          isPublished={previewCustomer.isPublished !== false}
          onTogglePublish={() => togglePublishCustomer(previewCustomer.id)}
        />
      )}
    </div>
  );
}
