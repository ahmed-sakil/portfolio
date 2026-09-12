import { useEffect, useRef } from 'react';

const hexToRgb = (hex) => {
  let clean = (hex || '#00e5a0').trim();
  if (clean.startsWith('var(')) return { r: 0, g: 229, b: 160 };
  if (clean.startsWith('#')) {
    clean = clean.slice(1);
    if (clean.length === 3) {
      clean = clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2];
    }
    const num = parseInt(clean, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  }
  return { r: 0, g: 229, b: 160 };
};

const MouseCursor = () => {
  const canvasRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    // Only activate on devices with a mouse
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const glow = glowRef.current;

    let animId;
    let isVisible = false;
    let mouse = { x: -100, y: -100 };
    let rawPoints = [];

    // Theme Accent Sync
    let currentAccent = '#00e5a0';
    let currentRgb = { r: 0, g: 229, b: 160 };

    const updateAccent = () => {
      const computed = getComputedStyle(document.documentElement);
      const acc = computed.getPropertyValue('--accent').trim() || '#00e5a0';
      currentAccent = acc;
      currentRgb = hexToRgb(acc);
      if (glow) {
        glow.style.background = `radial-gradient(circle, rgba(${currentRgb.r},${currentRgb.g},${currentRgb.b},0.65) 0%, rgba(${currentRgb.r},${currentRgb.g},${currentRgb.b},0.2) 45%, rgba(${currentRgb.r},${currentRgb.g},${currentRgb.b},0) 75%)`;
      }
    };

    updateAccent();
    window.addEventListener('portfolio-theme-change', updateAccent);

    const MAX_TAIL_PX = 55;   // Strict max length of tail in pixels
    const MAX_AGE_MS = 140;   // Quick fade

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      isVisible = true;

      const now = Date.now();
      rawPoints.push({ x: e.clientX, y: e.clientY, time: now });

      if (rawPoints.length > 25) {
        rawPoints.shift();
      }
    };

    const handleMouseLeave = () => {
      isVisible = false;
      rawPoints = [];
    };

    const handleMouseEnter = () => {
      isVisible = true;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isVisible) {
        if (glow) {
          glow.style.opacity = '1';
          glow.style.transform = `translate3d(${mouse.x - 12}px, ${mouse.y - 12}px, 0)`;
        }

        const now = Date.now();
        rawPoints = rawPoints.filter((p) => now - p.time < MAX_AGE_MS);

        if (rawPoints.length > 1) {
          const head = { x: mouse.x, y: mouse.y, time: now };
          const clampedPoints = [head];
          let accumulatedDist = 0;

          for (let i = rawPoints.length - 1; i >= 0; i--) {
            const prev = clampedPoints[clampedPoints.length - 1];
            const curr = rawPoints[i];
            const dist = Math.hypot(curr.x - prev.x, curr.y - prev.y);

            if (accumulatedDist + dist > MAX_TAIL_PX) {
              const remaining = MAX_TAIL_PX - accumulatedDist;
              if (remaining > 2 && dist > 0) {
                const t = remaining / dist;
                clampedPoints.push({
                  x: prev.x + (curr.x - prev.x) * t,
                  y: prev.y + (curr.y - prev.y) * t,
                  time: curr.time,
                });
              }
              break;
            }

            accumulatedDist += dist;
            clampedPoints.push(curr);
          }

          if (clampedPoints.length >= 2) {
            ctx.save();
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            for (let i = 0; i < clampedPoints.length - 1; i++) {
              const p0 = clampedPoints[i];
              const p1 = clampedPoints[i + 1];

              const progress = 1 - i / clampedPoints.length;
              const alpha = progress * 0.75;
              const width = Math.max(0.5, progress * 4.5);

              ctx.beginPath();
              ctx.moveTo(p0.x, p0.y);
              ctx.lineTo(p1.x, p1.y);
              ctx.strokeStyle = `rgba(${currentRgb.r}, ${currentRgb.g}, ${currentRgb.b}, ${alpha})`;
              ctx.lineWidth = width;
              ctx.shadowColor = currentAccent;
              ctx.shadowBlur = progress * 8;
              ctx.stroke();
            }

            ctx.restore();
          }
        }
      } else {
        if (glow) glow.style.opacity = '0';
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('portfolio-theme-change', updateAccent);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 99998,
          pointerEvents: 'none',
          display: 'block',
        }}
      />

      <div
        ref={glowRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 24,
          height: 24,
          borderRadius: '50%',
          filter: 'blur(2px)',
          zIndex: 99999,
          pointerEvents: 'none',
          opacity: 0,
          willChange: 'transform, opacity',
          transition: 'opacity 0.15s ease',
        }}
      />
    </>
  );
};

export default MouseCursor;
