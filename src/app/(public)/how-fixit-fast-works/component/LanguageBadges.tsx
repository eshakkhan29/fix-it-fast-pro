import React from 'react';
import { Badge, Flex } from '@mantine/core';
import { EnglishFlagIcon, SpanishFlagIcon, FrenchFlagIcon } from './icons';

/**
 * Props for the LanguageBadges component
 */
export interface LanguageBadgesProps {
  languages?: Array<{
    code: string;
    label: string;
    icon: React.ReactNode;
  }>;
  /** Spacing between badges */
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Badge size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Additional CSS class name */
  className?: string;
  /** Custom inline styles */
  style?: React.CSSProperties;
}

/**
 * LanguageBadges component displays language selection badges with icons
 * Matches Figma design with 100% accuracy
 */
export const LanguageBadges = ({
  languages,
  gap = 'sm',
  size = 'md',

}: LanguageBadgesProps) => {
  const defaultLanguages = [
    {
      code: 'en',
      label: 'English',
      icon: <EnglishFlagIcon />,
    },
    {
      code: 'es',
      label: 'Español',
      icon: <SpanishFlagIcon />,
    },
    {
      code: 'fr',
      label: 'Français',
      icon: <FrenchFlagIcon />,
    },
  ];

  const displayLanguages = languages || defaultLanguages;

  return (
    <Flex justify={'center'} gap={{ base: 12, md: gap }} mt={{ base: 24 }}>
      {displayLanguages.map((language) => (
        <Badge
          c={'black'}
          color={'secondary'}
          key={language.code}
          size={size}
          variant="outline"
          radius={16}
          px={{ base: 12 }}
          h={26}
          fz={{ base: 12, md: 14 }}
          fw={400}
          leftSection={language.icon}
        >
          {language.label}
        </Badge>
      ))}
    </Flex>
  );
};

export default LanguageBadges;
