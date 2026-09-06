import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  Lock,
  Unlock,
  ShieldCheck,
  Sparkles,
  Plus,
  Trash2,
  Star,
  Check,
  Palette,
  Copy,
  Edit2,
  Users,
  Monitor,
  Search,
  ExternalLink,
  History,
  Tag,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import LivePreviewModal from '../components/LivePreviewModal';

export default function AdminTemplate() {
  const {
    templates,
    customers,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    setDefaultTemplate,
    duplicateTemplate,
    migrateCustomerTemplate,
  } = usePortfolio();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [migratingTemplate, setMigratingTemplate] = useState(null);
  const [selectedCustomerIdForMigration, setSelectedCustomerIdForMigration] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [saveToast, setSaveToast] = useState('');

  // Form State for Add Template
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    version: 'V1.3',
    edition: 'Custom Engineering Edition',
    category: 'Engineering & Industrial',
    price: 499000,
    themeAccent: 'Dark Red Metal & Gold Accent',
    badgeColor: 'bg-rose-950 text-rose-300 border-rose-500/40',
    description: '',
    featuresText: '3D Lanyard ID Card, 192-Frame Canvas Engine, 3D Orbit Carousel, WhatsApp Direct Chat',
    isDefault: false,
    status: 'active',
  });

  const triggerToast = (msg) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(''), 3000);
  };

  // Metrics
  const metrics = useMemo(() => {
    const total = templates.length;
    const active = templates.filter((t) => t.status === 'active').length;
    const defaultTmpl = templates.find((t) => t.isDefault) || templates[0];
    const totalCustomerUsing = customers.length;
    return { total, active, defaultName: defaultTmpl?.name, totalCustomerUsing };
  }, [templates, customers]);

  // Filtered Templates
  const filteredTemplates = useMemo(() => {
    return templates.filter((tmpl) => {
      const matchSearch =
        tmpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tmpl.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tmpl.version && tmpl.version.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (tmpl.category && tmpl.category.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCat = categoryFilter === 'all' || tmpl.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [templates, searchQuery, categoryFilter]);

  // Categories List
  const categoriesList = useMemo(() => {
    const cats = new Set(templates.map((t) => t.category).filter(Boolean));
    return ['all', ...Array.from(cats)];
  }, [templates]);

  // Handlers
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newTemplate.name) return;

    const featuresArray = newTemplate.featuresText
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);

    await addTemplate({
      name: newTemplate.name,
      version: newTemplate.version,
      edition: newTemplate.edition,
      category: newTemplate.category,
      price: Number(newTemplate.price) || 499000,
      themeAccent: newTemplate.themeAccent,
      badgeColor: newTemplate.badgeColor,
      description: newTemplate.description || 'Varian template portofolio interaktif baru siap jual.',
      isDefault: newTemplate.isDefault,
      status: newTemplate.status,
      features: featuresArray.length > 0 ? featuresArray : ['Responsive Layout', '3D ID Card'],
    });

    setNewTemplate({
      name: '',
      version: `V1.${templates.length + 1}`,
      edition: 'Custom Engineering Edition',
      category: 'Engineering & Industrial',
      price: 499000,
      themeAccent: 'Dark Red Metal & Gold Accent',
      badgeColor: 'bg-rose-950 text-rose-300 border-rose-500/40',
      description: '',
      featuresText: '3D Lanyard ID Card, 192-Frame Canvas Engine, 3D Orbit Carousel, WhatsApp Direct Chat',
      isDefault: false,
      status: 'active',
    });

    setShowAddModal(false);
    triggerToast('Template baru berhasil dirilis ke katalog!');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingTemplate) return;

    const featuresArray = typeof editingTemplate.features === 'string'
      ? editingTemplate.features.split(',').map((f) => f.trim()).filter(Boolean)
      : editingTemplate.features;

    await updateTemplate(editingTemplate.id, {
      name: editingTemplate.name,
      version: editingTemplate.version,
      edition: editingTemplate.edition,
      category: editingTemplate.category,
      price: Number(editingTemplate.price) || 499000,
      themeAccent: editingTemplate.themeAccent,
      description: editingTemplate.description,
      features: featuresArray,
      status: editingTemplate.status,
    });

    setEditingTemplate(null);
    triggerToast(`Perubahan template ${editingTemplate.name} berhasil disimpan!`);
  };

  const handleDuplicate = async (tmplId) => {
    const cloned = await duplicateTemplate(tmplId);
    if (cloned) {
      triggerToast(`Template berhasil diduplikasi ke versi baru: ${cloned.version}!`);
    }
  };

  const handleMigrateSubmit = async (e) => {
    e.preventDefault();
    if (!migratingTemplate || !selectedCustomerIdForMigration) return;

    await migrateCustomerTemplate(selectedCustomerIdForMigration, migratingTemplate.id);
    const targetCustomer = customers.find((c) => c.id === selectedCustomerIdForMigration);
    triggerToast(`Customer ${targetCustomer?.name} berhasil dimigrasikan ke ${migratingTemplate.name}!`);
    setMigratingTemplate(null);
    setSelectedCustomerIdForMigration('');
  };

  const lockedComponents = [
    {
      name: 'Layer 0: Dark Red Metal Shaders',
      category: 'Visual Background',
      file: 'DarkRedMetalBackground.jsx',
      desc: 'Background metal merah gelap kode generatif SVG murni dengan radial flare.',
    },
    {
      name: 'Layer 1: Industrial Caution Hazard Tapes',
      category: 'Marquee Animation',
      file: 'Hero.jsx & Contact.jsx',
      desc: 'Pita kuning bergaris hazard hitam tak terputus dengan teks dinamis.',
    },
    {
      name: 'Layer 2: 192-Frame Canvas Cinematic Background',
      category: 'Canvas Engine',
      file: 'ScrollFrameCanvas.jsx',
      desc: 'Engine rendering 192 frame cinematic refinery sequence pada scroll 380vh.',
    },
    {
      name: 'Layer 3: 3D Holographic Orbit Carousel',
      category: '3D Mechanics',
      file: 'About3DCarousel.jsx',
      desc: 'Sistem orbit 3D silindrikal interaktif dengan gestur sentuh (touch-swipe) & physics.',
    },
    {
      name: 'Layer 4: 3D Hanging Lanyard ID Card',
      category: 'Physics Animation',
      file: 'InteractiveIDCard.jsx',
      desc: 'Kartu tanda pengenal 3D elastis yang dapat digeser (drag & spring damping).',
    },
    {
      name: 'Typography & Tailwind v4 Palette',
      category: 'Design System',
      file: 'index.css',
      desc: 'Kombinasi tipografi Plus Jakarta Sans, Inter, Bebas Neue, Oswald, dan JetBrains Mono.',
    },
  ];

  const editableSlots = [
    { title: 'Biodata & Hero Profile', items: ['Nama Lengkap', 'Jabatan / Profesi', 'Bio Singkat', 'Foto Potret Profil'] },
    { title: 'Technical Skills Array', items: ['Nama Skill', 'Kategori Keahlian', 'Tingkat Kemahiran', 'Urutan Tampil'] },
    { title: 'Project Showcase Catalog', items: ['Judul Projek', 'Kategori & Tipe', 'Foto Cover Mockup', '3 Tahap Rekayasa', 'Link Live Website'] },
    { title: 'Certificates & Credentials', items: ['Nama Sertifikat', 'Lembaga Penerbit', 'Tahun', 'Link Bukti Kredensial'] },
    { title: 'Curriculum Vitae (CV)', items: ['Upload File PDF', 'Ganti / Hapus CV', 'Tautan Download CV'] },
    { title: 'Social Media Links', items: ['WhatsApp', 'Instagram', 'LinkedIn', 'Email Kontak', 'TikTok / YouTube'] },
  ];

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
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-400/40 text-amber-300 text-xs font-mono font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>KATALOG & MANAJEMEN TEMPLATE MASTER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-sans">
            Koleksi Template Portofolio Siap Jual
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
            Anda dapat <strong>menambahkan varian template baru kapan saja</strong>, menduplikasi versi (branching), mengatur template default, memigrasikan pelanggan, serta menguji tampilan multi-device.
          </p>
        </div>

        {/* Action: Add New Template Button */}
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-rose-700 to-rose-900 hover:from-amber-500 hover:to-rose-800 border border-amber-400/50 text-xs font-bold text-white transition-all shadow-lg shadow-rose-950/40 cursor-pointer shrink-0 hover:scale-105"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>+ Rilis Template Versi Baru</span>
        </button>
      </div>

      {/* ========================================================
          1. METRICS OVERVIEW CARDS
          ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#090E17]/90 border border-white/10 shadow-lg">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
            Total Edisi Template
          </div>
          <div className="text-3xl font-black text-white font-mono">{metrics.total}</div>
          <div className="text-[11px] text-amber-400 mt-1">Tersedia di sistem</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#090E17]/90 border border-white/10 shadow-lg">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
            Template Aktif
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono">{metrics.active}</div>
          <div className="text-[11px] text-slate-400 mt-1">Siap dijual ke pembeli</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#090E17]/90 border border-white/10 shadow-lg">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
            Template Default Master
          </div>
          <div className="text-sm font-bold text-white truncate font-sans">{metrics.defaultName}</div>
          <div className="text-[11px] text-emerald-400 mt-1">Otomatis untuk customer baru</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#090E17]/90 border border-white/10 shadow-lg">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
            Lisensi Pelanggan Terpasang
          </div>
          <div className="text-3xl font-black text-purple-400 font-mono">{metrics.totalCustomerUsing}</div>
          <div className="text-[11px] text-slate-400 mt-1">Portofolio aktif terhubung</div>
        </div>
      </div>

      {/* ========================================================
          2. SEARCH & CATEGORY FILTERS
          ======================================================== */}
      <div className="p-4 rounded-2xl bg-[#090E17]/80 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama template, versi (V1.0), kategori, ID..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 custom-scrollbar">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-amber-600 text-white border border-amber-400 shadow-md'
                  : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              {cat === 'all' ? 'Semua Kategori' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================
          3. TEMPLATES CATALOG GRID
          ======================================================== */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider font-sans">
              Daftar Edisi Template ({filteredTemplates.length} Ditemukan)
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Database Master Synchronized
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((tmpl) => {
            const customerCount = customers.filter((c) => c.templateId === tmpl.id).length;

            return (
              <motion.div
                key={tmpl.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className={`relative rounded-2xl p-5 sm:p-6 flex flex-col justify-between overflow-hidden shadow-xl transition-all ${
                  tmpl.isDefault
                    ? 'bg-gradient-to-b from-[#240812] via-[#14030A] to-[#0A0407] border-2 border-amber-500/80 shadow-[0_0_30px_rgba(245,158,11,0.2)]'
                    : 'bg-[#090E17]/90 border border-white/15 hover:border-white/30'
                }`}
              >
                <div>
                  {/* Top Badge: Version, ID & Default Status */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono font-black text-rose-300 bg-rose-950/80 border border-rose-500/40 px-2 py-0.5 rounded">
                        {tmpl.version}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                        {tmpl.id}
                      </span>
                    </div>

                    {tmpl.isDefault ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-[10px] font-mono font-bold uppercase">
                        <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                        <span>MASTER DEFAULT</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                        {tmpl.category}
                      </span>
                    )}
                  </div>

                  {/* Template Title & Price */}
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-lg font-black text-white font-sans uppercase tracking-tight">
                      {tmpl.name}
                    </h3>
                    <div className="text-xs font-mono font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40 shrink-0">
                      Rp {(tmpl.price || 499000).toLocaleString('id-ID')}
                    </div>
                  </div>

                  <div className="text-xs text-rose-300 font-mono font-medium mb-3">
                    {tmpl.edition}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-3">
                    {tmpl.description}
                  </p>

                  {/* Theme Accent Badge & Customer Usage */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/50 border border-white/10 text-[11px] font-mono text-slate-300 truncate">
                      <Palette className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{tmpl.themeAccent}</span>
                    </div>

                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-950/60 border border-purple-500/30 text-[11px] font-mono text-purple-300 shrink-0">
                      <Users className="w-3 h-3" />
                      <span>{customerCount} Pelanggan</span>
                    </div>
                  </div>

                  {/* Feature Pills */}
                  <div className="space-y-1.5 pt-3 border-t border-white/10 mb-4">
                    <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                      Fitur Unggulan:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {tmpl.features?.map((f, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-300 font-medium"
                        >
                          ✓ {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons Grid */}
                <div className="space-y-2 pt-3 border-t border-white/10">
                  {/* Row 1: Live Preview & Clone Duplicate */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewTemplate(tmpl)}
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-xs font-bold text-purple-200 hover:text-white transition-all cursor-pointer shadow-md"
                    >
                      <Monitor className="w-3.5 h-3.5 text-purple-400" />
                      <span>Live Preview</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDuplicate(tmpl.id)}
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-950/80 hover:bg-blue-900 border border-blue-500/40 text-xs font-bold text-blue-200 hover:text-white transition-all cursor-pointer shadow-md"
                      title="Kloning template untuk rilis versi baru"
                    >
                      <Copy className="w-3.5 h-3.5 text-blue-400" />
                      <span>Duplikasi</span>
                    </button>
                  </div>

                  {/* Row 2: Edit, Migrate Customer & Set Default */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setEditingTemplate({
                          ...tmpl,
                          features: Array.isArray(tmpl.features) ? tmpl.features.join(', ') : tmpl.features,
                        })
                      }
                      className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/15 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3 text-slate-400" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMigratingTemplate(tmpl)}
                      className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/15 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
                      title="Pindahkan customer ke template ini"
                    >
                      <RefreshCw className="w-3 h-3 text-emerald-400" />
                      <span>Migrasi</span>
                    </button>

                    {!tmpl.isDefault && (
                      <button
                        type="button"
                        onClick={() => {
                          setDefaultTemplate(tmpl.id);
                          triggerToast(`Template ${tmpl.name} sekarang menjadi default master!`);
                        }}
                        className="p-2 rounded-xl bg-white/5 hover:bg-amber-500/20 border border-white/15 hover:border-amber-400/40 text-slate-300 hover:text-amber-300 transition-all cursor-pointer"
                        title="Jadikan Template Default"
                      >
                        <Star className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {!tmpl.isDefault && (
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Hapus template ${tmpl.name}?`)) {
                            deleteTemplate(tmpl.id);
                            triggerToast(`Template ${tmpl.name} telah dihapus.`);
                          }
                        }}
                        className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900 border border-rose-500/30 text-rose-300 hover:text-white transition-all cursor-pointer"
                        title="Hapus Template"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          4. CHANGELOG & VERSION HISTORY TIMELINE
          ======================================================== */}
      <div className="p-6 rounded-2xl bg-[#090E17]/90 border border-white/15 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-950/80 border border-blue-500/40 flex items-center justify-center text-blue-300">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
                Riwayat Versi & Roadmap Rilis Template
              </h3>
              <span className="text-[10.5px] font-mono text-slate-400">
                Log pembaruan arsitektur template portofolio
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-950 border border-blue-500/40 text-blue-300">
            {templates.length} Versi Terdaftar
          </span>
        </div>

        <div className="space-y-3">
          {templates.map((tmpl) => (
            <div
              key={tmpl.id}
              className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
                    {tmpl.version}
                  </span>
                  <span className="text-xs font-bold text-white">{tmpl.name}</span>
                  <span className="text-[11px] font-mono text-slate-400">({tmpl.edition})</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  {tmpl.description}
                </div>
              </div>
              <div className="text-[10px] font-mono text-slate-400 shrink-0">
                Rilis: {tmpl.createdAt || '2026-03-01'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          5. LOCKED VS EDITABLE GUARDRAIL REFERENCE
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Locked Design Elements */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#090E17]/90 border border-rose-500/30 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-950/80 border border-rose-500/40 flex items-center justify-center text-rose-300">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
                  Bagian Template yang Dikunci (Immutable)
                </h3>
                <span className="text-[10.5px] font-mono text-rose-300">
                  Customer DILARANG Mengubah Bagian Ini
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-950 border border-rose-500/40 text-rose-300">
              6 Komponen Inti
            </span>
          </div>

          <div className="space-y-3">
            {lockedComponents.map((comp, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>{comp.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{comp.desc}</p>
                </div>
                <span className="text-[9.5px] font-mono text-slate-400 px-2 py-1 rounded bg-black/40 border border-white/10 shrink-0 self-start sm:self-auto">
                  {comp.file}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Editable Content Slots */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#090E17]/90 border border-emerald-500/30 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                <Unlock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
                  Slot Konten yang Boleh Diubah
                </h3>
                <span className="text-[10.5px] font-mono text-emerald-300">
                  Data yang Dapat Dikustomisasi Customer
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {editableSlots.map((slot, i) => (
              <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/10 space-y-1.5">
                <div className="text-xs font-bold text-emerald-300 font-mono">
                  • {slot.title}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {slot.items.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10.5px] text-slate-300 font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================
          MODAL 1: ADD NEW TEMPLATE
          ======================================================== */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="relative w-full max-w-lg p-6 sm:p-7 rounded-2xl bg-[#090E17] border-2 border-amber-500/40 shadow-2xl text-white space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h3 className="text-base font-bold uppercase tracking-wider font-sans">
                    Rilis Template Portofolio Baru
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Nama Template *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                    placeholder="Contoh: Dark Crimson Apex"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">
                      Versi *
                    </label>
                    <input
                      type="text"
                      required
                      value={newTemplate.version}
                      onChange={(e) => setNewTemplate({ ...newTemplate, version: e.target.value })}
                      placeholder="V2.0"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">
                      Harga Lisensi (Rp)
                    </label>
                    <input
                      type="number"
                      value={newTemplate.price}
                      onChange={(e) => setNewTemplate({ ...newTemplate, price: e.target.value })}
                      placeholder="499000"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">
                      Kategori
                    </label>
                    <input
                      type="text"
                      value={newTemplate.category}
                      onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                      placeholder="Engineering"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Edisi / Sub-Judul
                  </label>
                  <input
                    type="text"
                    value={newTemplate.edition}
                    onChange={(e) => setNewTemplate({ ...newTemplate, edition: e.target.value })}
                    placeholder="Contoh: Heavy Industrial Pro Edition"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Kombinasi Warna & Aksen
                  </label>
                  <input
                    type="text"
                    value={newTemplate.themeAccent}
                    onChange={(e) => setNewTemplate({ ...newTemplate, themeAccent: e.target.value })}
                    placeholder="Contoh: Dark Red Metal & Gold Amber"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Deskripsi Template
                  </label>
                  <textarea
                    rows={3}
                    value={newTemplate.description}
                    onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                    placeholder="Deskripsi keunggulan arsitektur dan target pembeli..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-amber-400 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Fitur Utama (Pisahkan koma)
                  </label>
                  <input
                    type="text"
                    value={newTemplate.featuresText}
                    onChange={(e) => setNewTemplate({ ...newTemplate, featuresText: e.target.value })}
                    placeholder="3D ID Card, Canvas Scroll, WhatsApp Chat"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isDefCheck"
                    checked={newTemplate.isDefault}
                    onChange={(e) => setNewTemplate({ ...newTemplate, isDefault: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 cursor-pointer"
                  />
                  <label htmlFor="isDefCheck" className="text-xs text-slate-300 cursor-pointer">
                    Jadikan template default untuk pembeli baru
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-300 transition-all cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-rose-700 to-rose-900 hover:from-amber-500 hover:to-rose-800 text-xs font-bold text-white shadow-lg cursor-pointer transition-all"
                  >
                    Rilis Template
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================
          MODAL 2: EDIT TEMPLATE
          ======================================================== */}
      <AnimatePresence>
        {editingTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="relative w-full max-w-lg p-6 sm:p-7 rounded-2xl bg-[#090E17] border-2 border-blue-500/40 shadow-2xl text-white space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-blue-400" />
                  <h3 className="text-base font-bold uppercase tracking-wider font-sans">
                    Edit Template: {editingTemplate.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingTemplate(null)}
                  className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Nama Template *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingTemplate.name}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-blue-400"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">
                      Versi *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingTemplate.version}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, version: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-blue-400 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">
                      Harga (Rp)
                    </label>
                    <input
                      type="number"
                      value={editingTemplate.price || 499000}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, price: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-blue-400 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">
                      Kategori
                    </label>
                    <input
                      type="text"
                      value={editingTemplate.category}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-blue-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Edisi / Sub-Judul
                  </label>
                  <input
                    type="text"
                    value={editingTemplate.edition}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, edition: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Deskripsi
                  </label>
                  <textarea
                    rows={3}
                    value={editingTemplate.description}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-blue-400 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Fitur (Pisahkan koma)
                  </label>
                  <input
                    type="text"
                    value={editingTemplate.features}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, features: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-blue-400"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setEditingTemplate(null)}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-300 transition-all cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-lg cursor-pointer transition-all"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================
          MODAL 3: MIGRATE CUSTOMER TO TEMPLATE
          ======================================================== */}
      <AnimatePresence>
        {migratingTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="relative w-full max-w-md p-6 sm:p-7 rounded-2xl bg-[#090E17] border-2 border-emerald-500/40 shadow-2xl text-white space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-base font-bold uppercase tracking-wider font-sans">
                    Migrasikan Pelanggan
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setMigratingTemplate(null)}
                  className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Pilih pelanggan yang ingin Anda upgrade / alihkan ke template <strong>{migratingTemplate.name} ({migratingTemplate.version})</strong>.
              </p>

              <form onSubmit={handleMigrateSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Pilih Pelanggan Target *
                  </label>
                  <select
                    required
                    value={selectedCustomerIdForMigration}
                    onChange={(e) => setSelectedCustomerIdForMigration(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-emerald-400"
                  >
                    <option value="">-- Pilih Customer --</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.id}) • Saat ini: {templates.find((t) => t.id === c.templateId)?.name || 'Default'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 font-mono space-y-1">
                  <div>✓ Konten & karya pelanggan tetap aman.</div>
                  <div>✓ Template layout & styling akan otomatis diperbarui.</div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setMigratingTemplate(null)}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-300 transition-all cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg cursor-pointer transition-all"
                  >
                    Terapkan Migrasi
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================
          MODAL 4: MULTI-DEVICE LIVE PREVIEW MODAL
          ======================================================== */}
      {previewTemplate && (
        <LivePreviewModal
          isOpen={!!previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          previewUrl={`${window.location.origin}/`}
          title={`Live Simulator: ${previewTemplate.name} (${previewTemplate.version})`}
          isPublished={true}
        />
      )}
    </div>
  );
}
