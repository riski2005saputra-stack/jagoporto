import React, { useEffect, useRef, useState, useMemo } from 'react';

export default function ScrollFrameCanvas({
  scrollProgress,
  totalFrames = 192,
  basePath = '/Zoom_sequence_to_oil_refinery_202608202218-frames',
  filePrefix = 'frame-',
  fileExt = '.jpg',
  padLength = 4,
  filterStyle = 'contrast(1.04) brightness(0.95)',
  overlayGradient = 'bg-gradient-to-b from-[#05080D]/50 via-[#05080D]/35 to-[#05080D]/65',
}) {
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const loadedFlagsRef = useRef([]);
  const currentFrameRef = useRef(0);
  const rafIdRef = useRef(null);
  const [isFirstFrameLoaded, setIsFirstFrameLoaded] = useState(false);

  // Generate frame URLs memoized
  const frameUrls = useMemo(() => {
    return Array.from({ length: totalFrames }, (_, i) => {
      const num = String(i + 1).padStart(padLength, '0');
      return `${basePath}/${filePrefix}${num}${fileExt}`;
    });
  }, [totalFrames, basePath, filePrefix, fileExt, padLength]);

  // Helper to draw a specific frame to canvas with object-fit: cover
  const drawFrame = (frameIndex) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Find requested frame or fallback to nearest loaded frame
    let imgToDraw = null;
    if (loadedFlagsRef.current[frameIndex] && imagesRef.current[frameIndex]) {
      imgToDraw = imagesRef.current[frameIndex];
    } else {
      // Find nearest loaded frame
      for (let dist = 1; dist < totalFrames; dist++) {
        const left = frameIndex - dist;
        const right = frameIndex + dist;
        if (left >= 0 && loadedFlagsRef.current[left]) {
          imgToDraw = imagesRef.current[left];
          break;
        }
        if (right < totalFrames && loadedFlagsRef.current[right]) {
          imgToDraw = imagesRef.current[right];
          break;
        }
      }
      // If still none, fallback to frame 0
      if (!imgToDraw && loadedFlagsRef.current[0]) {
        imgToDraw = imagesRef.current[0];
      }
    }

    if (!imgToDraw || !imgToDraw.complete || imgToDraw.naturalWidth === 0) {
      return;
    }

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgWidth = imgToDraw.naturalWidth || imgToDraw.width;
    const imgHeight = imgToDraw.naturalHeight || imgToDraw.height;

    const imgRatio = imgWidth / imgHeight;
    const canvasRatio = canvasWidth / canvasHeight;

    let drawWidth, drawHeight, offsetX, offsetY;

    // Object-fit: cover calculation
    if (canvasRatio > imgRatio) {
      drawWidth = canvasWidth;
      drawHeight = canvasWidth / imgRatio;
      offsetX = 0;
      offsetY = (canvasHeight - drawHeight) / 2;
    } else {
      drawWidth = canvasHeight * imgRatio;
      drawHeight = canvasHeight;
      offsetX = (canvasWidth - drawWidth) / 2;
      offsetY = 0;
    }

    ctx.drawImage(imgToDraw, offsetX, offsetY, drawWidth, drawHeight);
  };

  // Resize canvas according to window size and DPR
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2 for performance
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }

    drawFrame(currentFrameRef.current);
  };

  // 1. Initial Setup & Progressive Preloading
  useEffect(() => {
    imagesRef.current = new Array(totalFrames);
    loadedFlagsRef.current = new Array(totalFrames).fill(false);

    // Resize listener
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Priority 1: Load First Frame immediately
    const firstImg = new Image();
    firstImg.src = frameUrls[0];
    firstImg.onload = () => {
      imagesRef.current[0] = firstImg;
      loadedFlagsRef.current[0] = true;
      setIsFirstFrameLoaded(true);
      resizeCanvas();
      drawFrame(0);
    };

    // Priority 2: Preload initial burst (frames 1 to 30)
    const preloadBurst = () => {
      const burstCount = Math.min(30, totalFrames);
      for (let i = 1; i < burstCount; i++) {
        const img = new Image();
        img.src = frameUrls[i];
        img.onload = () => {
          imagesRef.current[i] = img;
          loadedFlagsRef.current[i] = true;
        };
      }
    };
    preloadBurst();

    // Priority 3: Preload remaining frames in staged background batches
    const loadRemaining = () => {
      let currentIndex = 30;
      const batchSize = 15;

      const loadNextBatch = () => {
        if (currentIndex >= totalFrames) return;

        const end = Math.min(currentIndex + batchSize, totalFrames);
        for (let i = currentIndex; i < end; i++) {
          const img = new Image();
          img.src = frameUrls[i];
          img.onload = () => {
            imagesRef.current[i] = img;
            loadedFlagsRef.current[i] = true;
          };
        }
        currentIndex = end;

        if (currentIndex < totalFrames) {
          if ('requestIdleCallback' in window) {
            window.requestIdleCallback(loadNextBatch, { timeout: 300 });
          } else {
            setTimeout(loadNextBatch, 80);
          }
        }
      };

      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(loadNextBatch, { timeout: 200 });
      } else {
        setTimeout(loadNextBatch, 150);
      }
    };

    const timer = setTimeout(loadRemaining, 300);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      clearTimeout(timer);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [frameUrls, totalFrames]);

  // 2. Connect Scroll Progress to Frame Rendering with requestAnimationFrame
  useEffect(() => {
    if (!scrollProgress) return;

    const unsubscribe = scrollProgress.on('change', (latestProgress) => {
      // Map progress (0 to 1) to frame index (0 to totalFrames - 1)
      const normalized = Math.max(0, Math.min(1, latestProgress));
      
      // Slightly expanded mapping so final frame holds stably at bottom
      const progressMapped = Math.min(1, normalized / 0.92);
      const targetFrame = Math.min(
        totalFrames - 1,
        Math.max(0, Math.floor(progressMapped * (totalFrames - 1)))
      );

      if (targetFrame !== currentFrameRef.current) {
        currentFrameRef.current = targetFrame;

        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current);
        }

        rafIdRef.current = requestAnimationFrame(() => {
          drawFrame(targetFrame);
        });
      }
    });

    return () => {
      unsubscribe();
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [scrollProgress, totalFrames]);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none">
      {/* HTML5 High-Performance Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block object-cover transform-gpu"
        style={{
          filter: filterStyle,
        }}
      />

      {/* Layer 2: Subtle Cinematic Vignette / Glass Gradient Overlay */}
      <div className={`absolute inset-0 ${overlayGradient} pointer-events-none`} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(5,8,13,0.5)_100%)] pointer-events-none" />
    </div>
  );
}
