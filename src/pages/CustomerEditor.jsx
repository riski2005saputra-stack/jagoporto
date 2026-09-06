import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  User,
  UserCheck,
  FolderGit2,
  FolderKanban,
  Cpu,
  Award,
  FileText,
  Share2,
  Plus,
  Save,
  Trash2,
  Edit,
  ExternalLink,
  Lock,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Eye,
  Globe,
  Monitor,
  UploadCloud,
  Layers,
  KeyRound,
  Shield,
  Info,
  Phone,
  Mail,
  MapPin,
  Camera,
  Check,
  Filter,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { useAuth } from '../context/AuthContext';
import { LinkedinIcon, InstagramIcon } from '../components/SocialIcons';
import LivePreviewModal from '../components/LivePreviewModal';

export default function CustomerEditor() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const { customers, templates, updateCustomer, togglePublishCustomer } = usePortfolio();
  const { logoutCustomer } = useAuth();

  const foundCustomer = customers.find((c) => c.id === customerId);
  const customer = useMemo(() => {
    if (foundCustomer) return foundCustomer;
    return {
      id: customerId,
      name: `Customer ${customerId}`,
      slug: customerId?.toLowerCase() || 'customer',
      email: '',
      status: 'active',
      templateId: 'TMPL-001',
      accessPin: '1234',
      profile: {
        fullName: `Customer ${customerId}`,
        jobTitle: 'Mechanical & Automation Engineer',
        bio: 'Spesialis perancangan sistem mekanikal presisi, simulasi FEA, dan teknologi modern.',
        email: '',
        whatsapp: '',
        education: 'Sarjana Teknik',
        experienceYears: '3+',
        certCount: '4+',
        isPublished: true,
      },
      skills: [],
      projects: [],
      certificates: [],
      cv: { fileName: 'CV Portfolio.pdf', fileUrl: '' },
      socialMedia: { whatsapp: '', email: '' },
    };
  }, [foundCustomer, customerId]);

  const assignedTemplate = templates.find((t) => t.id === customer?.templateId) || templates[0];

  // Default to Halaman 1 (Hero & ID Card) with safety fallback
  const [activeTab, setActiveTab] = useState('page1');
  const validTabs = ['page1', 'page2', 'page3', 'page4'];
  const currentTab = validTabs.includes(activeTab) ? activeTab : 'page1';
  const [saveToast, setSaveToast] = useState(false);
  const [saveToastMsg, setSaveToastMsg] = useState('Perubahan berhasil disimpan dan langsung aktif di portofolio!');
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Local Form States
  const [profileForm, setProfileForm] = useState(customer?.profile || {});
  const [cvForm, setCvForm] = useState(customer?.cv || {});
  const [socialForm, setSocialForm] = useState(customer?.socialMedia || {});
  const [settingsForm, setSettingsForm] = useState({
    slug: customer?.slug || '',
    pin: customer?.accessPin || customer?.pin || '1234',
    isPublished: customer?.isPublished !== false,
  });

  // Project Modal State
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    category: 'Mechanical Engineer',
    subCategory: '',
    type: 'mechanical',
    liveUrl: '',
    coverImage: '',
    shortDesc: '',
    planning: '',
    analysis: '',
    fabrication: '',
    toolsStr: 'Autodesk Inventor, SolidWorks, FEA',
  });

  // Local Project List for Direct In-Page Editing
  const [projectsListForm, setProjectsListForm] = useState(
    (customer?.projects || []).map((p) => ({
      ...p,
      toolsStr: Array.isArray(p.tools) ? p.tools.join(', ') : (p.toolsStr || ''),
    }))
  );

  // Halaman 2 (About Section) Sub-Tab State
  const [aboutSubTab, setAboutSubTab] = useState('texts');

  // Halaman 3 (Projects Section) Sub-Tab State
  const [projectsSubTab, setProjectsSubTab] = useState('list'); // 'list' | 'header' | 'categories'

  // Skill Modal State
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [editingSkillId, setEditingSkillId] = useState(null);
  const [skillForm, setSkillForm] = useState({ name: '', category: 'Design & Software', level: 'Expert', percent: 95 });

  // Certificate Modal State
  const [showCertModal, setShowCertModal] = useState(false);
  const [editingCertId, setEditingCertId] = useState(null);
  const [certForm, setCertForm] = useState({ title: '', issuer: '', year: '2025', desc: '' });

  useEffect(() => {
    if (foundCustomer) {
      setProfileForm(foundCustomer.profile || {});
      setCvForm(foundCustomer.cv || {});
      setSocialForm(foundCustomer.socialMedia || {});
      setProjectsListForm(
        (foundCustomer.projects || []).map((p) => ({
          ...p,
          toolsStr: Array.isArray(p.tools) ? p.tools.join(', ') : (p.toolsStr || ''),
        }))
      );
      setSettingsForm({
        slug: foundCustomer.slug || '',
        pin: foundCustomer.accessPin || foundCustomer.pin || '1234',
        isPublished: foundCustomer.isPublished !== false,
      });
    }
  }, [foundCustomer]);

  const triggerSaveToast = (msg) => {
    if (msg) setSaveToastMsg(msg);
    else setSaveToastMsg('Perubahan berhasil disimpan dan langsung aktif di portofolio!');
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleImageUpload = (e, callback) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Detect if PNG or WEBP (alpha transparency supported)
    const isPng = file.type === 'image/png' || file.name.toLowerCase().endsWith('.png') || file.type.includes('png');
    const isWebp = file.type === 'image/webp' || file.name.toLowerCase().endsWith('.webp');

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d', { alpha: true });
        
        // Ensure completely clear transparent background before drawing
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Crucial: Use image/png for PNG files so transparent pixels NEVER turn black!
        let dataUrl;
        if (isPng) {
          dataUrl = canvas.toDataURL('image/png');
        } else if (isWebp) {
          dataUrl = canvas.toDataURL('image/webp', 0.88);
        } else {
          dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        }

        callback(dataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // --- Auto-Save Photo Handlers ---
  const handleAvatarChange = (e) => {
    handleImageUpload(e, (dataUrl) => {
      const updatedProfile = {
        ...customer.profile,
        ...profileForm,
        avatarUrl: dataUrl,
        aboutAvatarUrl: profileForm.aboutAvatarUrl || dataUrl,
      };
      setProfileForm(updatedProfile);
      updateCustomer(customer.id, {
        name: updatedProfile.fullName || customer.name,
        profile: updatedProfile,
      });
      triggerSaveToast('✓ Foto ID Card 3D berhasil diunggah & langsung aktif di portofolio!');
    });
  };

  const handleAvatarRemove = () => {
    const updatedProfile = { ...customer.profile, ...profileForm, avatarUrl: '' };
    setProfileForm(updatedProfile);
    updateCustomer(customer.id, { profile: updatedProfile });
    triggerSaveToast('✓ Foto ID Card dihapus');
  };

  const handleHeroPersonChange = (e) => {
    handleImageUpload(e, (dataUrl) => {
      const updatedProfile = {
        ...customer.profile,
        ...profileForm,
        heroPersonUrl: dataUrl,
      };
      setProfileForm(updatedProfile);
      updateCustomer(customer.id, { profile: updatedProfile });
      triggerSaveToast('✓ Foto Orang Layar Utama berhasil diunggah & langsung aktif!');
    });
  };

  const handleHeroPersonRemove = () => {
    const updatedProfile = { ...customer.profile, ...profileForm, heroPersonUrl: '' };
    setProfileForm(updatedProfile);
    updateCustomer(customer.id, { profile: updatedProfile });
    triggerSaveToast('✓ Foto Orang Layar Utama direset ke default');
  };

  const handleAboutAvatarChange = (e) => {
    handleImageUpload(e, (dataUrl) => {
      const updatedProfile = {
        ...customer.profile,
        ...profileForm,
        aboutAvatarUrl: dataUrl,
      };
      setProfileForm(updatedProfile);
      updateCustomer(customer.id, { profile: updatedProfile });
      triggerSaveToast('✓ Foto Potret Halaman 2 berhasil diunggah & langsung aktif!');
    });
  };

  const handleAboutAvatarRemove = () => {
    const updatedProfile = { ...customer.profile, ...profileForm, aboutAvatarUrl: '' };
    setProfileForm(updatedProfile);
    updateCustomer(customer.id, { profile: updatedProfile });
    triggerSaveToast('✓ Foto Potret Halaman 2 direset ke default');
  };

  const handleProjectCoverChange = (index, e) => {
    handleImageUpload(e, (dataUrl) => {
      const updated = projectsListForm.map((proj, i) => {
        if (i === index) {
          let tools = proj.tools;
          if (typeof proj.toolsStr === 'string') {
            tools = proj.toolsStr.split(',').map((t) => t.trim()).filter(Boolean);
          }
          return {
            ...proj,
            coverImage: dataUrl,
            tools: tools || proj.tools || [],
            filterCategory: proj.category || 'Mesin & Industri',
          };
        }
        return proj;
      });
      setProjectsListForm(updated);
      updateCustomer(customer.id, { projects: updated });
      triggerSaveToast(`✓ Foto Projek #${String(index + 1).padStart(2, '0')} berhasil diunggah & tersimpan ke Cloud!`);
    });
  };

  const handleProjectCoverRemove = (index) => {
    const updated = projectsListForm.map((proj, i) => {
      if (i === index) {
        return { ...proj, coverImage: '' };
      }
      return proj;
    });
    setProjectsListForm(updated);
    updateCustomer(customer.id, { projects: updated });
    triggerSaveToast(`✓ Foto Projek #${String(index + 1).padStart(2, '0')} dihapus`);
  };

  const handleCVFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const newCv = {
        fileName: file.name,
        fileUrl: event.target.result,
        fileSize: `${Math.round(file.size / 1024)} KB`,
        lastUpdated: new Date().toISOString().split('T')[0],
      };
      setCvForm(newCv);
      updateCustomer(customer.id, { cv: newCv });
      triggerSaveToast('✓ File CV berhasil diunggah & langsung aktif!');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCVFileRemove = () => {
    const newCv = { fileName: '', fileUrl: '' };
    setCvForm(newCv);
    updateCustomer(customer.id, { cv: newCv });
    triggerSaveToast('✓ File CV dihapus');
  };

  // --- Handlers: Save Sections ---
  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateCustomer(customer.id, {
      name: profileForm.fullName,
      email: profileForm.email,
      profile: { ...customer.profile, ...profileForm },
    });
    triggerSaveToast('✓ Data profil berhasil disimpan ke Cloud!');
  };

  const handleSaveProjectsList = (updatedProjects) => {
    updateCustomer(customer.id, { projects: updatedProjects });
    triggerSaveToast('✓ Daftar projek berhasil disimpan ke Cloud!');
  };

  // --- Handlers: Projects Modal & Categories ---
  const handleOpenAddProject = () => {
    setEditingProjectId(null);
    setProjectForm({
      title: '',
      category: 'Mesin & Industri',
      subCategory: 'Mechanical Engineering',
      type: 'mechanical',
      liveUrl: '',
      coverImage: '',
      shortDesc: '',
      planning: '',
      analysis: '',
      fabrication: '',
      toolsStr: 'Autodesk Inventor, SolidWorks, FEA',
    });
    setShowProjectModal(true);
  };

  const handleOpenEditProject = (proj) => {
    setEditingProjectId(proj.id);
    setProjectForm({
      title: proj.title || '',
      category: proj.category || 'Mesin & Industri',
      subCategory: proj.subCategory || '',
      type: proj.type || 'mechanical',
      liveUrl: proj.liveUrl || '',
      coverImage: proj.coverImage || '',
      shortDesc: proj.shortDesc || '',
      planning: proj.planning || '',
      analysis: proj.analysis || '',
      fabrication: proj.fabrication || '',
      toolsStr: (proj.tools || []).join(', '),
    });
    setShowProjectModal(true);
  };

  const handleSaveProject = (e) => {
    e.preventDefault();
    if (!projectForm.title) return;

    const toolsArray = projectForm.toolsStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const projectPayload = {
      title: projectForm.title,
      category: projectForm.category || 'Mesin & Industri',
      subCategory: projectForm.subCategory,
      filterCategory: projectForm.category || 'Mesin & Industri',
      type: projectForm.type || 'mechanical',
      liveUrl: projectForm.liveUrl,
      coverImage: projectForm.coverImage,
      shortDesc: projectForm.shortDesc,
      planning: projectForm.planning,
      analysis: projectForm.analysis,
      fabrication: projectForm.fabrication,
      tools: toolsArray,
    };

    let updatedProjects = customer.projects || [];
    if (editingProjectId) {
      updatedProjects = updatedProjects.map((p) =>
        p.id === editingProjectId ? { ...p, ...projectPayload } : p
      );
    } else {
      updatedProjects = [
        { id: `proj-c-${Date.now()}`, ...projectPayload },
        ...updatedProjects,
      ];
    }

    handleSaveProjectsList(updatedProjects);
    setShowProjectModal(false);
  };

  const handleUpdateProjectField = (index, field, value) => {
    setProjectsListForm((prev) =>
      prev.map((proj, i) => (i === index ? { ...proj, [field]: value } : proj))
    );
  };

  const handleSaveSingleProjectFromList = (index) => {
    const targetProj = projectsListForm[index];
    if (!targetProj) return;

    let tools = targetProj.tools;
    if (typeof targetProj.toolsStr === 'string') {
      tools = targetProj.toolsStr.split(',').map((t) => t.trim()).filter(Boolean);
    }

    const payload = {
      ...targetProj,
      tools: tools || targetProj.tools || [],
      filterCategory: targetProj.category || 'Mesin & Industri',
    };

    const updated = projectsListForm.map((p, i) => (i === index ? payload : p));
    updateCustomer(customer.id, { projects: updated });
    triggerSaveToast();
  };

  const handleSaveAllProjectsFromList = () => {
    const updated = projectsListForm.map((p) => {
      let tools = p.tools;
      if (typeof p.toolsStr === 'string') {
        tools = p.toolsStr.split(',').map((t) => t.trim()).filter(Boolean);
      }
      return {
        ...p,
        tools: tools || p.tools || [],
        filterCategory: p.category || 'Mesin & Industri',
      };
    });
    updateCustomer(customer.id, { projects: updated });
    triggerSaveToast();
  };

  const handleAddNewDirectProject = () => {
    const newProj = {
      id: `proj-c-${Date.now()}`,
      title: 'Projek Rekayasa Baru',
      category: 'Mesin & Industri',
      subCategory: 'Mechanical Engineering',
      filterCategory: 'Mesin & Industri',
      type: 'mechanical',
      liveUrl: '',
      coverImage: '',
      shortDesc: 'Deskripsi hasil kerja dan implementasi sistem...',
      planning: 'Perancangan 3D CAD & Geometri',
      analysis: 'Simulasi FEA & Uji Teknis',
      fabrication: 'Fabrikasi Presisi & Produksi',
      tools: ['SolidWorks', 'Autodesk Inventor'],
      toolsStr: 'SolidWorks, Autodesk Inventor',
    };
    const updated = [newProj, ...(projectsListForm || [])];
    setProjectsListForm(updated);
    updateCustomer(customer.id, { projects: updated });
    triggerSaveToast();
  };

  const handleDeleteDirectProject = (index) => {
    if (confirm('Hapus projek ini dari portofolio Anda?')) {
      const updated = projectsListForm.filter((_, i) => i !== index);
      setProjectsListForm(updated);
      updateCustomer(customer.id, { projects: updated });
      triggerSaveToast();
    }
  };

  const handleMoveDirectProjectUp = (index) => {
    if (index <= 0) return;
    const list = [...projectsListForm];
    const temp = list[index - 1];
    list[index - 1] = list[index];
    list[index] = temp;
    setProjectsListForm(list);
    updateCustomer(customer.id, { projects: list });
    triggerSaveToast();
  };

  const handleMoveDirectProjectDown = (index) => {
    if (index >= projectsListForm.length - 1) return;
    const list = [...projectsListForm];
    const temp = list[index + 1];
    list[index + 1] = list[index];
    list[index] = temp;
    setProjectsListForm(list);
    updateCustomer(customer.id, { projects: list });
    triggerSaveToast();
  };

  const handleSaveCategories = (categoriesArray) => {
    updateCustomer(customer.id, { projectCategories: categoriesArray });
    triggerSaveToast();
  };

  // --- Handlers: Skills ---
  const handleOpenAddSkill = () => {
    setEditingSkillId(null);
    setSkillForm({ name: '', category: 'Design & Engineering Software', level: 'Expert', percent: 95 });
    setShowSkillModal(true);
  };

  const handleOpenEditSkill = (sk) => {
    setEditingSkillId(sk.id);
    setSkillForm({
      name: sk.name || '',
      category: sk.category || 'Design & Engineering Software',
      level: sk.level || 'Expert',
      percent: typeof sk.percent === 'number' ? sk.percent : (sk.level === 'Expert' ? 95 : 90),
    });
    setShowSkillModal(true);
  };

  const handleSaveSkill = (e) => {
    e.preventDefault();
    if (!skillForm.name) return;
    const payload = {
      name: skillForm.name,
      category: skillForm.category || 'Keahlian Utama',
      level: skillForm.level || 'Expert',
      percent: parseInt(skillForm.percent) || 90,
    };
    let updated;
    if (editingSkillId) {
      updated = (customer.skills || []).map((s) => (s.id === editingSkillId ? { ...s, ...payload } : s));
    } else {
      updated = [...(customer.skills || []), { id: `sk-c-${Date.now()}`, ...payload }];
    }
    updateCustomer(customer.id, { skills: updated });
    setShowSkillModal(false);
    triggerSaveToast();
  };

  const handleDeleteSkill = (skillId) => {
    if (confirm('Hapus keahlian ini?')) {
      const updated = (customer.skills || []).filter((s) => s.id !== skillId);
      updateCustomer(customer.id, { skills: updated });
      triggerSaveToast();
    }
  };

  // --- Handlers: Certificates ---
  const handleOpenAddCert = () => {
    setEditingCertId(null);
    setCertForm({ title: '', issuer: '', year: '2025', desc: '' });
    setShowCertModal(true);
  };

  const handleOpenEditCert = (cert) => {
    setEditingCertId(cert.id);
    setCertForm({
      title: cert.title || '',
      issuer: cert.issuer || '',
      year: cert.year || '2025',
      desc: cert.desc || '',
    });
    setShowCertModal(true);
  };

  const handleSaveCert = (e) => {
    e.preventDefault();
    if (!certForm.title) return;
    const payload = {
      title: certForm.title,
      issuer: certForm.issuer,
      year: certForm.year,
      desc: certForm.desc,
      isActive: true,
    };
    let updated;
    if (editingCertId) {
      updated = (customer.certificates || []).map((c) => (c.id === editingCertId ? { ...c, ...payload } : c));
    } else {
      updated = [...(customer.certificates || []), { id: `cert-c-${Date.now()}`, ...payload }];
    }
    updateCustomer(customer.id, { certificates: updated });
    setShowCertModal(false);
    triggerSaveToast();
  };

  const handleDeleteCert = (certId) => {
    if (confirm('Hapus sertifikat ini?')) {
      const updated = (customer.certificates || []).filter((c) => c.id !== certId);
      updateCustomer(customer.id, { certificates: updated });
      triggerSaveToast();
    }
  };

  // --- Handlers: CV & Social & Settings ---
  const handleSaveCV = (e) => {
    e.preventDefault();
    updateCustomer(customer.id, { cv: cvForm });
    triggerSaveToast();
  };

  const handleSaveSocial = (e) => {
    e.preventDefault();
    updateCustomer(customer.id, {
      socialMedia: socialForm,
      profile: {
        ...customer.profile,
        whatsapp: socialForm.whatsapp,
        email: socialForm.email,
        location: socialForm.location,
      },
    });
    triggerSaveToast();
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateCustomer(customer.id, {
      slug: settingsForm.slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-'),
      pin: settingsForm.pin.trim(),
      isPublished: settingsForm.isPublished,
    });
    triggerSaveToast();
  };

  const handleLogout = () => {
    logoutCustomer(customer.id);
    navigate('/customer/login');
  };

  // Tabs Definition: Organized Page-by-Page
  const PAGE_TABS = [
    {
      id: 'page1',
      badge: 'Halaman 1',
      label: 'Hero & ID Card',
      subtitle: 'Beranda Utama & Kartu 3D',
      icon: Sparkles,
    },
    {
      id: 'page2',
      badge: 'Halaman 2',
      label: 'Tentang Saya (About)',
      subtitle: '3D Carousel, Skills, Sertifikat & CV',
      icon: UserCheck,
      count: (customer.skills?.length || 0) + (customer.certificates?.length || 0),
    },
    {
      id: 'page3',
      badge: 'Halaman 3',
      label: 'Karya Rekayasa (Projek)',
      subtitle: 'Galeri Portofolio & 3 Pilar Teknik',
      icon: FolderKanban,
      count: customer.projects?.length || 0,
    },
    {
      id: 'page4',
      badge: 'Halaman 4',
      label: 'Kontak & Medsos',
      subtitle: 'WhatsApp, Email & LinkedIn',
      icon: Share2,
    },
  ];

  return (
    <div className="min-h-screen bg-[#05080E] text-slate-100 font-sans selection:bg-blue-900 selection:text-white pb-24">
      {/* ========================================================
          1. LOCKED TEMPLATE TOP BANNER
          ======================================================== */}
      <div className="bg-gradient-to-r from-blue-950 via-[#0a1829] to-indigo-950 border-b border-blue-500/30 px-3 sm:px-8 py-2 sm:py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-3 text-[11px] sm:text-xs">
        <div className="flex items-center gap-2 text-blue-200">
          <div className="p-1 rounded bg-blue-500/20 text-blue-300 shrink-0">
            <Lock className="w-3.5 h-3.5" />
          </div>
          <span className="font-mono leading-tight">
            <strong>DESAIN TEMPLATE TERKUNCI:</strong> {assignedTemplate.name} ({assignedTemplate.version}) • Anda hanya mengubah isi data & karya per halaman.
          </span>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[10px] sm:text-[11px] font-mono text-blue-300 bg-blue-950 px-2 py-0.5 rounded border border-blue-500/40 font-bold">
            LISENSI: {customer.id}
          </span>
        </div>
      </div>

      {/* ========================================================
          2. STICKY TOPBAR CONTROLS
          ======================================================== */}
      <header className="sticky top-0 z-30 bg-[#090E17]/95 backdrop-blur-xl border-b border-white/10 px-3 sm:px-8 py-2.5 sm:py-3 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
          
          {/* User ID & Profile Identity */}
          <div className="flex items-center justify-between sm:justify-start gap-2.5 sm:gap-3 min-w-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-600/30 border border-blue-400/50 flex items-center justify-center text-blue-300 font-black font-mono text-xs sm:text-sm shrink-0">
                {customer.id.replace('CUST-', 'C')}
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-black text-white font-sans flex items-center gap-1.5 truncate">
                  <span className="truncate">{customer.name}</span>
                  <span className="text-[9px] sm:text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-1.5 py-0.2 rounded shrink-0">
                    Editor Aktif
                  </span>
                </div>
                <div className="text-[10px] sm:text-[11px] font-mono text-slate-400 truncate">
                  Panel Editor Mandiri ({PAGE_TABS.find(t => t.id === currentTab)?.badge})
                </div>
              </div>
            </div>

            {/* Mobile Logout Quick Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="sm:hidden p-2 rounded-lg bg-white/5 hover:bg-rose-950/50 border border-white/10 hover:border-rose-500/40 text-slate-300 hover:text-rose-300 text-xs shrink-0"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center justify-start gap-1.5 sm:gap-2.5 overflow-x-auto no-scrollbar pb-0.5 sm:pb-0">
            {/* Publish / Draft Toggle */}
            <button
              type="button"
              onClick={() => {
                togglePublishCustomer(customer.id);
                triggerSaveToast();
              }}
              className={`inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer shadow-md shrink-0 ${
                customer.isPublished !== false
                  ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-900'
                  : 'bg-amber-950/80 border border-amber-500/50 text-amber-300 hover:bg-amber-900'
              }`}
              title="Ubah status publikasi"
            >
              {customer.isPublished !== false ? (
                <>
                  <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
                  <span>PUBLISHED</span>
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
                  <span>DRAFT</span>
                </>
              )}
            </button>

            {/* View Live Portfolio */}
            <a
              href={`/portfolio/${customer.slug || customer.id}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] sm:text-xs font-bold transition-all shadow-md cursor-pointer shrink-0"
            >
              <span>Live Web</span>
              <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </a>

            {/* Preview Simulator */}
            <button
              type="button"
              onClick={() => setShowPreviewModal(true)}
              className="inline-flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-200 hover:text-white text-[11px] sm:text-xs font-bold transition-all shadow-md cursor-pointer shrink-0"
              title="Preview Simulator"
            >
              <Monitor className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Simulator</span>
            </button>

            {/* Desktop Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-rose-950/50 border border-white/10 hover:border-rose-500/40 text-slate-300 hover:text-rose-300 text-xs font-semibold transition-all cursor-pointer shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Save Toast Notification */}
      <AnimatePresence>
        {saveToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-3 sm:right-6 z-50 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-emerald-950/90 border border-emerald-400/60 text-emerald-200 text-xs font-mono font-bold flex items-center gap-2 shadow-2xl backdrop-blur-md"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{saveToastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================
          3. MAIN CONTENT CONTAINER
          ======================================================== */}
      <main className="max-w-6xl mx-auto px-3 sm:px-6 pt-4 sm:pt-8 space-y-5 sm:space-y-8">
        
        {/* ========================================================
            PAGE-BY-PAGE TAB SELECTOR (Clear & Intuitive 4-Page Navigation)
            ======================================================== */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3.5">
          {PAGE_TABS.map((tab) => {
            const active = currentTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group ${
                  active
                    ? 'bg-gradient-to-b from-blue-950/90 to-[#0c182b] border-blue-400 shadow-xl shadow-blue-950/50 scale-[1.01]'
                    : 'bg-[#090E17]/80 hover:bg-[#0c1422] border-white/10 hover:border-white/20 text-slate-400'
                }`}
              >
                {/* Active Indicator Top Stripe */}
                {active && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500" />
                )}

                <div className="flex items-center justify-between mb-1 sm:mb-2">
                  <span
                    className={`text-[9px] sm:text-[10px] font-mono font-bold px-1.5 sm:px-2 py-0.5 rounded-full ${
                      active
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/10 text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    {tab.badge}
                  </span>
                  <Icon
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                      active ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'
                    }`}
                  />
                </div>

                <div>
                  <div className={`text-[11px] sm:text-xs font-bold font-sans ${active ? 'text-white' : 'text-slate-200'} line-clamp-1`}>
                    {tab.label}
                  </div>
                  <div className="text-[9.5px] sm:text-[10.5px] font-mono text-slate-400 line-clamp-1 mt-0.5">
                    {tab.subtitle}
                  </div>
                </div>

                {tab.count !== undefined && (
                  <div className="mt-1.5 sm:mt-2 text-[9px] sm:text-[10px] font-mono text-blue-300 flex items-center gap-1">
                    <span>{tab.count} data</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* ========================================================
            TAB 1: HALAMAN 1 (HERO & ID CARD 3D)
            ======================================================== */}
        {currentTab === 'page1' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Visual Page Guide Banner */}
            <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-950/60 via-[#0a1628] to-[#090E17] border border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[10.5px] font-mono font-bold text-blue-300 bg-blue-950/80 px-2.5 py-0.5 rounded-full border border-blue-500/40">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>HALAMAN 1: LAYAR PEMBUKA (HERO SECTION)</span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white font-sans">
                  Beranda Utama & Kartu ID Card 3D Lanyard
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-300 max-w-2xl leading-relaxed">
                  Halaman pertama yang dilihat pengunjung saat membuka portofolio Anda. Bagian ini memuat sambutan nama besar, gelar profesi, dan ID Card 3D interaktif yang tergantung dengan tali lanyard.
                </p>
              </div>

              <div className="shrink-0 text-left sm:text-right">
                <span className="text-[10px] sm:text-[10.5px] font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2.5 py-1 rounded-lg inline-flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>Animasi 3D Lanyard Terkunci Aman</span>
                </span>
              </div>
            </div>

            {/* Form Halaman 1 */}
            <form onSubmit={handleSaveProfile} className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-[#090E17]/90 border border-white/15 shadow-xl space-y-4 sm:space-y-6">
              <div className="border-b border-white/10 pb-2.5">
                <h3 className="text-xs sm:text-sm font-bold text-white uppercase font-sans tracking-wider">
                  Data yang Ditampilkan pada Halaman 1:
                </h3>
              </div>

              {/* 1. Foto Profil ID Card & Foto Orang Layar Utama */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
                {/* 1A. Foto ID Card 3D */}
                <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-[#060B12] border border-slate-700/80 flex flex-col justify-between gap-3 sm:gap-4">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <label className="block text-xs font-mono text-blue-300 font-bold">
                        1. Foto Profil Kartu ID Card 3D
                      </label>
                      <span className="text-[9.5px] sm:text-[10px] font-mono text-slate-400">Wajah / Setengah Badan</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans leading-relaxed mb-2">
                      Tampil di dalam lingkaran Kartu ID Card 3D yang berayun.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3 sm:gap-4">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-blue-500/50 bg-black shrink-0 shadow-lg group">
                      {profileForm.avatarUrl ? (
                        <img
                          src={profileForm.avatarUrl}
                          alt="Foto Profil ID Card"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-[9px] font-mono">
                          <User className="w-6 h-6 mb-1 opacity-50" />
                          <span>Belum Ada</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 flex-grow w-full sm:w-auto text-center sm:text-left">
                      <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-xs font-bold text-white shadow-md cursor-pointer transition-all hover:scale-[1.02] border border-blue-400/40">
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Pilih Foto ID Card</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarChange}
                        />
                      </label>

                      {profileForm.avatarUrl && (
                        <div>
                          <button
                            type="button"
                            onClick={handleAvatarRemove}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-[11px] font-mono text-rose-300 hover:text-white transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 1B. Foto Orang Layar Utama (Hero Section) */}
                <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-[#060B12] border border-slate-700/80 flex flex-col justify-between gap-3 sm:gap-4">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <label className="block text-xs font-mono text-amber-300 font-bold">
                        2. Foto Orang / Pose Berdiri Layar Utama (Hero)
                      </label>
                      <span className="text-[9.5px] sm:text-[10px] font-mono text-slate-400">Pose Berdiri / PNG</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans leading-relaxed mb-2">
                      Tampil sebagai sosok berdiri di latar belakang layar utama samping kartu. Disarankan format PNG transparan tanpa background.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3 sm:gap-4">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-amber-500/50 bg-black shrink-0 shadow-lg group">
                      {profileForm.heroPersonUrl ? (
                        <img
                          src={profileForm.heroPersonUrl}
                          alt="Foto Orang Layar Utama"
                          className="w-full h-full object-contain object-bottom"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-[9px] font-mono">
                          <User className="w-6 h-6 mb-1 opacity-50" />
                          <span>Default Model</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 flex-grow w-full sm:w-auto text-center sm:text-left">
                      <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 text-xs font-bold text-white shadow-md cursor-pointer transition-all hover:scale-[1.02] border border-amber-400/40">
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Ganti Foto Orang Layar Utama</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleHeroPersonChange}
                        />
                      </label>

                      {profileForm.heroPersonUrl && (
                        <div>
                          <button
                            type="button"
                            onClick={handleHeroPersonRemove}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-[11px] font-mono text-rose-300 hover:text-white transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Reset ke Default</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Identitas Pokok & Tagline Kartu */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-[#060B12] border border-slate-800 space-y-3 sm:space-y-4">
                <div className="text-xs font-bold text-white font-mono uppercase tracking-wider text-blue-300 border-b border-white/10 pb-2">
                  A. Identitas Pokok Pemilik Kartu
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5">
                      Nama Lengkap & Gelar *
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.fullName || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                      placeholder="Contoh: Budi Santoso, S.T."
                      className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#090E17] border border-slate-700 text-xs text-white outline-none focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5">
                      Jabatan / Profesi Utama *
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.jobTitle || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, jobTitle: e.target.value })}
                      placeholder="Contoh: Mechanical Engineer"
                      className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#090E17] border border-slate-700 text-xs text-white outline-none focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5">
                      Tag Kategori Samping (Role Tag)
                    </label>
                    <input
                      type="text"
                      value={profileForm.cardRoleTag !== undefined ? profileForm.cardRoleTag : 'DESIGNER'}
                      onChange={(e) => setProfileForm({ ...profileForm, cardRoleTag: e.target.value })}
                      placeholder="DESIGNER / ENGINEER / SPECIALIST"
                      className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#090E17] border border-slate-700 text-xs text-white outline-none focus:border-blue-400 font-mono uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Header Kartu & Tali Lanyard */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-[#060B12] border border-slate-800 space-y-3 sm:space-y-4">
                <div className="text-xs font-bold text-white font-mono uppercase tracking-wider text-indigo-300 border-b border-white/10 pb-2">
                  B. Teks Header Kartu & Tali Lanyard
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5">
                      Nama Perusahaan / Instansi
                    </label>
                    <input
                      type="text"
                      value={profileForm.cardCompany !== undefined ? profileForm.cardCompany : 'YOUR COMPANY'}
                      onChange={(e) => setProfileForm({ ...profileForm, cardCompany: e.target.value })}
                      placeholder="YOUR COMPANY"
                      className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#090E17] border border-slate-700 text-xs text-white outline-none focus:border-blue-400 font-mono uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5">
                      Departemen / Sub-Header
                    </label>
                    <input
                      type="text"
                      value={profileForm.cardDepartment !== undefined ? profileForm.cardDepartment : 'ENGINEERING & DESIGN'}
                      onChange={(e) => setProfileForm({ ...profileForm, cardDepartment: e.target.value })}
                      placeholder="ENGINEERING & DESIGN"
                      className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#090E17] border border-slate-700 text-xs text-white outline-none focus:border-blue-400 font-mono uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5">
                      Inisial Logo Monogram
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={profileForm.cardBadge !== undefined ? profileForm.cardBadge : 'RS'}
                      onChange={(e) => setProfileForm({ ...profileForm, cardBadge: e.target.value })}
                      placeholder="RS / BS"
                      className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#090E17] border border-slate-700 text-xs text-white outline-none focus:border-blue-400 font-mono font-bold uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5">
                      Teks Vertikal Tali Lanyard
                    </label>
                    <input
                      type="text"
                      value={profileForm.cardRibbonText !== undefined ? profileForm.cardRibbonText : 'PORTFOLIO'}
                      onChange={(e) => setProfileForm({ ...profileForm, cardRibbonText: e.target.value })}
                      placeholder="PORTFOLIO"
                      className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#090E17] border border-slate-700 text-xs text-white outline-none focus:border-blue-400 font-mono uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Tabel Data ID Card & Barcode */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-[#060B12] border border-slate-800 space-y-3 sm:space-y-4">
                <div className="text-xs font-bold text-white font-mono uppercase tracking-wider text-amber-300 border-b border-white/10 pb-2">
                  C. Tabel Data ID Card & Nomor Barcode
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5 font-bold text-amber-300">
                      ID No (Nomor ID Card)
                    </label>
                    <input
                      type="text"
                      value={profileForm.idCardNo || customer.id || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, idCardNo: e.target.value })}
                      placeholder="CUST-003 / ENG-2026"
                      className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#090E17] border border-slate-700 text-xs text-white outline-none focus:border-blue-400 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5">
                      Division (Divisi Kerja)
                    </label>
                    <input
                      type="text"
                      value={profileForm.division || profileForm.jobTitle || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, division: e.target.value })}
                      placeholder="Mechanical Engineering"
                      className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#090E17] border border-slate-700 text-xs text-white outline-none focus:border-blue-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5">
                      Specialist (Spesialisasi)
                    </label>
                    <input
                      type="text"
                      value={profileForm.specialist || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, specialist: e.target.value })}
                      placeholder="Consultation Projek"
                      className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#090E17] border border-slate-700 text-xs text-white outline-none focus:border-blue-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5">
                      Status (Status Kartu)
                    </label>
                    <input
                      type="text"
                      value={profileForm.cardStatus !== undefined ? profileForm.cardStatus : 'Active / Verified'}
                      onChange={(e) => setProfileForm({ ...profileForm, cardStatus: e.target.value })}
                      placeholder="Active / Verified"
                      className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#090E17] border border-slate-700 text-xs text-emerald-400 outline-none focus:border-blue-400 font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">
                    Teks Serial Barcode (Bawah Kartu)
                  </label>
                  <input
                    type="text"
                    value={profileForm.cardBarcode !== undefined ? profileForm.cardBarcode : 'No : 12345678900000000000'}
                    onChange={(e) => setProfileForm({ ...profileForm, cardBarcode: e.target.value })}
                    placeholder="No : 12345678900000000000"
                    className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#090E17] border border-slate-700 text-xs text-white outline-none focus:border-blue-400 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-white/10">
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-bold text-white shadow-lg cursor-pointer transition-all hover:scale-105"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan Halaman 1</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================
            TAB 2: HALAMAN 2 (ABOUT & 3D CAROUSEL)
            ======================================================== */}
        {currentTab === 'page2' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Visual Page Guide Banner */}
            <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-indigo-950/60 via-[#0a1628] to-[#090E17] border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[10.5px] font-mono font-bold text-indigo-300 bg-indigo-950/80 px-2.5 py-0.5 rounded-full border border-indigo-500/40">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>HALAMAN 2: TENTANG SAYA (ABOUT SECTION)</span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white font-sans">
                  3D Orbit Carousel: Profil, Keahlian, Sertifikat & CV
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-300 max-w-2xl leading-relaxed">
                  Halaman kedua berisi kartu 3D Carousel berputar. Terdapat 4 bagian data yang dapat Anda sesuaikan di bawah ini:
                </p>
              </div>

              <div className="shrink-0 text-left sm:text-right">
                <span className="text-[10px] sm:text-[10.5px] font-mono text-purple-400 bg-purple-950/70 border border-purple-500/30 px-2.5 py-1 rounded-lg inline-flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>3D Carousel Auto-Sync</span>
                </span>
              </div>
            </div>

            {/* Sub-Navigation for Halaman 2 */}
            <div className="flex items-center gap-1.5 sm:gap-2 border-b border-white/10 pb-2 overflow-x-auto no-scrollbar">
              {[
                { id: 'texts', label: '1. Teks Utama & 3 Sorotan', icon: FileText },
                { id: 'portrait', label: '2. Foto Potret & Kartu 3D', icon: User },
                { id: 'stats', label: '3. 4 Angka Statistik', icon: Sparkles },
                { id: 'skills', label: `4. Keahlian Teknik (${customer.skills?.length || 0})`, icon: Cpu },
                { id: 'certs', label: `5. Sertifikat (${customer.certificates?.length || 0})`, icon: Award },
                { id: 'cv', label: '6. Dokumen CV', icon: UploadCloud },
              ].map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setAboutSubTab(sub.id)}
                  className={`inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    aboutSubTab === sub.id
                      ? 'bg-indigo-600 text-white shadow-md border border-indigo-400/50 scale-[1.02]'
                      : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <sub.icon className="w-3.5 h-3.5" />
                  <span>{sub.label}</span>
                </button>
              ))}
            </div>

            {/* SubTab 1: Teks Utama & 3 Poin Sorotan */}
            {aboutSubTab === 'texts' && (
              <form onSubmit={handleSaveProfile} className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-[#090E17]/90 border border-white/15 shadow-xl space-y-4 sm:space-y-5">
                <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white uppercase font-sans tracking-wider text-indigo-300">
                      1. Teks Judul, Sambutan & 3 Poin Sorotan Halaman 2
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-400">Sesuaikan badge kecil, judul besar, paragraf bio, dan 3 butir sorotan di samping carousel.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5 font-bold">
                      Badge Kecil Halaman (Atas Judul)
                    </label>
                    <input
                      type="text"
                      value={profileForm.aboutBadge !== undefined ? profileForm.aboutBadge : '02 / TENTANG SAYA'}
                      onChange={(e) => setProfileForm({ ...profileForm, aboutBadge: e.target.value })}
                      placeholder="02 / TENTANG SAYA"
                      className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-indigo-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5 font-bold">
                      Judul Utama Halaman 2
                    </label>
                    <input
                      type="text"
                      value={profileForm.aboutTitle !== undefined ? profileForm.aboutTitle : 'Lebih Dekat Dengan Saya'}
                      onChange={(e) => setProfileForm({ ...profileForm, aboutTitle: e.target.value })}
                      placeholder="Lebih Dekat Dengan Saya"
                      className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-indigo-400 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5 font-bold">
                    Paragraf Sambutan & Biodata Lengkap (Bio)
                  </label>
                  <textarea
                    rows={3}
                    value={profileForm.bio || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    placeholder="Saya berfokus pada perancangan produk, analisis kekuatan struktur, dan pengembangan solusi teknik yang inovatif untuk industri modern."
                    className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-slate-200 outline-none focus:border-indigo-400 leading-relaxed custom-scrollbar"
                  />
                </div>

                {/* 3 Bullet Points */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-[#060B12] border border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-indigo-300 font-mono uppercase tracking-wider pb-2 border-b border-white/10">
                    3 Butir Poin Sorotan Keahlian (Checkmark Points)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">Poin Sorotan 1</label>
                      <input
                        type="text"
                        value={profileForm.aboutBullet1 !== undefined ? profileForm.aboutBullet1 : '3D CAD Modeling & Kinematic Assembly'}
                        onChange={(e) => setProfileForm({ ...profileForm, aboutBullet1: e.target.value })}
                        placeholder="3D CAD Modeling & Kinematic Assembly"
                        className="w-full px-3 py-2 rounded-xl bg-[#090E17] border border-slate-700 text-xs text-white outline-none focus:border-indigo-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">Poin Sorotan 2</label>
                      <input
                        type="text"
                        value={profileForm.aboutBullet2 !== undefined ? profileForm.aboutBullet2 : 'Finite Element Analysis (FEA) & Simulation'}
                        onChange={(e) => setProfileForm({ ...profileForm, aboutBullet2: e.target.value })}
                        placeholder="Finite Element Analysis (FEA) & Simulation"
                        className="w-full px-3 py-2 rounded-xl bg-[#090E17] border border-slate-700 text-xs text-white outline-none focus:border-indigo-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">Poin Sorotan 3</label>
                      <input
                        type="text"
                        value={profileForm.aboutBullet3 !== undefined ? profileForm.aboutBullet3 : 'Industrial Product R&D & Fabrication'}
                        onChange={(e) => setProfileForm({ ...profileForm, aboutBullet3: e.target.value })}
                        placeholder="Industrial Product R&D & Fabrication"
                        className="w-full px-3 py-2 rounded-xl bg-[#090E17] border border-slate-700 text-xs text-white outline-none focus:border-indigo-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-3 border-t border-white/10">
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 text-xs font-bold text-white shadow-md cursor-pointer transition-all hover:scale-105"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Teks Halaman 2</span>
                  </button>
                </div>
              </form>
            )}

            {/* SubTab 2: Foto Potret & Teks Kartu 3D */}
            {aboutSubTab === 'portrait' && (
              <form onSubmit={handleSaveProfile} className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-[#090E17]/90 border border-white/15 shadow-xl space-y-4 sm:space-y-6">
                <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white uppercase font-sans tracking-wider text-purple-300">
                      2. Foto Potret & Teks Kartu 3D Orbit Carousel
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-400">Ganti foto potret profil 3:4 langsung dari galeri dan sesuaikan teks 4 kartu 3D berputar.</p>
                  </div>
                </div>

                {/* Foto Potret Uploader */}
                <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-[#060B12] border border-slate-700 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                  <div className="relative w-24 h-32 sm:w-28 sm:h-36 rounded-2xl overflow-hidden border-2 border-purple-500/60 bg-slate-950 shrink-0 shadow-2xl group">
                    {profileForm.aboutAvatarUrl || profileForm.avatarUrl ? (
                      <img
                        src={profileForm.aboutAvatarUrl || profileForm.avatarUrl}
                        alt="Foto Potret Halaman 2"
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-[10px] font-mono">
                        <User className="w-8 h-8 mb-1 opacity-50" />
                        <span>Default Potret</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 flex-grow text-center sm:text-left w-full sm:w-auto">
                    <div className="text-xs font-bold text-white font-mono">
                      Foto Potret 3:4 (Kartu 3D Profil Halaman 2)
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                      Tampil di kartu utama pada 3D Carousel Halaman 2. Ambil langsung dari file penyimpanan komputer atau galeri ponsel Anda.
                    </p>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center sm:justify-start gap-2 sm:gap-2.5 pt-1">
                      <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-xs font-bold text-white shadow-md cursor-pointer transition-all hover:scale-[1.02] border border-purple-400/40">
                        <UploadCloud className="w-4 h-4" />
                        <span>Pilih Foto Potret</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAboutAvatarChange}
                        />
                      </label>

                      {profileForm.aboutAvatarUrl && (
                        <button
                          type="button"
                          onClick={handleAboutAvatarRemove}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-xs font-mono text-rose-300 hover:text-white transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Reset ke Default</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Teks 4 Kartu 3D */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
                    Kustomisasi Teks Kartu 3D Carousel (Orbit Cards):
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {/* Kartu 1: Projects */}
                    <div className="p-3.5 sm:p-4 rounded-xl bg-[#060B12] border border-slate-800 space-y-2">
                      <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">Kartu 1: Portfolio Projek</span>
                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">Judul Kartu</label>
                        <input
                          type="text"
                          value={profileForm.card1Title !== undefined ? profileForm.card1Title : 'VIEW PROJECTS'}
                          onChange={(e) => setProfileForm({ ...profileForm, card1Title: e.target.value })}
                          placeholder="VIEW PROJECTS"
                          className="w-full px-3 py-2 rounded-xl bg-[#090E17] border border-slate-700 text-xs text-white outline-none focus:border-indigo-400 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">Deskripsi Singkat</label>
                        <input
                          type="text"
                          value={profileForm.card1Desc !== undefined ? profileForm.card1Desc : 'Lihat semua projek yang pernah saya kerjakan dalam industri manufaktur, perancangan mesin, dan web apps.'}
                          onChange={(e) => setProfileForm({ ...profileForm, card1Desc: e.target.value })}
                          placeholder="Deskripsi projek..."
                          className="w-full px-3 py-2 rounded-xl bg-[#090E17] border border-slate-700 text-xs text-white outline-none focus:border-indigo-400"
                        />
                      </div>
                    </div>

                    {/* Kartu 2: Certificate */}
                    <div className="p-3.5 sm:p-4 rounded-xl bg-[#060B12] border border-slate-800 space-y-2">
                      <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">Kartu 2: Sertifikat Resmi</span>
                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">Judul Kartu</label>
                        <input
                          type="text"
                          value={profileForm.card2Title !== undefined ? profileForm.card2Title : 'CERTIFICATE'}
                          onChange={(e) => setProfileForm({ ...profileForm, card2Title: e.target.value })}
                          placeholder="CERTIFICATE"
                          className="w-full px-3 py-2 rounded-xl bg-[#090E17] border border-slate-700 text-xs text-white outline-none focus:border-indigo-400 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">Deskripsi Singkat</label>
                        <input
                          type="text"
                          value={profileForm.card2Desc !== undefined ? profileForm.card2Desc : 'Sertifikat keahlian resmi yang saya peroleh dari berbagai pelatihan industri, software engineering, dan asosiasi.'}
                          onChange={(e) => setProfileForm({ ...profileForm, card2Desc: e.target.value })}
                          placeholder="Deskripsi sertifikat..."
                          className="w-full px-3 py-2 rounded-xl bg-[#090E17] border border-slate-700 text-xs text-white outline-none focus:border-indigo-400"
                        />
                      </div>
                    </div>

                    {/* Kartu 3: Completed Works */}
                    <div className="p-3.5 sm:p-4 rounded-xl bg-[#060B12] border border-slate-800 space-y-2">
                      <span className="text-[10px] font-mono font-bold text-rose-400 uppercase">Kartu 3: Rekam Jejak Pekerjaan</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 mb-1">Judul Kartu</label>
                          <input
                            type="text"
                            value={profileForm.card3Title !== undefined ? profileForm.card3Title : 'COMPLETED WORKS'}
                            onChange={(e) => setProfileForm({ ...profileForm, card3Title: e.target.value })}
                            placeholder="COMPLETED WORKS"
                            className="w-full px-3 py-2 rounded-xl bg-[#090E17] border border-slate-700 text-xs text-white outline-none focus:border-indigo-400 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 mb-1">Subtitle</label>
                          <input
                            type="text"
                            value={profileForm.card3Subtitle !== undefined ? profileForm.card3Subtitle : 'Hasil Pekerjaan Industri'}
                            onChange={(e) => setProfileForm({ ...profileForm, card3Subtitle: e.target.value })}
                            placeholder="Hasil Pekerjaan Industri"
                            className="w-full px-3 py-2 rounded-xl bg-[#090E17] border border-slate-700 text-xs text-white outline-none focus:border-indigo-400"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">Deskripsi Singkat</label>
                        <input
                          type="text"
                          value={profileForm.card3Desc !== undefined ? profileForm.card3Desc : 'Dokumentasi berbagai pekerjaan teknis dan perancangan mesin yang telah sukses diselesaikan.'}
                          onChange={(e) => setProfileForm({ ...profileForm, card3Desc: e.target.value })}
                          placeholder="Deskripsi pekerjaan..."
                          className="w-full px-3 py-2 rounded-xl bg-[#090E17] border border-slate-700 text-xs text-white outline-none focus:border-indigo-400"
                        />
                      </div>
                    </div>

                    {/* Kartu 4: Skills */}
                    <div className="p-3.5 sm:p-4 rounded-xl bg-[#060B12] border border-slate-800 space-y-2">
                      <span className="text-[10px] font-mono font-bold text-blue-400 uppercase">Kartu 4: Keahlian Teknik</span>
                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">Judul Kartu</label>
                        <input
                          type="text"
                          value={profileForm.card4Title !== undefined ? profileForm.card4Title : 'TECHNICAL SKILLS'}
                          onChange={(e) => setProfileForm({ ...profileForm, card4Title: e.target.value })}
                          placeholder="TECHNICAL SKILLS"
                          className="w-full px-3 py-2 rounded-xl bg-[#090E17] border border-slate-700 text-xs text-white outline-none focus:border-indigo-400 font-mono"
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 pt-1">
                        * Deskripsi kartu skill otomatis merangkum 4 keahlian teratas dari tab Keahlian Teknik.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Pengaturan Teks Modal Popup: Rekam Jejak Pekerjaan & Pengalaman Karir */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-[#060B12] border border-slate-800 space-y-3 sm:space-y-4">
                  <div className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider pb-2 border-b border-white/10">
                    Pengaturan Teks Modal Popup (Works & Experience):
                  </div>

                  {/* Modal Works */}
                  <div className="space-y-2.5">
                    <span className="text-[11px] font-mono font-bold text-rose-300 uppercase">Modal Popup: Rekam Jejak Pekerjaan</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1 font-bold">Badge Atas</label>
                        <input
                          type="text"
                          value={profileForm.worksModalBadge !== undefined ? profileForm.worksModalBadge : 'Studi Kasus & Industri'}
                          onChange={(e) => setProfileForm({ ...profileForm, worksModalBadge: e.target.value })}
                          placeholder="Studi Kasus & Industri"
                          className="w-full px-3 py-2 rounded-xl bg-[#090E17] border border-slate-700 text-xs text-white outline-none focus:border-indigo-400 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1 font-bold">Judul Besar</label>
                        <input
                          type="text"
                          value={profileForm.worksModalTitle !== undefined ? profileForm.worksModalTitle : 'Rekam Jejak Pekerjaan'}
                          onChange={(e) => setProfileForm({ ...profileForm, worksModalTitle: e.target.value })}
                          placeholder="Rekam Jejak Pekerjaan"
                          className="w-full px-3 py-2 rounded-xl bg-[#090E17] border border-slate-700 text-xs text-white outline-none focus:border-indigo-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1 font-bold">Paragraf Deskripsi Modal</label>
                      <textarea
                        rows={2}
                        value={profileForm.worksModalDesc !== undefined ? profileForm.worksModalDesc : ''}
                        onChange={(e) => setProfileForm({ ...profileForm, worksModalDesc: e.target.value })}
                        placeholder={`Berbagai proyek yang telah diselesaikan oleh ${customer.profile?.fullName || 'saya'} mencakup siklus komprehensif: Perencanaan, Analisis, hingga Eksekusi.`}
                        className="w-full px-3 py-2 rounded-xl bg-[#090E17] border border-slate-700 text-xs text-slate-200 outline-none focus:border-indigo-400 leading-relaxed custom-scrollbar"
                      />
                    </div>
                  </div>

                  {/* Modal Experience */}
                  <div className="space-y-2.5 pt-3 border-t border-white/10">
                    <span className="text-[11px] font-mono font-bold text-amber-300 uppercase">Modal Popup: Karir & Pengalaman</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1 font-bold">Badge Atas</label>
                        <input
                          type="text"
                          value={profileForm.expModalBadge !== undefined ? profileForm.expModalBadge : 'Pengalaman Kerja & Pendidikan'}
                          onChange={(e) => setProfileForm({ ...profileForm, expModalBadge: e.target.value })}
                          placeholder="Pengalaman Kerja & Pendidikan"
                          className="w-full px-3 py-2 rounded-xl bg-[#090E17] border border-slate-700 text-xs text-white outline-none focus:border-indigo-400 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1 font-bold">Judul Besar</label>
                        <input
                          type="text"
                          value={profileForm.expModalTitle !== undefined ? profileForm.expModalTitle : 'Rekam Jejak Karir & Pendidikan'}
                          onChange={(e) => setProfileForm({ ...profileForm, expModalTitle: e.target.value })}
                          placeholder="Rekam Jejak Karir & Pendidikan"
                          className="w-full px-3 py-2 rounded-xl bg-[#090E17] border border-slate-700 text-xs text-white outline-none focus:border-indigo-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1 font-bold">Paragraf Deskripsi Modal</label>
                      <textarea
                        rows={2}
                        value={profileForm.expModalDesc !== undefined ? profileForm.expModalDesc : ''}
                        onChange={(e) => setProfileForm({ ...profileForm, expModalDesc: e.target.value })}
                        placeholder={`Perjalanan akademik dan praktek profesional ${customer.profile?.fullName || 'saya'} dalam bidang keahlian dan perancangan.`}
                        className="w-full px-3 py-2 rounded-xl bg-[#090E17] border border-slate-700 text-xs text-slate-200 outline-none focus:border-indigo-400 leading-relaxed custom-scrollbar"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-3 border-t border-white/10">
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-xs font-bold text-white shadow-md cursor-pointer transition-all hover:scale-105"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Foto & Teks Kartu 3D</span>
                  </button>
                </div>
              </form>
            )}

            {/* SubTab 3: 4 Angka & Label Statistik */}
            {aboutSubTab === 'stats' && (
              <form onSubmit={handleSaveProfile} className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-[#090E17]/90 border border-white/15 shadow-xl space-y-4 sm:space-y-5">
                <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white uppercase font-sans tracking-wider text-amber-300">
                      3. 4 Pasang Angka & Label Statistik (Bar Bawah)
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-400">Atur nilai angka dan teks label yang muncul di baris statistik kaca di bawah halaman 2.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {/* Stat 1 */}
                  <div className="p-3.5 sm:p-4 rounded-xl bg-[#060B12] border border-slate-800 space-y-2.5">
                    <span className="text-[10px] font-mono font-bold text-amber-300 uppercase">Statistik 1</span>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">Nilai Angka / Teks</label>
                      <input
                        type="text"
                        value={profileForm.experienceYears || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, experienceYears: e.target.value })}
                        placeholder="Contoh: 3+"
                        className="w-full px-3 py-2 rounded-xl bg-[#090E17] border border-slate-700 text-xs text-white outline-none focus:border-amber-400 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">Label Teks</label>
                      <input
                        type="text"
                        value={profileForm.stat1Label !== undefined ? profileForm.stat1Label : 'Tahun Pengalaman'}
                        onChange={(e) => setProfileForm({ ...profileForm, stat1Label: e.target.value })}
                        placeholder="Tahun Pengalaman"
                        className="w-full px-3 py-2 rounded-xl bg-[#090E17] border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  {/* Stat 2 */}
                  <div className="p-3.5 sm:p-4 rounded-xl bg-[#060B12] border border-slate-800 space-y-2.5">
                    <span className="text-[10px] font-mono font-bold text-emerald-300 uppercase">Statistik 2</span>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">Nilai Angka / Teks</label>
                      <input
                        type="text"
                        value={profileForm.stat2Value || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, stat2Value: e.target.value })}
                        placeholder={`Otomatis (${customer.projects?.length || 10}+)`}
                        className="w-full px-3 py-2 rounded-xl bg-[#090E17] border border-slate-700 text-xs text-white outline-none focus:border-emerald-400 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">Label Teks</label>
                      <input
                        type="text"
                        value={profileForm.stat2Label !== undefined ? profileForm.stat2Label : 'Karya Mesin & Alat'}
                        onChange={(e) => setProfileForm({ ...profileForm, stat2Label: e.target.value })}
                        placeholder="Karya Mesin & Alat"
                        className="w-full px-3 py-2 rounded-xl bg-[#090E17] border border-slate-700 text-xs text-white outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  {/* Stat 3 */}
                  <div className="p-3.5 sm:p-4 rounded-xl bg-[#060B12] border border-slate-800 space-y-2.5">
                    <span className="text-[10px] font-mono font-bold text-blue-300 uppercase">Statistik 3</span>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">Nilai / Gelar</label>
                      <input
                        type="text"
                        value={profileForm.education || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, education: e.target.value })}
                        placeholder="Contoh: D3 / S1"
                        className="w-full px-3 py-2 rounded-xl bg-[#090E17] border border-slate-700 text-xs text-white outline-none focus:border-blue-400 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">Label Teks</label>
                      <input
                        type="text"
                        value={profileForm.stat3Label !== undefined ? profileForm.stat3Label : 'Pendidikan'}
                        onChange={(e) => setProfileForm({ ...profileForm, stat3Label: e.target.value })}
                        placeholder="Pendidikan"
                        className="w-full px-3 py-2 rounded-xl bg-[#090E17] border border-slate-700 text-xs text-white outline-none focus:border-blue-400"
                      />
                    </div>
                  </div>

                  {/* Stat 4 */}
                  <div className="p-3.5 sm:p-4 rounded-xl bg-[#060B12] border border-slate-800 space-y-2.5">
                    <span className="text-[10px] font-mono font-bold text-purple-300 uppercase">Statistik 4</span>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">Nilai Angka / Teks</label>
                      <input
                        type="text"
                        value={profileForm.certCount || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, certCount: e.target.value })}
                        placeholder={`Otomatis (${customer.certificates?.length || 6}+)`}
                        className="w-full px-3 py-2 rounded-xl bg-[#090E17] border border-slate-700 text-xs text-white outline-none focus:border-purple-400 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">Label Teks</label>
                      <input
                        type="text"
                        value={profileForm.stat4Label !== undefined ? profileForm.stat4Label : 'Sertifikasi Resmi'}
                        onChange={(e) => setProfileForm({ ...profileForm, stat4Label: e.target.value })}
                        placeholder="Sertifikasi Resmi"
                        className="w-full px-3 py-2 rounded-xl bg-[#090E17] border border-slate-700 text-xs text-white outline-none focus:border-purple-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-3 border-t border-white/10">
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 text-xs font-bold text-white shadow-md cursor-pointer transition-all hover:scale-105"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Angka Statistik</span>
                  </button>
                </div>
              </form>
            )}

            {/* SubTab 4: Keahlian Teknik (Skills) */}
            {aboutSubTab === 'skills' && (
              <div className="space-y-4 sm:space-y-6">
                {/* Form Pengaturan Teks Modal Skill */}
                <form onSubmit={handleSaveProfile} className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-[#090E17]/90 border border-white/15 shadow-xl space-y-3.5 sm:space-y-4">
                  <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-white uppercase font-sans tracking-wider text-blue-300">
                        Pengaturan Teks Modal Popup: Skill & Technical Skill
                      </h3>
                      <p className="text-[11px] sm:text-xs text-slate-400">Ubah badge kecil, judul besar, dan paragraf deskripsi yang muncul saat pengunjung mengklik kartu Skill.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1 font-bold">Badge Atas Modal</label>
                      <input
                        type="text"
                        value={profileForm.skillsModalBadge !== undefined ? profileForm.skillsModalBadge : 'KOMPETENSI REKAYASA'}
                        onChange={(e) => setProfileForm({ ...profileForm, skillsModalBadge: e.target.value })}
                        placeholder="KOMPETENSI REKAYASA / KEAHLIAN PROFESIONAL"
                        className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-blue-400 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1 font-bold">Judul Besar Modal</label>
                      <input
                        type="text"
                        value={profileForm.skillsModalTitle !== undefined ? profileForm.skillsModalTitle : 'Skill & Technical Skill'}
                        onChange={(e) => setProfileForm({ ...profileForm, skillsModalTitle: e.target.value })}
                        placeholder="Skill & Technical Skill / Keahlian Utama"
                        className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-blue-400 font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1 font-bold">Paragraf Deskripsi Modal</label>
                    <textarea
                      rows={2}
                      value={profileForm.skillsModalDesc !== undefined ? profileForm.skillsModalDesc : ''}
                      onChange={(e) => setProfileForm({ ...profileForm, skillsModalDesc: e.target.value })}
                      placeholder={`Kompetensi teknis dan keahlian yang dikuasai ${customer.profile?.fullName || 'saya'}, mencakup penguasaan software profesional, standar industri, dan metodologi kerja.`}
                      className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-slate-200 outline-none focus:border-blue-400 leading-relaxed custom-scrollbar"
                    />
                  </div>

                  <div className="flex justify-end pt-2 border-t border-white/10">
                    <button
                      type="submit"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-md cursor-pointer transition-all hover:scale-105"
                    >
                      <Save className="w-4 h-4" />
                      <span>Simpan Teks Modal Skill</span>
                    </button>
                  </div>
                </form>

                {/* Daftar Item Keahlian */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-white uppercase font-sans tracking-wider">
                        Daftar Keahlian & Progress Bar ({customer.skills?.length || 0})
                      </h3>
                      <p className="text-[11px] sm:text-xs text-slate-400">Setiap keahlian akan otomatis dikelompokkan berdasarkan kategori pada popup modal.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleOpenAddSkill}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-xs font-bold text-white shadow-md cursor-pointer transition-all hover:scale-105"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Keahlian Baru</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {(customer.skills || []).map((sk) => {
                      const pct = typeof sk.percent === 'number' ? sk.percent : (sk.level === 'Expert' ? 95 : 90);
                      return (
                        <div
                          key={sk.id}
                          className="p-3.5 sm:p-4 rounded-xl bg-[#090E17]/90 border border-white/15 flex flex-col justify-between gap-2.5 hover:border-blue-500/40 transition-all"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-[10px] font-mono text-blue-300 font-bold uppercase tracking-wider line-clamp-1">
                                {sk.category || 'Keahlian Utama'}
                              </span>
                              <span className="text-[10px] font-mono font-extrabold text-amber-300 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/30 shrink-0">
                                {pct}%
                              </span>
                            </div>
                            <div className="text-xs font-bold text-white mb-2">{sk.name}</div>
                            <div className="w-full h-1.5 rounded-full bg-slate-900 border border-white/10 overflow-hidden">
                              <div
                                style={{ width: `${pct}%` }}
                                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-400"
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-white/10">
                            <span className="text-[10px] font-mono text-slate-400">{sk.level || 'Expert'}</span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEditSkill(sk)}
                                className="px-2.5 py-1 rounded-lg bg-blue-950/60 hover:bg-blue-900 border border-blue-500/30 text-blue-300 text-[11px] font-mono cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteSkill(sk.id)}
                                className="p-1 rounded-lg bg-rose-950/40 hover:bg-rose-900 text-rose-300 cursor-pointer"
                                title="Hapus Skill"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* SubTab 5: Sertifikat Resmi */}
            {aboutSubTab === 'certs' && (
              <div className="space-y-4 sm:space-y-6">
                {/* Form Pengaturan Teks Modal Sertifikat */}
                <form onSubmit={handleSaveProfile} className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-[#090E17]/90 border border-white/15 shadow-xl space-y-3.5 sm:space-y-4">
                  <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-white uppercase font-sans tracking-wider text-purple-300">
                        Pengaturan Teks Modal Popup: Sertifikat Resmi
                      </h3>
                      <p className="text-[11px] sm:text-xs text-slate-400">Ubah badge kecil, judul besar, dan paragraf penjelasan modal sertifikat.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1 font-bold">Badge Atas Modal</label>
                      <input
                        type="text"
                        value={profileForm.certModalBadge !== undefined ? profileForm.certModalBadge : 'Kredensial Resmi'}
                        onChange={(e) => setProfileForm({ ...profileForm, certModalBadge: e.target.value })}
                        placeholder="Kredensial Resmi / Lisensi Keahlian"
                        className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-purple-400 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1 font-bold">Judul Besar Modal</label>
                      <input
                        type="text"
                        value={profileForm.certModalTitle !== undefined ? profileForm.certModalTitle : 'Sertifikat'}
                        onChange={(e) => setProfileForm({ ...profileForm, certModalTitle: e.target.value })}
                        placeholder="Sertifikat / Sertifikasi & Lisensi"
                        className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-purple-400 font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1 font-bold">Paragraf Penjelasan Modal</label>
                    <textarea
                      rows={2}
                      value={profileForm.certModalDesc !== undefined ? profileForm.certModalDesc : ''}
                      onChange={(e) => setProfileForm({ ...profileForm, certModalDesc: e.target.value })}
                      placeholder={`Dokumentasi resmi sertifikat keahlian, uji kompetensi industri, dan kredensial profesional yang tercantum dalam portofolio ${customer.profile?.fullName || 'saya'}.`}
                      className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-slate-200 outline-none focus:border-purple-400 leading-relaxed custom-scrollbar"
                    />
                  </div>

                  <div className="flex justify-end pt-2 border-t border-white/10">
                    <button
                      type="submit"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-md cursor-pointer transition-all hover:scale-105"
                    >
                      <Save className="w-4 h-4" />
                      <span>Simpan Teks Modal Sertifikat</span>
                    </button>
                  </div>
                </form>

                {/* Daftar Sertifikat */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-white uppercase font-sans tracking-wider">
                        Daftar Sertifikat & Lisensi ({customer.certificates?.length || 0})
                      </h3>
                      <p className="text-[11px] sm:text-xs text-slate-400">Daftar sertifikat keahlian yang tercantum pada portofolio Anda.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleOpenAddCert}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-xs font-bold text-white shadow-md cursor-pointer transition-all hover:scale-105"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Sertifikat Baru</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(customer.certificates || []).map((cert) => (
                      <div
                        key={cert.id}
                        className="p-3.5 sm:p-4 rounded-xl bg-[#090E17]/90 border border-white/15 flex flex-col justify-between gap-3 hover:border-purple-500/40 transition-all"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-[10px] font-mono text-purple-300 font-bold uppercase">
                              {cert.issuer || 'Lembaga Penerbit'}
                            </span>
                            <span className="text-[10px] font-mono font-extrabold text-amber-300 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/30">
                              {cert.year || '2025'}
                            </span>
                          </div>
                          <div className="text-xs font-bold text-white mb-1">{cert.title}</div>
                          {cert.desc && (
                            <div className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">{cert.desc}</div>
                          )}
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                          <button
                            type="button"
                            onClick={() => handleOpenEditCert(cert)}
                            className="px-2.5 py-1 rounded-lg bg-purple-950/60 hover:bg-purple-900 border border-purple-500/30 text-purple-300 text-[11px] font-mono cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCert(cert.id)}
                            className="p-1 rounded-lg bg-rose-950/40 hover:bg-rose-900 text-rose-300 cursor-pointer"
                            title="Hapus Sertifikat"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SubTab 6: File CV */}
            {aboutSubTab === 'cv' && (
              <form onSubmit={handleSaveCV} className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-[#090E17]/90 border border-white/15 shadow-xl space-y-4 sm:space-y-5">
                <h3 className="text-xs sm:text-sm font-bold text-white uppercase font-sans tracking-wider pb-2 border-b border-white/10">
                  6. File Curriculum Vitae (CV) Siap Unduh
                </h3>

                <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-[#060B12] border border-slate-700 flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 flex flex-col items-center justify-center text-indigo-400 shrink-0 shadow-lg">
                    <FileText className="w-8 h-8 sm:w-9 sm:h-9 mb-1" />
                    <span className="text-[9px] sm:text-[10px] font-mono uppercase font-bold text-indigo-300">
                      {cvForm.fileName?.split('.').pop() || 'PDF'}
                    </span>
                  </div>

                  <div className="space-y-2 flex-grow text-center sm:text-left w-full sm:w-auto">
                    <div className="text-xs font-bold text-white font-sans break-all">
                      {cvForm.fileName ? cvForm.fileName : 'Belum Ada File CV yang Dipilih'}
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                      {cvForm.fileUrl
                        ? `✓ File siap diunduh oleh pengunjung portofolio pada tombol "Download CV".`
                        : `Pilih file CV dari komputer atau HP Anda (format PDF, DOC, DOCX). File akan langsung tersimpan ke sistem.`}
                    </p>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center sm:justify-start gap-2 sm:gap-2.5 pt-1">
                      <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 text-xs font-bold text-white shadow-md cursor-pointer transition-all hover:scale-[1.02]">
                        <UploadCloud className="w-4 h-4" />
                        <span>{cvForm.fileUrl ? 'Ganti File CV' : 'Pilih File CV'}</span>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                          className="hidden"
                          onChange={handleCVFileUpload}
                        />
                      </label>

                      {cvForm.fileUrl && (
                        <a
                          href={cvForm.fileUrl}
                          download={cvForm.fileName || 'CV.pdf'}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-mono text-white transition-all cursor-pointer"
                        >
                          <span>Test Unduh ↗</span>
                        </a>
                      )}

                      {cvForm.fileUrl && (
                        <button
                          type="button"
                          onClick={handleCVFileRemove}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-xs font-mono text-rose-300 hover:text-white transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Nama Tampilan File CV</label>
                  <input
                    type="text"
                    value={cvForm.fileName || ''}
                    onChange={(e) => setCvForm({ ...cvForm, fileName: e.target.value })}
                    placeholder="CV-Nama-Lengkap.pdf"
                    className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-indigo-400"
                  />
                </div>

                <div className="flex justify-end pt-3 border-t border-white/10">
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-md cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Pengaturan CV</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 3: HALAMAN 3 (PROJECTS SHOWCASE - DIRECT IN-PAGE EDITOR)
            ======================================================== */}
        {currentTab === 'page3' && (
          <div className="space-y-5 sm:space-y-8">
            {/* Visual Page Guide Banner */}
            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-950/80 via-[#0a1b2d] to-[#07111e] border-2 border-emerald-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-5 shadow-2xl">
              <div className="space-y-1 sm:space-y-1.5">
                <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-mono font-bold text-emerald-300 bg-emerald-950 px-2.5 sm:px-3 py-1 rounded-full border border-emerald-400/50">
                  <FolderKanban className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                  <span>HALAMAN 3: EDITOR LENGKAP KARYA REKAYASA & PROJEK</span>
                </div>
                <h2 className="text-base sm:text-xl font-bold text-white font-sans">
                  Galeri Projek, 3 Pilar Rekayasa & Garis Hazard Sudut
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-300 max-w-2xl leading-relaxed">
                  Semua teks, foto, dan 3 tahap teknis projek dapat Anda ubah langsung pada formulir di bawah ini. Jangan lupa klik tombol <b>Simpan</b> setelah melakukan perubahan.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 shrink-0 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleAddNewDirectProject}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 text-xs font-black text-white shadow-xl shadow-emerald-950/70 transition-all cursor-pointer hover:scale-105 uppercase tracking-wider"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Tambah Projek Baru</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveAllProjectsFromList}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-black text-white shadow-xl shadow-blue-950/70 transition-all cursor-pointer hover:scale-105 uppercase tracking-wider"
                >
                  <Save className="w-4 h-4" />
                  <span>💾 Simpan Semua Projek</span>
                </button>
              </div>
            </div>

            {/* ========================================================
                SECTION 1: TEKS JUDUL, BADGE & GARIS HAZARD BERGERAK
                ======================================================== */}
            <div className="p-4 sm:p-7 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#0f233a] via-[#091626] to-[#060f1c] border-2 border-emerald-500/40 shadow-2xl space-y-4 sm:space-y-5">
              <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-white/15">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 sm:p-2 rounded-xl bg-amber-500/20 border border-amber-400 text-amber-300">
                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-base font-bold text-white font-sans uppercase tracking-wider">
                      1. Pengaturan Teks Judul & Garis Bergerak Sudut (Halaman 3)
                    </h3>
                    <p className="text-[10px] sm:text-xs text-slate-300 font-mono mt-0.5">
                      Ubah teks pita hazard caution tape, judul besar, dan deskripsi halaman projek.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-3.5 sm:space-y-4">
                {/* Teks Garis Hazard Bergerak Sudut */}
                <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#060e19] border-2 border-amber-500/40 space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] sm:text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
                      🟡 Teks Garis Bergerak Sudut (Hazard Caution Tape)
                    </label>
                    <span className="text-[9.5px] sm:text-[10.5px] font-mono text-amber-400">Animasi Sudut</span>
                  </div>
                  <input
                    type="text"
                    value={profileForm.projectsHazardText !== undefined ? profileForm.projectsHazardText : ''}
                    onChange={(e) => setProfileForm({ ...profileForm, projectsHazardText: e.target.value })}
                    placeholder={`• PORTO FOLIO ${(customer.profile?.fullName || 'RISKI SAPUTRA').toUpperCase()} • PORTO FOLIO ${(customer.profile?.fullName || 'RISKI SAPUTRA').toUpperCase()} •`}
                    className="w-full px-3.5 sm:px-4 py-2 sm:py-3 rounded-xl bg-[#081525] border-2 border-amber-500/50 text-xs sm:text-sm text-amber-200 outline-none focus:border-amber-300 font-mono font-bold shadow-inner"
                  />
                  <p className="text-[10.5px] sm:text-[11px] text-slate-400">
                    * Teks ini bergerak otomatis tanpa henti pada pita kuning miring di sudut kiri dan kanan Halaman 3.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {/* Badge Kecil */}
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5 font-bold uppercase">
                      Badge Atas Halaman 3
                    </label>
                    <input
                      type="text"
                      value={profileForm.projectsBadge !== undefined ? profileForm.projectsBadge : '03 / PROJECT SHOWCASE'}
                      onChange={(e) => setProfileForm({ ...profileForm, projectsBadge: e.target.value })}
                      placeholder="03 / PROJECT SHOWCASE"
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#060e19] border-2 border-slate-700 text-xs text-white outline-none focus:border-emerald-400 font-mono font-bold"
                    />
                  </div>

                  {/* Judul Utama */}
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5 font-bold uppercase">
                      Judul Besar Halaman 3
                    </label>
                    <input
                      type="text"
                      value={profileForm.projectsTitle !== undefined ? profileForm.projectsTitle : 'COMPLETED WORKS'}
                      onChange={(e) => setProfileForm({ ...profileForm, projectsTitle: e.target.value })}
                      placeholder="COMPLETED WORKS / KARYA & PROYEK UNGGULAN"
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#060e19] border-2 border-slate-700 text-xs text-white outline-none focus:border-emerald-400 font-bold"
                    />
                  </div>
                </div>

                {/* Subtitle Deskripsi */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 font-bold uppercase">
                    Subtitle / Deskripsi Halaman 3
                  </label>
                  <textarea
                    rows={2}
                    value={profileForm.projectsSubtitle !== undefined ? profileForm.projectsSubtitle : ''}
                    onChange={(e) => setProfileForm({ ...profileForm, projectsSubtitle: e.target.value })}
                    placeholder="From Mechanical Engineering, Modern Web Apps to CV Portfolio Templates"
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#060e19] border-2 border-slate-700 text-xs text-slate-200 outline-none focus:border-emerald-400 leading-relaxed custom-scrollbar font-sans"
                  />
                </div>

                {/* Ringkasan Footer Bawah */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 font-bold uppercase">
                    Teks Ringkasan Footer Bawah
                  </label>
                  <input
                    type="text"
                    value={profileForm.projectsFooterSummary !== undefined ? profileForm.projectsFooterSummary : 'MESIN, WEB APPS & TEMPLATE CV'}
                    onChange={(e) => setProfileForm({ ...profileForm, projectsFooterSummary: e.target.value })}
                    placeholder="MESIN, WEB APPS & TEMPLATE CV / PROJEK & KARYA TERVERIFIKASI"
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#060e19] border-2 border-slate-700 text-xs text-white outline-none focus:border-emerald-400 font-mono"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 text-xs font-bold text-white shadow-lg cursor-pointer transition-all hover:scale-105"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Pengaturan Teks Halaman 3</span>
                  </button>
                </div>
              </form>
            </div>

            {/* ========================================================
                SECTION 2: DAFTAR & FORM EDIT SETIAP PROJEK (LANGSUNG DI HALAMAN)
                ======================================================== */}
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/15">
                <div>
                  <h3 className="text-sm sm:text-lg font-black text-white font-sans uppercase tracking-wider flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                    <span>2. Formulir Edit Setiap Projek ({projectsListForm.length} Projek)</span>
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">
                    Isi dan ganti foto setiap karya rekayasa Anda langsung pada kartu di bawah ini.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddNewDirectProject}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-md cursor-pointer transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Tambah Projek Baru</span>
                </button>
              </div>

              {projectsListForm.length === 0 ? (
                <div className="p-8 sm:p-12 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#0e1e33] to-[#07111e] border-2 border-dashed border-emerald-500/40 text-center space-y-3 sm:space-y-4 shadow-xl">
                  <FolderKanban className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-400 mx-auto opacity-80" />
                  <div className="text-sm sm:text-base font-bold text-white">Belum Ada Projek Tersimpan</div>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto">
                    Klik tombol di bawah untuk menambahkan karya dan hasil kerja rekayasa Anda.
                  </p>
                  <button
                    type="button"
                    onClick={handleAddNewDirectProject}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-black text-white cursor-pointer uppercase tracking-wider"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Projek Sekarang</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  {projectsListForm.map((proj, idx) => {
                    const num = String(idx + 1).padStart(2, '0');
                    return (
                      <div
                        key={proj.id || idx}
                        className="p-4 sm:p-7 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#0f233a] via-[#091626] to-[#060f1c] border-2 border-emerald-500/50 hover:border-emerald-400 transition-all shadow-2xl space-y-4 sm:space-y-5 relative overflow-hidden"
                      >
                        {/* Top Glow Stripe */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />

                        {/* Header Kartu Projek: Nomor, Urutan, Hapus */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 sm:pb-4 border-b border-white/15">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-xs sm:text-base font-mono font-black text-emerald-300 bg-emerald-950/90 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-lg sm:rounded-xl border border-emerald-400/60 shadow-md shrink-0">
                              PROJEK #{num}
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-white font-sans truncate">
                              {proj.title || 'Tanpa Judul'}
                            </span>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                            {/* Reorder Buttons */}
                            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
                              <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 px-1">Urutan:</span>
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => handleMoveDirectProjectUp(idx)}
                                className={`px-2 py-0.5 sm:py-1 rounded-lg text-[11px] sm:text-xs font-bold ${
                                  idx === 0
                                    ? 'text-slate-600 cursor-not-allowed'
                                    : 'bg-white/10 hover:bg-white/20 text-white cursor-pointer'
                                }`}
                                title="Pindah ke Atas"
                              >
                                ↑ Naik
                              </button>
                              <button
                                type="button"
                                disabled={idx === projectsListForm.length - 1}
                                onClick={() => handleMoveDirectProjectDown(idx)}
                                className={`px-2 py-0.5 sm:py-1 rounded-lg text-[11px] sm:text-xs font-bold ${
                                  idx === projectsListForm.length - 1
                                    ? 'text-slate-600 cursor-not-allowed'
                                    : 'bg-white/10 hover:bg-white/20 text-white cursor-pointer'
                                }`}
                                title="Pindah ke Bawah"
                              >
                                ↓ Turun
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDeleteDirectProject(idx)}
                              className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/50 text-rose-300 hover:text-white text-[11px] sm:text-xs font-mono font-bold cursor-pointer transition-colors"
                              title="Hapus Projek Ini"
                            >
                              <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              <span>Hapus</span>
                            </button>
                          </div>
                        </div>

                        {/* Formulir Langsung Projek */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
                          {/* Kolom Kiri: Foto Sampul & Tipe Projek */}
                          <div className="lg:col-span-4 space-y-3 sm:space-y-4">
                            {/* Upload & Preview Foto Sampul */}
                            <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#060e19] border-2 border-emerald-500/30 space-y-2.5">
                              <label className="block text-xs font-mono text-emerald-300 font-bold uppercase tracking-wider">
                                📸 Foto Sampul Projek
                              </label>

                              {proj.coverImage ? (
                                <div className="relative h-36 sm:h-44 w-full rounded-xl sm:rounded-2xl overflow-hidden border-2 border-emerald-400 bg-black shadow-lg">
                                  <img
                                    src={proj.coverImage}
                                    alt={proj.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="h-32 sm:h-44 w-full rounded-xl sm:rounded-2xl border-2 border-dashed border-slate-700 bg-black/30 flex flex-col items-center justify-center text-slate-400 text-xs font-mono gap-1">
                                  <Camera className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400 opacity-60" />
                                  <span>Belum Ada Foto</span>
                                </div>
                              )}

                              <div className="space-y-2">
                                <label className="w-full inline-flex items-center justify-center gap-2 py-2 sm:py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-xs font-bold text-white cursor-pointer transition-all shadow-md hover:scale-[1.02]">
                                  <UploadCloud className="w-4 h-4" />
                                  <span>{proj.coverImage ? 'Ganti Foto Projek' : 'Pilih Foto Projek'}</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleProjectCoverChange(idx, e)}
                                  />
                                </label>

                                {proj.coverImage && (
                                  <button
                                    type="button"
                                    onClick={() => handleProjectCoverRemove(idx)}
                                    className="w-full py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-xs font-mono cursor-pointer transition-colors"
                                  >
                                    Hapus Foto
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Tipe Projek */}
                            <div>
                              <label className="block text-xs font-mono text-slate-300 mb-1 font-bold">
                                Tipe Projek
                              </label>
                              <select
                                value={proj.type || 'mechanical'}
                                onChange={(e) => handleUpdateProjectField(idx, 'type', e.target.value)}
                                className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl bg-[#060e19] border-2 border-slate-700 text-xs text-white outline-none focus:border-emerald-400 font-semibold"
                              >
                                <option value="mechanical">Mesin & Manufaktur</option>
                                <option value="webapp">Web Application</option>
                                <option value="template">Template CV / Portofolio</option>
                              </select>
                            </div>

                            {/* URL Live Website / Blueprint */}
                            <div>
                              <label className="block text-xs font-mono text-slate-300 mb-1 font-bold">
                                URL Live Website / Blueprint (Opsional)
                              </label>
                              <div className="flex items-center gap-2 px-3 py-2 sm:py-2.5 rounded-xl bg-[#060e19] border-2 border-slate-700">
                                <Globe className="w-4 h-4 text-amber-400 shrink-0" />
                                <input
                                  type="url"
                                  value={proj.liveUrl || ''}
                                  onChange={(e) => handleUpdateProjectField(idx, 'liveUrl', e.target.value)}
                                  placeholder="https://aplikasi-anda.vercel.app"
                                  className="w-full bg-transparent text-xs text-white outline-none font-mono"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Kolom Kanan: Judul, Kategori, Deskripsi, 3 Tahap Rekayasa */}
                          <div className="lg:col-span-8 space-y-3 sm:space-y-4">
                            {/* Judul Projek */}
                            <div>
                              <label className="block text-xs font-mono text-emerald-300 mb-1 font-bold uppercase tracking-wider">
                                Judul Projek / Nama Karya *
                              </label>
                              <input
                                type="text"
                                value={proj.title || ''}
                                onChange={(e) => handleUpdateProjectField(idx, 'title', e.target.value)}
                                placeholder="Contoh: Conveyor System Transfer 1500 RPM / Web Portal LMS Bimbel"
                                className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[#060e19] border-2 border-emerald-500/50 text-xs sm:text-sm text-white font-bold outline-none focus:border-emerald-300 shadow-inner"
                              />
                            </div>

                            {/* Kategori & Sub-Kategori */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-mono text-slate-300 mb-1 font-bold">
                                  Kategori Utama
                                </label>
                                <input
                                  type="text"
                                  value={proj.category || ''}
                                  onChange={(e) => handleUpdateProjectField(idx, 'category', e.target.value)}
                                  placeholder="Mesin & Industri / Web Apps"
                                  className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#060e19] border-2 border-slate-700 text-xs text-white outline-none focus:border-emerald-400 font-semibold"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-mono text-slate-300 mb-1 font-bold">
                                  Sub-Kategori / Bidang
                                </label>
                                <input
                                  type="text"
                                  value={proj.subCategory || ''}
                                  onChange={(e) => handleUpdateProjectField(idx, 'subCategory', e.target.value)}
                                  placeholder="Material Handling / IoT"
                                  className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#060e19] border-2 border-slate-700 text-xs text-white outline-none focus:border-emerald-400"
                                />
                              </div>
                            </div>

                            {/* Deskripsi Singkat */}
                            <div>
                              <label className="block text-xs font-mono text-slate-300 mb-1 font-bold">
                                Deskripsi Ringkas Projek *
                              </label>
                              <textarea
                                rows={2}
                                value={proj.shortDesc || ''}
                                onChange={(e) => handleUpdateProjectField(idx, 'shortDesc', e.target.value)}
                                placeholder="Jelaskan secara ringkas fungsi projek, tantangan teknis, dan hasil yang dicapai..."
                                className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#060e19] border-2 border-slate-700 text-xs text-slate-200 outline-none focus:border-emerald-400 leading-relaxed custom-scrollbar font-sans"
                              />
                            </div>

                            {/* 3 Tahap Rekayasa Teknik */}
                            <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#060e19] border-2 border-emerald-500/30 space-y-2.5 sm:space-y-3">
                              <div className="text-xs font-mono text-emerald-300 font-black uppercase tracking-wider flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>3 Tahap Rekayasa Teknik (Pilar Karya):</span>
                              </div>

                              <div>
                                <label className="block text-[11px] sm:text-xs font-mono text-emerald-300 mb-1 font-bold">
                                  1. Perancangan / Planning / Desain 3D
                                </label>
                                <input
                                  type="text"
                                  value={proj.planning || ''}
                                  onChange={(e) => handleUpdateProjectField(idx, 'planning', e.target.value)}
                                  placeholder="Contoh: Desain Geometri 3D CAD & Pemilihan Material SS400"
                                  className="w-full px-3 sm:px-3.5 py-2 rounded-xl bg-[#081525] border border-emerald-500/40 text-xs text-white outline-none focus:border-emerald-300 font-semibold"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] sm:text-xs font-mono text-rose-300 mb-1 font-bold">
                                  2. Simulasi & Analisis / Analysis / FEA
                                </label>
                                <input
                                  type="text"
                                  value={proj.analysis || ''}
                                  onChange={(e) => handleUpdateProjectField(idx, 'analysis', e.target.value)}
                                  placeholder="Contoh: FEA Static Stress, Deformasi < 0.5mm & Safety Factor 2.8"
                                  className="w-full px-3 sm:px-3.5 py-2 rounded-xl bg-[#081525] border border-rose-500/40 text-xs text-white outline-none focus:border-rose-300 font-semibold"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] sm:text-xs font-mono text-amber-300 mb-1 font-bold">
                                  3. Fabrikasi / Deployment / Produksi
                                </label>
                                <input
                                  type="text"
                                  value={proj.fabrication || ''}
                                  onChange={(e) => handleUpdateProjectField(idx, 'fabrication', e.target.value)}
                                  placeholder="Contoh: Machining CNC, Pengelasan SMAW, & Uji Beban 500kg"
                                  className="w-full px-3 sm:px-3.5 py-2 rounded-xl bg-[#081525] border border-amber-500/40 text-xs text-white outline-none focus:border-amber-300 font-semibold"
                                />
                              </div>
                            </div>

                            {/* Software / Tools Stack */}
                            <div>
                              <label className="block text-xs font-mono text-slate-300 mb-1 font-bold">
                                Software / Tools Stack (Pisahkan dengan tanda koma)
                              </label>
                              <input
                                type="text"
                                value={proj.toolsStr !== undefined ? proj.toolsStr : (Array.isArray(proj.tools) ? proj.tools.join(', ') : '')}
                                onChange={(e) => handleUpdateProjectField(idx, 'toolsStr', e.target.value)}
                                placeholder="Autodesk Inventor, SolidWorks, ANSYS FEA, AutoCAD"
                                className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#060e19] border-2 border-slate-700 text-xs text-white outline-none focus:border-emerald-400 font-mono"
                              />
                            </div>

                            {/* Tombol Simpan Kartu Projek Ini */}
                            <div className="flex justify-end pt-2 sm:pt-3">
                              <button
                                type="button"
                                onClick={() => handleSaveSingleProjectFromList(idx)}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 text-xs font-black text-white shadow-xl shadow-emerald-950/70 cursor-pointer transition-all hover:scale-105 uppercase tracking-wider"
                              >
                                <Save className="w-4 h-4" />
                                <span>Simpan Projek #{num} Ini</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ========================================================
                SECTION 3: MANAJEMEN KATEGORI TAB FILTER
                ======================================================== */}
            <div className="p-4 sm:p-7 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#0f233a] via-[#091626] to-[#060f1c] border-2 border-emerald-500/40 shadow-2xl space-y-4 sm:space-y-5">
              <div className="flex items-center gap-2.5 pb-2.5 sm:pb-3 border-b border-white/15">
                <div className="p-1.5 sm:p-2 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-300">
                  <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-base font-bold text-white font-sans uppercase tracking-wider">
                    3. Manajemen Kategori Filter Tab (Halaman 3)
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-300 font-mono mt-0.5">
                    Kategori tombol filter di bagian atas galeri karya Anda.
                  </p>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#060e19] border border-slate-800 space-y-2.5 sm:space-y-3">
                <label className="block text-xs font-mono text-slate-300 font-bold">
                  Daftar Kategori yang Aktif:
                </label>
                
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 text-[11px] sm:text-xs font-bold font-mono">
                    Semua (Otomatis)
                  </span>
                  {(customer.projectCategories && customer.projectCategories.length > 0
                    ? customer.projectCategories
                    : ['Mesin & Industri', 'Web Apps & Portofolio', 'Template CV']
                  ).map((cat, cIdx) => (
                    <div
                      key={cIdx}
                      className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-[11px] sm:text-xs font-bold font-sans shadow-md"
                    >
                      <span>{cat}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const currentCats = customer.projectCategories || ['Mesin & Industri', 'Web Apps & Portofolio', 'Template CV'];
                          const updated = currentCats.filter((_, i) => i !== cIdx);
                          handleSaveCategories(updated);
                        }}
                        className="text-slate-400 hover:text-rose-400 font-bold cursor-pointer"
                        title="Hapus Kategori"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Tambah Kategori Baru */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const input = e.target.elements.newCat;
                  const val = input.value.trim();
                  if (!val) return;
                  const currentCats = customer.projectCategories || ['Mesin & Industri', 'Web Apps & Portofolio', 'Template CV'];
                  if (!currentCats.includes(val)) {
                    handleSaveCategories([...currentCats, val]);
                  }
                  input.value = '';
                }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3"
              >
                <input
                  type="text"
                  name="newCat"
                  placeholder="Ketik nama kategori baru (misal: Desain 3D, Fabrikasi CNC, IoT)..."
                  className="flex-1 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#060e19] border-2 border-slate-700 text-xs text-white outline-none focus:border-emerald-400 font-semibold"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 text-xs font-bold text-white shadow-md cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Kategori</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: HALAMAN 4 (KONTAK & MEDIA SOSIAL)
            ======================================================== */}
        {currentTab === 'page4' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Visual Page Guide Banner */}
            <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-teal-950/60 via-[#0a1628] to-[#090E17] border border-teal-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[10.5px] font-mono font-bold text-teal-300 bg-teal-950/80 px-2.5 py-0.5 rounded-full border border-teal-500/40">
                  <Share2 className="w-3.5 h-3.5" />
                  <span>HALAMAN 4: KONTAK & FOOTER (CONTACT SECTION)</span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white font-sans">
                  Saluran Komunikasi Langsung & Media Sosial
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-300 max-w-2xl leading-relaxed">
                  Halaman penutup portofolio tempat klien, recruiter, dan partner menghubungi Anda secara cepat via WhatsApp, Email, dan LinkedIn.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveSocial} className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-[#090E17]/90 border border-white/15 shadow-xl space-y-4 max-w-3xl">
              <h3 className="text-xs sm:text-sm font-bold text-white uppercase font-sans tracking-wider pb-2 border-b border-white/10">
                Informasi Kontak Resmi
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Nomor WhatsApp</span>
                  </label>
                  <input
                    type="text"
                    value={socialForm.whatsapp || profileForm.whatsapp || ''}
                    onChange={(e) => setSocialForm({ ...socialForm, whatsapp: e.target.value })}
                    placeholder="+62 812-3456-7890"
                    className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-teal-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Email Profesional</span>
                  </label>
                  <input
                    type="email"
                    value={socialForm.email || profileForm.email || ''}
                    onChange={(e) => setSocialForm({ ...socialForm, email: e.target.value })}
                    placeholder="nama.anda@example.com"
                    className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-teal-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <LinkedinIcon className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>URL Profil LinkedIn</span>
                  </label>
                  <input
                    type="text"
                    value={socialForm.linkedin || ''}
                    onChange={(e) => setSocialForm({ ...socialForm, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-teal-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <InstagramIcon className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                    <span>URL Profil Instagram</span>
                  </label>
                  <input
                    type="text"
                    value={socialForm.instagram || ''}
                    onChange={(e) => setSocialForm({ ...socialForm, instagram: e.target.value })}
                    placeholder="https://instagram.com/username"
                    className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-teal-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>Lokasi / Domisili Kerja</span>
                </label>
                <input
                  type="text"
                  value={socialForm.location || profileForm.location || ''}
                  onChange={(e) => setSocialForm({ ...socialForm, location: e.target.value })}
                  placeholder="Contoh: Jakarta / Riau, Indonesia"
                  className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-teal-400"
                />
              </div>

              <div className="flex justify-end pt-3 border-t border-white/10">
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-700 hover:from-teal-500 text-xs font-bold text-white shadow-lg cursor-pointer transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Kontak & Medsos</span>
                </button>
              </div>
            </form>
          </div>
        )}


      </main>

      {/* ========================================================
          MODAL: TAMBAH / EDIT PROJEK (HALAMAN 3)
          ======================================================== */}
      <AnimatePresence>
        {showProjectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              className="relative w-full max-w-2xl p-4 sm:p-7 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#0f233a] via-[#091626] to-[#060f1c] border-2 border-emerald-400 shadow-[0_0_80px_rgba(16,185,129,0.35)] text-white space-y-4 sm:space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/15">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="p-2 sm:p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 shadow-lg shadow-emerald-950/60 shrink-0">
                    <FolderKanban className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-lg font-black font-sans text-white uppercase tracking-wider">
                      {editingProjectId ? '✏️ Edit Data Karya' : '✨ Tambah Projek Baru'}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-emerald-300/90 font-mono mt-0.5">
                      Lengkapi data karya, foto, deskripsi, dan 3 tahap teknis.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-rose-900/80 border border-white/20 hover:border-rose-400 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-all shrink-0"
                  title="Tutup Modal"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveProject} className="space-y-3.5 sm:space-y-4">
                {/* Judul Projek */}
                <div>
                  <label className="block text-xs font-mono text-emerald-300 mb-1 font-bold uppercase tracking-wider">
                    Judul Projek / Nama Karya *
                  </label>
                  <input
                    type="text"
                    required
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    placeholder="Contoh: Conveyor System Transfer 1500 RPM / Web Portal LMS Bimbel"
                    className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[#050d18] border-2 border-emerald-500/50 text-xs sm:text-sm text-white font-bold outline-none focus:border-emerald-300 shadow-inner"
                  />
                </div>

                {/* Tipe & Kategori */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1 font-bold">Tipe Projek</label>
                    <select
                      value={projectForm.type || 'mechanical'}
                      onChange={(e) => setProjectForm({ ...projectForm, type: e.target.value })}
                      className="w-full px-3 py-2 sm:py-2.5 rounded-xl bg-[#050d18] border-2 border-slate-700 text-xs text-white outline-none focus:border-emerald-400 font-semibold"
                    >
                      <option value="mechanical">Mesin & Manufaktur</option>
                      <option value="webapp">Web Application</option>
                      <option value="template">Template CV / Portofolio</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1 font-bold">Kategori Utama</label>
                    <input
                      type="text"
                      value={projectForm.category}
                      onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                      placeholder="Mesin & Industri / Web Apps"
                      className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#050d18] border-2 border-slate-700 text-xs text-white outline-none focus:border-emerald-400 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1 font-bold">Sub-Kategori</label>
                    <input
                      type="text"
                      value={projectForm.subCategory}
                      onChange={(e) => setProjectForm({ ...projectForm, subCategory: e.target.value })}
                      placeholder="Material Handling / IoT"
                      className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#050d18] border-2 border-slate-700 text-xs text-white outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                {/* Direct File Picker for Project Cover */}
                <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#050c17] border-2 border-emerald-500/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-emerald-300 font-bold uppercase tracking-wider">
                      Foto Sampul / Dokumentasi Karya
                    </label>
                    <span className="text-[10px] sm:text-[11px] font-mono text-slate-400">JPG, PNG, WEBP</span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3 sm:gap-4">
                    {projectForm.coverImage ? (
                      <div className="relative w-28 h-20 rounded-2xl overflow-hidden border-2 border-emerald-400 shrink-0 bg-black shadow-lg">
                        <img
                          src={projectForm.coverImage}
                          alt="Cover"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-28 h-20 rounded-2xl border-2 border-dashed border-slate-600 bg-white/5 flex flex-col items-center justify-center text-[10px] text-slate-400 shrink-0">
                        <Camera className="w-5 h-5 mb-1 opacity-60 text-emerald-400" />
                        <span>Belum Ada Foto</span>
                      </div>
                    )}
                    
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
                      <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-xs font-black text-white cursor-pointer transition-all shadow-lg hover:scale-105 uppercase tracking-wider">
                        <UploadCloud className="w-4 h-4" />
                        <span>{projectForm.coverImage ? 'Ganti Foto' : 'Pilih Foto'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, (dataUrl) => setProjectForm({ ...projectForm, coverImage: dataUrl }))}
                        />
                      </label>

                      {projectForm.coverImage && (
                        <button
                          type="button"
                          onClick={() => setProjectForm({ ...projectForm, coverImage: '' })}
                          className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/50 text-rose-300 text-xs font-mono font-bold cursor-pointer transition-colors"
                        >
                          Hapus Foto
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* URL Live Website / Blueprint Link */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1 font-bold">
                    URL Live Website / Link Blueprint (Opsional)
                  </label>
                  <div className="flex items-center gap-2 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#050d18] border-2 border-slate-700">
                    <Globe className="w-4 h-4 text-amber-400 shrink-0" />
                    <input
                      type="url"
                      value={projectForm.liveUrl || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                      placeholder="https://aplikasi-anda.vercel.app atau link Google Drive"
                      className="w-full bg-transparent text-xs text-white outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Deskripsi Singkat */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1 font-bold">
                    Deskripsi Ringkas Projek *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={projectForm.shortDesc}
                    onChange={(e) => setProjectForm({ ...projectForm, shortDesc: e.target.value })}
                    placeholder="Jelaskan secara ringkas fungsi projek, tantangan teknis, dan hasil yang dicapai..."
                    className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#050d18] border-2 border-slate-700 text-xs text-slate-200 outline-none focus:border-emerald-400 leading-relaxed custom-scrollbar font-sans"
                  />
                </div>

                {/* 3 Tahap Rekayasa Teknik */}
                <div className="space-y-2.5 sm:space-y-3 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#050c17] border-2 border-emerald-500/30">
                  <div className="text-xs font-mono text-emerald-300 font-black uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>3 Tahap Rekayasa Teknik (Pilar Karya):</span>
                  </div>
                  <div>
                    <label className="block text-[11px] sm:text-xs font-mono text-emerald-300 mb-1 font-bold">
                      1. Perancangan / Planning / Desain 3D
                    </label>
                    <input
                      type="text"
                      value={projectForm.planning}
                      onChange={(e) => setProjectForm({ ...projectForm, planning: e.target.value })}
                      placeholder="Contoh: Desain Geometri 3D & Pemilihan Material Baja SS400"
                      className="w-full px-3 sm:px-3.5 py-2 rounded-xl bg-[#081525] border border-emerald-500/40 text-xs text-white outline-none focus:border-emerald-300 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] sm:text-xs font-mono text-rose-300 mb-1 font-bold">
                      2. Simulasi & Analisis / Analysis / FEA
                    </label>
                    <input
                      type="text"
                      value={projectForm.analysis}
                      onChange={(e) => setProjectForm({ ...projectForm, analysis: e.target.value })}
                      placeholder="Contoh: FEA Static Stress, Deformasi < 0.5mm & Safety Factor 2.8"
                      className="w-full px-3 sm:px-3.5 py-2 rounded-xl bg-[#081525] border border-rose-500/40 text-xs text-white outline-none focus:border-rose-300 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] sm:text-xs font-mono text-amber-300 mb-1 font-bold">
                      3. Fabrikasi / Deployment / Produksi
                    </label>
                    <input
                      type="text"
                      value={projectForm.fabrication}
                      onChange={(e) => setProjectForm({ ...projectForm, fabrication: e.target.value })}
                      placeholder="Contoh: Machining Milling CNC, Pengelasan SMAW, & Uji Beban 500kg"
                      className="w-full px-3 sm:px-3.5 py-2 rounded-xl bg-[#081525] border border-amber-500/40 text-xs text-white outline-none focus:border-amber-300 font-semibold"
                    />
                  </div>
                </div>

                {/* Software & Tools Stack */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1 font-bold">
                    Software / Tools Stack (Pisahkan dengan tanda koma)
                  </label>
                  <input
                    type="text"
                    value={projectForm.toolsStr}
                    onChange={(e) => setProjectForm({ ...projectForm, toolsStr: e.target.value })}
                    placeholder="Autodesk Inventor, SolidWorks, ANSYS FEA, AutoCAD"
                    className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#050d18] border-2 border-slate-700 text-xs text-white outline-none focus:border-emerald-400 font-mono"
                  />
                </div>

                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-white/15">
                  <button
                    type="button"
                    onClick={() => setShowProjectModal(false)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white cursor-pointer transition-colors text-center"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-xs font-black text-white shadow-xl shadow-emerald-950/70 cursor-pointer transition-all hover:scale-105 uppercase tracking-wider"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingProjectId ? 'Simpan Perubahan' : 'Tambah Projek'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================
          MODAL: TAMBAH / EDIT SKILL (HALAMAN 2)
          ======================================================== */}
      <AnimatePresence>
        {showSkillModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              className="w-full max-w-md p-4 sm:p-6 rounded-2xl bg-[#090E17] border border-blue-500/40 shadow-2xl text-white space-y-3.5 sm:space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-sm sm:text-base font-bold font-sans">
                  {editingSkillId ? 'Edit Keahlian' : 'Tambah Keahlian Baru'}
                </h3>
                <button type="button" onClick={() => setShowSkillModal(false)} className="text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveSkill} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1 font-bold">
                    Nama Keahlian / Software / Kompetensi *
                  </label>
                  <input
                    type="text"
                    required
                    value={skillForm.name}
                    onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                    placeholder="Contoh: AutoCAD 2D & 3D / Manajemen Kurikulum"
                    className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1 font-bold">
                    Kategori Grup Keahlian *
                  </label>
                  <input
                    type="text"
                    required
                    value={skillForm.category}
                    onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                    placeholder="Design Software / Keahlian Utama / Pedagogik"
                    className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-blue-400 font-mono"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-mono text-slate-400 font-bold">Persentase Penguasaan</label>
                    <span className="text-xs font-mono font-bold text-amber-300">{skillForm.percent || 90}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="1"
                    value={skillForm.percent || 90}
                    onChange={(e) => setSkillForm({ ...skillForm, percent: parseInt(e.target.value) })}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1 font-bold">Level Kemahiran</label>
                  <select
                    value={skillForm.level}
                    onChange={(e) => setSkillForm({ ...skillForm, level: e.target.value })}
                    className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-blue-400"
                  >
                    <option value="Expert">Expert / Sangat Mahir (90-100%)</option>
                    <option value="Advanced">Advanced / Mahir (80-89%)</option>
                    <option value="Intermediate">Intermediate / Menengah (65-79%)</option>
                    <option value="Beginner">Beginner / Dasar (40-64%)</option>
                  </select>
                </div>

                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowSkillModal(false)}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white/10 text-xs font-semibold text-white cursor-pointer text-center"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-xs font-bold text-white shadow-lg cursor-pointer text-center"
                  >
                    {editingSkillId ? 'Perbarui Skill' : 'Simpan Skill'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================
          MODAL: TAMBAH / EDIT SERTIFIKAT (HALAMAN 2)
          ======================================================== */}
      <AnimatePresence>
        {showCertModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              className="w-full max-w-md p-4 sm:p-6 rounded-2xl bg-[#090E17] border border-purple-500/40 shadow-2xl text-white space-y-3.5 sm:space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-sm sm:text-base font-bold font-sans">
                  {editingCertId ? 'Edit Sertifikat' : 'Tambah Sertifikat Baru'}
                </h3>
                <button type="button" onClick={() => setShowCertModal(false)} className="text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveCert} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1 font-bold">Nama Sertifikat / Kredensial *</label>
                  <input
                    type="text"
                    required
                    value={certForm.title}
                    onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                    placeholder="Contoh: Sertifikasi Pendidik / Certified Professional"
                    className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1 font-bold">Lembaga Penerbit / Organisasi *</label>
                  <input
                    type="text"
                    required
                    value={certForm.issuer}
                    onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                    placeholder="Contoh: BNSP / Kemendikbud / Autodesk Inc"
                    className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1 font-bold">Tahun Penerbitan</label>
                  <input
                    type="text"
                    value={certForm.year}
                    onChange={(e) => setCertForm({ ...certForm, year: e.target.value })}
                    placeholder="2025"
                    className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-purple-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1 font-bold">Keterangan / Deskripsi Singkat</label>
                  <textarea
                    rows={2}
                    value={certForm.desc || ''}
                    onChange={(e) => setCertForm({ ...certForm, desc: e.target.value })}
                    placeholder="Deskripsi keahlian atau kompetensi yang disertifikasi..."
                    className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-xs text-white outline-none focus:border-purple-400 leading-relaxed"
                  />
                </div>

                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowCertModal(false)}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white/10 text-xs font-semibold text-white cursor-pointer text-center"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-xs font-bold text-white shadow-lg cursor-pointer text-center"
                  >
                    {editingCertId ? 'Perbarui Sertifikat' : 'Simpan Sertifikat'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Interactive Multi-Device Live Preview Modal */}
      <LivePreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        previewUrl={`/portfolio/${customer.slug || customer.id}`}
        customerSlug={customer.slug || customer.id}
        title={`Live Preview • ${customer.name}`}
      />
    </div>
  );
}
