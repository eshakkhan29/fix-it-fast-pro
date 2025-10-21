'use client';
import SideNav from '@/app/evaluator/components/SideNav';
import TopNav from '@/app/evaluator/components/TopNav';
import React from 'react';
import { Drawer } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

function EvaluatorLayout({ children }: { children: React.ReactNode }) {
  const [mobileNavOpened, { toggle: toggleMobileNav, close: closeMobileNav }] =
    useDisclosure(false);

  return (
    <div className="flex h-screen">

      {/* Mobile Drawer */}
      <Drawer
        opened={mobileNavOpened}
        onClose={closeMobileNav}
        size="272px"
        padding={0}
        hiddenFrom="md"
        styles={{
          content: {
            backgroundColor: 'white',
          },
        }}
      >
        <SideNav onLinkClick={closeMobileNav} />
      </Drawer>

      {/* Main content */}
      <div className="flex flex-col grow">
        {/* Top nav */}
        <TopNav
          mobileNavOpened={mobileNavOpened}
          toggleMobileNav={toggleMobileNav}
        />

        {/* page content */}
        <div className="h-[calc(100vh-64px)] overflow-auto custom_scroll">
          {children}
        </div>
      </div>
    </div>
  );
}

export default EvaluatorLayout;
