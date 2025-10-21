import { WidgetWrapper } from '@/components/widget-wrapper'
import { Icon } from '@iconify/react'
import { Select, Box, Group, Text } from '@mantine/core'
import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Dummy data for the bar chart
const data = [
  {
    name: 'Assignment 1',
    average: 65,
    target: 40,
  },
  {
    name: 'Assignment 2',
    average: 85,
    target: 50,
  },
  {
    name: 'FixitFast Assignment',
    average: 45,
    target: 30,
  },
  {
    name: 'Housekeeping',
    average: 45,
    target: 30,
  },
  {
    name: 'Assignment Demo 4',
    average: 45,
    target: 30,
  },
  {
    name: 'New Assignment',
    average: 45,
    target: 30,
  },
]

const ResolutionBarChart = () => {


  return (
    <WidgetWrapper
      title="Average Resolution Time vs Target"
      primaryActionSection={
        <Select
          w={100}
          placeholder="Month"
          data={['Monthly', 'Weekly', 'Yearly']}
        />
      }

    >
      <Box h={300} pb={30}>
        <Group mb={10}>
          <Text fw={500} fz={22}>73</Text>
          <Group gap={5}>
            <Icon icon="lets-icons:arrow-top" className='!text-green-500' />
            <Text className='!text-green-500'>0.10%</Text>
          </Group>

          <Text c='dimmed' fw={500}>Since last week</Text>

        </Group>

        <ResponsiveContainer width="100%" height="100%">


          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >

            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={true}
              vertical={false}
            />
            <XAxis dataKey="name" axisLine={false} />
            <YAxis
              axisLine={false}
              label={{ value: 'Hours', angle: -90, position: 'insideLeft' }}
              ticks={[0, 20, 40, 60, 80, 100]}
            />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="average"
              name="Average"
              fill="#2D8FBC"
              radius={[6, 6, 6, 6]}
            />
            <Bar
              dataKey="target"
              name="Target"
              fill="#007D37 "
              radius={[6, 6, 6, 6]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </WidgetWrapper>
  );
}

export default ResolutionBarChart