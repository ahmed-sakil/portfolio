import { useEffect } from 'react';

interface DynamicHeadOptions {
  title?: string;
  faviconUrl?: string | null;
}

export function updateFavicon(url?: string | null) {
  if (typeof document === 'undefined') return;
  const targetUrl = url && url.trim() ? url.trim() : '/favicon.svg';
  let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  if (link.getAttribute('href') !== targetUrl) {
    link.setAttribute('href', targetUrl);
    if (targetUrl.endsWith('.svg')) {
      link.type = 'image/svg+xml';
    } else if (targetUrl.endsWith('.png')) {
      link.type = 'image/png';
    } else if (targetUrl.endsWith('.ico')) {
      link.type = 'image/x-icon';
    } else {
      link.type = 'image/png';
    }
  }
}

export function useDynamicHead({ title, faviconUrl }: DynamicHeadOptions) {
  useEffect(() => {
    if (title && document.title !== title) {
      document.title = title;
    }
  }, [title]);

  useEffect(() => {
    updateFavicon(faviconUrl);
  }, [faviconUrl]);
}
