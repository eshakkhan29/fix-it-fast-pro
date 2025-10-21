import { useInspectionTemplateStore } from '@/stores/inspection-template/inspection-template-stor';
import { Card, Group, Stack, Text } from '@mantine/core'
import React from 'react'



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



const TopicQuestionCard = ({ form }: { form: any }) => {
  const { currentTemplate } = useInspectionTemplateStore();
  const uniqueTopics = extractUniqueTopics(
    currentTemplate?.TopicEvaluationGroups || []
  );

  const filteredQuestions = currentTemplate?.TopicEvaluationGroups?.filter(
    (item) => item.TopicId === Number(form.values.topicId)
  );

  const selectedTopic = uniqueTopics.find((topic) => topic.value === form?.values?.topicId)
  const selectedQuestion = filteredQuestions?.find((item) => item.QuestionId === Number(form.values.questionId))



  return (
    <Card withBorder>
      <Stack gap={5}>
        <Text fw={500} fz={14}>Selected Topic and Question</Text>
        <Group>
          <Text fw={500} fz={16} c="primary">Topic:</Text>
          {
            selectedTopic && <Text>{selectedTopic?.label || ''}</Text>
          }

        </Group>
        <Group>
          <Text fw={500} fz={16} c="primary">Question:</Text>
          {
            selectedQuestion && <Text>{selectedQuestion?.Question || ''}</Text>
          }

        </Group>
      </Stack>
    </Card>
  )
}

export default TopicQuestionCard