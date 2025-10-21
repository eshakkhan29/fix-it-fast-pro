"use client";

import { useEffect, useState } from 'react';

export default function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleBeforeInstallPrompt(e: any) {
      e.preventDefault();
      setDeferredPrompt(e);
      // show later to avoid jank
      const timeout = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timeout);
    }
    function handleAppInstalled() {
      setVisible(false);
      setDeferredPrompt(null);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as any);
    window.addEventListener('appinstalled', handleAppInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as any);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  if (!visible) return null;

  const onInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome !== 'accepted') {
      // keep button visible for retry
      return;
    }
    setVisible(false);
    setDeferredPrompt(null);
  };

  return (
    <button
      onClick={onInstall}
      style={{
        position: 'fixed',
        right: 16,
        bottom: 16,
        background: '#003212',
        color: 'white',
        padding: '10px 14px',
        borderRadius: 8,
        border: 'none',
        cursor: 'pointer',
        zIndex: 1000,
      }}
    >
      Install App
    </button>
  );
}
