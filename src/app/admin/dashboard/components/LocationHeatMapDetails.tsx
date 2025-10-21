
import { Icon } from '@iconify/react'
import { ActionIcon, Card, Group, Stack, Text } from '@mantine/core'
import React from 'react'

interface LocationHeatMapDetailsProps  {
 level: string;
  count:number;

}



const LocationHeatMapDetails = ({location}:{location:LocationHeatMapDetailsProps}) => {
// icon function 
const getIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case 'campus':
        return 'mdi:domain';
      case 'building':
        return 'mdi:office-building';
      case 'floor':
        return 'mdi:layers';
      case 'area':
        return 'mdi:vector-square';
      case 'room':
        return 'mdi:door';
      default:
        return 'mdi:map-marker';
    }
  };

 const LEVEL_COLORS: Record<string, string> = {
  Campus: '#DF1C41',   // Red — high/critical (keep)
  Building: '#1E3A8A', // Dark Blue (from Tailwind blue-900) — bold and strong
  Floor: '#0F766E',    // Teal (from Tailwind teal-700) — cool and calming
  Area: '#7C3AED',     // Purple (from Tailwind violet-600) — distinct and modern
  Room: '#184E44',     // Deep green — low priority or safe (keep)
};
  const getCardColor = (data: LocationHeatMapDetailsProps): string => {
  return LEVEL_COLORS[data.level] || '#6B7280'; // Fallback to neutral gray if level is unknown
};
  return (
   <Card withBorder  
   style={{
         
          
         borderLeft:`5px solid ${getCardColor(location)}`
        }}
   
   >
    <Group justify='space-between'>
      <Group >
          {/* left section */}
          <ActionIcon variant='default' radius="100%" size={45}>
            <Icon icon={getIcon(location?.level)} className='text-2xl' color={getCardColor(location)} />
          </ActionIcon>
          <Stack gap={0}>
            <Text  fz={18} fw={600}>
              {location?.level}
            </Text>
            <Text c="dimmed" size='xs'>
              {`Total ${location?.count} ${location?.level}`}
               
            </Text>
          </Stack>
          
      </Group>
      {/* right sectin */}
          <Group gap={5}>
                <Text fz={18} fw={600}>
              {location?.count}
              </Text>
              <Icon icon="mi:tag" color={getCardColor(location)} className='text-2xl'/>
          </Group>
    </Group>
      
   </Card>
  )
}

export default LocationHeatMapDetails