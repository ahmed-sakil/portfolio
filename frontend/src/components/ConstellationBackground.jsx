import { useEffect, useRef } from 'react';
import { isColorLight } from '../utils/themeEngine';

const ConstellationBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let grid = [];
    let allDots = [];
    let mouse = { x: -9999, y: -9999, active: false };

    // Dynamic Theme Colors
    let currentBgBase = '#0a0f1e';
    let lineStroke = 'rgba(255, 255, 255, 0.065)';
    let dotFill = 'rgba(255, 255, 255, 0.28)';

    const updateColorsFromTheme = () => {
      const computed = getComputedStyle(document.documentElement);
      const bg = computed.getPropertyValue('--bg-base').trim() || '#0a0f1e';
      currentBgBase = bg;

      const isLight = isColorLight(bg);
      if (isLight) {
        lineStroke = 'rgba(15, 23, 42, 0.065)';
        dotFill = 'rgba(15, 23, 42, 0.25)';
      } else {
        lineStroke = 'rgba(255, 255, 255, 0.065)';
        dotFill = 'rgba(255, 255, 255, 0.28)';
      }
    };

    updateColorsFromTheme();

    const onThemeChange = () => {
      updateColorsFromTheme();
    };
    window.addEventListener('portfolio-theme-change', onThemeChange);

    const GAP = 44;             // Equal distance between dots
    const CIRCLE_RADIUS = 95;   // Empty circle radius around mouse
    const SPRING = 0.075;        // Recovery spring force
    const DAMPING = 0.80;       // Damping for smooth recovery
    const DOT_RADIUS = 1.4;     // Uniform dot radius

    const buildGrid = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      const cols = Math.ceil(width / GAP) + 2;
      const rows = Math.ceil(height / GAP) + 2;

      grid = [];
      allDots = [];

      const offsetX = (width - (cols - 1) * GAP) / 2;
      const offsetY = (height - (rows - 1) * GAP) / 2;

      for (let r = 0; r < rows; r++) {
        grid[r] = [];
        for (let c = 0; c < cols; c++) {
          const ox = offsetX + c * GAP;
          const oy = offsetY + r * GAP;
          const dot = {
            ox,
            oy,
            x: ox,
            y: oy,
            vx: 0,
            vy: 0,
          };
          grid[r][c] = dot;
          allDots.push(dot);
        }
      }
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const distToSegment = (px, py, x1, y1, x2, y2) => {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const lenSq = dx * dx + dy * dy;
      if (lenSq === 0) return Math.hypot(px - x1, py - y1);
      const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lenSq));
      const projX = x1 + t * dx;
      const projY = y1 + t * dy;
      return Math.hypot(px - projX, py - projY);
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Fill canvas background if NOT a custom flat background
      const isCustomFlat = document.body.classList.contains('custom-flat-bg');
      if (!isCustomFlat) {
        ctx.fillStyle = currentBgBase;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Update dot physics
      const numDots = allDots.length;
      for (let i = 0; i < numDots; i++) {
        const d = allDots[i];

        // 1. Spring force returning to anchor
        const ax = (d.ox - d.x) * SPRING;
        const ay = (d.oy - d.y) * SPRING;
        d.vx = (d.vx + ax) * DAMPING;
        d.vy = (d.vy + ay) * DAMPING;

        d.x += d.vx;
        d.y += d.vy;

        // 2. Strict exclusion circle around mouse
        if (mouse.active) {
          const dx = d.x - mouse.x;
          const dy = d.y - mouse.y;
          const dist = Math.hypot(dx, dy);

          if (dist < CIRCLE_RADIUS) {
            const pushDirX = dist > 0.001 ? dx / dist : 1;
            const pushDirY = dist > 0.001 ? dy / dist : 0;
            d.x = mouse.x + pushDirX * CIRCLE_RADIUS;
            d.y = mouse.y + pushDirY * CIRCLE_RADIUS;
            d.vx *= 0.3;
            d.vy *= 0.3;
          }
        }
      }

      const rows = grid.length;
      const cols = rows > 0 ? grid[0].length : 0;

      // Draw grid lines
      ctx.beginPath();
      ctx.strokeStyle = lineStroke;
      ctx.lineWidth = 0.6;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const a = grid[r][c];

          // Horizontal connection to right neighbor
          if (c + 1 < cols) {
            const b = grid[r][c + 1];
            const passesThroughCircle =
              mouse.active && distToSegment(mouse.x, mouse.y, a.x, a.y, b.x, b.y) < CIRCLE_RADIUS - 1;

            if (!passesThroughCircle) {
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
            }
          }

          // Vertical connection to bottom neighbor
          if (r + 1 < rows) {
            const b = grid[r + 1][c];
            const passesThroughCircle =
              mouse.active && distToSegment(mouse.x, mouse.y, a.x, a.y, b.x, b.y) < CIRCLE_RADIUS - 1;

            if (!passesThroughCircle) {
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
            }
          }
        }
      }
      ctx.stroke();

      // Draw dots at intersections
      ctx.beginPath();
      ctx.fillStyle = dotFill;

      for (let i = 0; i < numDots; i++) {
        const d = allDots[i];
        if (!mouse.active || Math.hypot(d.x - mouse.x, d.y - mouse.y) >= CIRCLE_RADIUS - 1) {
          ctx.moveTo(d.x + DOT_RADIUS, d.y);
          ctx.arc(d.x, d.y, DOT_RADIUS, 0, Math.PI * 2);
        }
      }
      ctx.fill();

      animationId = requestAnimationFrame(draw);
    };

    buildGrid();
    draw();

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', buildGrid);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('portfolio-theme-change', onThemeChange);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', buildGrid);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        display: 'block',
        pointerEvents: 'none',
      }}
    />
  );
};

export default ConstellationBackground;
