'use client';
import { Button, Text } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React from 'react';

function CtaAction() {
  const t = useTranslations('HomePage.signIn');
  const router = useRouter();
  return (
    <div className="p-2 !rounded-[10px] bg-white !border !border-neutral-800">
      <div className="rounded-[10px] bg-gradient-to-b from-0% to-40% from-primary-300/25 to-white p-7 md:p-10 flex items-center justify-center flex-col">
        <p className="!text-neutral-900 text-xl md:text-[32px] !font-semibold text-center">
          {t('title')}
        </p>

        <Text
          ta="center"
          className="!text-neutral-900 text-xs md:text-base"
          maw={800}
          mt={24}
        >
          {t('description')}
        </Text>

        <div className="mt-10">
          <Button
            onClick={() => router.push('/login')}
            size="md"
            variant="outline"
            radius="xs"
            className="!bg-white !text-neutral-900 !border-2 !border-gray-300 hover:!border-gray-400 !font-medium !shadow-sm hover:!shadow-md !transition-all !duration-200"
            styles={{
              root: {
                borderRadius: '10px',
                minWidth: '114px',
                '@media (maxWidth: 640px)': {
                  minWidth: '80px',
                },
              },
            }}
          >
            {t('button')}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CtaAction;
