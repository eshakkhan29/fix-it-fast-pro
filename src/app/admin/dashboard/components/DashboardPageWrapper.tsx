'use client';
import { Box, Grid, Group, Title, Skeleton, Button, } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import MetricsCardWrapper from './MetricsCardWrapper';
import IncidentStatusOverview from './IncidentStatusOverview';
import RealTimeIncidentFeed from './RealTimeIncidentFeed';
import LocationHeatmapCard from './LocationHeatmapCard';
import { getData } from '@/app/(public)/create-incident/action/getData';
import { useAccountIdStore } from '@/stores/user/accountId-store';
import { useSession } from 'next-auth/react';
import { DatePickerInput } from '@mantine/dates';
import { getFollowUpDefaultDates } from '@/utils/gerFollowUpDefaultDates';
import MetricsCardSkeleton from './MetricsCardSkeleton';
import IncidentOverviewSkeleton from './IncidentOverviewSkeleton';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';

function DashboardPageWrapper() {
  const { userAccountId } = useAccountIdStore();
  const session: any = useSession();
  const [metrics, setMetrics] = useState<any>([]);
  const [dates, setDates] = useState<[string | null, string | null]>([
    null,
    null,
  ]);
  const t = useTranslations('Dashboard');
  const defaultDates = getFollowUpDefaultDates();
  const [isLoadingMetrics, setIsLoadingMetrics] = useState<boolean>(false);

  const roleId = Cookies.get('fifRoleId');

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

  // get metrics from server
  useEffect(() => {
    const getMetrics = async () => {
      setIsLoadingMetrics(true);
      try {
        const res = await getData(
          `/Dashboard/Stats?accountId=${userAccountId}&startDate=${formattedDates.from}&endDate=${formattedDates.to}&userId=${session?.data?.user?.id}&roleId=${roleId}`
        );
        const filtered = res?.filter((item: any) =>
          ['Overdue', 'Closed', 'Blocked', 'Open'].includes(item.Name)
        );
        setMetrics(filtered);
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
        // Optionally set an error state here
      } finally {
        setIsLoadingMetrics(false); // Stop loading
      }
    };

    if (
      formattedDates.from &&
      formattedDates.to &&
      session?.data?.user?.id &&
      userAccountId
    ) {
      getMetrics();
    }
  }, [
    session?.data?.user?.id,
    userAccountId,
    formattedDates.from,
    formattedDates.to,
  ]);

  return (
    <Box p={'xl'}>
      {isLoadingMetrics ? (
        <Group align="center" justify="space-between" mb="xl">
          <Skeleton height={32} width={120} />
          <Group>
            <Skeleton height={36} width={140} mt={20} />
            <Skeleton height={36} width={150} mt={20} />
            <Box>
              <Skeleton height={14} width={60} mb={4} />
              <Skeleton height={36} width={200} radius="lg" />
            </Box>
          </Group>
        </Group>
      ) : (
        <Group align="center" justify="space-between" mb="xl">
          <Title order={1}>{t('title')}</Title>
          
          <Group>
            <Button
              component={Link}
              href="https://junoprod-walshqa.azurewebsites.net/followups"
              leftSection={<Icon icon="majesticons:plus" />}
              variant="outline"
              mt={20}
            >
              {t('actions.createFollowup')}
            </Button>
            <Button
              component={Link}
              href="https://junoprod-walshqa.azurewebsites.net/assignments"
              leftSection={<Icon icon="majesticons:plus" />}
              variant="light"
              mt={20}
            >
              {t('actions.createAssignment')}
            </Button>
            <Box className="flex-grow">
            <DatePickerInput
              
              radius="lg"
              type="range"
              label={t('filters.pickDatesLabel')}
              placeholder={t('filters.pickDatesPlaceholder')}
              value={dates}
              onChange={(value) => {
                if (value) {
                  setDates(value);
                }
              }}
            />
          </Box>
          </Group>
          
        </Group>
      )}

      {/* Metrics Overview */}
      {isLoadingMetrics ? (
        <MetricsCardSkeleton />
      ) : (
        <MetricsCardWrapper metrics={metrics} />
      )}

      {/* Request Status Overview */}
      <Grid>
        <Grid.Col span={{ base: 12 }}>
          {isLoadingMetrics ? (
            <IncidentOverviewSkeleton />
          ) : (
            <IncidentStatusOverview metrics={metrics} />
          )}
        </Grid.Col>

        {/* Real-Time Request Feed */}
        <Grid.Col span={{ base: 12, sm: 6, lg: 7 }}>
          <RealTimeIncidentFeed />
        </Grid.Col>

        {/* Location Heatmap */}
        <Grid.Col span={{ base: 12, sm: 6, lg: 5 }}>
          <LocationHeatmapCard />
        </Grid.Col>
      </Grid>
    </Box>
  );
}

export default DashboardPageWrapper;
