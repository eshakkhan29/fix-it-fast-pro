'use client';
import {
  Button,
  Card,
  Drawer,
  Flex,
  Group,
  Modal,
  MultiSelect,
  Pagination,
  Select,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core';
import React, { useState } from 'react';

import IncidentManagementSkeleton from './IncidentManagementSkeleton';

import { useAccountIdStore } from '@/stores/user/accountId-store';
import { useDisclosure } from '@mantine/hooks';
import UpdateFollowUpStatusModal from './UpdateFollowUpStatusModal';
import { useGetFollowUpsListByFilters } from '../../hooks/useGetFollowUpListByFilters';
import { useSession } from 'next-auth/react';
import Cookies from 'js-cookie';
import { DatePickerInput } from '@mantine/dates';
import RequestFeedCardNew from '../../dashboard/components/RequestFeedCardNew';
import { Icon } from '@iconify/react';
import { getFollowUpDefaultDates } from '@/utils/gerFollowUpDefaultDates';
import { useGetFollowUpStatuses } from '../../hooks/useGetFollowUpStatues';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';


const IncidentManagementContent = () => {
  const pathname = usePathname()
  const t = useTranslations('IncidentManagement');
  const tDashboard = useTranslations('Dashboard');
  const [opened, { open, close }] = useDisclosure(false);
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [statusIds, setStatusIds] = useState<number[]>([]);
  const [activePage, setActivePage] = useState(1);
  const [pageSize, setPageSize] = useState<string>('10');
  const [dates, setDates] = useState<[string | null, string | null]>([
    null,
    null,
  ]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedOverdue, setSelectedOverdue] = useState<string[]>([]);

  // Temporary filter states for drawer
  const [tempDates, setTempDates] = useState<[string | null, string | null]>([
    null,
    null,
  ]);
  const [tempSelectedStatus, setTempSelectedStatus] = useState<string[]>([]);
  const [tempSelectedOverdue, setTempSelectedOverdue] = useState<string[]>([]);

  const { userAccountId } = useAccountIdStore();
  const session: any = useSession();
  const roleId = Cookies.get('fifRoleId');
  const { data: statusData, isLoading: isStatusLoading } =
    useGetFollowUpStatuses({
      accountId: Number(userAccountId),
    });
  const selectStatusData = statusData?.map((status: any) => ({
    label: status.StatusName === 'Closed' ? tDashboard('status.resolved') : status.StatusName,
    value: status.GlobalId.toString(),
  }));

  const defaultDates = getFollowUpDefaultDates();

  // Format dates for API - only use selected dates if both are present
  const getFormattedDates = () => {
    if (dates[0] && dates[1]) {
      const fromDate =
        typeof dates[0] === 'string' ? new Date(dates[0]) : dates[0];
      const toDate =
        typeof dates[1] === 'string' ? new Date(dates[1]) : dates[1];
      return {
        from: fromDate.toISOString().split('T')[0],
        to: toDate.toISOString().split('T')[0],
      };
    }
    return defaultDates;
  };

  const formattedDates = getFormattedDates();

  const isAdmin = pathname.startsWith('/admin');

  const params = {
    AccountId: Number(userAccountId),
    UserId: session?.data?.user?.id || '',
    RoleId: Number(roleId),
    PageNumber: activePage,
    PageSize: Number(pageSize),
    Sorted: true,
    CreatedDateFrom: formattedDates.from,
    CreatedDateTo: formattedDates.to,
    LocationNodeLevelType: '',
    ...(selectedStatus.length > 0 && {
      StatusIds: selectedStatus.map((id) => Number(id)),
    }),
    ...(selectedOverdue.length > 0 && {
      OverDueFlag: selectedOverdue,
    }),
  };

  // Only fetch when we have both dates selected or use defaults
  const shouldFetch =
    (dates[0] === null && dates[1] === null) ||
    (dates[0] !== null && dates[1] !== null);
  const {
    data: followUpsList,
    isLoading,
    error,
    refetch,
  } = useGetFollowUpsListByFilters(params, {
    enabled: shouldFetch,
  });

  console.log('followUplist', followUpsList)

  const totalItems = followUpsList?.data?.[0]?.TotalResult || 0;
  const totalPages = followUpsList?.data?.[0]?.PageCount || 1;

  const handleCheckboxChange = (followUpId: number, isChecked: boolean) => {
    if (isChecked) {
      setStatusIds((prev) => [...prev, followUpId]);
    } else {
      setStatusIds((prev) => prev.filter((id) => id !== followUpId));
    }
  };

  const handlePageChange = (page: number) => {
    setActivePage(page);
    setStatusIds([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (value: string | null) => {
    if (value) {
      setPageSize(value);
      setActivePage(1);
      setStatusIds([]);
    }
  };

  const handleOpenDrawer = () => {
    // Sync temp states with current filter states when opening drawer
    setTempDates(dates);
    setTempSelectedStatus(selectedStatus);
    setTempSelectedOverdue(selectedOverdue);
    openDrawer();
  };

  const handleApplyFilters = () => {
    // Apply temp states to actual filter states
    setDates(tempDates);
    setSelectedStatus(tempSelectedStatus);
    setSelectedOverdue(tempSelectedOverdue);
    setActivePage(1); // Reset to first page when filters change
    closeDrawer();
  };

  const handleClearFilters = () => {
    // Clear all temp filters
    setTempDates([null, null]);
    setTempSelectedStatus([]);
    setTempSelectedOverdue([]);
  };

  const handleResetFilters = () => {
    // Reset both temp and actual filters
    setTempDates([null, null]);
    setTempSelectedStatus([]);
    setTempSelectedOverdue([]);
    setDates([null, null]);
    setSelectedStatus([]);
    setSelectedOverdue([]);
    setActivePage(1);
    closeDrawer();
  };

  if (isLoading) {
    return <IncidentManagementSkeleton />;
  }

  return (
    <>
      <Group
        justify="space-between"
        className="sticky !top-[-10px] z-[100] backdrop-blur-md bg-white/80 py-3 px-4 mb-2"
      >
        <Text fw={500} fz={{ base: 17, md: 20 }}>
          {t('title')} {totalItems > 0 && `(${totalItems} ${t('labels.total')})`}
        </Text>
        <Stack>
          <Flex
            w={{ base: '100%', md: 'auto' }}
            gap={5}
            justify={'space-between'}
            wrap="wrap"
            align="center"
          >
            <Button
              className="flex-grow"
              disabled={statusIds.length === 0}
              onClick={open}
              mt={20}
            >
              {t('actions.updateStatus')}
            </Button>

            <Select
              className="flex-grow"
              label={t('filters.itemsPerPageLabel')}
              w={100}
              size="xs"
              value={pageSize}
              onChange={handlePageSizeChange}
              data={[
                { value: '5', label: '5' },
                { value: '10', label: '10' },
                { value: '30', label: '30' },
                { value: '50', label: '50' },
              ]}
              placeholder={t('filters.pageSizePlaceholder')}
            />
            
            <Button
              leftSection={<Icon icon="lsicon:filter-outline" />}
              variant="outline"
              onClick={handleOpenDrawer}
              mt={20}
            >
              {t('actions.filter')}
            </Button>
          </Flex>
          
        </Stack>
      </Group>
      <Group justify="end" p={15}></Group>

      <Stack
        align="center"
        style={{ minHeight: 'calc(100vh - 200px)' }}
        p={{ base: 15, md: 25 }}
      >
        {error ? (
          <Card withBorder shadow="sm" p="xl" radius="md" maw={400}>
            <Stack align="center" gap="md">
              <Icon
                icon="mdi:clipboard-search-outline"
                className="text-7xl text-gray-300"
              />
              <Stack align="center" gap="xs">
                <Text fw={600} fz={20} ta="center">
                  {t('messages.noIncidentsTitle')}
                </Text>
                <Text c="dimmed" fz="sm" ta="center">
                  {t('messages.noIncidentsDescription')}
                </Text>
              </Stack>

              <Button variant="light" onClick={handleResetFilters} mt="sm">
                {t('actions.clearFilters')}
              </Button>
            </Stack>
          </Card>
        ) : (
          <>
            <SimpleGrid
              cols={{ base: 1, md: 2 }}
              style={{ width: '100%' }}
              spacing="lg"
            >
              {followUpsList?.data?.map((followUpData) => (
                <RequestFeedCardNew
                  key={followUpData?.FollowupId}
                  followUp={followUpData}
                  isChecked={statusIds.includes(followUpData?.FollowupId)}
                  onCheckboxChange={handleCheckboxChange}
                  refetch={refetch}
                  path={`/${isAdmin ? "admin" : "evaluator"}/incident-management/${followUpData?.FollowupId}`}
                />
              ))}
            </SimpleGrid>

            <div style={{ flexGrow: 1 }} />

            {totalPages > 1 && (
              <Group justify="center" w="100%" py="lg">
                <Pagination
                  total={totalPages}
                  value={activePage}
                  onChange={handlePageChange}
                />
              </Group>
            )}
          </>
        )}

        {/* Drawer for filter options */}
        <Drawer
          styles={{
            content: {
              display: 'flex',
              flexDirection: 'column',
              height: '100%', // Ensure Drawer content takes full height
            },
            body: {
              flex: 1, // Make the body take available space
              display: 'flex',
              flexDirection: 'column',
            },
          }}
          opened={drawerOpened}
          onClose={closeDrawer}
          title={
            <Text fw={500} fz={20} c="primary">
              {t('labels.filterOptions')}
            </Text>
          }
          position="right"
          size="md"
        >
          <Stack gap="md" h="100%" justify="space-between">
            <Stack>
              <DatePickerInput
                label={t('filters.selectDateRangeLabel')}
                radius="lg"
                type="range"
                placeholder={t('filters.pickDateRangePlaceholder')}
                value={tempDates}
                onChange={(value) => {
                  if (value) {
                    setTempDates(value);
                  }
                }}
                clearable
              />

              <MultiSelect
                className="flex-grow"
                radius="lg"
                label={t('filters.selectStatusLabel')}
                placeholder={t('filters.selectStatusPlaceholder')}
                data={selectStatusData || []}
                value={tempSelectedStatus}
                onChange={(value) => setTempSelectedStatus(value)}
                disabled={isStatusLoading}
                clearable
                searchable
              />

              <MultiSelect
                className="flex-grow"
                radius="lg"
                label={t('filters.overdueLabel')}
                placeholder={t('filters.overduePlaceholder')}
                data={[t('filters.overdueOptions.overDue'), t('filters.overdueOptions.dueTomorrow'), t('filters.overdueOptions.dueToday')]}
                value={tempSelectedOverdue}
                onChange={(value) => setTempSelectedOverdue(value)}
                clearable
                searchable
              />
            </Stack>

            <Group grow mt="xl">
              <Button variant="outline" onClick={handleClearFilters}>
                {t('actions.clear')}
              </Button>
              <Button onClick={handleApplyFilters}>{t('actions.applyFilters')}</Button>
            </Group>

            {(selectedStatus.length > 0 ||
              selectedOverdue.length > 0 ||
              dates[0]) && (
                <Button
                  variant="subtle"
                  color="red"
                  onClick={handleResetFilters}
                  fullWidth
                >
                  {t('actions.resetAllFilters')}
                </Button>
              )}
          </Stack>
        </Drawer>

        <Modal
          opened={opened}
          onClose={close}
          title={
            <Text fw={500} fz={20}>
              {t('modals.updateStatusTitle')}
            </Text>
          }
          centered
        >
          <UpdateFollowUpStatusModal
            isStatusLoading={isStatusLoading}
            selectStatusData={selectStatusData}
            refetch={refetch}
            close={close}
            statusIds={statusIds}
            setStatusIds={setStatusIds}
          />
        </Modal>
      </Stack>
    </>
  );
};

export default IncidentManagementContent;
