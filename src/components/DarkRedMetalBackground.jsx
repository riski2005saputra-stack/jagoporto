import React, { useEffect, useRef } from 'react';

/**
 * 100% Code-Generated "ABSTRACT DARK RED METAL" Background (BRIGHT & VIBRANT)
 * Pure CSS / HTML / Canvas / SVG. Zero external images or videos.
 * Features: Rich Radiant Metallic Gradients, Dynamic Crimson Glows, Metallic Waves, CAD Blueprint Grid, Floating Particles & Noise Texture.
 */
export default function DarkRedMetalBackground() {
  const canvasRef = useRef(null);

  // Floating Crimson Embers / Micro-Particles Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle pool with higher luminosity
    const particleCount = Math.min(55, Math.floor((width * height) / 24000));
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.2 + 0.8,
      speedY: Math.random() * 0.5 + 0.2,
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.6 + 0.35,
      pulseSpeed: Math.random() * 0.025 + 0.01,
      pulseAngle: Math.random() * Math.PI * 2,
      color: Math.random() > 0.3 ? 'rgba(235, 60, 85,' : 'rgba(195, 35, 60,',
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y -= p.speedY;
        p.x += p.speedX;
        p.pulseAngle += p.pulseSpeed;
        const currentOpacity = Math.max(0.2, p.opacity + Math.sin(p.pulseAngle) * 0.25);

        // Respawn when reaching top or borders
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Draw particle glow
        ctx.save();
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3.5);
        gradient.addColorStop(0, `${p.color} ${currentOpacity})`);
        gradient.addColorStop(0.5, `${p.color} ${currentOpacity * 0.5})`);
        gradient.addColorStop(1, `${p.color} 0)`);
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.radius * 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Core bright center
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 220, 230, ${currentOpacity * 0.95})`;
        ctx.arc(p.x, p.y, p.radius * 0.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
      
      {/* ========================================================
          1. BRIGHT RADIANT BASE METALLIC GRADIENT
          ======================================================== */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: `
            radial-gradient(ellipse 130% 110% at 50% 15%, #4A0D22 0%, #2A0714 45%, #120309 85%),
            linear-gradient(135deg, #14030A 0%, #280613 25%, #4D0E23 50%, #280613 75%, #14030A 100%)
          `,
        }}
      />

      {/* ========================================================
          2. ANIMATED SPECULAR METALLIC HIGHLIGHT SHEEN
          ======================================================== */}
      <div
        className="absolute inset-0 w-full h-full opacity-40 animate-pulse pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(115deg, transparent 15%, rgba(139,21,56,0.35) 35%, rgba(215,53,77,0.5) 50%, rgba(122,19,48,0.35) 65%, transparent 85%)
          `,
          backgroundSize: '250% 250%',
          animationDuration: '10s',
        }}
      />

      {/* ========================================================
          3. VIBRANT RED & CRIMSON GLOWING AMBIENT LIGHTS (PURE CRIMSON/MAROON)
          ======================================================== */}
      {/* Light 1: Top Center-Right Radiant Crimson Aura */}
      <div
        className="absolute -top-16 right-10 sm:right-1/4 w-[600px] sm:w-[850px] h-[600px] sm:h-[850px] rounded-full blur-[120px] opacity-60 animate-pulse pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #8B1538 0%, #5C0E24 40%, #25040E 70%, transparent 100%)',
          animationDuration: '8s',
        }}
      />

      {/* Light 2: Center-Left Deep Burgundy Glow */}
      <div
        className="absolute top-1/3 -left-20 w-[650px] sm:w-[900px] h-[650px] sm:h-[900px] rounded-full blur-[130px] opacity-60 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #9E1B38 0%, #5C0E24 45%, #1A050E 80%, transparent 100%)',
        }}
      />

      {/* Light 3: Bottom Center Vivid Soft Red Aura */}
      <div
        className="absolute -bottom-24 left-1/3 w-[750px] sm:w-[950px] h-[750px] sm:h-[950px] rounded-full blur-[140px] opacity-55 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #B81D3C 0%, #8B1538 35%, #3D0817 70%, transparent 100%)',
        }}
      />

      {/* ========================================================
          4. BRIGHT ABSTRACT METALLIC FLOWING WAVES (SVG)
          ======================================================== */}
      <svg
        className="absolute inset-0 w-full h-full opacity-45 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Metallic Wave Gradient 1 */}
          <linearGradient id="brightMetalWave1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#15030A" stopOpacity="0" />
            <stop offset="25%" stopColor="#641326" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#8B1538" stopOpacity="0.6" />
            <stop offset="75%" stopColor="#641326" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#15030A" stopOpacity="0" />
          </linearGradient>

          {/* Metallic Wave Gradient 2 */}
          <linearGradient id="brightMetalWave2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#15030A" stopOpacity="0" />
            <stop offset="30%" stopColor="#8B1538" stopOpacity="0.65" />
            <stop offset="55%" stopColor="#B81D3C" stopOpacity="0.5" />
            <stop offset="80%" stopColor="#4A0D22" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#15030A" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Wave Layer 1 */}
        <path
          d="M -100,240 C 300,80 650,420 1100,180 C 1300,60 1500,280 1600,220 L 1600,900 L -100,900 Z"
          fill="url(#brightMetalWave1)"
        />

        {/* Wave Layer 2 */}
        <path
          d="M -100,450 C 250,590 600,320 1000,530 C 1280,670 1500,420 1600,470 L 1600,900 L -100,900 Z"
          fill="url(#brightMetalWave2)"
        />

        {/* Dynamic Contour Lines with Higher Glow */}
        <path
          d="M -50,140 Q 400,280 800,100 T 1500,260"
          fill="none"
          stroke="#C42042"
          strokeWidth="1.6"
          strokeOpacity="0.45"
          strokeDasharray="8 8"
        />
        <path
          d="M -50,620 Q 500,450 950,650 T 1500,490"
          fill="none"
          stroke="#9E1B38"
          strokeWidth="1.4"
          strokeOpacity="0.4"
        />
      </svg>

      {/* ========================================================
          5. MECHANICAL CAD / TECHNICAL BLUEPRINT GRID & LINES
          ======================================================== */}
      <div 
        className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(225, 45, 75, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(225, 45, 75, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Secondary Dense Technical Grid */}
      <div 
        className="absolute inset-0 w-full h-full opacity-18 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(245, 70, 100, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(245, 70, 100, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '12px 12px',
        }}
      />

      {/* Technical HUD Overlay Watermarks */}
      <div className="absolute top-24 left-6 sm:left-10 text-[9.5px] font-mono text-rose-300/45 tracking-widest hidden md:block">
        <div>[SYS_GRID: 48x48 mm]</div>
        <div>LAT_REF: 08°06'09" N</div>
        <div>SURFACE: TITANIUM-MAROON ALLOY</div>
      </div>

      <div className="absolute bottom-10 right-6 sm:right-10 text-[9.5px] font-mono text-rose-300/45 tracking-widest text-right hidden md:block">
        <div>AUTODESK INVENTOR & CAD SUITE</div>
        <div>STATUS: ALL SYSTEMS NOMINAL</div>
        <div>VER: 2026.08.31</div>
      </div>

      {/* Horizontal Laser Scanning Line (Vivid Sweep) */}
      <div
        className="absolute left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-[#E63956]/70 to-transparent shadow-[0_0_12px_rgba(230,57,86,0.9)] animate-pulse pointer-events-none"
        style={{
          top: '35%',
          animationDuration: '6s',
        }}
      />

      {/* ========================================================
          6. FLOATING RED PARTICLES & EMBERS (HTML5 CANVAS)
          ======================================================== */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-1"
      />

      {/* ========================================================
          7. SOFT VIGNETTE OVERLAY
          ======================================================== */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none z-3"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(18,3,9,0.45) 75%, rgba(18,3,9,0.85) 100%)',
        }}
      />
    </div>
  );
}
