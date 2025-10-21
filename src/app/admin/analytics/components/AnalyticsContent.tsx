'use client'
import { Grid, Stack } from '@mantine/core'
import React from 'react'
import AnalyticalStatistics from './AnalyticalStatistics'
// import ResolutionBarChart from './ResolutionBarChart'



const AnalyticsContent = () => {
  return (
    <Stack >
      <Grid>
        <Grid.Col span={{ base: 12 }}>
          <AnalyticalStatistics />
        </Grid.Col>
      </Grid>
      <Grid>
        {/* <Grid.Col span={{ base: 12 }}>
          <ResolutionBarChart />
        </Grid.Col> */}
        {/* <Grid.Col span={{ base: 12, md: 6 }}>
          <IncidentAreaChart />
        </Grid.Col> */}
      </Grid>
    </Stack>
  )
}

export default AnalyticsContent