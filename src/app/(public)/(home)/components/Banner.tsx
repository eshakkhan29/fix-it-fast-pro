"use client";
import React from 'react';
import { Container, Text, Stack } from '@mantine/core';
import BannerButtons from './BannerButtons';
import { useTranslations } from 'next-intl';

function Banner() {
  const t = useTranslations('HomePage');
  return (
    <Container size="lg" py={80}>
      <Stack align="center" gap="lg">
        <p className="text-[48px] md:text-[64px] !text-neutral-900 !font-medium !text-center">
          {t('title1')}
          <br className="hidden md:inline" />
          {t('title2')} <span className="!text-primary-300">
            {t('title3')}
          </span>{' '}
          {t('title4')}
        </p>
        <Text
          ta="center"
          className="!text-neutral-900 text-sm md:text-base max-w-[800px]"
        >
          {t('description')}
        </Text>

        <BannerButtons />
      </Stack>
    </Container>
  );
}

export default Banner;
