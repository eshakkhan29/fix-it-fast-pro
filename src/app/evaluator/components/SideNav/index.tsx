'use client';
import React from 'react';
import {
  Stack,
  Text,
  UnstyledButton,
  Group,
  Box,
  Divider,
} from '@mantine/core';
import { Icon } from '@iconify/react';
import { useRouter, usePathname } from 'next/navigation';
import { adminSidenavLinks, evaluatorSidenavLinks, initiatorSidenavLink, operatorSidenavLink } from '@/data/evaluatorSideNavLink';
import SiteLogo from '@/components/SiteLogo';

interface SideNavProps {
  onLinkClick?: () => void; // For mobile drawer close
}

function SideNav({ onLinkClick }: SideNavProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isAdmin = pathname.startsWith('/admin');
  const isInitiator = pathname.startsWith('/initiator');
  const isOperator = pathname.startsWith('/operator');


  const handleNavigation = (link: string) => {
    router.push(link);
    onLinkClick?.(); // Close mobile drawer if provided
  };

  // Separate regular sections from footer
  const regularSections = isAdmin
    ? adminSidenavLinks.filter((section) => section.type !== 'footer')
    : isInitiator
      ? initiatorSidenavLink.filter((section) => section.type !== 'footer')
      : isOperator
        ? operatorSidenavLink.filter((section) => section.type !== 'footer')
        : evaluatorSidenavLinks.filter((section) => section.type !== 'footer');
  const footerSection = isAdmin
    ? adminSidenavLinks.find((section) => section.type === 'footer')
    : isInitiator
      ? initiatorSidenavLink.find((section) => section.type === 'footer')
      : isOperator
        ? operatorSidenavLink.find((section) => section.type === 'footer')
        : evaluatorSidenavLinks.find((section) => section.type === 'footer');

 const renderNavItem = (child: any) => {
    const isActive = pathname === child.link;
    const isLogout = child.title === 'Logout';

    return (
      <Box key={child?.id} pos="relative" pl="md">
        {/* Vertical bar for active link - positioned outside and on the left */}
        {isActive && (
          <Box
            pos="absolute"
            left={0}
            top="50%"
            style={{
              transform: 'translateY(-50%)',
              width: '4px',
              height: '24px',
              backgroundColor: 'var(--mantine-primary-color-filled)',
              borderRadius: '2px',
            }}
          />
        )}

        <UnstyledButton
          onClick={() => handleNavigation(child.link)}
          style={{
            borderRadius: '8px',
            padding: '10px 16px',
            backgroundColor: isActive
              ? 'rgba(102, 187, 106, 0.2)'
              : 'transparent',
            color: isActive ? 'white' : 'var(--mantine-color-dark-6)',
            transition: 'all 0.2s ease',
            width: '100%',
          }}
          styles={{
            root: {
              '&:hover': {
                backgroundColor: isActive
                  ? 'rgba(102, 187, 106, 0.2)'
                  : 'var(--mantine-color-gray-1)',
              },
            },
          }}
        >
          <Group gap="sm" wrap="nowrap">
            <Icon
              icon={child.icon}
              width={20}
              height={20}
              style={{
                color: isLogout
                  ? 'var(--mantine-color-red-6)'
                  : isActive
                  ? 'var(--mantine-primary-color-filled)'
                  : 'var(--mantine-color-gray-6)',
                flexShrink: 0,
              }}
            />
            <Text
              size="sm"
              fw={500}
              style={{
                color: isLogout
                  ? 'var(--mantine-color-red-6)'
                  : isActive
                  ? 'var(--mantine-color-dark-6)'
                  : 'var(--mantine-color-gray-6)',
              }}
            >
              {child.title}
            </Text>
          </Group>
        </UnstyledButton>
      </Box>
    );
  };

  return (
    <Box h="100%" p="md" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Regular sections */}
      {/* site logo */}
      <Box mb={10}>
        <SiteLogo width={140} height={32} redirectTo={isInitiator ? 'initiator' : isOperator ? 'operator' : 'evaluator'} />
      </Box>
      <Divider />

      <Box style={{ flex: 1 }} mt={20}>
        <Stack gap="xs">
          {regularSections.map((section) => (
            <Box key={section.id}>
              {/* Section Title */}
              <Text size="sm" c="dimmed" px="sm">
                {section.title}
              </Text>

              {/* Section Children */}
              <Stack gap={0}>{section.childrens.map(renderNavItem)}</Stack>
            </Box>
          ))}
        </Stack>
      </Box>

      {/* Footer section */}
      {footerSection && (
        <Box mt="auto" pt="lg">
          <Stack gap={0}>{footerSection.childrens.map(renderNavItem)}</Stack>
        </Box>
      )}
    </Box>
  );
}

export default SideNav;
