import {
  Box,
  Radio,
  Grid,
  GridCol,
  Group,
  ScrollArea,
  Text,

} from '@mantine/core';
import React from 'react';
import { useInspectionTemplateStore } from '@/stores/inspection-template/inspection-template-stor';

type RawItem = {
  TopicId: number;
  Topic: string;
  [key: string]: any;
};

type UniqueTopic = {
  value: string;
  label: string;
};

function extractUniqueTopics(data: RawItem[]): UniqueTopic[] {
  const seen = new Set<string>();
  const result: UniqueTopic[] = [];

  for (const item of data) {
    if (!seen.has(item.TopicId.toString())) {
      seen.add(item.TopicId.toString());
      result.push({ value: item.TopicId.toString(), label: item.Topic });
    }
  }
  return result;
}

function Topics({ form }: { form: any }) {
  const { currentTemplate } = useInspectionTemplateStore();

  const uniqueTopics = extractUniqueTopics(
    currentTemplate?.TopicEvaluationGroups || []
  );

  // handle topic change
  const handleTopicChange = (topicId: string) => {
    form.setFieldValue('topicId', topicId);
  };

  return (
    <Box>
      <Group gap={5}>
        <Text size="sm" fw={500} mb="xs">
          Select an object (Topic)
        </Text>
        {uniqueTopics?.length > 10 && (
          <Text size="sm" fw={500} mb="xs" c="dimmed">
            {'(Scroll down to see more)'}
          </Text>
        )}
      </Group>

      <ScrollArea
        className="custom_scroll"
        h={uniqueTopics?.length > 10 ? 200 : undefined}
        scrollbars={uniqueTopics?.length > 10 ? 'y' : false}
      >
        <Grid gutter="xs">
          {uniqueTopics?.map((topic: UniqueTopic) => (
            <GridCol key={topic.value} span="content">
              {/* <Card 
                withBorder 
                radius="xl" 
                bg='#F8F9FB'
                style={{ cursor: 'pointer' }}
                onClick={() => handleTopicChange(topic.value)}
              > */}
              <Radio
                checked={form.values.topicId === topic.value}
                onChange={() => handleTopicChange(topic.value)}
                label={topic.label}
                styles={{
                  root: { cursor: 'pointer', background: "#F8F9FB", borderRadius: 21, padding: 10 },
                  label: {
                    cursor: 'pointer',
                    maxWidth: '200px', // Adjust as needed
                    color: '#007D37',
                    fontSize: "16px"
                  },
                }}
              />
              {/* </Card> */}
            </GridCol>
          ))}
        </Grid>
      </ScrollArea>

      {form.errors.topicId && (
        <Text size="xs" c="red" mt="xs">
          {form.errors.topicId}
        </Text>
      )}
    </Box>
  );
}

export default Topics;
