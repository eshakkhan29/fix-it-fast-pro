import { Icon } from '@iconify/react'
import { Badge, Box, Checkbox, Group, Paper, Stack, Text } from '@mantine/core'
import React from 'react'
import { SelectedLocation } from './LocationManagementContent'

interface BulkLocationCardProps {
    item:SelectedLocation
}
const BulkLocationCard = ({item}:BulkLocationCardProps) => {
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
  const getColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'campus':
        return 'primary';
      case 'building':
        return 'secondary';
      case 'floor':
        return 'success';
      case 'area':
        return 'warning';
      case 'room':
        return 'neutral';
      default:
        return 'gray';
    }
  };
  return (
   <Paper
     
        p="sm"
        withBorder
        style={{
         
          marginBottom: 4,
         borderLeft:`3px solid var(--mantine-color-${getColor(item?.level)}-3)`
        }}
      >
        <Group justify="space-between" wrap="nowrap">
          <Group gap="sm" wrap="nowrap">
            {/* {onSelectionChange && ( */}
              <Checkbox
              defaultChecked={true}
                // checked={true}
                // onChange={(event) =>
                //   handleSelectionChange(event.currentTarget.checked)
                // }
                size="sm"
                color={getColor(item?.level)}
              />
            {/* )} */}

            {/* {hasChildren && (
              <ActionIcon
                variant="subtle"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                color={getColor(node.level)}
              >
                <Icon
                  icon={isExpanded ? 'mdi:chevron-down' : 'mdi:chevron-right'}
                  style={{ fontSize: 16 }}
                />
              </ActionIcon>
            )} */}
            <Box w={28} />

            <Icon
              icon={getIcon(item?.level)}
           
              style={{
                fontSize: 20,
                color: `var(--mantine-color-${getColor(item.level)}-6)`,
              }}
            />

            <Stack gap={2}>
              <Text fw={500} size="sm">
                {/* {node.text} */}
                {item?.name}
              </Text>
              <Group gap="xs">
                <Badge  variant="outline"  radius="lg" color={getColor(item?.level)} >
               
                  {/* {node.level} */}
                  {item?.level}
                </Badge>
                <Badge variant='outline' color='#353849' radius="lg">
                  {/* ID: {node.value} */}
                  ID:{item?.id?.split("-")[1]}
                </Badge>
              </Group>
            </Stack>
          </Group>

          <Group gap="xs">
            

            
          </Group>
        </Group>
      </Paper>
  )
}

export default BulkLocationCard