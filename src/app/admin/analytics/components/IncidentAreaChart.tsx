import { WidgetWrapper } from '@/components/widget-wrapper'
import { Icon } from '@iconify/react'
import { Select, Box, Text, Group } from '@mantine/core'
import React, { useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,

} from 'recharts'

// Dummy data for the area chart
const areaData = [
  { name: 'Week 1', incidents: 45 },
  { name: 'Week 2', incidents: 65 },
  { name: 'Week 3', incidents: 35 },
  { name: 'Week 4', incidents: 78 },
  { name: 'Week 5', incidents: 52 }
];

const IncidentAreaChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Monthly');
  // const currentMonth = new Date().toLocaleString('default', { month: 'short' }) + ' ' + new Date().getFullYear();



  return (
    <WidgetWrapper
      title="Incident Trends Analysis"
      primaryActionSection={
        <Select
          w={100}
          placeholder="Month"
          data={['Monthly', 'Weekly', 'Yearly']}
          value={selectedPeriod}
          onChange={(value) => setSelectedPeriod(value || 'Monthly')}
        />
      }

    >
      <Box h={300} pb={35}>
        <Group mb={10}>
          <Text fw={500} fz={22}>73</Text>
          <Group gap={5}>
            <Icon icon="lets-icons:arrow-top" className='!text-green-500' />
            <Text className='!text-green-500'>0.10%</Text>
          </Group>

          <Text c='dimmed' fw={500}>Since last week</Text>
        </Group>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={areaData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false} vertical={true}
            />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            {/* <ReferenceLine 
                y={50} 
                stroke="#8F8F8F" 
                strokeDasharray="3 3" 
                label={{ value: 'Target', position: 'right', fill: '#8F8F8F' }} 
              /> */}
            <Area
              type="monotone"
              dataKey="incidents"
              stroke="#005624"
              strokeWidth={2} // Increase stroke thickness
              fill="#8ED2AC"
              fillOpacity={0.6}
            />

          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </WidgetWrapper>
  )
}

export default IncidentAreaChart