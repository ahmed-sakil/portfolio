import { useEffect, useRef } from 'react';

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

    const MAX_TAIL_PX = 55;   // Strict max length of tail in pixels even on fast movements
    const MAX_AGE_MS = 140;   // Quick fade so the tail is short and responsive

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

      // Keep buffer manageable
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
        // Move the soft glow directly behind the default cursor
        if (glow) {
          glow.style.opacity = '1';
          glow.style.transform = `translate3d(${mouse.x - 12}px, ${mouse.y - 12}px, 0)`;
        }

        const now = Date.now();
        // Discard points older than MAX_AGE_MS
        rawPoints = rawPoints.filter((p) => now - p.time < MAX_AGE_MS);

        if (rawPoints.length > 1) {
          // Constrain trail by MAX_TAIL_PX from the current mouse position backwards
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

          // Draw the short smooth glowing ribbon
          if (clampedPoints.length >= 2) {
            ctx.save();
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            for (let i = 0; i < clampedPoints.length - 1; i++) {
              const p0 = clampedPoints[i];
              const p1 = clampedPoints[i + 1];

              // progress: 1 at cursor head, 0 at tail tip
              const progress = 1 - i / clampedPoints.length;
              const alpha = progress * 0.75;
              const width = Math.max(0.5, progress * 4.5);

              ctx.beginPath();
              ctx.moveTo(p0.x, p0.y);
              ctx.lineTo(p1.x, p1.y);
              ctx.strokeStyle = `rgba(0, 229, 160, ${alpha})`;
              ctx.lineWidth = width;
              ctx.shadowColor = '#00e5a0';
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
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      {/* Short tail ribbon canvas — sits above everything */}
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

      {/* Subtle soft glow following right under the default cursor */}
      <div
        ref={glowRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,229,160,0.65) 0%, rgba(0,229,160,0.2) 45%, rgba(0,229,160,0) 75%)',
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
