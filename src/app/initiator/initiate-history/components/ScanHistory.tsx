'use client';

import { useState } from 'react';
import { DataTable } from 'mantine-datatable';
import {
  Button,
  Badge,
  Title,
  Group,
  Flex,
  Box,
  Text,
  Card,
  MultiSelect,
  SimpleGrid,
  Drawer,
  Stack,
  Select,
  Pagination,
} from '@mantine/core';

import { useRouter } from 'next/navigation';
import { DatePickerInput } from '@mantine/dates';
import { getFollowUpStatusColor } from '@/utils/getFollowUpStatusColor';
import IncidentCard from '@/app/operator/incident-management/components/IncidentCard';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';

type ScanRecord = {
  FollowupId: number;
  InspectionId: number;
  Location: string;
  DueDate: string;
  CreatedOn: string;
  AssignedTo: string;
  CreatedBy: string;
  Topic: string;
  OverDueFlag: string;
  Question: string;
  StatusId: number;
  OverDueDay: number;
  Status: string;
  InspectionTemplateName: string;
  TotalResult: number;
  PageCount: number;
};

/**
 * Props interface for ScanHistory component
 */
interface ScanHistoryProps {
  data?: ScanRecord[];
  isLoading?: boolean;
  error?: any;
  dates?: [string | null, string | null];
  setDates?: (value: [string | null, string | null]) => void;
  selectedStatus: string[];
  selectedOverdue: string[];
  setSelectedOverdue: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedStatus: React.Dispatch<React.SetStateAction<string[]>>;
  selectStatusData: any[];
  handlePageSizeChange: (value: string | null) => void;
  pageSize: string;
  setPageSize: React.Dispatch<React.SetStateAction<string>>;
  activePage: number;
  setActivePage: React.Dispatch<React.SetStateAction<number>>;
  isStatusLoading?: boolean;
}

export function ScanHistory({
  data = [],
  error = null,
  dates = [null, null],
  setDates = () => { },
  selectStatusData,
  selectedStatus,
  selectedOverdue,
  setSelectedOverdue,
  setSelectedStatus,
  handlePageSizeChange,
  pageSize,

  activePage,
  setActivePage,
  isStatusLoading = false,
}: ScanHistoryProps) {
  const t = useTranslations('ScanHistory');
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);

  // Temporary filter states for drawer
  const [tempDates, setTempDates] = useState<[string | null, string | null]>([
    null,
    null,
  ]);
  const [tempSelectedStatus, setTempSelectedStatus] = useState<string[]>([]);
  const [tempSelectedOverdue, setTempSelectedOverdue] = useState<string[]>([]);

  const records = data || [];
  const totalItems = records?.[0]?.TotalResult || 0;
  const totalPages = records?.[0]?.PageCount || 1;

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

  const handlePageChange = (page: number) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box p={40}>
      {/* Header */}
      <Flex align="center" justify="space-between" mb={10}>
        <Title fz={24} fw={600}>
          {t('title')} {totalItems > 0 && `(${totalItems} total)`}
        </Title>

        <Group align="center" gap={5}>
          <Select
            className="flex-grow"
            label={t('itemsPerPage')}
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
            {t('actions.filters')}
          </Button>
        </Group>
      </Flex>

      {/* Past Records Section */}
      {isMobile ? (
        <>
          <SimpleGrid cols={{ base: 1, lg: 3 }} style={{ width: '100%' }}>
            {data?.map((followUpData: any, index: number) => (
              <IncidentCard
                key={index}
                followUp={followUpData}
                path={`/initiator/initiate-history/${followUpData?.FollowupId}`}
              />
            ))}
          </SimpleGrid>
          {totalPages > 1 && (
            <Group justify="center" w="100%" py="lg" mt={20}>
              <Pagination
                total={totalPages}
                value={activePage}
                onChange={handlePageChange}
              />
            </Group>
          )}
        </>
      ) : (
        <Card className="!border !border-primary-300" withBorder mt={20}>
          <Box p={20}>
            <Flex align="center" justify="space-between">
              <Text fw={500} fz={22} c="primary">
                {t('pastRecords')}
              </Text>
            </Flex>
          </Box>
          {error ? (
            <Group justify="center" pb={15}>
              <Text fw={500}>{t('noHistoryAvailable')}</Text>
            </Group>
          ) : (
            <>
              <DataTable
                //  height={isMobile ? 'calc(100dvh - 310px)' : 'calc(100dvh - 320px)'}
                idAccessor="FollowupId"
                withTableBorder={false}
                withColumnBorders={false}
                striped={false}
                highlightOnHover
                records={records}
                noRecordsText={t('noRecordsFound')}
                noRecordsIcon={
                  <Box
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      gap: '1rem',
                    }}
                  >
                    <Icon icon="mdi:history" width={48} height={48} />
                    <Text>{t('noHistoryAvailable')}</Text>
                  </Box>
                }
                columns={[
                  {
                    accessor: 'FollowupId',
                    title: t('table.columns.followUpId'),
                    render: (record) => (
                      <span className="font-medium">#{record.FollowupId}</span>
                    ),
                  },
                  {
                    accessor: 'InspectionId',
                    title: t('table.columns.inspectionId'),
                    render: (record) => (
                      <span className="text-muted-foreground">
                        #{record.InspectionId}
                      </span>
                    ),
                  },
                  {
                    accessor: 'Location',
                    title: t('table.columns.location'),
                    width: 300,
                    render: (record) => (
                      <span className="text-muted-foreground">
                        {record.Location.replace(/\s*-->\s*/g, ', ')}
                      </span>
                    ),
                  },
                  {
                    accessor: 'Topic',
                    title: t('table.columns.topic'),
                    render: (record) => (
                      <span className="font-medium">{record.Topic}</span>
                    ),
                  },
                  {
                    accessor: 'AssignedTo',
                    title: t('table.columns.assignedTo'),
                    render: (record) => (
                      <span className="text-muted-foreground">
                        {record?.AssignedTo ? record.AssignedTo : 'N/A'}
                      </span>
                    ),
                  },
                  {
                    accessor: 'Created On',
                    title: t('table.columns.createdOn'),
                    render: (record) => (
                      <span className="text-muted-foreground">
                        {new Date(record?.CreatedOn).toLocaleDateString(
                          'en-US',
                          {
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric', 
                          }
                        )}
                      </span>
                    ),
                  },
                  {
                    accessor: 'Status',
                    title: t('table.columns.status'),
                    width: 120,
                    textAlign: 'center',
                    render: (record) => (
                      <Badge
                        size="md"
                        radius="xl"
                        variant="outline"
                        color={getFollowUpStatusColor(record?.Status)}
                      >
                        {record?.Status}
                      </Badge>
                    ),
                  },
                  {
                    accessor: 'details',
                    title: t('table.columns.details'),
                    render: (record) => (
                      <Button
                        onClick={() =>
                          router.push(
                            `/initiator/initiate-history/${record.FollowupId}`
                          )
                        }
                        variant="outline"
                        size="sm"
                        className="h-8 bg-transparent"
                      >
                        {t('actions.details')}
                      </Button>
                    ),
                  },
                ]}
                styles={{
                  header: {
                    backgroundColor: 'transparent',
                  },
                  table: {
                    backgroundColor: 'transparent',
                  },
                }}
              />
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
        </Card>
      )}
      {/* drawer */}
      <Drawer
        styles={{
          content: {
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          },
          body: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          },
        }}
        opened={drawerOpened}
        onClose={closeDrawer}
        title={
          <Text fw={500} fz={20} c="primary">
            {t('filters.title')}
          </Text>
        }
        position="right"
        size="md"
      >
        <Stack gap="md" h="100%" justify="space-between">
          <Stack>
            <DatePickerInput
              clearable
              className="flex-grow"
              radius="lg"
              type="range"
              label={t('filters.labels.dateRange')}
              placeholder={t('filters.placeholders.pickDateRange')}
              value={tempDates}
              onChange={(value) => {
                if (value) {
                  setTempDates(value);
                }
              }}
            />
            <MultiSelect
              className="flex-grow"
              radius="lg"
              label={t('filters.labels.status')}
              placeholder={t('filters.placeholders.selectStatuses')}
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
              label={t('filters.labels.overdue')}
              placeholder={t('filters.placeholders.selectOverdue')}
              data={['OverDue', 'Due Tomorrow', 'Due Today']}
              value={tempSelectedOverdue}
              onChange={(value) => setTempSelectedOverdue(value)}
              clearable
              searchable
            />
          </Stack>

          <Group grow mt="xl">
            <Button variant="outline" onClick={handleClearFilters}>
              {t('filters.actions.clear')}
            </Button>
            <Button onClick={handleApplyFilters}>{t('filters.actions.applyFilters')}</Button>
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
              {t('filters.actions.resetAll')}
            </Button>
          )}
        </Stack>
      </Drawer>
    </Box>
  );
}