import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  UserCheck,
  Users,
  Layers,
  Settings,
  ExternalLink,
  Menu,
  X,
  Sparkles,
  ArrowLeft,
  Database,
  ChevronRight,
  LogOut,
  Lock,
  CreditCard,
  Tag,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

const NAV_ITEMS = [
  {
    path: '/admin',
    exact: true,
    label: 'Dashboard',
    icon: LayoutDashboard,
    badge: 'Overview',
  },
  {
    path: '/admin/my-portfolio',
    label: 'My Portfolio',
    icon: UserCheck,
    badge: 'OWNER-001',
    highlight: true,
  },
  {
    path: '/admin/customers',
    label: 'Customers',
    icon: Users,
    badge: 'Multi-Tenant',
  },
  {
    path: '/admin/template',
    label: 'Master Template',
    icon: Layers,
    badge: 'V1.0',
  },
  {
    path: '/admin/pricing',
    label: 'Paket & Harga',
    icon: Tag,
    badge: 'Toko',
  },
  {
    path: '/admin/payments',
    label: 'Transaksi & Bayar',
    icon: CreditCard,
    badge: 'Keuangan',
  },
  {
    path: '/admin/settings',
    label: 'Settings & Backup',
    icon: Settings,
    badge: 'System',
  },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { ownerData, templateConfig, exportDatabaseBackup } = usePortfolio();
  const { logoutMaster } = useAuth();
  const { isDark } = useTheme();

  const isCurrentActive = (item) => {
    if (item.exact) {
      return location.pathname === '/admin' || location.pathname === '/admin/';
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <div
      className={`min-h-screen ${
        isDark
          ? 'admin-theme-dark bg-[#05080E] text-slate-100 selection:bg-rose-900 selection:text-white'
          : 'admin-theme-light bg-slate-100 text-slate-900 selection:bg-rose-500 selection:text-white'
      } flex flex-col lg:flex-row font-sans transition-colors duration-200`}
    >
      {/* ========================================================
          1. DESKTOP & MOBILE SIDEBAR NAVIGATION
          ======================================================== */}
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 ${
          isDark
            ? 'bg-[#090E17]/95 border-white/15 text-slate-100'
            : 'bg-white border-slate-200 text-slate-800 shadow-xl'
        } border-r backdrop-blur-2xl flex flex-col justify-between p-5 transition-all duration-300 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header: Logo & Branding */}
        <div>
          <div className={`flex items-center justify-between pb-5 border-b ${isDark ? 'border-white/10' : 'border-slate-200'} mb-6`}>
            <Link
              to="/admin"
              onClick={() => setMobileSidebarOpen(false)}
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-900 via-[#641326] to-[#240812] border-2 border-white/40 flex items-center justify-center shadow-[0_0_20px_rgba(225,29,72,0.4)] group-hover:scale-105 transition-transform">
                <span className="font-black text-white text-base tracking-wider font-mono">
                  RS
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-sm font-black uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    RISKI PROJEK
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-950/80 border border-rose-500/30 text-[9.5px] font-mono text-rose-300 font-bold">
                  <span>ADMIN MASTER</span>
                  <span>•</span>
                  <span>OWNER-001</span>
                </div>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className={`lg:hidden p-1.5 rounded-lg ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1.5">
            <div className={`text-[10px] font-mono font-bold uppercase tracking-widest px-3 mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Sistem Menu
            </div>
            {NAV_ITEMS.map((item) => {
              const active = isCurrentActive(item);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 group ${
                    active
                      ? 'bg-gradient-to-r from-rose-900 via-[#641326] to-[#43071a] text-white shadow-lg shadow-rose-950/50 border border-rose-400/50 scale-[1.02]'
                      : isDark
                      ? 'text-slate-300 hover:text-white hover:bg-white/[0.06] border border-transparent'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        active ? 'text-amber-300' : isDark ? 'text-slate-400 group-hover:text-white' : 'text-slate-500 group-hover:text-slate-900'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9.5px] font-mono px-1.5 py-0.5 rounded-md font-semibold ${
                        active
                          ? 'bg-black/40 text-amber-300 border border-white/20'
                          : isDark
                          ? 'bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-slate-200'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar: Status, Backup & Public Website Preview */}
        <div className={`space-y-3 pt-5 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
          {/* Theme Switcher in Sidebar */}
          <ThemeToggle variant="full" />

          {/* Quick Database Backup */}
          <button
            type="button"
            onClick={exportDatabaseBackup}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer shadow-sm ${
              isDark
                ? 'bg-white/[0.04] hover:bg-white/[0.10] border-white/10 text-slate-300 hover:text-white'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-rose-500" />
              <span>Backup Database</span>
            </div>
            <span className="text-[9px] font-mono text-emerald-500 font-bold">JSON Ready</span>
          </button>

          {/* Link to Live Master Website */}
          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-[#18040E] to-[#2E0715] hover:from-[#2E0715] hover:to-[#4A0A22] border border-rose-500/40 text-white text-xs font-bold transition-all shadow-md shadow-black/40 group"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Buka Website Master</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-rose-300 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          {/* Logout Action Button */}
          <button
            type="button"
            onClick={() => {
              if (confirm('Kunci sesi Admin Master dan kembali ke halaman login?')) {
                logoutMaster();
                navigate('/admin/login');
              }
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-xs font-semibold text-rose-300 hover:text-white transition-all cursor-pointer shadow-sm"
          >
            <div className="flex items-center gap-2">
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Kunci / Logout Master</span>
            </div>
            <Lock className="w-3 h-3 text-rose-400/70" />
          </button>

          {/* Version Info */}
          <div className="text-[10px] font-mono text-slate-400 text-center">
            {templateConfig.version} • {templateConfig.edition}
          </div>
        </div>
      </aside>

      {/* ========================================================
          2. MAIN CONTENT AREA & TOPBAR
          ======================================================== */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Topbar */}
        <header
          className={`sticky top-0 z-30 h-16 ${
            isDark
              ? 'bg-[#090E17]/85 border-white/15 text-slate-100'
              : 'bg-white/90 border-slate-200 text-slate-900 shadow-xs'
          } backdrop-blur-xl border-b px-4 sm:px-8 flex items-center justify-between transition-colors duration-200`}
        >
          {/* Left: Mobile Toggle & Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className={`lg:hidden p-2 rounded-lg ${isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'}`}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className={`flex items-center gap-2 text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>ADMIN</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="text-rose-500 font-semibold uppercase">
                {location.pathname.replace('/admin', '').replace('/', '') || 'Dashboard'}
              </span>
            </div>
          </div>

          {/* Right: Theme Toggle, Master Status, Logout & Quick Profile Pill */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Cloud Supabase Status Badge */}
            <div className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[11px] font-mono text-emerald-300 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Cloud Database: Connected</span>
            </div>

            {/* Theme Toggle Button */}
            <ThemeToggle variant="button" />

            <Link
              to="/"
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all shadow-sm ${
                isDark
                  ? 'bg-white/10 hover:bg-white/20 border-white/20 text-slate-200 hover:text-white'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Web Master</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                logoutMaster();
                navigate('/admin/login');
              }}
              title="Kunci Akses Admin"
              className="p-2 rounded-lg bg-rose-950/50 hover:bg-rose-900 border border-rose-500/30 text-rose-300 hover:text-white transition-all cursor-pointer"
            >
              <Lock className="w-4 h-4" />
            </button>

            <div className={`flex items-center gap-2.5 pl-3 border-l ${isDark ? 'border-white/15' : 'border-slate-200'}`}>
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-rose-500/40 bg-black">
                <img
                  src={ownerData.profile.avatarUrl}
                  alt={ownerData.profile.fullName}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="hidden md:block text-left">
                <div className={`text-xs font-bold leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {ownerData.profile.fullName}
                </div>
                <div className="text-[10px] font-mono text-emerald-500 font-semibold">
                  Owner Active
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Outlet Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto overflow-y-auto custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
