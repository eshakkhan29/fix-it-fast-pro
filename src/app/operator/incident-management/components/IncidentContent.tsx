'use client';
import {
  Button,
  Card,
  Drawer,
  Flex,
  Group,
  MultiSelect,
  Pagination,
  Select,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core';
import React, { useState } from 'react';

import { useAccountIdStore } from '@/stores/user/accountId-store';
import { useSession } from 'next-auth/react';
import Cookies from 'js-cookie';
import { useGetFollowUpsListByFilters } from '@/app/evaluator/hooks/useGetFollowUpListByFilters';
import IncidentCard from './IncidentCard';
import IncidentManagementSkeleton from '@/app/admin/incident-management/components/IncidentManagementSkeleton';
import { DatePickerInput } from '@mantine/dates';
import { Icon } from '@iconify/react';
import { useDisclosure } from '@mantine/hooks';
import { useGetFollowUpStatuses } from '@/app/admin/hooks/useGetFollowUpStatues';

const IncidentContent = () => {
  const [activePage, setActivePage] = useState(1);
  const [pageSize, setPageSize] = useState<string>('10'); // Store as string for Select
  const { userAccountId } = useAccountIdStore();

  const session: any = useSession();
  const roleId = Cookies.get('fifRoleId');
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
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);

  const { data: statusData, isLoading: isStatusLoading } =
    useGetFollowUpStatuses({
      accountId: Number(userAccountId),
    });
  const selectStatusData = statusData?.map((status: any) => ({
    label: status.StatusName === 'Closed' ? 'Resolved' : status.StatusName,
    value: status.GlobalId.toString(),
  }));

  // Helper function to get default dates
  const getDefaultDates = () => {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    return {
      from: oneMonthAgo.toISOString().split('T')[0],
      to: tomorrow.toISOString().split('T')[0],
    };
  };

  const defaultDates = getDefaultDates();

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
      StatusIds: selectedStatus.map(id => Number(id))
    }),
    ...(selectedOverdue.length > 0 && {
      OverDueFlag: selectedOverdue
    }),
  };

  const {
    data: followUpsList,
    isLoading,
    error,
  } = useGetFollowUpsListByFilters(params);


  // Get total items and pages from API response
  const totalItems = followUpsList?.data?.[0]?.TotalResult || 0;
  const totalPages = followUpsList?.data?.[0]?.PageCount || 1;

  const handlePageChange = (page: number) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top on page change
  };

  const handlePageSizeChange = (value: string | null) => {
    if (value) {
      setPageSize(value);
      setActivePage(1); // Reset to first page when changing page size
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
        className="sticky !top-[-30px] z-[100] backdrop-blur-md bg-white/80 py-3 px-4 mb-4"
      >
        <Text fw={500} fz={{ base: 17, md: 20 }}>
          Incident {totalItems > 0 && `(${totalItems} total)`}
        </Text>

        <Flex
          w={{ base: '100%', md: 'auto' }}
          gap={5}
          justify={'space-between'}
        >
          <Select
            label="Items per page"
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
            placeholder="Page size"
          />
          <Button
            leftSection={<Icon icon="lsicon:filter-outline" />}
            variant="outline"
            onClick={handleOpenDrawer}
            mt={20}
          >
            Filter
          </Button>
        </Flex>
      </Group>

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
                  No incidents found
                </Text>
                <Text c="dimmed" fz="sm" ta="center">
                  Could not find any incident. Try adjusting your filters or
                  refresh the page.
                </Text>
              </Stack>

              <Button variant="light" onClick={handleResetFilters} mt="sm">
                Clear Filters
              </Button>
            </Stack>
          </Card>
        ) : (
          <>
            <SimpleGrid cols={{ base: 1, lg: 3 }} style={{ width: '100%' }}>
              {followUpsList?.data?.map((followUpData: any, index: number) => (
                <IncidentCard key={index} followUp={followUpData} path={`/operator/incident-management/${followUpData?.FollowupId}`} />
              ))}
            </SimpleGrid>

            {/* Spacer to push pagination to bottom */}
            <div style={{ flexGrow: 1 }} />

            {/* Pagination Component at the bottom */}
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
      </Stack>
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
            Filter Options
          </Text>
        }
        position="right"
        size="md"
      >
        <Stack gap="md" justify="space-between" h="100%">
          <Stack>
            <DatePickerInput
              label="Select a date range"
              radius="lg"
              type="range"
              placeholder="Pick date range"
              value={tempDates}
              onChange={(value) => {
                if (value) {
                  setTempDates(value);
                }
              }}
              clearable
            />
            <Group>
              <MultiSelect
                w="45%"
                className="flex-grow"
                radius="lg"
                label="Select Status"
                placeholder="Pick one or more statuses"
                data={selectStatusData || []}
                value={tempSelectedStatus}
                onChange={(value) => setTempSelectedStatus(value)}
                disabled={isStatusLoading}
                clearable
                searchable
              />

              <MultiSelect
                w="45%"
                className="flex-grow"
                radius="lg"
                label="Overdue"
                placeholder="Pick one or more options"
                data={['OverDue', 'Due Tomorrow', 'Due Today']}
                value={tempSelectedOverdue}
                onChange={(value) => setTempSelectedOverdue(value)}
                clearable
                searchable
              />
            </Group>
          </Stack>

          <Group grow mt="xl">
            <Button variant="outline" onClick={handleClearFilters}>
              Clear
            </Button>
            <Button onClick={handleApplyFilters}>Apply Filters</Button>
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
                Reset All Filters
              </Button>
            )}
        </Stack>
      </Drawer>
    </>
  );
};

export default IncidentContent;
