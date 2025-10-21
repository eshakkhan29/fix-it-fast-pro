import React from 'react';
import { Card, Group, ScrollArea, Stack, Text } from '@mantine/core';
import { useTranslations } from 'next-intl';

interface Activity {
  Id: number;
  Text: string;
  CreatedBy: string;
  CreateDate: string;
}

interface ActivityLogSectionProps {
  activities?: Activity[];
}

const ActivityLogSection = ({ activities }: ActivityLogSectionProps) => {
  const t = useTranslations('IncidentManagement');
  // Don't render if no activities
  if (!activities || activities.length === 0) {
    return null;
  }

  return (
    <Stack gap="sm">
      <Text fw={500}>{`${t('labels.activity')} (${activities.length})`}</Text>
      <Card withBorder radius="md" p="md">
        <ScrollArea h={400}>
          {activities.map((activity, index) => (
            <Card key={activity.Id || index} withBorder padding="sm" my={10}>
              <Text size="sm">{activity.Text}</Text>
              <Group gap="xs" mt="xs">
                <Text size="xs" c="dimmed">
                  {activity.CreatedBy}
                </Text>
                <Text size="xs" c="dimmed">
                  • {activity.CreateDate}
                </Text>
              </Group>
            </Card>
          ))}
        </ScrollArea>
      </Card>
    </Stack>
  );
};

export default ActivityLogSection;