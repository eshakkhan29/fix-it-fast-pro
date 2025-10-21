import React from 'react';
import PWAInstallButton from '@/components/PWAInstallButton';
import PublicTopNav from '@/app/(public)/components/PublicTopNav';

interface PublicLayoutProps {
  children: React.ReactNode;
}

function PublicLayout(props: PublicLayoutProps) {
  return (
    <div className="flex flex-col h-screen overflow-auto custom_scroll bg-[url('/bg/new-bg.svg')] bg-cover bg-no-repeat bg-fixed bottom-0 left-0">
      <PublicTopNav />
      <div className="px-4 md:px-[120px]">{props.children}</div>
      <PWAInstallButton />
    </div>
  );
}

export default PublicLayout;
