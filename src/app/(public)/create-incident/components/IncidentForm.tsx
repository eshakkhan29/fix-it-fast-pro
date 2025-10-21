'use client';

import {
  // Badge,
  Box,
  Button,
  Card,
  Divider,
  Group,
  Loader,
  Stack,
  Text,
  Textarea,

  Paper,
  ThemeIcon,
  Transition,
  Collapse,
} from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import React, { useEffect, useState } from 'react';
import * as yup from 'yup';

import IncidentImage from './IncidentImage';
import Question from './Question';
import InspectionTemplate from './InspectionTemplate';

import GetNotificationSection from './GetNotificationSection';
import { useRouter, useSearchParams } from 'next/navigation';
import { postIncident } from '../action/postIncident';
import { incidentDataFormatter } from '../utils/incidentDataFormatter';
import { notifications } from '@mantine/notifications';
import dynamic from 'next/dynamic';
import LocationPreview from './LocationPreview';
import { useUserRoleCheck } from '../hook/useUserRoleCheck';
import { useSession } from 'next-auth/react';
import Campus from './Campus';
import Building from './Building';
import Floor from './Floor';
import Area from './Area';
import Room from './Room';
import Assignment from './Assignment';
const Icon = dynamic(() => import('@iconify/react').then((m) => m.Icon), {
  ssr: false,
});

// Validation schema
const schema = yup.object({
  description: yup.string().optional(),
  images: yup.array().optional(),
  // topicId: yup.string().required('Please select a topic'),
  questionId: yup.string().required('Please select a question'),
  campusId: yup.string().required('Campus is required'),
  assignmentId: yup.string().required('Assignment is required'),
  // Password checks only when sending notification and user opts in &  password must be at least 8 characters and contains numbers & special characters & uppercase letters
  password: yup
    .string()
    .when(['walshUserStatus', 'wishToBecome'], {
      is: (status: string, wish: string) =>
        status === 'send-notification' && wish === 'yes',
      then: (schema) =>
        schema
          .required('Password is required')
          .matches(
            /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$/,
            'Password must be at least 8 characters and contains numbers & special characters & uppercase letters'
          ),
      otherwise: (schema) => schema.optional(),
    }),
  confirmPassword: yup
    .string()
    .when(['walshUserStatus', 'wishToBecome'], {
      is: (status: string, wish: string) =>
        status === 'send-notification' && wish === 'yes',
      then: (schema) =>
        schema
          .required('Please confirm your password')
          .oneOf([yup.ref('password')], 'Passwords must match'),
      otherwise: (schema) => schema.optional(),
    }),
});

function IncidentForm() {
  const {
    isInitiator,
    checkUserRole,
    userExist,
    wishToBecome,
    accountCreateSuccess,
    getInspectionDetails,
    sendEmailNotification
  } = useUserRoleCheck();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const accountId = searchParams.get('accountId');
  const assignmentId = searchParams.get('assignmentId');
  const campusId = searchParams.get('campusId');
  const campusName = searchParams.get('campusName');
  const buildingId = searchParams.get('buildingId');
  const buildingName = searchParams.get('buildingName');
  const floorId = searchParams.get('floorId');
  const floorName = searchParams.get('floorName');
  const areaId = searchParams.get('areaId');
  const areaName = searchParams.get('areaName');
  const roomId = searchParams.get('roomId');
  const roomName = searchParams.get('roomName');
  const session: any = useSession();
  const isManual = searchParams.get('manual') === 'true';

  // Initialize form with useForm hook
  const form = useForm({
    initialValues: {
      initiatorId: '',
      assignmentId: '',
      title: 'Fix it Fast Incident',
      description: '',
      images: [] as File[],
      incidentImages: [],
      topicId: '',
      questionId: '',
      tegId: '',
      responseId: '',
      campusName: '',
      campusId: '',
      buildingName: '',
      buildingId: '',
      floorName: '',
      floorId: '',
      areaName: '',
      areaId: '',
      roomName: '',
      roomId: '',
      inspectionTemplateId: '',
      accountId: '',
      walshUserStatus: 'no-notification',
      wishToBecome: '',
      firstName: '',
      lastName: '',
      email: '',
      prefix: '',
      phone: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      userRole: '',
      responseLimitId: '',
      evaluatorUserId: '',
      operatorId: '',
    },
    validate: yupResolver(schema),
    validateInputOnBlur: true,
  });



  // Set initial values from search params
  useEffect(() => {
    if (assignmentId) form.setFieldValue('assignmentId', assignmentId);
    if (campusId) form.setFieldValue('campusId', campusId);
    if (campusName) form.setFieldValue('campusName', campusName);
    if (buildingId) form.setFieldValue('buildingId', buildingId);
    if (buildingName) form.setFieldValue('buildingName', buildingName);
    if (floorId) form.setFieldValue('floorId', floorId);
    if (floorName) form.setFieldValue('floorName', floorName);
    if (areaId) form.setFieldValue('areaId', areaId);
    if (areaName) form.setFieldValue('areaName', areaName);
    if (roomId) form.setFieldValue('roomId', roomId);
    if (roomName) form.setFieldValue('roomName', roomName);
  }, [accountId, assignmentId, buildingId, floorId, areaId, roomId]);

  // check user role
  useEffect(() => {
    const check = async () => {
      await checkUserRole(session?.data?.user?.id || '', true);
    };
    if (session?.data?.user?.id) {
      check();
    }
  }, [form.values.walshUserStatus, session?.data?.user?.id, checkUserRole]);

  // Handle form submission
  const handleSubmit = async (values: typeof form.values) => {
    setIsLoading(true);
    // format data to match walsh schema

    const dataFromWalsh = incidentDataFormatter(values);

    // always check user role
    if (!isInitiator) {
      notifications.show({
        title: 'Error',
        message: 'Only the initiator can post an incident',
        color: 'red',
        autoClose: 3000,
      });
      return;
    }

    // Post incident to server
    const res = await postIncident(dataFromWalsh);


    // Show notification
    if (res?.success) {
      notifications.show({
        title: 'Successful',
        message: 'Incident posted successfully!',
        color: 'green',
        autoClose: 3000,
      });

      if (values?.walshUserStatus === "send-notification") {
        // get inspection details
        const id = res?.data?.Message?.split(":")[1]?.trim();

        // get
        const inspectionDetails = await getInspectionDetails(id);
        await sendEmailNotification({
          assignmentId: inspectionDetails?.AssignmentId || '',
          location: inspectionDetails?.FollowUps?.[0]?.Location || '',
          toEmail: form.values.email || '',
          url: `${window.location.origin}/initiator/initiate-history/${inspectionDetails?.FollowUps?.[0]?.Id}`,
          inspectionId: id || '',
          followupId: inspectionDetails?.FollowUps?.[0]?.Id || '',
          status: 'Open',
          createdByUserId: values?.initiatorId || '',
        })
      }

      // redirect to initiate history
      router.push(`/initiator/initiate-history`);
    } else {
      notifications.show({
        title: 'Error',
        message: res?.error || 'Failed to post incident',
        color: 'red',
        autoClose: 3000,
      });
    }

    // Reset loading state
    setIsLoading(false);
  };

  const submitButtonDisabled =
    !accountCreateSuccess &&
    (!isInitiator ||
      (form?.values?.walshUserStatus === 'send-notification' &&
        !form?.values?.email) ||
      (!userExist && wishToBecome === 'yes'));

  // form submit when account Create Success
  useEffect(() => {
    const autoSubmitForm = async () => {
      await handleSubmit(form.values);
    }
    if (accountCreateSuccess) {
      autoSubmitForm();
    }
  }, [accountCreateSuccess])

  return (
    <Card
      className="!border !border-[#8ED2AC]"
      withBorder
      maw={600}
      radius="lg"
      p={8}
    >
      <Card withBorder maw={600} radius="lg" p={0}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            {/* Form Header */}
            <Stack px={14}>
              <Text size="xl" fw={600} c="primary" fz={26} pt={8}>
                Submit an Incident
              </Text>

              {/* Qr Code Location Preview */}
              {!isManual && (
                <>
                  <Transition
                    mounted={!form.values.campusId}
                    transition="slide-down"
                    duration={250}
                    timingFunction="ease"
                  >
                    {(styles) => (
                      <Box mt="md" w="100%" aria-live="polite" style={styles}>
                        <Paper withBorder radius="md" p="md" shadow="xs">
                          <Group
                            justify="space-between"
                            align="center"
                            w="100%"
                          >
                            <Group align="center" gap="sm">
                              <ThemeIcon
                                variant="light"
                                color="primary"
                                radius="md"
                                size={36}
                              >
                                <Icon
                                  icon="material-symbols:qr-code-2-rounded"
                                  width={20}
                                  height={20}
                                  color="black"
                                />
                              </ThemeIcon>
                              <Text
                                variant="gradient"
                                gradient={{
                                  from: 'primary.3',
                                  to: 'secondary.3',
                                  deg: 45,
                                }}
                                fw={600}
                              >
                                Generating Location from QR Code
                              </Text>
                            </Group>
                            <Loader size="sm" type="bars" color="primary" />
                          </Group>
                          <Text size="sm" c="dimmed" mt={6}>
                            Please wait while we fetch location details…
                          </Text>
                        </Paper>
                      </Box>
                    )}
                  </Transition>

                  {/* Location Selection */}
                  <Collapse
                    in={Boolean(campusId)}
                    transitionDuration={200}
                    animateOpacity
                  >
                    <LocationPreview form={form} />
                  </Collapse>
                </>
              )}

              {/* Manual Location Selection */}
              {isManual && (
                <>
                  <Group>
                    <Assignment form={form} />
                    <Campus form={form} />
                  </Group>
                  <Group>
                    <Building form={form} />
                    <Floor form={form} />
                  </Group>
                  <Group>
                    <Area form={form} />
                    <Room form={form} />
                  </Group>
                </>
              )}
            </Stack>

            {/* Inspection Template Selection */}
            <InspectionTemplate form={form} />

            {/* Topic Selection - Only show if a room is selected */}
            {/* {form.values.inspectionTemplateId && (
              <>
                <Divider />
                <Stack px={14}>
                  <Topics form={form} />
                </Stack>
              </>
            )} */}

            {/* Question Selection - Only show if a topic is selected */}
            {/* {form.values.topicId && ( */}
            <>
              <Divider />
              <Stack px={14}>
                <Question form={form} />
              </Stack>
            </>
            {/* )} */}

            {/* Topic Question Card */}
            {/* <Stack px={14}>
              {form.values.topicId && <TopicQuestionCard form={form} />}
            </Stack> */}

            <Divider />
            {form.values.questionId && (
              <>
                <Stack px={14}>
                  {/* <TextInput
                    label="Question"
                    placeholder="Describe the question you are facing"
                    {...form.getInputProps('title')}
                  /> */}

                  {/* Description */}
                  <Textarea
                    label="Notes"
                    placeholder="Write more details here"
                    {...form.getInputProps('description')}
                  />
                </Stack>

                {/* Image Upload Section */}
                <Divider />
                <Stack px={14}>
                  <IncidentImage form={form} />
                  {/* notify me section */}
                </Stack>

              </>
            )}

            <GetNotificationSection form={form} />


            {/* Submit Button */}
            <Stack p={14}>
              <Group w="100%" justify="flex-end">
                <Button
                  variant="default"
                  onClick={() => form.reset()}
                  miw={130}
                >
                  Cancel
                </Button>
                {wishToBecome !== 'yes' && (
                  <Button
                    disabled={submitButtonDisabled}
                    loading={isLoading}
                    type="submit"
                    miw={110}
                  >
                    Submit
                  </Button>
                )}
              </Group>
            </Stack>
          </Stack>
        </form>
      </Card>
    </Card>
  );
}

export default IncidentForm;
