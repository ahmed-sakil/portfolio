import { useEffect } from 'react';

/**
 * SmoothScroll provides silky, instantaneous-response momentum scrolling.
 * Employs a single-order lerp towards target scroll position (Lenis physics).
 * Zero initial lag, and graceful deceleration glide after releasing the wheel.
 */
const SmoothScroll = () => {
  useEffect(() => {
    let targetY = window.scrollY;
    let currentY = window.scrollY;
    let isRunning = false;
    let rafId = null;
    let isInternalScroll = false;

    const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

    const getMaxScroll = () =>
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    const updateScroll = () => {
      const maxScroll = getMaxScroll();
      targetY = clamp(targetY, 0, maxScroll);

      const diff = targetY - currentY;

      // When difference is tiny, snap to target and stop loop
      if (Math.abs(diff) < 0.5) {
        currentY = targetY;
        isInternalScroll = true;
        window.scrollTo(0, Math.round(currentY));
        isRunning = false;
        return;
      }

      // Smooth lerp factor: 0.15 provides tight user control with a soft, cushioned stop (no runaway scroll)
      currentY += diff * 0.15;
      isInternalScroll = true;
      window.scrollTo(0, Math.round(currentY));

      rafId = requestAnimationFrame(updateScroll);
    };

    const onWheel = (e) => {
      // Allow browser shortcuts like Ctrl+wheel zoom
      if (e.ctrlKey || e.metaKey || e.shiftKey) return;

      e.preventDefault();

      let delta = e.deltaY;
      // Normalize line/page mode deltas (Firefox / certain drivers)
      if (e.deltaMode === 1) delta *= 18;
      else if (e.deltaMode === 2) delta *= 60;

      // Controlled step size: gentle distance (~60-75px per notch instead of huge leaps)
      const step = Math.sign(delta) * Math.min(Math.abs(delta) * 0.65, 75);

      const maxScroll = getMaxScroll();

      // If loop is not currently running, sync target with current scroll position first
      if (!isRunning) {
        targetY = window.scrollY;
        currentY = window.scrollY;
      }

      // Maximum buffer distance target can be ahead of current scroll (prevent scrolling extra vh)
      const maxLead = Math.min(240, window.innerHeight * 0.25);
      targetY = clamp(targetY + step, currentY - maxLead, currentY + maxLead);
      targetY = clamp(targetY, 0, maxScroll);

      if (!isRunning) {
        isRunning = true;
        rafId = requestAnimationFrame(updateScroll);
      }
    };

    // If user manually drags native scrollbar or presses PageUp/PageDown, sync immediately
    const onScroll = () => {
      if (isInternalScroll) {
        isInternalScroll = false;
        return;
      }
      targetY = window.scrollY;
      currentY = window.scrollY;
      if (isRunning) {
        cancelAnimationFrame(rafId);
        isRunning = false;
      }
    };

    // Smooth scroll support for anchor hash links (e.g. #skills, #about)
    const onAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;
      const hash = anchor.getAttribute('href');
      if (!hash || hash === '#') return;

      const targetEl = document.querySelector(hash);
      if (targetEl) {
        e.preventDefault();
        const navOffset = 90; // account for floating navbar
        const elementPosition = targetEl.getBoundingClientRect().top + window.scrollY;
        const maxScroll = getMaxScroll();
        targetY = clamp(elementPosition - navOffset, 0, maxScroll);
        currentY = window.scrollY;

        if (!isRunning) {
          isRunning = true;
          rafId = requestAnimationFrame(updateScroll);
        }
      }
    };

    // Stop momentum immediately on touch start (mobile / touch interactions)
    const onTouchStart = () => {
      if (isRunning) {
        cancelAnimationFrame(rafId);
        isRunning = false;
      }
      targetY = window.scrollY;
      currentY = window.scrollY;
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('click', onAnchorClick);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('click', onAnchorClick);
    };
  }, []);

  return null;
};

export default SmoothScroll;
