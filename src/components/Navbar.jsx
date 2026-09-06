import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS } from '../data/navigation';
import { usePortfolio } from '../context/PortfolioContext';

export default function Navbar({ customData, showBuyButton }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { ownerData } = usePortfolio();
  const data = customData || ownerData;
  const fullName = data?.profile?.fullName || 'Riski Saputra';
  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Show "Beli Template" ONLY on the Master Website (OWNER-001 at root '/')
  const isMasterHome = showBuyButton !== undefined
    ? showBuyButton
    : (!customData && (location.pathname === '/' || location.pathname === ''));

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // 1. If user is at or near the bottom of the page, activate 'contact'
      const isAtBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80;
      if (isAtBottom) {
        setActiveSection('contact');
        return;
      }

      // 2. Viewport boundary checks
      const contactEl = document.getElementById('contact');
      const projectsEl = document.getElementById('projects');
      const aboutEl = document.getElementById('about');

      if (contactEl) {
        const contactRect = contactEl.getBoundingClientRect();
        if (contactRect.top <= window.innerHeight * 0.45) {
          setActiveSection('contact');
          return;
        }
      }

      if (projectsEl) {
        const projectsRect = projectsEl.getBoundingClientRect();
        if (projectsRect.top <= window.innerHeight * 0.45 && projectsRect.bottom >= window.innerHeight * 0.2) {
          setActiveSection('projects');
          return;
        }
      }

      if (aboutEl) {
        const aboutRect = aboutEl.getBoundingClientRect();
        if (aboutRect.top <= window.innerHeight * 0.45 && aboutRect.bottom >= window.innerHeight * 0.2) {
          setActiveSection('about');
          return;
        }
      }

      // Default to home
      setActiveSection('home');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, href, id) => {
    e.preventDefault();
    setActiveSection(id);
    setMobileMenuOpen(false);

    const isCustomerPage = location.pathname.startsWith('/portfolio/');
    const isRootHome = location.pathname === '/' || location.pathname === '';

    // If on /pricing or any other sub-route and NOT on home:
    if (!isRootHome && !isCustomerPage) {
      navigate('/');
      if (id === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setTimeout(() => {
          const element = document.getElementById(id);
          if (element) {
            const elementRect = element.getBoundingClientRect();
            const absoluteElementTop = elementRect.top + window.pageYOffset;
            const targetScroll = absoluteElementTop - (id === 'projects' || id === 'contact' ? 40 : 0);
            window.scrollTo({ top: Math.max(0, targetScroll), behavior: 'smooth' });
          }
        }, 150);
      }
      return;
    }

    // Normal on-page scroll (Home or Customer Portfolio)
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      const elementRect = element.getBoundingClientRect();
      const absoluteElementTop = elementRect.top + window.pageYOffset;
      const targetScroll = absoluteElementTop - (id === 'projects' || id === 'contact' ? 40 : 0);
      window.scrollTo({
        top: Math.max(0, targetScroll),
        behavior: 'smooth',
      });
    }
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (customData?.slug) {
      navigate(`/portfolio/${customData.slug}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'py-2 sm:py-2.5 bg-white/[0.12] backdrop-blur-2xl border-b border-white/20 shadow-md shadow-black/20'
          : 'py-2.5 sm:py-3 bg-white/[0.07] backdrop-blur-xl border-b border-white/15 shadow-sm shadow-black/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo Brand: [ RS ] Riski Saputra (Elevated & Sleek) */}
          <a
            href="#home"
            onClick={handleLogoClick}
            className="flex items-center gap-3 group focus:outline-none cursor-pointer"
          >
            <div className="w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 rounded-lg border border-white/40 bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:border-white group-hover:bg-white/20 shadow-md shadow-black/40 transition-all duration-300 group-hover:scale-105">
              <span className="font-black text-white text-sm sm:text-base tracking-wider font-mono drop-shadow">
                {initials}
              </span>
            </div>
            <span className="text-sm sm:text-base font-bold tracking-tight text-white group-hover:text-rose-200 transition-colors">
              {fullName}
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href, link.id)}
                  className={`relative px-3.5 py-1.5 text-xs sm:text-[13px] font-semibold transition-all duration-200 rounded-lg cursor-pointer ${
                    isActive
                      ? 'text-white bg-gradient-to-r from-rose-900 to-[#5c0b25] shadow-md shadow-rose-950/50 border border-white/40'
                      : 'text-white/85 hover:text-white hover:bg-white/15'
                  }`}
                >
                  <span className="relative z-10">{link.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Right Action: Login Editor & Beli Template */}
          <div className="hidden md:flex items-center gap-2">
            <a
              href="/customer/login"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer"
            >
              <span>Login Editor</span>
            </a>
            {isMasterHome && (
              <a
                href="/pricing"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 via-rose-700 to-rose-900 hover:from-amber-500 hover:to-rose-800 border border-amber-400/50 text-xs font-bold text-white shadow-md shadow-rose-950/40 transition-all hover:scale-105 cursor-pointer"
              >
                <span>Beli Template</span>
              </a>
            )}
          </div>

          {/* Mobile Hamburger & Actions */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href="/customer/login"
              className="px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/20 text-[11px] font-semibold text-slate-200"
            >
              Login
            </a>
            {isMasterHome && (
              <a
                href="/pricing"
                className="px-2.5 py-1.5 rounded-lg bg-rose-900 border border-amber-400/50 text-[11px] font-bold text-white"
              >
                Beli Template
              </a>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Mobile Menu"
              className="p-2 rounded-lg border border-white/30 bg-white/10 text-white hover:bg-white/20 cursor-pointer backdrop-blur-md"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-white/20 bg-slate-950/80 backdrop-blur-2xl px-6 py-4 mt-3"
          >
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href, link.id)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-gradient-to-r from-rose-900 to-[#5c0b25] text-white shadow-md border border-white/30'
                        : 'text-white/85 hover:bg-white/15'
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
              <a
                href="/customer/login"
                className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-white/10 flex items-center justify-between border-t border-white/10 pt-3"
              >
                <span>Portal Login Editor Pelanggan</span>
                <span>🔑</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
