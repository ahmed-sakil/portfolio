import { useEffect, useRef } from 'react';
import { apiClient } from '../lib/api';

export function useVisitorTracker() {
  const sessionIdRef = useRef<string>('');

  useEffect(() => {
    // 1. Get or generate persistent visitor session ID
    let sId = localStorage.getItem('portfolio_visitor_session');
    if (!sId) {
      sId = 'sess_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36);
      localStorage.setItem('portfolio_visitor_session', sId);
    }
    sessionIdRef.current = sId;

    // Detect platform
    const userAgent = navigator.userAgent;
    const isMobile = /Mobi|Android|iPhone/i.test(userAgent);
    const device = isMobile ? 'Mobile' : 'Desktop';

    let browser = 'Other';
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) browser = 'Chrome';
    else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Edg')) browser = 'Edge';

    const referrer = document.referrer ? new URL(document.referrer).hostname : 'Direct';

    // 2. Initial Ping
    apiClient('/analytics/ping', {
      method: 'POST',
      body: JSON.stringify({
        sessionId: sId,
        device,
        browser,
        referrer,
        path: window.location.pathname,
        additionalSeconds: 5,
      }),
    }).catch(() => {});

    // 3. Heartbeat: Record duration every 15 seconds while user is actively on site
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        apiClient('/analytics/ping', {
          method: 'POST',
          body: JSON.stringify({
            sessionId: sessionIdRef.current,
            path: window.location.pathname,
            additionalSeconds: 15,
          }),
        }).catch(() => {});
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);
}
