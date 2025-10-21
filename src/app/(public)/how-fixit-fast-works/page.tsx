import React from 'react';

import {
  ScanningTipsCard,
  TroubleshootingCard,
  AlternativeOptionCard,
  QRCodeStepsCard,
  LanguageBadges,
  CarouselSection,
} from './component';
import { Box, Flex, Text, Title } from '@mantine/core';
import { useTranslations } from 'next-intl';

function HowFixitFastWorksPage() {
  const t = useTranslations('howFifWork');
  const tScanningTipsData = useTranslations('howFifWork.scanningTipsData');
  const tTroubleshootingData = useTranslations('howFifWork.troubleshootingData');

  // Data for Scanning Tips card
  const scanningTipsData = {
    title: tScanningTipsData('title'),
    description: tScanningTipsData('description'),
    tips: [
      tScanningTipsData('tips.0'),
      tScanningTipsData('tips.1'),
      tScanningTipsData('tips.2'),
      tScanningTipsData('tips.3'),
    ],
  };

  // Data for Troubleshooting card
  const troubleshootingData = {
    title: tTroubleshootingData('title'),
    description: tTroubleshootingData('description'),
    tips: [
      tTroubleshootingData('tips.0'),
      tTroubleshootingData('tips.1'),
      tTroubleshootingData('tips.2'),
      tTroubleshootingData('tips.3'),
    ],
  };

  return (
    <Box my={32}>
      <Title ta={'center'} fz={{ base: 24, lg: 52 }} fw={600}>
        {t('title1')}{' '}
        <Text
          variant="gradient"
          gradient={{ from: '#00A64C', to: '#003212', deg: 180 }}
          fz={{ base: 24, lg: 52 }}
          fw={600}
          component="span"
        >
          {t('title2')}
        </Text>{' '}
        {t('title3')}
      </Title>
      <Text mt={16} fz={{ base: 12, lg: 16 }} ta={'center'}>
        {t('description')}
      </Text>
      <LanguageBadges />
      <Flex
        px={{ base: 0, lg: 100 }}
        mt={40}
        w={'100%'}
        mx={'auto'}
        justify={'space-between'}
        align={'center'}
        direction={{ base: 'column', lg: 'row' }}
      >
        <QRCodeStepsCard />
        <CarouselSection />
      </Flex>

      {/* Tips and Troubleshooting Section */}
      <Flex px={{ base: 0, lg: 100 }} mt={32} gap="md" direction={'column'}>
        <Box flex={1}>
          <ScanningTipsCard
            title={scanningTipsData.title}
            description={scanningTipsData.description}
            tips={scanningTipsData.tips}
          />
        </Box>
        <Box flex={1}>
          <TroubleshootingCard
            title={troubleshootingData.title}
            description={troubleshootingData.description}
            tips={troubleshootingData.tips}
          />
        </Box>
      </Flex>
      <Box px={{ base: 0, lg: 100 }} mt={32}>
        <AlternativeOptionCard
          title={t('alternativeOptionCard.title')}
          description={t('alternativeOptionCard.description')}
        />
      </Box>
    </Box>
  );
}

export default HowFixitFastWorksPage;
