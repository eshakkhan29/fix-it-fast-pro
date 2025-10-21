'use client';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import SiteLogo from '@/components/SiteLogo';
import { Button } from '@mantine/core';
import { IconHelpCircle } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React from 'react';

function PublicTopNav() {
  const t = useTranslations('publicTopNav');
  const router = useRouter();
  return (
    <div className="sticky top-0 left-0 py-4 md:py-5 z-50 px-6 md:px-[120px] !border-b-[1px] !border-gray-100 flex items-center justify-between !bg-transparent backdrop-blur-sm">
      <SiteLogo width={140} height={32} />
      <div className='flex items-center gap-4'>
        <LanguageSwitcher />
        <Button
          variant="filled"
          leftSection={<IconHelpCircle size={24} />}
          onClick={() => router.push('/how-fixit-fast-works')}
          // black button
          className="!bg-black !text-white"
        >
          {t('help')}
        </Button>
      </div>
    </div>
  );
}

export default PublicTopNav;
