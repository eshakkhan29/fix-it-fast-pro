import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslations } from 'next-intl';
import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const t = useTranslations('LoginPage');
  return (
    <div className="flex flex-col min-h-screen overflow-auto custom_scroll bg-[url('/bg/new-bg.svg')] bg-cover bg-no-repeat bg-fixed bottom-0 left-0">
      <div className="flex flex-col items-center justify-center flex-1 px-4 relative">
        <div className='absolute top-2 right-2'>
               <LanguageSwitcher showOnlyIcon={true}/>
        </div>
       
        <div className="text-center mb-8 ">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent mb-2 tracking-tight">
            FixitFast
          </h1>
          <p className="text-neutral-600 text-lg font-medium">
           {t('motto')}
          </p>
        </div>
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
