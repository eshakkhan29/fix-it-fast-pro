"use client"
import { WidgetWrapper } from '@/components/widget-wrapper'
import { Select, Stack } from '@mantine/core'
import React from 'react'
import ProgressBarWrapper from './ProgressBarWrapper'
import { useTranslations } from 'next-intl'

const IncidentStatusOverview = ({ metrics }: { metrics: any[] }) => {

  const t = useTranslations('Dashboard')

  const totalCount = metrics.reduce(
    (acc, item) => acc + (item.Name === "Overdue" ? 0 : item.Counts),
    0
  );

  const formattedMetrics = metrics.map((item) => {
    const color =
      item.Name === "Overdue"
        ? "red.6"
        : item.Name === "Closed"
          ? "green.6"
          : item.Name === "Blocked"
            ? "orange.6"
            : "yellow.6";

    return {
      color,
      title: item.Name === "Closed" ? t('status.resolved') : t(`status.${item.Name.toLowerCase()}`),
      completedValue: Number(item.Counts),
      totalValue: totalCount,
    };
  });




  return (
    <WidgetWrapper

      title={t('widgetTitles.incidentStatusOverview')}
      primaryActionSection={<Select
        w={120}
        placeholder={t('filters.periodPlaceholder')}
        data={[t('filters.monthly'), t('filters.weekly'), t('filters.yearly')]}
      />
      }

    >
      <Stack>
        {
          formattedMetrics?.map((data: any) => (
            <ProgressBarWrapper
              key={data.title}
              color={data.color}
              title={data.title}
              completedValue={data.completedValue}
              totalValue={data.totalValue}
            />
          ))
        }


      </Stack>
    </WidgetWrapper>
  )
}

export default IncidentStatusOverview