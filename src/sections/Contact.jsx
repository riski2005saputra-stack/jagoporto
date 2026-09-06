import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2 } from 'lucide-react';
import InteractiveContactCard from '../components/InteractiveContactCard';
import { usePortfolio } from '../context/PortfolioContext';

export default function Contact({ customData }) {
  const { ownerData } = usePortfolio();
  const data = customData || ownerData;
  const fullName = data?.profile?.fullName || 'Riski Saputra';
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState('idle');
  const [sendersList, setSendersList] = useState(() => {
    try {
      const saved = localStorage.getItem('contact_senders_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      const single = localStorage.getItem('contact_sender_name');
      if (single) return [single];
      return [];
    } catch {
      return [];
    }
  });

  // Seamless continuous text ribbon 1 & 2: ONLY 'NEW MESSAGE: [NAMA]' when available
  const ribbonText1 = useMemo(() => {
    if (sendersList && sendersList.length > 0) {
      const namesJoined = sendersList.map((n) => `NEW MESSAGE: ${n.trim().toUpperCase()}`).join(' • ');
      const unit = `• ${namesJoined} `;
      const repeatCount = Math.max(8, Math.ceil(500 / (unit.length || 1)));
      return unit.repeat(repeatCount) + '•';
    }
    const defaultUnit = `• CONTACT RISKI SAPUTRA • KONTAK RISKI SAPUTRA • WHATSAPP: +62 859-2332-0768 • EMAIL: RISKI2005SAPUTRA@GMAIL.COM `;
    return defaultUnit.repeat(6) + '•';
  }, [sendersList]);

  const ribbonText2 = useMemo(() => {
    if (sendersList && sendersList.length > 0) {
      const namesJoined = sendersList.map((n) => `NEW MESSAGE: ${n.trim().toUpperCase()}`).join(' • ');
      const unit = `• ${namesJoined} `;
      const repeatCount = Math.max(8, Math.ceil(500 / (unit.length || 1)));
      return unit.repeat(repeatCount) + '•';
    }
    const defaultUnit = `• CONTACT RISKI SAPUTRA • KONTAK RISKI SAPUTRA • WHATSAPP: +62 859-2332-0768 • EMAIL: RISKI2005SAPUTRA@GMAIL.COM `;
    return defaultUnit.repeat(6) + '•';
  }, [sendersList]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formState.name || !formState.message) {
      alert('Mohon lengkapi nama dan pesan sebelum mengirim.');
      return;
    }

    const currentName = formState.name.trim().toUpperCase();
    const updatedList = [currentName, ...sendersList.filter((n) => n.toUpperCase() !== currentName)];
    setSendersList(updatedList);
    try {
      localStorage.setItem('contact_senders_history', JSON.stringify(updatedList));
      localStorage.setItem('contact_sender_name', currentName);
    } catch (err) {
      console.error(err);
    }

    setStatus('loading');
    
    // Format structured, professional message for WhatsApp
    let waText = `Halo Mas Riski Saputra, saya menghubungi Anda melalui Website Portofolio.\n\n`;
    waText += `👤 *Nama:* ${currentName}\n`;
    if (formState.email) {
      waText += `📧 *Email:* ${formState.email}\n`;
    }
    if (formState.subject) {
      waText += `📌 *Topik / Subjek:* ${formState.subject}\n`;
    }
    waText += `💬 *Pesan:*\n${formState.message}\n\n`;
    waText += `Terima kasih.`;

    const encodedText = encodeURIComponent(waText);
    const waUrl = `https://wa.me/6285923320768?text=${encodedText}`;

    setTimeout(() => {
      window.open(waUrl, '_blank');
      setStatus('success');
      setFormState({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 6000);
    }, 400);
  };

  return (
    <section
      id="contact"
      className="relative min-h-screen pt-24 sm:pt-28 pb-8 sm:pb-10 px-4 sm:px-8 bg-office-atmosphere flex flex-col justify-start overflow-x-clip overflow-y-visible z-30 shadow-[0_-35px_90px_rgba(0,0,0,0.98)]"
    >
      {/* ========================================================
          1. BASE BOUNDARY HAZARD CAUTION TAPE (GARIS PERTAMA)
          ======================================================== */}
      <div className="absolute top-0 inset-x-0 w-full overflow-hidden flex select-none z-20 shadow-[0_0_12px_rgba(255,255,255,0.22)] border-b border-white/20">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: 240,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="flex w-max shrink-0 bg-[#FFB800]"
        >
          {/* 2 identical clones for infinite seamless scroll */}
          {[1, 2].map((idx) => (
            <div key={idx} className="flex flex-col shrink-0">
              <div 
                className="h-2.5 sm:h-3 w-full"
                style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, #000000 0, #000000 12px, #FFB800 12px, #FFB800 24px)',
                }}
              />
              <div className="py-1.5 sm:py-2 px-8 flex items-center whitespace-nowrap bg-[#FFB800]">
                <span className="text-black font-black font-mono tracking-[0.22em] text-xs sm:text-sm md:text-base uppercase leading-none">
                  {ribbonText1}
                </span>
              </div>
              <div 
                className="h-2.5 sm:h-3 w-full"
                style={{
                  backgroundImage: 'repeating-linear-gradient(-45deg, #000000 0, #000000 12px, #FFB800 12px, #FFB800 24px)',
                }}
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* ========================================================
          2. PITA MENYILANG (TITIK SILANG DI SAMPING KIRI)
          POSISI: DI ATAS GARIS PERTAMA (2 GARIS SAJA)
          BAYANGAN: PUTIH LEMBUT SAJA (TANPA HITAM)
          ======================================================== */}
      {/* Pita Silang: Miring ke Kanan Bawah (Rotate +4.5deg) */}
      <div 
        className="absolute pointer-events-none z-[22] overflow-hidden select-none shadow-[0_0_14px_rgba(255,255,255,0.22)]"
        style={{
          width: '240vw',
          minWidth: '2800px',
          top: '-12px',
          left: '-70vw',
          transform: 'rotate(4.5deg)',
          transformOrigin: '35% 50%',
        }}
      >
        <motion.div
          animate={{ x: ['-50%', '0%'] }}
          transition={{
            duration: 220,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="flex w-max shrink-0 bg-[#FFB800] border-y border-white/40"
        >
          {[1, 2].map((idx) => (
            <div key={idx} className="flex flex-col shrink-0">
              <div 
                className="h-2.5 w-full"
                style={{
                  backgroundImage: 'repeating-linear-gradient(-45deg, #000000 0, #000000 10px, #FFB800 10px, #FFB800 20px)',
                }}
              />
              <div className="py-1.5 px-8 flex items-center whitespace-nowrap bg-[#FFB800]">
                <span className="text-black font-black font-mono tracking-[0.22em] text-xs sm:text-sm uppercase leading-none">
                  {ribbonText2}
                </span>
              </div>
              <div 
                className="h-2.5 w-full"
                style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, #000000 0, #000000 10px, #FFB800 10px, #FFB800 20px)',
                }}
              />
            </div>
          ))}
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center z-10 my-auto pt-6 sm:pt-8">
        
        {/* Left Column: Interactive Contact Card with Dynamic Lanyard */}
        <div className="lg:col-span-5 flex items-center justify-center relative">
          <InteractiveContactCard customData={data} />
        </div>

        {/* Right Column: Header & Contact Form (Raised Up) */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 flex flex-col items-start"
        >
          {/* Badge: 04 / KONTAK */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/30 bg-[#0D1522] mb-3 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-xs font-mono font-semibold tracking-wider text-white">
              04 / KONTAK
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-[38px] font-black text-white leading-tight tracking-tight mb-2 font-sans">
            Kontak Saya
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 mb-6">
            Mari berkolaborasi dan wujudkan ide rekayasa terbaik Anda bersama {fullName}.
          </p>

          {/* Corporate Form Container (Crisp Solid Card without Blur) */}
          <div className="w-full rounded-2xl bg-[#0D1522] border-2 border-slate-700/80 p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            <h3 className="text-sm sm:text-base font-bold text-white mb-5">Kirim Pesan</h3>

            {status === 'success' ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-1 animate-bounce" />
                <h4 className="text-base font-bold text-white">Pesan Berhasil Terkirim!</h4>
                <p className="text-xs text-slate-300">
                  Riski Saputra akan segera merespon pesan Anda.
                </p>
                {sendersList && sendersList.length > 0 && (
                  <div className="inline-flex items-center gap-2 mt-2 px-3.5 py-1.5 rounded-lg bg-black/60 border border-[#FFB800]/50 text-[#FFB800] text-xs font-mono">
                    <span className="w-2 h-2 rounded-full bg-[#FFB800] animate-ping" />
                    <span>Nama <strong>{sendersList[0]}</strong> sekarang dicatat pada garis bergerak di atas!</span>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <input
                    type="text"
                    required
                    placeholder="Nama Anda"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-[#060B12] border border-slate-700 text-white placeholder-slate-400 text-xs sm:text-sm outline-none focus:border-white/70 transition-colors font-medium"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email Anda"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-[#060B12] border border-slate-700 text-white placeholder-slate-400 text-xs sm:text-sm outline-none focus:border-white/70 transition-colors font-medium"
                  />
                </div>

                <input
                  type="text"
                  placeholder="Subjek"
                  value={formState.subject}
                  onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                  className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-[#060B12] border border-slate-700 text-white placeholder-slate-400 text-xs sm:text-sm outline-none focus:border-white/70 transition-colors font-medium"
                />

                <textarea
                  required
                  rows={4}
                  placeholder="Pesan Anda"
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-[#060B12] border border-slate-700 text-white placeholder-slate-400 text-xs sm:text-sm outline-none focus:border-white/70 transition-colors resize-none font-medium"
                />

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-rose-900 to-[#5c0b25] hover:from-rose-800 hover:to-rose-900 active:bg-rose-950 transition-all duration-200 shadow-md shadow-rose-950/40 border border-white/40 cursor-pointer"
                >
                  <span>{status === 'loading' ? 'Mengirim...' : 'Kirim Pesan'}</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
