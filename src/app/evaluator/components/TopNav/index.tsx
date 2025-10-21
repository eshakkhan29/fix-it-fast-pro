'use client';
import React from 'react';
import {
  Group,
  Burger,
  Box,
  Flex,
  Breadcrumbs,
  Anchor,
  Button,
  ScrollArea,
} from '@mantine/core';
import { Icon } from '@iconify/react';
import { usePathname, useRouter } from 'next/navigation';
import SiteLogo from '@/components/SiteLogo';
import {
  adminSidenavLinks,
  evaluatorSidenavLinks,
  initiatorSidenavLink,
  operatorSidenavLink,
} from '@/data/evaluatorSideNavLink';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface TopNavProps {
  mobileNavOpened?: boolean;
  toggleMobileNav?: () => void;
}

function TopNav({ mobileNavOpened = false, toggleMobileNav }: TopNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isAdmin = pathname.startsWith('/admin');
  const isInitiator = pathname.startsWith('/initiator');
  const isOperator = pathname.startsWith('/operator');

  // Build role-aware nav items from existing side nav data (preserve functionality)
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
  const navItems = regularSections.flatMap((section) => section.childrens);

  // Route to title mapping
  const routeTitleMap: Record<string, string> = {
    '/evaluator': 'Evaluator',
    '/evaluator/dashboard': 'Dashboard',
    '/evaluator/analytics': 'Analytics',
    '/evaluator/user-management': 'User Management',
    '/evaluator/operator-management': 'Operator Management',
    '/evaluator/operator-performance': 'Operator Performance',
    '/evaluator/emergency-requests': 'Emergency Requests',
    '/evaluator/task-management': 'Task Management',
    '/evaluator/location-management': 'Location Management',
    '/evaluator/settings': 'Settings',
    '/evaluator/help-center': 'Help & Center',
    '/evaluator/logout': 'Logout',
    '/admin/incident-management': 'Incident Management',
    '/operator/incident': 'Incident Management',
    '/initiator/initiate-history': 'Initiate History',
  };

  // Helper function to format segment title
  const formatSegmentTitle = (segment: string) => {
    // If it's a UUID or numeric ID, return it as is
    if (/^[0-9a-f-]{36}$/i.test(segment) || /^\d+$/.test(segment)) {
      return segment;
    }

    // Convert kebab-case to Title Case
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Generate breadcrumb items based on current path
  const generateBreadcrumbs = () => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbItems = [];

    // Always start with Admin/Evaluator/Initiator/Operator
    breadcrumbItems.push({
      title: isAdmin ? 'Admin' : isInitiator ? 'Initiator' : isOperator ? 'Operator' : 'Evaluator',
      href: isAdmin ? '/admin' : isInitiator ? '/initiator' : isOperator ? '/operator' : '/evaluator',
      isLast: pathSegments.length === 1,
    });

    // Add intermediate and current segments
    if (pathSegments.length > 1) {
      for (let i = 1; i < pathSegments.length; i++) {
        const segmentPath = `/${pathSegments.slice(0, i + 1).join('/')}`;
        const isLastSegment = i === pathSegments.length - 1;

        // Get title from map or format the segment
        const segmentTitle = routeTitleMap[segmentPath] || formatSegmentTitle(pathSegments[i]);

        breadcrumbItems.push({
          title: segmentTitle,
          href: segmentPath,
          isLast: isLastSegment,
        });
      }
    }

    return breadcrumbItems;
  };

  const breadcrumbItems = generateBreadcrumbs();

  const renderTopNavButton = (child: any) => {
    const isActive = pathname === child.link;
    return (
      <Button
        key={child.id}
        radius="xl"
        size="sm"
        variant={isActive ? 'filled' : 'light'}
        color="primary"
        leftSection={<Icon icon={child.icon} />}
        onClick={() => router.push(child.link)}
        styles={{
          root: {
            // Subtle rounded pill look to match design aspect
            borderRadius: 9999,
            // Tighten spacing for compact top nav
            paddingInline: 14,
          },
        }}
      >
        {child.title}
      </Button>
    );
  };

  return (
    <Box className=" py-2 px-8 !border-b !border-solid !border-[#E5E5E5]">
      <Group justify="space-between" align="center" pt={10}>
        {/* Mobile hamburger menu - only visible on mobile */}
        <Burger
          opened={mobileNavOpened}
          onClick={toggleMobileNav}
          size="sm"
          hiddenFrom="md"
          aria-label="Toggle navigation"
        />
        <Box hiddenFrom="md">
          <SiteLogo width={100} height={100} redirectTo="evaluator/dashboard" />
        </Box>
        <Box hiddenFrom="md">  <LanguageSwitcher/></Box>
      

        {/* Desktop content */}
        <Box visibleFrom="md" w="100%">
          <Flex direction="column" gap={8}>
            {/* Top row: breadcrumbs and actions */}
            <Flex justify="space-between" align="center">
              <Group>
                <Breadcrumbs separator="/">
                  {breadcrumbItems.map((item, index) => (
                    <Anchor
                      key={index}
                      onClick={() => !item.isLast && router.push(item.href)}
                      style={{
                        cursor: item.isLast ? 'default' : 'pointer',
                        color: item.isLast
                          ? 'var(--mantine-color-dark-6)'
                          : 'var(--mantine-color-blue-6)',
                        textDecoration: 'none',
                        fontWeight: item.isLast ? 600 : 400,
                      }}
                      c={item.isLast ? 'dark.6' : 'primary'}
                      fw={item.isLast ? 600 : 400}
                    >
                      {item.title}
                    </Anchor>
                  ))}
                </Breadcrumbs>
              </Group>
              <Group>

                {/* Logout button from footer section if present */}
                {footerSection?.childrens?.map((child: any) => (
                  <Button
                    key={child.id}
                    radius="xl"
                    variant="outline"
                    color="red"
                    leftSection={<Icon icon={child.icon} />}
                    onClick={() => router.push(child.link)}
                  >
                    {child.title}
                  </Button>
                ))}
                <LanguageSwitcher/>
              </Group>
            </Flex>

            {/* Nav buttons row: role-aware items converted from SideNav */}
            {navItems.length > 0 && (
              <ScrollArea type="never">
                <Group wrap="nowrap" gap="xs">
                  {navItems.map(renderTopNavButton)}
                </Group>
              </ScrollArea>
            )}
          </Flex>
        </Box>

        {/* Right side content (visible on all screens) */}
        <Box>{/* Add user menu, notifications, etc. here */}</Box>
      </Group>
    </Box>
  );
}

export default TopNav;