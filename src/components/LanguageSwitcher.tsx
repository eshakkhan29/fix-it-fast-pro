'use client';

import { Menu, Button, ActionIcon } from '@mantine/core';
import { IconLanguage, IconChevronDown } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Icon } from '@iconify/react';
import { useMediaQuery } from '@mantine/hooks';
 interface LanguageSwitcherProps {
  showOnlyIcon?:boolean
 }
export default function LanguageSwitcher({showOnlyIcon=false}:LanguageSwitcherProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const router = useRouter();
  const currentLocale = useLocale();

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'es', label: 'Español', flag: '🇪🇸' }
  ];

  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0];

  const changeLanguage = (newLocale: string) => {
    // Set cookie
    document.cookie = `locale=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}`; // 1 year
    
    // Refresh the page to apply new locale
    router.refresh();
  };

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        {showOnlyIcon && isMobile ? (
          <ActionIcon variant="light">
            <Icon icon="ix:language-filled" />
          </ActionIcon>
        ) : (
          <Button
            variant="light"
            leftSection={<IconLanguage size={18} />}
            rightSection={<IconChevronDown size={14} />}
          >
            {currentLanguage.label}
          </Button>
        )}
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Select Language</Menu.Label>
        {languages.map((lang) => (
          <Menu.Item
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            disabled={lang.code === currentLocale}
          >
            {lang.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}