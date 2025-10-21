import React, { useEffect, useState } from 'react';
import { getData } from '../action/getData';
import { useInspectionTemplateStore } from '@/stores/inspection-template/inspection-template-stor';
import {
  Box,
  Divider,
  Flex,
  Group,
  Loader,
  Radio,
  ScrollArea,
  Stack,
  Text,
} from '@mantine/core';
import { useAccountIdStore } from '@/stores/user/accountId-store';
import { useSearchParams } from 'next/navigation';

function InspectionTemplate({ form }: { form: any }) {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const { userAccountId: accountId } = useAccountIdStore();
  const { setTemplates, templates, setCurrentTemplate } =
    useInspectionTemplateStore();
  const [assignment, setAssignment] = useState<any>(null);
  const [filteredTemplates, setFilteredTemplates] = useState<any>([]);
  const isManual = searchParams.get('manual') === 'true';

  // filter templates by assignment type or manual mode
  useEffect(() => {
    if (assignment) {
      form.setFieldValue('evaluatorUserId', assignment?.Evaluators?.[0]?.UserId);
      form.setFieldValue('operatorId', assignment?.Operators?.[0]?.UserId);
      const filteredTemplates = templates.filter((t: any) =>
        assignment?.InspectionTemplates?.some((it: any) => it.Id === t.Id)
      );
      setFilteredTemplates(filteredTemplates || []);
      setLoading(false);
    }
  }, [assignment, templates]);

  // no need to format for Select; we'll render radios directly

  // get inspection template
  useEffect(() => {
    const getDataTopic = async () => {
      const data = await getData(
        `/InspectionTemplates/GetByAccountId?accountId=${accountId}`
      );
      if (data?.length > 0) {
        setTemplates(data);
      }
    };
    if (accountId && form?.values?.assignmentId) getDataTopic();
  }, [accountId, form?.values?.assignmentId, setTemplates]);

  // get assignment by assignment id
  useEffect(() => {
    const getAssignment = async () => {
      if (form?.values?.assignmentId) {
        const data = await getData(
          `/Assignment/getByAssignmentId?accountId=${accountId}&id=${form?.values?.assignmentId}`
        );
        if (data) {
          setAssignment(data);
        }
      }
    };
    if (accountId && form?.values?.assignmentId) getAssignment();
  }, [accountId, form?.values?.assignmentId]);

  // handle select inspection template
  const handleSelectTemplate = (id: string) => {
    const selectedTemplate = templates?.find((item) => item.Id === Number(id));
    setCurrentTemplate(selectedTemplate || null);
    // Mantine Select expects a string value; ensure we store string IDs
    form.setFieldValue(
      'inspectionTemplateId',
      selectedTemplate ? String(selectedTemplate.Id) : null
    );
  };

  // select first template by default
  useEffect(() => {
    if (filteredTemplates?.length > 0) {
      handleSelectTemplate(String(filteredTemplates[0].Id));
    }
  }, [filteredTemplates]);


  return (
    <>
      {filteredTemplates?.length > 1 && <Divider />}
      {(filteredTemplates?.length > 1 || loading) && (
        <Stack px={14}>
          <Box className="flex-grow">
            {(loading && !isManual) && (
              <Flex justify="center" align="center">
                <Loader size="sm" type="bars" color="primary" />
              </Flex>
            )}
            {filteredTemplates?.length > 1 && (
              <>
                <Group gap={5}>
                  <Text size="sm" fw={500} mb="xs">
                    What kind of problem are you facing?
                  </Text>
                  {filteredTemplates?.length > 4 && (
                    <Text size="sm" fw={500} mb="xs" c="dimmed">
                      {'(Scroll down to see more)'}
                    </Text>
                  )}
                </Group>

                <Radio.Group
                  value={
                    typeof form?.values?.inspectionTemplateId === 'number'
                      ? String(form.values.inspectionTemplateId)
                      : form?.values?.inspectionTemplateId || ''
                  }
                  onChange={(value) => handleSelectTemplate(value as string)}
                >
                  <ScrollArea
                    className="!custom_scroll"
                    h={filteredTemplates?.length > 4 ? 220 : undefined}
                  >
                    <Stack gap="xs">
                      {filteredTemplates?.map((item: any, index: number) => (
                        <div
                          key={index}
                          className="cursor-pointer"
                          onClick={() => handleSelectTemplate(String(item.Id))}
                        >
                          <Radio
                            value={String(item.Id)}
                            label={item.Title}
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
                                  (typeof form?.values?.inspectionTemplateId ===
                                    'number'
                                    ? String(form.values.inspectionTemplateId)
                                    : form?.values?.inspectionTemplateId || '') ===
                                    String(item.Id)
                                    ? '#000000'
                                    : '#868E96',
                              },
                            }}
                          />
                        </div>
                      ))}
                    </Stack>
                  </ScrollArea>
                </Radio.Group>
              </>
            )}
          </Box>
        </Stack>
      )}
    </>
  );
}

export default InspectionTemplate;
