'use client'
import { Box, Group, Radio, ScrollArea, Stack, Text } from '@mantine/core';
import React, { useMemo, useState } from 'react';
import { useInspectionTemplateStore } from '@/stores/inspection-template/inspection-template-stor';
import { groupTegBySection } from '@/utils/groupTegBySection';

type ResponseOption = {
  ResponseId: number;
  Name: string;
  InspectionReponseOptionLimitAndAction?: Array<{ LimitId: number }>;
};

function Question({ form }: { form: any }) {
  const { currentTemplate } = useInspectionTemplateStore();
  
  console.log('current template', currentTemplate)
  const [responseOptions, setResponseOptions] = useState<ResponseOption[]>([]);



  // const filteredQuestions = currentTemplate?.TopicEvaluationGroups?.filter(
  //   (item) => item.TopicId === Number(form.values.topicId)
  // );

  const groupedSections = useMemo(() => {
    return groupTegBySection(currentTemplate?.TopicEvaluationGroups || []);
  }, [currentTemplate]);

  console.log(groupedSections, 'gp sectoins')


  // const formattedQuestionData =
  //   filteredQuestions?.reduce((unique, item) => {
  //     const existingItem = unique.find((q) => q.value === item?.QuestionId);
  //     if (!existingItem) {
  //       unique.push({
  //         label: item?.Question,
  //         value: item?.QuestionId,
  //       });
  //     }
  //     return unique;
  //   }, [] as Array<{ label: string; value: number }>) || [];



  // handle question change
  const handleQuestionChange = (questionId: number) => {
    const selectedQuestionItem = currentTemplate?.TopicEvaluationGroups?.find(
      (item) => item.QuestionId === questionId
    );

    // console.log("selectedQuestionItem", selectedQuestionItem)

    // Set questionId and tegId in the form
    form.setFieldValue('questionId', questionId);
    if (selectedQuestionItem?.TEGId) {
      form.setFieldValue('tegId', selectedQuestionItem.TEGId);
    }

    // Update response options for the selected question
    const options = selectedQuestionItem?.ReponseOptions ?? [];
    setResponseOptions(options);

    // Handle response option selection
    if (options.length === 1) {
      // Auto-select the single response option
      const singleOption = options[0];
      form.setFieldValue('responseId', singleOption.ResponseId);
      const limitId = singleOption?.InspectionReponseOptionLimitAndAction?.[0]?.LimitId;
      if (limitId !== undefined) {
        form.setFieldValue('responseLimitId', limitId);
      }
    } else {
      // Clear responseId for multiple options to ensure none are selected
      form.setFieldValue('responseId', undefined);
      form.setFieldValue('responseLimitId', undefined);
    }
  };


  return (
    <div>
      {form.values.inspectionTemplateId && (
        <Box>
          <Group>
            <Text size="sm" fw={500} mb="xs">
              Select Issue:
            </Text>
            {currentTemplate &&
              currentTemplate?.TopicEvaluationGroups?.length > 4 && (
                <Text size="sm" fw={500} mb="xs" c="dimmed">
                  {'(Scroll down to see more)'}
                </Text>
              )}
          </Group>

          <ScrollArea
            className="!custom_scroll"
            h={
              currentTemplate &&
                currentTemplate?.TopicEvaluationGroups?.length > 4
                ? 350
                : undefined
            }
          >
            {/* <Stack gap="xs">
              {formattedQuestionData?.map((question: any, index: number) => (
                <div
                  key={index}
                  className="cursor-pointer"
                  onClick={() => handleQuestionChange(question.value)}
                >
                  <Radio
                    checked={form.values.questionId === question.value}
                    onChange={() => handleQuestionChange(question.value)}
                    label={question.label}
                    styles={{
                      root: {
                        cursor: 'pointer',
                        background: '#F8F9FB',
                        borderRadius: 6,
                        padding: 15,
                      },
                      label: {
                        cursor: 'pointer',
                        fontSize: '16px',
                        color:
                          form.values.questionId === question.value
                            ? '#000000'
                            : '#868E96',
                      },
                    }}
                  />
                  {form.values.questionId === question.value &&
                    responseOptions.length > 0 && (
                      <Stack my={5}>
                        <Text fw={500} fz={14}>
                          Select an option according to current situation:
                        </Text>
                        <Radio.Group
                          value={String(form.values.responseId ?? '')}
                          onChange={(val) => {
                            const parsed = Number(val);
                            if (!Number.isNaN(parsed)) {
                              form.setFieldValue('responseId', parsed);
                              const selectedResponse = responseOptions.find(
                                (response) => response.ResponseId === parsed
                              );
                              const limitId =
                                selectedResponse
                                  ?.InspectionReponseOptionLimitAndAction?.[0]
                                  ?.LimitId;
                              if (limitId !== undefined) {
                                form.setFieldValue('responseLimitId', limitId);
                              }
                            }
                          }}
                        >
                          <Group gap="md" wrap="wrap">
                            {responseOptions.map((response) => (
                              <Radio
                                key={response.ResponseId}
                                value={String(response.ResponseId)}
                                label={response.Name}
                                styles={{
                                  root: {
                                    cursor: 'pointer',
                                    background: '#F8F9FB',
                                    borderRadius: 21,
                                    padding: 10,
                                  },
                                  label: {
                                    cursor: 'pointer',
                                    maxWidth: '200px',
                                    color: '#007D37',
                                    fontSize: '16px',
                                  },
                                }}
                              />
                            ))}
                          </Group>
                        </Radio.Group>
                      </Stack>
                    )}
                </div>
              ))}
            </Stack> */}
            {/* Grouped section */}
            {groupedSections?.map?.((group, index) => (
              <Stack key={index} gap={5} mb={10}>
                <Text size="sm" fw={500}>{group?.sectionTitle}</Text>
                {group?.items?.map((teg, index) => (
                  <div
                    key={index}
                    className="cursor-pointer"
                    onClick={() => handleQuestionChange(teg?.QuestionId)}
                  >
                    <Radio
                      checked={form.values.questionId === teg?.QuestionId}
                      onChange={() => handleQuestionChange(teg?.QuestionId)}
                      label={teg?.Question}
                      styles={{
                        root: {
                          cursor: 'pointer',
                          background: '#F8F9FB',
                          borderRadius: 6,
                          padding: 15,
                        },
                        label: {
                          cursor: 'pointer',
                          fontSize: '16px',
                          color:
                            form.values.questionId === teg?.QuestionId
                              ? '#000000'
                              : '#868E96',
                        },
                      }}
                    />
                    {form.values.questionId === teg?.QuestionId &&
                      responseOptions.length > 1 && (
                        <Stack my={5}>
                          <Text fw={500} fz={14}>
                            Select an option according to current situation:
                          </Text>
                          <Radio.Group
                            value={String(form.values.responseId ?? '')}
                            onChange={(val) => {
                              const parsed = Number(val);
                              if (!Number.isNaN(parsed)) {
                                form.setFieldValue('responseId', parsed);
                                const selectedResponse = responseOptions.find(
                                  (response) => response.ResponseId === parsed
                                );
                                const limitId =
                                  selectedResponse
                                    ?.InspectionReponseOptionLimitAndAction?.[0]
                                    ?.LimitId;
                                if (limitId !== undefined) {
                                  form.setFieldValue(
                                    'responseLimitId',
                                    limitId
                                  );
                                }
                              }
                            }}
                          >
                            <Group gap="md" wrap="wrap">
                              {responseOptions.map((response) => (
                                <Radio
                                  key={response.ResponseId}
                                  value={String(response.ResponseId)}
                                  label={response.Name}
                                  styles={{
                                    root: {
                                      cursor: 'pointer',
                                      background: '#F8F9FB',
                                      borderRadius: 21,
                                      padding: 10,
                                    },
                                    label: {
                                      cursor: 'pointer',
                                      maxWidth: '200px',
                                      color: '#007D37',
                                      fontSize: '16px',
                                    },
                                  }}
                                />
                              ))}
                            </Group>
                          </Radio.Group>
                        </Stack>
                      )}
                  </div>
                ))}
              </Stack>
            ))}
          </ScrollArea>

          {form.errors.questionId && (
            <Text size="xs" c="red" mt="xs">
              {form.errors.questionId}
            </Text>
          )}
        </Box>
      )}
    </div>
  );
}

export default Question;