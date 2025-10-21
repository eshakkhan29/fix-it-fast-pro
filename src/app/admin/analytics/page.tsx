'use client'
import { Stack, Text } from '@mantine/core';
import React from 'react';
import { useTranslations } from 'next-intl';
import AnalyticsContent from './components/AnalyticsContent';


function AnalyticsPage() {
  const t = useTranslations('Analytics');

  return (
    <Stack p={{base:15, md:25}}>
      <Text fw={500} fz={22}>
        {t('title')}
      </Text>
      <AnalyticsContent/>
    </Stack>
  );
}

export default AnalyticsPage;
