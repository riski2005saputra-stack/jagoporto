import React, { createContext, useContext, useState, useEffect } from 'react';
import { PROJECTS_DATA } from '../data/projects';
import riskiPortrait from '../assets/riski-portrait.jpg';
import riskiAboutPortrait from '../assets/riski-about-portrait.jpg';
import orangImg from '../assets/ORANG.png';
import { db } from '../services/database';

// Initial Master Owner Data (OWNER-001)
const DEFAULT_OWNER_DATA = {
  id: 'OWNER-001',
  role: 'admin',
  profile: {
    fullName: 'Riski Saputra',
    jobTitle: 'Mechanical Engineer & Product Designer',
    specialist: 'Consultation Projek',
    bio: 'Saya berfokus pada perancangan produk, analisis kekuatan struktur, dan pengembangan solusi teknik yang inovatif untuk industri modern.',
    email: 'riski2005saputra@gmail.com',
    whatsapp: '+62 859-2332-0768',
    avatarUrl: riskiPortrait,
    aboutAvatarUrl: riskiAboutPortrait,
    heroPersonUrl: orangImg,
    education: 'D3 Teknik Mesin UNRI',
    experienceYears: '3+',
    certCount: '6+',
    isPublished: true,
  },
  skills: [
    { id: 'sk-1', name: '3D CAD Modeling & Kinematic Assembly', level: 'Expert', category: 'CAD/CAM' },
    { id: 'sk-2', name: 'Finite Element Analysis (FEA) & Simulation', level: 'Advanced', category: 'Engineering' },
    { id: 'sk-3', name: 'Industrial Product R&D & Fabrication', level: 'Expert', category: 'Manufacturing' },
    { id: 'sk-4', name: 'Autodesk Inventor & SolidWorks', level: 'Expert', category: 'Software' },
    { id: 'sk-5', name: 'Modern Web Apps & Telemetry Dashboards', level: 'Advanced', category: 'Software' },
  ],
  projects: PROJECTS_DATA,
  certificates: [
    {
      id: 'cert-1',
      title: 'Certified Mechanical Design Associate (SolidWorks)',
      issuer: 'Dassault Systèmes',
      year: '2024',
      isActive: true,
    },
    {
      id: 'cert-2',
      title: 'Autodesk Certified Professional: Inventor',
      issuer: 'Autodesk Inc.',
      year: '2024',
      isActive: true,
    },
    {
      id: 'cert-3',
      title: 'Industrial Safety & HSE Standards',
      issuer: 'PT Pertamina RU II Dumai',
      year: '2023',
      isActive: true,
    },
    {
      id: 'cert-4',
      title: 'FEA Simulation & Structural Analysis',
      issuer: 'Engineering Research Association',
      year: '2023',
      isActive: true,
    },
  ],
  cv: {
    fileName: 'CV Riski Saputra.pdf',
    fileUrl: '/CV%20Riski%20Saputra.pdf',
    lastUpdated: '2025-02',
  },
  socialMedia: {
    linkedin: 'https://www.linkedin.com/in/riski2005saputra/',
    instagram: 'https://www.instagram.com/riskisaputra_1922/',
    email: 'mailto:riski2005saputra@gmail.com',
    whatsapp: 'https://wa.me/6285923320768',
  },
};

// Initial Sample Customers for Multi-Tenant Demonstration
const DEFAULT_CUSTOMERS = [
  {
    id: 'CUST-001',
    name: 'Budi Santoso',
    slug: 'budi-santoso',
    email: 'budi.santoso@example.com',
    status: 'active',
    createdAt: '2026-03-01',
    profile: {
      fullName: 'Budi Santoso, S.T.',
      jobTitle: 'Civil & Structural Design Engineer',
      bio: 'Spesialis perencanaan struktur beton, baja, dan pemodelan Building Information Modeling (BIM).',
      email: 'budi.santoso@example.com',
      whatsapp: '+62 812-3456-7890',
      avatarUrl: riskiPortrait,
      education: 'S1 Teknik Sipil',
      experienceYears: '4+',
      certCount: '5+',
      isPublished: true,
    },
    skills: [
      { id: 'sk-b1', name: 'AutoCAD & BIM Modeling', level: 'Expert', category: 'CAD' },
      { id: 'sk-b2', name: 'SAP2000 & ETABS Structural Analysis', level: 'Advanced', category: 'Engineering' },
    ],
    projects: [
      {
        id: 'proj-b1',
        title: 'Desain Rangka Jembatan Baja',
        category: 'Mechanical Engineer',
        subCategory: 'Analisis Struktur Baja',
        filterCategory: 'Mechanical Engineer',
        type: 'mechanical',
        tools: ['SAP2000', 'AutoCAD'],
        coverImage: PROJECTS_DATA[0]?.coverImage,
        shortDesc: 'Perancangan jembatan baja bentang 30 meter dengan pembebanan dinamis.',
        planning: 'Perancangan Konsep Geometri',
        analysis: 'Analisis Tegangan Von Mises',
        fabrication: 'Fabrikasi dan Perakitan Baut Mutu Tinggi',
      },
    ],
    certificates: [
      { id: 'cert-b1', title: 'Ahli Teknik Bangunan Gedung (SKA)', issuer: 'LPJK', year: '2024', isActive: true },
    ],
    cv: { fileName: 'CV Budi Santoso.pdf', fileUrl: '#', lastUpdated: '2026-01' },
    socialMedia: {
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com',
      email: 'mailto:budi.santoso@example.com',
      whatsapp: 'https://wa.me/6281234567890',
    },
  },
  {
    id: 'CUST-002',
    name: 'Andi Saputra',
    slug: 'andi-saputra',
    email: 'andi.saputra@example.com',
    status: 'active',
    createdAt: '2026-03-02',
    profile: {
      fullName: 'Andi Saputra',
      jobTitle: 'Fullstack Web Developer',
      bio: 'Membangun aplikasi web modern skala enterprise dengan Next.js, React, Node.js, dan Cloud.',
      email: 'andi.saputra@example.com',
      whatsapp: '+62 813-9876-5432',
      avatarUrl: riskiPortrait,
      education: 'S1 Teknik Informatika',
      experienceYears: '3+',
      certCount: '4+',
      isPublished: true,
    },
    skills: [
      { id: 'sk-a1', name: 'React.js, Next.js, TypeScript', level: 'Expert', category: 'Frontend' },
      { id: 'sk-a2', name: 'Node.js, PostgreSQL, Docker', level: 'Advanced', category: 'Backend' },
    ],
    projects: [
      {
        id: 'proj-a1',
        title: 'SaaS Multi-Tenant E-Commerce Platform',
        category: 'Website & Web Apps',
        subCategory: 'Fullstack Web App',
        filterCategory: 'Website & Web Apps',
        type: 'webapp',
        liveUrl: 'https://example.com',
        tools: ['Next.js', 'Tailwind CSS', 'PostgreSQL'],
        coverImage: PROJECTS_DATA[10]?.coverImage || PROJECTS_DATA[0]?.coverImage,
        shortDesc: 'Platform belanja online dengan integrasi payment gateway dan dashboard penjual.',
        planning: 'Arsitektur Database & UI Design',
        analysis: 'Load testing 10.000 concurrent user',
        fabrication: 'Deploy di Kubernetes & AWS Cloud',
      },
    ],
    certificates: [
      { id: 'cert-a1', title: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', year: '2025', isActive: true },
    ],
    cv: { fileName: 'CV Andi Saputra.pdf', fileUrl: '#', lastUpdated: '2026-02' },
    socialMedia: {
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com',
      email: 'mailto:andi.saputra@example.com',
      whatsapp: 'https://wa.me/6281398765432',
    },
  },
  {
    id: 'CUST-003',
    name: 'Andi Saputra',
    slug: 'cust-003',
    email: 'andi.saputra@example.com',
    status: 'active',
    createdAt: '2026-03-02',
    templateId: 'TMPL-001',
    accessPin: '1234',
    profile: {
      fullName: 'Andi Saputra',
      jobTitle: 'Mechanical & Automation Engineer',
      companyName: 'PT REKAYASA DIGITAL INDONESIA',
      department: 'Engineering & Fabrication Dept',
      portfolioType: 'MECHANICAL & SOFTWARE PORTFOLIO',
      cardNumber: 'CUST-003 / ENG-2026',
      cardJoinDate: '03 / 2026',
      cardSpecialist: 'SPECIALIST: 3D CAD, FEA SIMULATION & WEB APPS',
      cardAccessLevel: 'LEVEL 4 • INDUSTRIAL DESIGN & AUTOMATION',
      bio: 'Spesialis perancangan sistem mekanikal presisi, simulasi FEA Von-Mises, aplikasi web modern, dan otomasi industri manufaktur.',
      email: 'andi.saputra@example.com',
      whatsapp: '+62 813-9876-5432',
      phone: '+62 813-9876-5432',
      avatarUrl: riskiPortrait,
      education: 'S1 Teknik Mesin',
      experienceYears: '4+',
      certCount: '6+',
      isPublished: true,
      projectsHazardText: '• PORTO FOLIO ANDI SAPUTRA • REKAYASA MEKANIKAL & WEB APPS •',
      projectsBadge: '03 / PROJECT SHOWCASE',
      projectsTitle: 'COMPLETED WORKS',
      projectsSubtitle: 'From Mechanical Engineering, Modern Web Apps to CV Portfolio Templates',
      projectsFooterSummary: 'MESIN, WEB APPS & TEMPLATE CV',
      projectCategories: ['Mesin & Industri', 'Web Apps & Portofolio', 'Template CV'],
      // Halaman 1 moving ribbons
      line1Text: '• NAMA LENGKAP: ANDI SAPUTRA • JABATAN: MECHANICAL & AUTOMATION ENGINEER • PERUSAHAAN: PT REKAYASA DIGITAL INDONESIA • DEPARTEMEN: ENGINEERING & FABRICATION DEPT • PORTO FOLIO: MECHANICAL & SOFTWARE PORTFOLIO',
      line2Text: '• NAMA LENGKAP: ANDI SAPUTRA • JABATAN: MECHANICAL & AUTOMATION ENGINEER • PERUSAHAAN: PT REKAYASA DIGITAL INDONESIA • DEPARTEMEN: ENGINEERING & FABRICATION DEPT • PORTO FOLIO: MECHANICAL & SOFTWARE PORTFOLIO',
    },
    skills: [
      { id: 'sk-c1', name: 'Autodesk Inventor & 3D CAD', level: 'Expert', category: 'CAD/CAM', percent: 95 },
      { id: 'sk-c2', name: 'ANSYS FEA Static Stress & CFD', level: 'Advanced', category: 'Simulasi & Analisis', percent: 90 },
      { id: 'sk-c3', name: 'Machining CNC & Fabrikasi Baja', level: 'Expert', category: 'Fabrikasi & Produksi', percent: 92 },
      { id: 'sk-c4', name: 'Fullstack React & Node.js', level: 'Advanced', category: 'Software & Web', percent: 88 },
    ],
    projects: [
      {
        id: 'proj-c1',
        title: 'Mesin Conveyor Transfer 1500 RPM',
        category: 'Mesin & Industri',
        subCategory: 'Material Handling System',
        filterCategory: 'Mesin & Industri',
        type: 'mechanical',
        tools: ['Autodesk Inventor', 'SolidWorks', 'ANSYS'],
        coverImage: PROJECTS_DATA[0]?.coverImage,
        shortDesc: 'Perancangan dan simulasi struktur konveyor transfer kapasitas 5 ton/jam untuk pabrik manufaktur.',
        planning: 'Desain 3D Autodesk Inventor & Perhitungan Daya Motor',
        analysis: 'Simulasi ANSYS FEA Static Stress & Safety Factor 2.8',
        fabrication: 'Fabrikasi Frame Baja SS400, Machining Roller CNC & Assembly',
      },
      {
        id: 'proj-c2',
        title: 'Aplikasi Web Portal Monitoring Produksi Pabrik',
        category: 'Web Apps & Portofolio',
        subCategory: 'Industrial Telemetry Web App',
        filterCategory: 'Web Apps & Portofolio',
        type: 'webapp',
        liveUrl: 'https://example.com',
        tools: ['React.js', 'Tailwind CSS', 'Vite', 'Node.js'],
        coverImage: PROJECTS_DATA[10]?.coverImage || PROJECTS_DATA[1]?.coverImage,
        shortDesc: 'Dashboard monitoring throughput produksi mesin pabrik secara real-time via telemetry web.',
        planning: 'Desain UI/UX Dashboard Modern & Flow Telemetry',
        analysis: 'Optimasi performa rendering telemetry data under 50ms',
        fabrication: 'Deploy Cloud Hosting Vercel & Real-Time API',
      },
      {
        id: 'proj-c3',
        title: 'Template CV ATS & Portofolio Rekayasa',
        category: 'Template CV',
        subCategory: 'Executive Engineering Resume',
        filterCategory: 'Template CV',
        type: 'template',
        liveUrl: 'https://example.com/cv-template',
        tools: ['Figma', 'React', 'Print CSS'],
        coverImage: PROJECTS_DATA[11]?.coverImage || PROJECTS_DATA[2]?.coverImage,
        shortDesc: 'Format CV standar ATS internasional yang lolos screening HRD untuk engineer & profesional.',
        planning: 'Struktur layout ATS Compliant & Hierarki Typografi',
        analysis: 'Skor ATS 98% pada platform pemindaian resume global',
        fabrication: 'Export siap cetak PDF A4 & Integrasi Web Digital',
      },
    ],
    certificates: [
      { id: 'cert-c1', title: 'Certified SOLIDWORKS Professional (CSWP)', issuer: 'Dassault Systèmes', year: '2024', isActive: true },
      { id: 'cert-c2', title: 'Ahli K3 Umum & Keselamatan Industri', issuer: 'Kemnaker RI', year: '2023', isActive: true },
    ],
    cv: { fileName: 'CV Andi Saputra.pdf', fileUrl: '#', lastUpdated: '2026-03' },
    socialMedia: {
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com',
      email: 'mailto:andi.saputra@example.com',
      whatsapp: 'https://wa.me/6281398765432',
    },
  },
];

// Initial Master Templates Catalog for Template Sales System
const DEFAULT_TEMPLATES = [
  {
    id: 'TMPL-001',
    name: 'Industrial Dark Red Master',
    version: 'V1.0',
    edition: 'Master Industrial Edition',
    category: 'Engineering & Industrial',
    themeAccent: 'Dark Red / Burgundy & Gold',
    badgeColor: 'bg-rose-950 text-rose-300 border-rose-500/40',
    description: 'Template utama dengan background metal merah gelap SVG, kanvas 192-frame cinematic refinery, dan ID Card 3D gantung interaktif.',
    isDefault: true,
    status: 'active',
    features: ['3D Lanyard ID Card', '192-Frame Scroll Canvas', '3D Orbit Carousel', 'Hazard Marquee Ribbons'],
    createdAt: '2026-03-01',
  },
  {
    id: 'TMPL-002',
    name: 'Cyber Steel & Cyan Horizon',
    version: 'V1.1',
    edition: 'Cyberpunk & Tech Edition',
    category: 'Software & Web Developer',
    themeAccent: 'Cyber Cyan & Titanium Steel',
    badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-500/40',
    description: 'Varian futuristik bernuansa titanium dengan efek glow neon cyan untuk web developer, IoT telemetry engineer, dan software architect.',
    isDefault: false,
    status: 'active',
    features: ['Neon Cyber Accents', 'Glassmorphism Cards', 'Code Syntax Highlights', 'Live Web Demos'],
    createdAt: '2026-03-02',
  },
  {
    id: 'TMPL-003',
    name: 'Gold Luxury Engineering',
    version: 'V1.2',
    edition: 'Executive Gold Edition',
    category: 'Executive & Consultant',
    themeAccent: 'Gold Amber & Onyx Black',
    badgeColor: 'bg-amber-950 text-amber-300 border-amber-500/40',
    description: 'Desain elegan bernuansa emas dan hitam obsidian mewah, khusus untuk konsultan teknik senior, lead engineer, dan manajer proyek.',
    isDefault: false,
    status: 'active',
    features: ['Gold Metallic Accents', 'Minimalist Typography', 'Verified Badges', 'Executive Timeline'],
    createdAt: '2026-03-03',
  },
];

// Sample Initial Transactions for Sales System
const DEFAULT_TRANSACTIONS = [
  {
    id: 'TRX-202603-0001',
    buyerName: 'Budi Santoso',
    buyerEmail: 'budi.santoso@example.com',
    buyerWhatsapp: '+62 812-3456-7890',
    packageName: 'Personal Engineer License',
    templateId: 'TMPL-001',
    templateName: 'Industrial Dark Red Master',
    amount: 499000,
    paymentMethod: 'QRIS Instant',
    status: 'lunas',
    customerId: 'CUST-001',
    createdAt: '2026-03-01 14:30',
  },
  {
    id: 'TRX-202603-0002',
    buyerName: 'Rudi Hermawan',
    buyerEmail: 'rudi.hermawan@example.com',
    buyerWhatsapp: '+62 821-9876-5432',
    packageName: 'Personal Engineer License',
    templateId: 'TMPL-001',
    templateName: 'Industrial Dark Red Master',
    amount: 499000,
    paymentMethod: 'Bank Transfer (BNI)',
    status: 'lunas',
    customerId: 'CUST-002',
    createdAt: '2026-03-01 18:45',
  },
  {
    id: 'TRX-202603-0003',
    buyerName: 'Andi Saputra',
    buyerEmail: 'andi.saputra@example.com',
    buyerWhatsapp: '+62 813-9876-5432',
    packageName: 'Pro Enterprise License',
    templateId: 'TMPL-002',
    templateName: 'Cyber Steel & Cyan Horizon',
    amount: 750000,
    paymentMethod: 'QRIS Instant',
    status: 'lunas',
    customerId: 'CUST-003',
    createdAt: '2026-03-02 09:15',
  },
];

const DEFAULT_PAYMENT_SETTINGS = {
  bankAccounts: [
    {
      bank: 'BNI (Bank Negara Indonesia)',
      accountNumber: '0829-1234-56',
      accountName: 'RISKI SAPUTRA',
      isActive: true,
    },
    {
      bank: 'Bank Mandiri',
      accountNumber: '108-00-1234567-8',
      accountName: 'RISKI SAPUTRA',
      isActive: true,
    },
    {
      bank: 'Bank BRI',
      accountNumber: '0123-01-098765-50-1',
      accountName: 'RISKI SAPUTRA',
      isActive: true,
    },
  ],
  qrisUrl: '/qris-card.png',
  whatsappNumber: '6285923320768',
  currency: 'IDR',
};

// Initial Pricing Packages for Template Store (/pricing)
const DEFAULT_PRICING_PACKAGES = [
  {
    id: 'pkg-personal',
    name: 'Personal Engineer License',
    price: 499000,
    badge: 'STARTER REKOMENDASI',
    isPopular: false,
    description: 'Ideal untuk mahasiswa teknik, fresh graduate, engineer, dan profesional yang ingin portofolio berkelas tinggi.',
    features: [
      '1 Lisensi Portofolio Siap Pakai',
      'Akses Editor Mandiri (6 Tab Lengkap)',
      'PIN Akses Editor Pribadi',
      'Sub-URL Portofolio Publik (/portfolio/nama-anda)',
      'ID Card 3D Gantung Interaktif (Draggable)',
      'Panggung 3D Orbit Carousel Putar',
      'Form Kontak & Notifikasi WhatsApp',
      'Pilihan Edisi Template Master V1.0',
      'Garansi Selamanya (Lifetime Access)',
    ],
    ctaText: 'Pesan Lisensi Personal',
    isActive: true,
  },
  {
    id: 'pkg-pro',
    name: 'Pro Enterprise Edition',
    price: 750000,
    badge: 'PALING DIMINATI ★',
    isPopular: true,
    description: 'Pilihan terbaik untuk senior engineer, konsultan, dan software developer yang butuh fleksibilitas template penuh.',
    features: [
      'Semua Fitur Paket Personal',
      'Akses Seluruh Varian Template (V1.0, V1.1, V1.2, V2.0)',
      'Kustomisasi 3 Pilar Rekayasa (Planning, Analysis, Fabrication)',
      'Upload & Integrasi CV PDF Instan',
      'Multi-Device Live Simulator Previewer',
      'Prioritas Rilis Fitur & Update Versi Baru',
      'Bebas Migrasi ke Template Baru Kapan Saja',
      'Bantuan Setup Awal oleh Riski Saputra',
    ],
    ctaText: 'Pilih Pro Enterprise',
    isActive: true,
  },
  {
    id: 'pkg-agency',
    name: 'Agency & Multi-License Suite',
    price: 1499000,
    badge: 'HEMAT 3 LISENSI',
    isPopular: false,
    description: 'Untuk tim konsultan, biro teknik, atau Anda yang ingin menjual kembali portofolio ke rekan/klien Anda.',
    features: [
      '3 Lisensi Portofolio Pelanggan Terpisah',
      '3 Editor Mandiri dengan PIN Masing-Masing',
      'All Templates & Future Versions Unlocked',
      'Akses Master Catalog & Versioning Controller',
      'Support Prioritas VIP via WhatsApp Call',
      'Panduan Pemasaran & Penjualan Template',
    ],
    ctaText: 'Beli Paket Multi-Lisensi',
    isActive: true,
  },
];

const DEFAULT_PRICING_FAQS = [
  {
    id: 'faq-1',
    q: 'Apakah saya bisa mengedit data portofolio sendiri setelah membeli?',
    a: 'Ya, 100%! Setelah pembayaran, Anda langsung menerima tautan Editor Mandiri (/editor/CUST-XXX) beserta PIN akses pribadi untuk mengubah profil, foto, karya rekayasa, keahlian, sertifikat, dan kontak tanpa perlu koding.',
  },
  {
    id: 'faq-2',
    q: 'Apakah desain template bisa rusak jika saya salah input?',
    a: 'Tidak. Sistem dilengkapi locked guardrail arsitektur di mana background 192 frame, animasi 3D, physics ID card, dan font telah dikunci permanen oleh Admin Master. Anda hanya mengisi slot konten sehingga tampilan tetap estetik dan rapi.',
  },
  {
    id: 'faq-3',
    q: 'Metode pembayaran apa saja yang didukung?',
    a: 'Kami menerima QRIS Instant (BNI, Livin Mandiri, GoPay, OVO, Dana, ShopeePay) serta Transfer Bank Manual (BNI, Mandiri, BRI) dan Order WhatsApp langsung.',
  },
  {
    id: 'faq-4',
    q: 'Berapa lama website portofolio saya aktif?',
    a: 'Lisensi berlaku seumur hidup (Lifetime) tanpa biaya langganan bulanan tersembunyi.',
  },
];

const PortfolioContext = createContext(null);

const STORAGE_KEYS = {
  OWNER: 'riski_owner_portfolio_v1',
  CUSTOMERS: 'riski_customers_list_v1',
  TEMPLATES: 'riski_templates_list_v1',
  TEMPLATE_CONFIG: 'riski_template_config_v1',
  TRANSACTIONS: 'riski_transactions_list_v1',
  PAYMENT_SETTINGS: 'riski_payment_settings_v1',
  PRICING_PACKAGES: 'riski_pricing_packages_v1',
  PRICING_FAQS: 'riski_pricing_faqs_v1',
};

export function PortfolioProvider({ children }) {
  // 1. Owner Data State (OWNER-001)
  const [ownerData, setOwnerData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.OWNER);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_OWNER_DATA,
          ...parsed,
          projects: parsed.projects && parsed.projects.length > 0 ? parsed.projects : DEFAULT_OWNER_DATA.projects,
        };
      }
    } catch (e) {
      console.warn('Error reading owner data from storage', e);
    }
    return DEFAULT_OWNER_DATA;
  });

  // 2. Customers List State
  const [customers, setCustomers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading customers from storage', e);
    }
    return DEFAULT_CUSTOMERS;
  });

  // 3. Templates Catalog State (Enables Admin to add/manage new templates)
  const [templates, setTemplates] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Error reading templates from storage', e);
    }
    return DEFAULT_TEMPLATES;
  });

  // 4. Transactions / Orders State
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Error reading transactions from storage', e);
    }
    return DEFAULT_TRANSACTIONS;
  });

  // 5. Payment Configuration State
  const [paymentSettings, setPaymentSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PAYMENT_SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          const updatedBanks = (parsed.bankAccounts || DEFAULT_PAYMENT_SETTINGS.bankAccounts).map((b) =>
            b.bank && b.bank.includes('BCA')
              ? { ...b, bank: 'BNI (Bank Negara Indonesia)' }
              : b
          );
          return {
            ...DEFAULT_PAYMENT_SETTINGS,
            ...parsed,
            bankAccounts: updatedBanks,
            qrisUrl: parsed.qrisUrl && parsed.qrisUrl.includes('qrserver') ? '/qris-card.png' : (parsed.qrisUrl || '/qris-card.png'),
          };
        }
      }
    } catch (e) {
      console.warn('Error reading payment settings from storage', e);
    }
    return DEFAULT_PAYMENT_SETTINGS;
  });

  // 6. Pricing Packages State for Template Store
  const [pricingPackages, setPricingPackages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRICING_PACKAGES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error reading pricing packages from storage', e);
    }
    return DEFAULT_PRICING_PACKAGES;
  });

  // 7. Pricing FAQ State
  const [pricingFaqs, setPricingFaqs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRICING_FAQS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error reading pricing FAQs from storage', e);
    }
    return DEFAULT_PRICING_FAQS;
  });

  // 8. Template Version Info
  const [templateConfig] = useState({
    version: 'V1.0',
    edition: 'Master Industrial Dark Red Edition',
    lastUpdated: '2026-03-01',
    author: 'Riski Saputra (OWNER-001)',
    lockedFeatures: [
      '3D Holographic Orbit Carousel Layout',
      'HTML5 Canvas 192-Frame Oil Refinery Scroll Background',
      'Physics-based 3D Hanging Lanyard ID Card',
      'Abstract Dark Red Metal SVG Shaders',
      'Industrial Yellow & Black Caution Hazard Tapes',
      'Corporate Glassmorphism Header & Footer',
      'Responsive Mobile Viewports & Grid Tokens',
    ],
  });

  // Sync to database and localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.OWNER, JSON.stringify(ownerData));
      // Auto-sync database tables
      db.profiles.update('OWNER-001', { ...ownerData.profile, socialMedia: ownerData.socialMedia, cv: ownerData.cv });
    } catch (e) {
      console.warn('Failed saving ownerData to storage', e);
    }
  }, [ownerData]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
    } catch (e) {
      console.warn('Failed saving customers to storage', e);
    }
  }, [customers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
    } catch (e) {
      console.warn('Failed saving templates to storage', e);
    }
  }, [templates]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (e) {
      console.warn('Failed saving transactions to storage', e);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PAYMENT_SETTINGS, JSON.stringify(paymentSettings));
    } catch (e) {
      console.warn('Failed saving paymentSettings to storage', e);
    }
  }, [paymentSettings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRICING_PACKAGES, JSON.stringify(pricingPackages));
    } catch (e) {
      console.warn('Failed saving pricing packages to storage', e);
    }
  }, [pricingPackages]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRICING_FAQS, JSON.stringify(pricingFaqs));
    } catch (e) {
      console.warn('Failed saving pricing FAQs to storage', e);
    }
  }, [pricingFaqs]);

  // Pricing Packages Actions
  const updatePricingPackage = (pkgId, updatedData) => {
    setPricingPackages((prev) =>
      prev.map((p) => (p.id === pkgId ? { ...p, ...updatedData } : p))
    );
  };

  const addPricingPackage = (newPkg) => {
    const pkg = {
      ...newPkg,
      id: newPkg.id || `pkg-${Date.now()}`,
      isActive: true,
      features: Array.isArray(newPkg.features) ? newPkg.features : [],
    };
    setPricingPackages((prev) => [...prev, pkg]);
  };

  const deletePricingPackage = (pkgId) => {
    setPricingPackages((prev) => prev.filter((p) => p.id !== pkgId));
  };

  const updatePricingFaqs = (faqs) => {
    setPricingFaqs(faqs);
  };

  const addPricingFaq = (faq) => {
    const newFaq = {
      ...faq,
      id: faq.id || `faq-${Date.now()}`,
    };
    setPricingFaqs((prev) => [...prev, newFaq]);
  };

  const deletePricingFaq = (faqId) => {
    setPricingFaqs((prev) => prev.filter((f) => f.id !== faqId));
  };

  const resetPricingToDefault = () => {
    setPricingPackages(DEFAULT_PRICING_PACKAGES);
    setPricingFaqs(DEFAULT_PRICING_FAQS);
    localStorage.removeItem(STORAGE_KEYS.PRICING_PACKAGES);
    localStorage.removeItem(STORAGE_KEYS.PRICING_FAQS);
  };

  // Actions for My Portfolio (OWNER-001) connected directly to Database
  const updateOwnerProfile = async (newProfile) => {
    setOwnerData((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...newProfile },
    }));
    await db.profiles.update('OWNER-001', newProfile);
  };

  const updateOwnerProjects = (newProjects) => {
    setOwnerData((prev) => ({
      ...prev,
      projects: newProjects,
    }));
  };

  const addOwnerProject = async (project) => {
    const newProj = {
      ...project,
      id: project.id || `proj-${Date.now()}`,
      user_id: 'OWNER-001',
    };
    setOwnerData((prev) => ({
      ...prev,
      projects: [newProj, ...prev.projects],
    }));
    await db.projects.create(newProj);
  };

  const deleteOwnerProject = async (projectId) => {
    setOwnerData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== projectId),
    }));
    await db.projects.delete(projectId);
  };

  const updateOwnerSkills = async (newSkills) => {
    setOwnerData((prev) => ({
      ...prev,
      skills: newSkills,
    }));
  };

  const updateOwnerCertificates = async (newCerts) => {
    setOwnerData((prev) => ({
      ...prev,
      certificates: newCerts,
    }));
  };

  const updateOwnerSocial = async (newSocial) => {
    setOwnerData((prev) => ({
      ...prev,
      socialMedia: { ...prev.socialMedia, ...newSocial },
    }));
  };

  const updateOwnerCV = async (newCv) => {
    setOwnerData((prev) => ({
      ...prev,
      cv: { ...prev.cv, ...newCv },
    }));
  };

  // Actions for Customer Management
  const addCustomer = async (customerData) => {
    const nextNum = String(customers.length + 1).padStart(3, '0');
    const newCustId = `CUST-${nextNum}`;
    const slug = (customerData.slug || customerData.name || `user-${nextNum}`)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const selectedTemplateId = customerData.templateId || 'TMPL-001';
    const foundTemplate = templates.find((t) => t.id === selectedTemplateId) || templates[0];

    const newCustomer = {
      id: newCustId,
      name: customerData.name || 'New Customer',
      slug: slug || `cust-${Date.now()}`,
      email: customerData.email || '',
      accessPin: customerData.accessPin || '1234',
      templateId: selectedTemplateId,
      templateName: foundTemplate?.name || 'Industrial Dark Red Master',
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      profile: {
        fullName: customerData.name || 'New Customer',
        jobTitle: customerData.jobTitle || 'Professional Engineer',
        bio: customerData.bio || `Selamat datang di portofolio resmi ${customerData.name || 'saya'}. Spesialis perancangan, pengembangan produk, dan inovasi teknik.`,
        email: customerData.email || '',
        whatsapp: customerData.whatsapp || '',
        avatarUrl: riskiPortrait,
        education: customerData.education || 'Sarjana Teknik',
        experienceYears: '2+',
        certCount: '3+',
        isPublished: true,
      },
      skills: [
        { id: `sk-c1-${Date.now()}`, name: '3D CAD Modeling & Design', level: 'Expert', category: 'CAD/CAM' },
        { id: `sk-c2-${Date.now()}`, name: 'Structural Strength Analysis', level: 'Advanced', category: 'Engineering' },
        { id: `sk-c3-${Date.now()}`, name: 'Project Management & Planning', level: 'Expert', category: 'Management' },
      ],
      projects: [
        {
          id: `proj-c1-${Date.now()}`,
          title: 'Perancangan Sistem Mekanikal & Otomasi',
          category: 'Mechanical Engineer',
          subCategory: 'Projek Industri Utama',
          type: 'mechanical',
          liveUrl: '',
          coverImage: ownerData.projects[0]?.coverImage || '',
          shortDesc: 'Pengembangan dan perancangan sistem mekanikal inovatif dengan analisis efisiensi kerja tinggi.',
          planning: 'Perancangan konsep 3D CAD dan kalkulasi beban',
          analysis: 'Simulasi finite element analysis dan uji kelelahan bahan',
          fabrication: 'Pemesinan presisi, perakitan, dan pengujian lapangan',
          tools: ['Autodesk Inventor', 'SolidWorks', 'FEA Analysis'],
        },
      ],
      certificates: [
        {
          id: `cert-c1-${Date.now()}`,
          title: 'Sertifikasi Keahlian Teknik Profesional',
          issuer: 'Badan Sertifikasi Profesi Nasional',
          year: '2025',
          isActive: true,
        },
      ],
      cv: { fileName: 'CV Profesional.pdf', fileUrl: '', lastUpdated: '2026-03' },
      socialMedia: {
        linkedin: customerData.linkedin || '',
        instagram: customerData.instagram || '',
        email: customerData.email ? `mailto:${customerData.email}` : '',
        whatsapp: customerData.whatsapp ? `https://wa.me/${customerData.whatsapp.replace(/[^0-9]/g, '')}` : '',
      },
    };

    setCustomers((prev) => [newCustomer, ...prev]);
    await db.customers.create(newCustomer);
    return newCustomer;
  };

  const updateCustomer = async (customerId, updatedData) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, ...updatedData } : c))
    );
    await db.customers.update(customerId, updatedData);
  };

  const deleteCustomer = async (customerId) => {
    setCustomers((prev) => {
      const filtered = prev.filter((c) => c.id !== customerId);
      try {
        localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(filtered));
      } catch (e) {
        console.warn('Failed saving customers to storage', e);
      }
      return filtered;
    });
    await db.customers.delete(customerId);
  };

  const toggleCustomerStatus = async (customerId) => {
    const target = customers.find((c) => c.id === customerId);
    if (!target) return;
    const newStatus = target.status === 'active' ? 'inactive' : 'active';
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, status: newStatus } : c))
    );
    await db.customers.update(customerId, { status: newStatus });
  };

  const resetCustomerData = async (customerId) => {
    const target = customers.find((c) => c.id === customerId);
    if (!target) return;

    const resetPayload = {
      profile: {
        fullName: target.name,
        jobTitle: 'Professional Engineer',
        bio: `Selamat datang di portofolio resmi ${target.name}.`,
        email: target.email,
        whatsapp: target.profile?.whatsapp || '',
        avatarUrl: riskiPortrait,
        education: 'Sarjana Teknik',
        experienceYears: '1+',
        certCount: '1+',
        isPublished: true,
      },
      skills: [
        { id: `sk-c-${Date.now()}`, name: 'Core Engineering Skill', level: 'Expert', category: 'Engineering' },
      ],
      projects: [],
      certificates: [],
      cv: { fileName: 'CV.pdf', fileUrl: '', lastUpdated: '' },
    };

    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, ...resetPayload } : c))
    );
    await db.customers.update(customerId, resetPayload);
  };

  const togglePublishCustomer = async (customerId) => {
    const target = customers.find((c) => c.id === customerId);
    if (!target) return;
    const currentStatus = target.isPublished !== false;
    const newStatus = !currentStatus;
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, isPublished: newStatus } : c))
    );
    await db.customers.update(customerId, { isPublished: newStatus });
  };

  const setCustomerPublishStatus = async (customerId, isPublished) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, isPublished } : c))
    );
    await db.customers.update(customerId, { isPublished });
  };

  // Get specific portfolio data (OWNER or CUSTOMER)
  const getPortfolioData = (targetId) => {
    if (!targetId || targetId === 'OWNER-001' || targetId === 'master') {
      return ownerData;
    }
    const found = customers.find((c) => c.id === targetId || c.slug === targetId);
    return found || ownerData;
  };

  // Actions for Master Template Management
  const addTemplate = async (templateData) => {
    const nextNum = String(templates.length + 1).padStart(3, '0');
    const newTmplId = `TMPL-${nextNum}`;
    const isDef = templateData.isDefault || false;
    const newTemplate = {
      id: newTmplId,
      name: templateData.name || 'New Template Edition',
      version: templateData.version || `V1.${templates.length}`,
      edition: templateData.edition || 'Special Edition',
      category: templateData.category || 'General Portfolio',
      price: templateData.price || 499000,
      themeAccent: templateData.themeAccent || 'Custom Cyber Metal',
      badgeColor: templateData.badgeColor || 'bg-rose-950 text-rose-300 border-rose-500/40',
      description: templateData.description || 'Desain template portofolio interaktif baru.',
      isDefault: isDef,
      status: templateData.status || 'active',
      features: templateData.features || ['3D ID Card', 'Responsive Layout', 'WhatsApp Integration'],
      changelog: templateData.changelog || [
        {
          version: templateData.version || `V1.${templates.length}`,
          date: new Date().toISOString().split('T')[0],
          notes: 'Rilis perdana edisi template',
        },
      ],
      createdAt: new Date().toISOString().split('T')[0],
    };

    setTemplates((prev) => {
      const updated = isDef ? prev.map((t) => ({ ...t, isDefault: false })) : [...prev];
      return [newTemplate, ...updated];
    });
    await db.templates.add(newTemplate);
    return newTemplate;
  };

  const updateTemplate = async (templateId, updatedData) => {
    setTemplates((prev) =>
      prev.map((t) => {
        if (t.id === templateId) {
          return { ...t, ...updatedData };
        }
        if (updatedData.isDefault) {
          return { ...t, isDefault: false };
        }
        return t;
      })
    );
    await db.templates.update(templateId, updatedData);
  };

  const deleteTemplate = async (templateId) => {
    setTemplates((prev) => prev.filter((t) => t.id !== templateId));
    await db.templates.delete(templateId);
  };

  const setDefaultTemplate = async (templateId) => {
    setTemplates((prev) =>
      prev.map((t) => ({
        ...t,
        isDefault: t.id === templateId,
      }))
    );
    await db.templates.update(templateId, { isDefault: true });
  };

  const duplicateTemplate = async (templateId) => {
    const target = templates.find((t) => t.id === templateId);
    if (!target) return null;
    const nextNum = String(templates.length + 1).padStart(3, '0');
    const newTmplId = `TMPL-${nextNum}`;
    const vParts = (target.version || 'V1.0').replace('V', '').split('.');
    const nextMinor = Number(vParts[1] || 0) + 1;
    const nextVersion = `V${vParts[0] || '1'}.${nextMinor}`;

    const cloned = {
      ...target,
      id: newTmplId,
      name: `${target.name} (Salinan ${nextVersion})`,
      version: nextVersion,
      isDefault: false,
      status: 'draft',
      changelog: [
        {
          version: nextVersion,
          date: new Date().toISOString().split('T')[0],
          notes: `Duplikasi basis dari ${target.name} (${target.version})`,
        },
        ...(target.changelog || []),
      ],
      createdAt: new Date().toISOString().split('T')[0],
    };

    setTemplates((prev) => [cloned, ...prev]);
    await db.templates.add(cloned);
    return cloned;
  };

  const migrateCustomerTemplate = async (customerId, newTemplateId) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, templateId: newTemplateId } : c))
    );
    await db.customers.update(customerId, { templateId: newTemplateId });
  };

  // Payment & Sales Operations
  const createOrder = async (orderData) => {
    // 1. Create or ensure customer exists with PENDING status (Requires Admin Master approval)
    const nextCustNum = String(customers.length + 1).padStart(3, '0');
    const newCustId = `CUST-${nextCustNum}`;
    const cleanSlug = (orderData.slug || orderData.buyerName || 'user')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const newCustomer = {
      id: newCustId,
      name: orderData.buyerName,
      slug: cleanSlug,
      email: orderData.buyerEmail,
      templateId: orderData.templateId || 'TMPL-001',
      status: 'pending', // 'pending' = Menunggu persetujuan Admin Master agar bisa login
      isPublished: false,
      accessPin: orderData.accessPin || '1234',
      createdAt: new Date().toISOString().split('T')[0],
      profile: {
        fullName: orderData.buyerName,
        jobTitle: orderData.jobTitle || 'Professional Engineer',
        bio: `Selamat datang di portofolio resmi ${orderData.buyerName}.`,
        email: orderData.buyerEmail,
        whatsapp: orderData.buyerWhatsapp,
        avatarUrl: riskiPortrait,
        education: 'Teknik Industri & Mesin',
        experienceYears: '1+',
        certCount: '1+',
        isPublished: true,
      },
      skills: [
        { id: `sk-c-${Date.now()}`, name: 'Engineering Design & Analysis', level: 'Expert', category: 'Engineering' },
      ],
      projects: [],
      certificates: [],
      cv: { fileName: 'CV.pdf', fileUrl: '', lastUpdated: '' },
      socialMedia: {
        whatsapp: orderData.buyerWhatsapp ? `https://wa.me/${orderData.buyerWhatsapp.replace(/[^0-9]/g, '')}` : '',
        email: `mailto:${orderData.buyerEmail}`,
      },
    };

    setCustomers((prev) => [newCustomer, ...prev]);
    await db.customers.create(newCustomer);

    // 2. Create Transaction Record (Pending Admin Master Verification)
    const nextTxNum = String(transactions.length + 1).padStart(4, '0');
    const newTx = {
      id: `TRX-${Date.now().toString().slice(-6)}-${nextTxNum}`,
      buyerName: orderData.buyerName,
      buyerEmail: orderData.buyerEmail,
      buyerWhatsapp: orderData.buyerWhatsapp,
      packageName: orderData.packageName || 'Personal Engineer License',
      templateId: orderData.templateId || 'TMPL-001',
      templateName: orderData.templateName || 'Industrial Dark Red Master',
      amount: Number(orderData.amount) || 499000,
      paymentMethod: orderData.paymentMethod || 'QRIS Instant',
      status: 'pending', // 'pending' = Menunggu verifikasi Admin Master
      customerId: newCustId,
      accessPin: orderData.accessPin || '1234',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    setTransactions((prev) => [newTx, ...prev]);
    await db.transactions.create(newTx);

    return { transaction: newTx, customer: newCustomer };
  };

  const verifyPayment = async (txId) => {
    const target = transactions.find((t) => t.id === txId);
    if (!target) return;
    setTransactions((prev) =>
      prev.map((t) => (t.id === txId ? { ...t, status: 'lunas' } : t))
    );
    await db.transactions.update(txId, { status: 'lunas' });

    if (target.customerId) {
      setCustomers((prev) =>
        prev.map((c) => (c.id === target.customerId ? { ...c, status: 'active', isPublished: true } : c))
      );
      await db.customers.update(target.customerId, { status: 'active', isPublished: true });
    }
  };

  const rejectPayment = async (txId) => {
    const target = transactions.find((t) => t.id === txId);
    if (!target) return;
    setTransactions((prev) =>
      prev.map((t) => (t.id === txId ? { ...t, status: 'ditolak' } : t))
    );
    await db.transactions.update(txId, { status: 'ditolak' });

    if (target.customerId) {
      setCustomers((prev) =>
        prev.map((c) => (c.id === target.customerId ? { ...c, status: 'inactive' } : c))
      );
      await db.customers.update(target.customerId, { status: 'inactive' });
    }
  };

  const approveCustomerDirectly = async (customerId) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, status: 'active', isPublished: true } : c))
    );
    await db.customers.update(customerId, { status: 'active', isPublished: true });

    // Also update any pending transaction for this customer
    setTransactions((prev) =>
      prev.map((t) => (t.customerId === customerId ? { ...t, status: 'lunas' } : t))
    );
  };

  const deleteTransaction = async (txId) => {
    setTransactions((prev) => prev.filter((t) => t.id !== txId));
    await db.transactions.delete(txId);
  };

  const updatePaymentSettings = (newSettings) => {
    setPaymentSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Backup and Restore
  const exportDatabaseBackup = () => {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      ownerData,
      customers,
      templates,
      templateConfig,
    };
    const jsonStr = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `riski-portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importDatabaseBackup = (jsonContent) => {
    try {
      const parsed = typeof jsonContent === 'string' ? JSON.parse(jsonContent) : jsonContent;
      if (parsed.ownerData) setOwnerData(parsed.ownerData);
      if (Array.isArray(parsed.customers)) setCustomers(parsed.customers);
      if (Array.isArray(parsed.templates)) setTemplates(parsed.templates);
      return { success: true, message: 'Database backup berhasil diimpor!' };
    } catch {
      return { success: false, message: 'Format file backup tidak valid.' };
    }
  };

  const resetToDefaultData = () => {
    setOwnerData(DEFAULT_OWNER_DATA);
    setCustomers(DEFAULT_CUSTOMERS);
    setTemplates(DEFAULT_TEMPLATES);
    localStorage.removeItem(STORAGE_KEYS.OWNER);
    localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
    localStorage.removeItem(STORAGE_KEYS.TEMPLATES);
  };

  return (
    <PortfolioContext.Provider
      value={{
        ownerData,
        customers,
        templates,
        templateConfig,
        updateOwnerProfile,
        updateOwnerProjects,
        addOwnerProject,
        deleteOwnerProject,
        updateOwnerSkills,
        updateOwnerCertificates,
        updateOwnerSocial,
        updateOwnerCV,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        toggleCustomerStatus,
        resetCustomerData,
        togglePublishCustomer,
        setCustomerPublishStatus,
        addTemplate,
        updateTemplate,
        deleteTemplate,
        setDefaultTemplate,
        duplicateTemplate,
        migrateCustomerTemplate,
        transactions,
        paymentSettings,
        createOrder,
        verifyPayment,
        rejectPayment,
        approveCustomerDirectly,
        deleteTransaction,
        updatePaymentSettings,
        pricingPackages,
        pricingFaqs,
        updatePricingPackage,
        addPricingPackage,
        deletePricingPackage,
        updatePricingFaqs,
        addPricingFaq,
        deletePricingFaq,
        resetPricingToDefault,
        getPortfolioData,
        exportDatabaseBackup,
        importDatabaseBackup,
        resetToDefaultData,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
