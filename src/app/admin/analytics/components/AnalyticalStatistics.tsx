'use client';

import { WidgetWrapper } from '@/components/widget-wrapper';
import { Icon } from '@iconify/react';
import { Select, Box, Group, Text } from '@mantine/core';
import { useTranslations } from 'next-intl';
import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';
import { useGetFollowUpsListByFilters } from '../../hooks/useGetFollowUpListByFilters';
import Cookies from 'js-cookie';
import { useAccountIdStore } from '@/stores/user/accountId-store';
import { useSession } from 'next-auth/react';
import { getAnalyticChartData, GetFollowUpsListResponse } from '@/utils/getAnalyticChartData';
import { getDateRange } from '@/utils/getDateRange';


const AnalyticalStatistics: React.FC = () => {
  const t = useTranslations('Analytics');
  
  // State for time period selection
  const [timePeriod, setTimePeriod] = useState<string>('Monthly');

  // Get current month, day, and year for highlighting
  const currentMonth = new Date().toLocaleString('en-US', { month: 'short' });
  const currentDay = new Date().toLocaleString('en-US', { weekday: 'short' });
  const currentYear = new Date().getFullYear();

  // Authentication and user data
  const roleId = Cookies.get('fifRoleId');
  const session: any = useSession();
  const { userAccountId } = useAccountIdStore();

  // Calculate date ranges based on selected time period
  const dateRange = useMemo(() => getDateRange(timePeriod), [timePeriod]);

  // Parameters for fetching total count (first query)
  const countParams = {
    AccountId: Number(userAccountId),
    UserId: session?.data?.user?.id || '',
    RoleId: Number(roleId),
    PageNumber: 1,
    PageSize: 1, // Fetch only one record to get TotalResult
    Sorted: true,
    CreatedDateFrom: dateRange.from,
    CreatedDateTo: dateRange.to,
    LocationNodeLevelType: '',
  };

  // Fetch one follow-up to get TotalResult
  const { data: countData} = useGetFollowUpsListByFilters(
    countParams,
    { enabled: true }
  ) as { data: GetFollowUpsListResponse | undefined; isLoading: boolean; error: any };

  // Get total number of follow-ups
  const totalFollowUpsCount = countData?.data?.[0]?.TotalResult || 0;

  // Parameters for fetching all follow-ups (second query)
  const allParams = useMemo(
    () => ({
      AccountId: Number(userAccountId),
      UserId: session?.data?.user?.id || '',
      RoleId: Number(roleId),
      PageNumber: 1,
      PageSize: totalFollowUpsCount || 100, // Use TotalResult or fallback to 100
      Sorted: true,
      CreatedDateFrom: dateRange.from,
      CreatedDateTo: dateRange.to,
      LocationNodeLevelType: '',
    }),
    [userAccountId, session?.data?.user?.id, roleId, dateRange, totalFollowUpsCount]
  );

  // Fetch all follow-ups using TotalResult as PageSize
  const { data: followUpsList } = useGetFollowUpsListByFilters(allParams, {
    enabled: !!totalFollowUpsCount, // Only fetch if totalFollowUpsCount is available
  }) as { data: GetFollowUpsListResponse | undefined; isLoading: boolean; error: any };

  // Debugging logs
  console.log('Count Params:', countParams);
  console.log('All Params:', allParams);
  console.log('Total Follow-ups Count:', totalFollowUpsCount);
  console.log('Follow-ups:', followUpsList);
  console.log('Date Range:', dateRange);
  console.log('Selected Period:', timePeriod);

  // Dynamic chart data based on time period
  const chartData = useMemo(
    () =>
      getAnalyticChartData(
        followUpsList,
        timePeriod,
        currentMonth,
        currentDay,
        currentYear
      ),
    [followUpsList, timePeriod, currentMonth, currentDay, currentYear]
  );

  // Calculate total follow-ups
  const totalFollowUps = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <WidgetWrapper
      title={t('statistics.title')}
      primaryActionSection={
        <Select
          w={100}
          placeholder={t('statistics.selectPeriodPlaceholder')}
          data={[t('filters.monthly'), t('filters.weekly'), t('filters.yearly')]}
          value={timePeriod}
          onChange={(value) => setTimePeriod(value || t('filters.monthly'))}
        />
      }
    >
      <Box h={300} w="100%" mt={10} pb={{ base: 55, sm: 45, md: 35 }}>
        {/* Summary Section */}
        <Group>
          <Text fw={500} fz={20}>
            {totalFollowUps.toLocaleString()}
          </Text>
          <Group gap={5}>
            <Icon icon="line-md:arrow-down" className="text-[#DF1C41]" />
            <Text className="!text-[#DF1C41]">3.5%</Text>
          </Group>
          <Text c="dimmed">{t('statistics.lastUpdated')}: Jun 04, 2025</Text>
        </Group>

        {/* Bar Chart */}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, bottom: 0 }}
            barCategoryGap={2}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis dataKey="name" axisLine={{ strokeWidth: 1 }} tickLine={false} />
            <YAxis
              tickFormatter={(value) => value.toString()}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip formatter={(value) => [`${value}`, t('statistics.followUpsLabel')]} />
            <Bar
              dataKey="value"
              radius={[6, 6, 6, 6]}
              fill="#AAAAAA"
              fillOpacity={0.8}
              stroke="none"
              name="Value"
              isAnimationActive={true}
              animationDuration={500}
              animationEasing="ease-out"
              barSize={45}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isCurrent ? '#007D37' : '#AAAAAA'}
                />
              ))}
              <LabelList
                dataKey="value"
                position="insideTop"
                formatter={(label: React.ReactNode) => {
                  const value = Number(label);
                  const entry = chartData.find((item) => item.value === value);
                  return entry?.isCurrent ? `${value}` : '';
                }}
                style={{ fill: '#FFFFFF', fontWeight: 'bold', fontSize: '12px' }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </WidgetWrapper>
  );
};

export default AnalyticalStatistics;