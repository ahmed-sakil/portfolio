/**
 * Updates document title and website tab favicon dynamically.
 * Caches favicon in memory and sessionStorage so all navigation preserves custom favicon.
 */
let memoryFavicon = null;
try {
  memoryFavicon = sessionStorage.getItem('portfolio_active_favicon');
} catch (e) {}

export const updatePageMeta = ({ title, faviconUrl } = {}) => {
  if (title) {
    document.title = title;
  }

  const activeFavicon = faviconUrl || memoryFavicon;

  if (faviconUrl) {
    memoryFavicon = faviconUrl;
    try {
      sessionStorage.setItem('portfolio_active_favicon', faviconUrl);
    } catch (e) {}
  }

  if (activeFavicon) {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    if (link.getAttribute('href') !== activeFavicon) {
      link.href = activeFavicon;
      if (activeFavicon.includes('.png')) {
        link.type = 'image/png';
      } else if (activeFavicon.includes('.svg')) {
        link.type = 'image/svg+xml';
      }
    }
  }
};
