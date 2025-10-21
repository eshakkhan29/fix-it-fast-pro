"use client"
import { Grid } from '@mantine/core'
import React from 'react'
import MetricsCard from './MetricsCard'
import { useTranslations } from 'next-intl'

function MetricsCardWrapper({ metrics }: { metrics: any[] }) {
    const t = useTranslations('Dashboard')
    const formattedMetrics = metrics?.map((item: any) => ({
        ...item,
        icon: item.Name === "Overdue" ? "pajamas:calendar-overdue" : item.Name === "Closed" ? "oui:security-signal-resolved" : item.Name === "Blocked" ? "ic:baseline-block" : "pajamas:issue-type-maintenance",
    }))
    return (
        <Grid>
            {formattedMetrics?.map((item: any) => (
                <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 3 }} key={item.Name}>
                    <MetricsCard
                        icon={item.icon}
                        iconColor={
                            item.Name === "Overdue"
                                ? "#fa5252"
                                : item.Name === "Closed"
                                    ? "#40c057"
                                    : item.Name === "Blocked"
                                        ? "#fd7e14"
                                        : "#fca12f"}
                        title={item.Name === "Closed" ? t('status.resolved') : t(`status.${item.Name.toLowerCase()}`)}
                        value={item.Counts}

                    />
                </Grid.Col>
            ))}
        </Grid>
    )
}

export default MetricsCardWrapper