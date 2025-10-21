'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const registerSW = () => {
        navigator.serviceWorker
          .register('/sw.js')
          .catch(() => { });
      };

      if (document.readyState === 'loading') {
        window.addEventListener('load', registerSW);
        return () => window.removeEventListener('load', registerSW);
      } else {
        registerSW();
      }
    }
    return () => { };
  }, []);

  return null;
}
