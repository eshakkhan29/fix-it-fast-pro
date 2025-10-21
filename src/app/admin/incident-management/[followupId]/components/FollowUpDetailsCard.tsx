'use client';

import React, { useEffect, useState } from 'react';
import { useGetFollowUpDetails } from '@/app/evaluator/hooks/useGetFollowUpDetails';
import { useAccountIdStore } from '@/stores/user/accountId-store';
import { getFollowUpStatusColor } from '@/utils/getFollowUpStatusColor';
import { ActionIcon, Badge, Button, Grid, Group, Image, Modal, Paper, Stack, Text, Textarea } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { useForm } from '@mantine/form';
import { useUpdateFollowUp } from '@/app/evaluator/hooks/useUpdateFollowUp';
import { notifications } from '@mantine/notifications';
import { dueDateFormatter } from '@/utils/dueDateFormatter';
import DueDateSelector from './DueDateSelector';
import OperatorManagerSelection from './OperatorManagerSelection';
import ActivityLogSection from './ActivityLogSection';
import StatusUpdateComponent from './StatusUpdateComponent';
import IncidentImage from '@/app/(public)/create-incident/components/IncidentImage';
import FollowUpCardSkeleton from './FollowUpCardSkeleton';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { useDisclosure } from '@mantine/hooks';
import ImagePreviewModal from './ImagePreviewModal';
import { formatDatePart, formatTimePart } from '@/utils/formatDate';
import UnsavedChangesModal from '@/app/(public)/components/UnsavedChangesModal';
import { useTranslations } from 'next-intl';

const FollowUpDetailsCard = ({ followupId, role }: { followupId: string, role: string }) => {
  const router = useRouter()
  const [showDetails, setShowDetails] = useState<boolean>(true);
  const [assignmentData, setAssignmentData] = useState<any>(null);
  const [showImageSection, setShowImageSection] = useState<boolean>(false);
  const { mutate, isPending: isUpdatePending } = useUpdateFollowUp();
  const [opened, { open, close }] = useDisclosure(false);
   const [saveOpened, { open:saveOpen, close:saveClose }] = useDisclosure(false);
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [isGoBack, setIsGoBack] = useState<boolean>(false)

  const t = useTranslations('IncidentManagement');
  const tDashboard = useTranslations('Dashboard');
  // Form setup with initial values
  const form = useForm({
    initialValues: {
      incidentImages: [],
      operator: [] as string[],
      manager: [] as string[],
      note: '',
      comments: '',
      images: [] as File[],
      dueDate: null as Date | null,
      statusId: '',
    },
  });

  // Account and session data
  const { userAccountId } = useAccountIdStore();
  const session: any = useSession();

  // Date calculations
  const today = new Date();
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(today.getMonth() - 1);
  const createdDateFrom = oneMonthAgo.toISOString().split('T')[0];
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const createdDateTo = tomorrow.toISOString().split('T')[0];

  // Parameters for the hook
  const params = {
    AccountId: Number(userAccountId),
    UserId: session?.data?.user?.id || '',
    RoleId: 3,
    CreatedDateFrom: createdDateFrom,
    CreatedDateTo: createdDateTo,
    LocationNodeLevelType: '',
    FollowUpId: Number(followupId),
  };

  // Use the hook
  const { data, isLoading, isError, error, refetch } = useGetFollowUpDetails(params);
  console.log('followUpDetails', data)

  // get inspector Id
  const inspectorId = data?.data?.Inspector?.[0]?.Id

  // remove inspector from  informed parties to get assigned manager
  const assignedManagers = data?.data?.InformedParties?.filter((party:{Id:number, UserId:string, DisplayName:string }) => party?.UserId !== inspectorId)
 
console.log(assignedManagers, 'assigned manageres')

  const handleModalOpen = (file: { URL: string }) => {
    setSelectedImage(file?.URL)
    open();
  }

  // Define assignmentId
  const assignmentId = data?.data?.Assignments?.[0]?.Id || 0;
  

  // Set default values for operator, manager, and dueDate
  useEffect(() => {
    if (data?.data) {
      // Set default operators from Responsibles
      const defaultOperators = data.data.Responsibles?.map((resp: any) => resp.UserId) || [];
      form.setFieldValue('operator', defaultOperators);

      // Set default managers from InformedParties
      const defaultManagers = assignedManagers?.map((manager: any) => manager?.UserId) || [];
      form.setFieldValue('manager', defaultManagers);

      // set Default StatusId
      if (data.data.StatusId) {
        form.setFieldValue('statusId', data.data.StatusId[0].GlobalId.toString());
      }

      // Set default dueDate
      if (data.data.DueDate) {
        form.setFieldValue('dueDate', new Date(data.data.DueDate));
      }

    }
  }, [data, assignmentData]);

  // Handle image deletion
  // const handleImageDelete = (index: number) => {
  //   form.setFieldValue(
  //     'images',
  //     form.values.images.filter((_, i) => i !== index)
  //   );
  // };

  // Handle form submission
  const handleSubmit = (values: typeof form.values) => {
    

    const formValues = {
      Id: data?.data?.FollowUpId || 0,
      AccountId: Number(userAccountId),
      InspectionId: data?.data?.Inspection?.[0]?.Id || 0,
      Responsibles: values.operator.map((userId: string) => ({ UserId: userId })),
      TEGId: data?.data?.TEGId?.[0]?.Id || 0,
      // DueDate: dueDateFormatter(values.dueDate) || '',
      ...(dueDateFormatter(values.dueDate) !== data?.data?.DueDate && { DueDate: dueDateFormatter(values.dueDate) }),
      StatusId: Number(values?.statusId) || 0,
      Notes: values.note ? [{ Id: 0, Text: values.note }] : [],
      CreatedOn: data?.data?.CreateDate || '',
      MediaUrls: values?.incidentImages?.map((item: any) => {
        console.log('Creating MediaUrl for:', item);
        return {
          URL: item,
        };
      }) || [],
      InformedParties: values.manager.map((userId: string) => ({
        UserId: userId,
        DisplayName:
          assignmentData?.Managers?.find((m: any) => m.UserId === userId)?.Name ||
          data?.data?.InformedParties?.find((p: any) => p.UserId === userId)?.DisplayName ||
          '',
      })),
    };

    


    mutate(
      { payload: [formValues] },
      {
        onSuccess: () => {
          notifications.show({
            title: t('notifications.updateSuccessTitle'),
            message: t('notifications.updateSuccessMessage'),
            color: 'green',
            autoClose: 3000,
          });
          form.reset();
          setShowDetails(true);
          setShowImageSection(false)
          refetch();
        },
        onError: (error) => {
          notifications.show({
            title: t('errors.errorPrefix'),
            message: error.message || t('errors.updateFollowupFailed'),
            color: 'red',
            autoClose: 3000,
          });
          console.error('Update error:', error.message);
        },
      }
    );
  };

  // form close and showing save modal function
  const handleFromToggle = ()=>{
    // setShowDetails(true);
    if(showDetails){
      setShowDetails(false)
    } else {
      // setShowDetails(true)
      saveOpen();
    }

  }

  const handleGoBack = ()=>{
    if(!showDetails){
      setIsGoBack(true);
      saveOpen()
    } else {
      router.back()
    }
    
  }

 

  const handleCloseWithoutSaving = ()=>{
  
    if(isGoBack){
      router.back()
    } else{
         setShowDetails(true)
    saveClose()
    }
   
  }

  if (isLoading) {
    return <FollowUpCardSkeleton />;
  }

  if (isError) {
    return <Text>{t('errors.errorPrefix')}: {error?.message || t('errors.fetchFollowupFailed')}</Text>;
  }



  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap={10}>
        <Group justify="space-between">
          {/* back button and left text */}
          <Group gap={10} align="start">
            <ActionIcon
              mt={5}
              variant="default"
              miw={45}
              onClick={handleGoBack}
              role="button"
            >
              <Icon icon="solar:arrow-left-outline" />
            </ActionIcon>
            <Stack gap={2}>
              <Group gap={5} align="center">
                <Text fz={20} fw={500}>
                  {data?.data?.TEGId?.[0]?.Topic || t('messages.noDescriptionAvailable')}
                </Text>
                <Text c="primary">{`#${data?.data?.FollowUpId}`}</Text>
              </Group>
              <Text c="#515151">
                {data?.data?.Inspection?.[0]?.Name || t('messages.noTitleAvailable')}
              </Text>

              <Text c="#515151">
                {data?.data?.Note?.[0]?.Text || t('messages.noNoteAvailable')}
              </Text>
              <Text size="sm" c="dimmed">
                {data?.data?.Location
                  ? (() => {
                      const segments =
                        data.data.Location.split(' --> ').reverse();
                      return (
                        <>
                          <span style={{ fontSize: '16px' }}>
                            {segments[0]}
                          </span>
                          {segments.slice(1).map((segment, index) => (
                            <span key={index}>
                              {index === 0 ? ' , ' : ', '}
                              {segment}
                            </span>
                          ))}
                        </>
                      );
                    })()
                  : t('messages.noIssueAvailable')}
              </Text>
            </Stack>
          </Group>

          {/* Buttons */}
          {role !== 'initiator' && (
            <Group justify="end">
              {/* <Button color="#DC3545" onClick={() => form.reset()}>
                Cancel
              </Button> */}
              <Button
                color="#00A64C"
                disabled={form.values.operator.length === 0}
                loading={isUpdatePending}
                type="submit"
              >
                {t('actions.update')}
              </Button>
            </Group>
          )}
        </Group>

        {/* details and comment card */}
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack>
              <Paper
                p={15}
                styles={{
                  root: {
                    backgroundColor: 'var(--mantine-color-gray-0)',
                  },
                }}
              >
                <Stack>
                  <Group justify="space-between">
                    <Text c="#333333" fw={500}>
                      {t('actions.details')}
                    </Text>
                    {role !== 'initiator' && (
                      <Button
                        variant={showDetails ? 'outline' : 'default'}
                        color={
                          role === 'operator'
                            ? 'var(--mantine-color-gray-7)'
                            : 'var(--mantine-color-red-7)'
                        }
                        // onClick={() => setShowDetails(!showDetails)}
                        onClick={handleFromToggle}
                        leftSection={
                          <Icon
                            icon={
                              showDetails
                                ? role === 'operator'
                                  ? 'lucide:pen-line'
                                  : 'ci:user-add'
                                : 'bx:hide'
                            }
                          />
                        }
                      >
                        {showDetails
                          ? role === 'operator'
                            ? t('actions.updateStatus')
                            : t('actions.assignOperator')
                          : t('actions.view')}
                      </Button>
                    )}
                  </Group>
                  <Text c="#333333" size="sm">
                    {data?.data?.TEGId?.[0]?.Question || t('messages.noIssueAvailable')}
                  </Text>

                  {/* view details section */}
                  {showDetails ? (
                    <>
                      {/* created date */}
                      <Group justify="space-between">
                        <Text c="dimmed" size="sm">
                          {t('labels.dateCreated')}
                        </Text>
                       
                        <Group gap={5}>
                          <Text size='sm'>{formatDatePart(data?.data?.CreateDate)}</Text>
                           <Text size='sm' c='dimmed'>{formatTimePart(data?.data?.CreateDate)}</Text>
                        </Group>
                      </Group>

                      {/* due date */}
                      <Group justify="space-between">
                        <Text c="dimmed" size="sm">
                          {t('labels.dueDate')}
                        </Text>
                        <Group gap={5}>
                          <Text size='sm'>{formatDatePart(data?.data?.DueDate)}</Text>
                           <Text size='sm' c='dimmed'>{formatTimePart(data?.data?.DueDate)}</Text>
                        </Group>
                      </Group>

                      {/* status */}
                      <Group justify="space-between">
                        <Text c="dimmed" size="sm">
                          {t('labels.status')}
                        </Text>
                        <Badge
                          variant="outline"
                          radius="xl"
                          leftSection={<Icon icon="oui:dot" />}
                          color={getFollowUpStatusColor(
                            data?.data?.StatusId?.[0]?.Name || ''
                          )}
                        >
                          {data?.data?.StatusId?.[0]?.Name === 'Closed'
                            ? tDashboard('status.resolved')
                            : data?.data?.StatusId?.[0]?.Name}
                        </Badge>
                      </Group>

                      {/* Operator */}
                      <Group justify="space-between">
                        <Text c="dimmed" size="sm">
                          {t('labels.operators')}
                        </Text>
                        <Group>
                          {
                            data?.data?.Responsibles?.length > 0 ?
                            data?.data?.Responsibles?.map(
                            (operator: any, index: number) => (
                              <Text key={operator?.Id} size="sm">
                                {operator?.DisplayName}{' '}
                                {index === data?.data?.Responsibles?.length - 1
                                  ? ''
                                  : ','}
                              </Text>
                            )
                          )
                            :  <Text size="sm" c='dimmed'>{t('messages.notAssigned')}</Text>
                          }
                          
                        </Group>
                      </Group>

                      {/* Manager */}
                      <Group justify="space-between">
                        <Text c="dimmed" size="sm">
                          {t('labels.managers')}
                        </Text>
                        <Group>
                          {
                            assignedManagers?.length > 0 ? assignedManagers?.map(
                            (manager: any, index: number) => (
                              <Text size="sm" key={index}>
                                {manager?.DisplayName}{' '}
                                {index ===
                                data?.data?.Managers?.length - 1
                                  ? ''
                                  : ','}
                              </Text>
                            )
                          ) : <Text size="sm" c='dimmed'>{t('messages.notAssigned')}</Text>
                          }
                          
                        </Group>
                      </Group>
                    </>
                  ) : (
                    <>
                     <DueDateSelector
                        role={role}
                        followUpStatus={data?.data?.StatusId?.[0]?.Name || ''}
                        form={form}
                      /> 
                      
                      <StatusUpdateComponent form={form} />
                      <OperatorManagerSelection
                        role={role}
                        form={form}
                        assignmentId={assignmentId}
                        onAssignmentLoad={setAssignmentData}
                       
                        managers={data?.data?.Managers}
                      />
                    </>
                  )}
                </Stack>
              </Paper>
              {/* media section */}
              <Paper
                p={15}
                styles={{
                  root: {
                    backgroundColor: 'var(--mantine-color-gray-0)',
                  },
                }}
              >
                <Stack>
                  <Group justify="space-between">
                    <Stack gap={5}>
                      <Text fw={500} fz={18}>
                        {t('labels.media')}
                      </Text>
                      <Text c="dimmed">{t('labels.uploadImage')}</Text>
                    </Stack>
                    {role !== 'initiator' && (
                      <Button
                        variant="default"
                        leftSection={
                          <Icon
                            icon={
                              showImageSection
                                ? 'bx:hide'
                                : 'material-symbols:download'
                            }
                          />
                        }
                        onClick={() => setShowImageSection(!showImageSection)}
                      >
                        {showImageSection ? t('actions.hide') : t('actions.upload')}
                      </Button>
                    )}
                  </Group>
                  {showImageSection && <IncidentImage form={form} />}
                  {data?.data?.MediaUrl?.length > 0 && (
                    <Group mt="md" gap="md">
                      {data?.data?.MediaUrl?.map(
                        (file: { URL: string }, index: number) => (
                          <div
                            key={index}
                            style={{ position: 'relative' }}
                            onClick={() => handleModalOpen(file)}
                            className="cursor-pointer"
                          >
                            <Image
                              className="!border-1 !border-primary-300 "
                              src={file?.URL || ''}
                              alt={`${t('labels.uploadImage')} ${index + 1}`}
                              w={100}
                              h={100}
                              radius="md"
                              fit="cover"
                            />
                          </div>
                        )
                      )}
                    </Group>
                  )}

                  {/* Image Preview Modal */}
                  <Modal
                    opened={opened}
                    onClose={close}
                    className="!bg-transparent"
                    withCloseButton={false}
                    padding={0}
                    centered
                    size="xl"
                  >
                    {/* Modal content */}

                    <ImagePreviewModal
                      close={close}
                      mediaUrl={data?.data?.MediaUrl}
                      selectedImage={selectedImage}
                      setSelectedImage={setSelectedImage}
                    />
                  </Modal>
                </Stack>
              </Paper>

              <Paper></Paper>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack>
              {role !== 'initiator' && (
                <Paper
                  p={15}
                  styles={{
                    root: {
                      backgroundColor: 'var(--mantine-color-gray-0)',
                    },
                  }}
                >
                  <Stack>
                    <Textarea
                      minRows={6}
                      label={t('forms.commentsLabel')}
                      placeholder={t('forms.commentsPlaceholder')}
                      {...form.getInputProps('note')}
                    />
                  </Stack>
                </Paper>
              )}

              {/* Activity Section */}
              <Paper
                p={15}
                styles={{
                  root: {
                    backgroundColor: 'var(--mantine-color-gray-0)',
                  },
                }}
              >
                <ActivityLogSection activities={data?.data?.Activity} />
              </Paper>
            </Stack>
          </Grid.Col>
        </Grid>
        {/* Save Modal */}
      <Modal opened={saveOpened} onClose={saveClose} withCloseButton={false} padding={0} centered>
        <UnsavedChangesModal onCloseWithoutSaving={handleCloseWithoutSaving} onKeepEditing={saveClose} />
      </Modal>
      </Stack>
    </form>
  );
};

export default FollowUpDetailsCard;