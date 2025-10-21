'use client';

import React, { useEffect } from 'react';
import {
  Box,
  Text,
  TextInput,
  Paper,
  Group,
  Stack,
  Select,
  Textarea,
 
  Button,
  Title,
  Grid,
  SimpleGrid,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { yupResolver } from 'mantine-form-yup-resolver';
import * as Yup from 'yup';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useGetAssignmentsList } from '@/app/evaluator/hooks/useGetAssignmentList';
import { useAccountIdStore } from '@/stores/user/accountId-store';
import { useSession } from 'next-auth/react';
import { useAddQRTemplate } from '../../hooks/QRTemplate/useAddQRtemplate';
import { notifications } from '@mantine/notifications';
import { QRCodeTemplateItem } from './QRTemplateCard';
import { useUpdateQRTemplate } from '../../hooks/QRTemplate/useUpdateQRTemplate';

interface QRCodeTemplateProps {
  qrCodeTemplates?: QRCodeTemplateItem[];
  isEdit: boolean;
  defaultValues?: QRCodeTemplateItem;
  qrCodeUrl: string;
  locationName: string;
  level: string;
  onLocationNameChange?: (name: string) => void;
  onDownload?: () => void;
  allowEditTitle?: boolean;
  showControls?: boolean;
  fitToCell?: boolean;
  initialHeaderText?: string;
  initialFooterText?: string;
  initialHeaderBody?: string;
  initialFooterBody?: string;
  initialHeaderAlignment?: 'left' | 'center' | 'right';
  initialFooterAlignment?: 'left' | 'center' | 'right';
  initialHeaderPosition?: 'top' | 'bottom';
  initialFooterPosition?: 'top' | 'bottom';
  initialLocationNamePosition?: 'top' | 'bottom';
}

// Yup validation schema factory for localized messages
const makeValidationSchema = (t: any) =>
  Yup.object().shape({
    assignmentId: Yup.string()
      .required(t('qrTemplate.validation.assignmentRequired'))
      .test('not-empty', t('qrTemplate.validation.assignmentRequired'), (value) => value !== ''),
    format: Yup.string()
      .required(t('qrTemplate.validation.formatRequired'))
      .oneOf(['pdf', 'png', 'jpg'], t('qrTemplate.validation.formatInvalid')),
    paperSize: Yup.string()
      .required(t('qrTemplate.validation.paperSizeRequired'))
      .oneOf(['a4', 'letter', 'legal', 'a3'], t('qrTemplate.validation.paperSizeInvalid')),
    rows: Yup.string()
      .required(t('qrTemplate.validation.rowsRequired'))
      .test('not-empty', t('qrTemplate.validation.rowsRequired'), (value) => value !== ''),
    columns: Yup.string()
      .required(t('qrTemplate.validation.columnsRequired'))
      .test('not-empty', t('qrTemplate.validation.columnsRequired'), (value) => value !== ''),
  });

const QRCodeTemplate2: React.FC<QRCodeTemplateProps> = ({
  qrCodeTemplates,
  isEdit = false,
  defaultValues,
  qrCodeUrl,
  locationName,
  level,
  onDownload,
  showControls = true,
  fitToCell = false,
  initialHeaderText,
  initialFooterText,
  initialHeaderBody,
  initialFooterBody,
  initialHeaderAlignment,
  initialFooterAlignment,
  initialHeaderPosition,
  initialFooterPosition,
  initialLocationNamePosition,
}) => {
  const { userAccountId } = useAccountIdStore();
  const accountId = Number(userAccountId);
  const { data: assignmentList } = useGetAssignmentsList({ accountId });
  const session = useSession();

  const t = useTranslations('LocationManagement');

  const { mutate, isPending: isLoadingAddQRTemplate } = useAddQRTemplate({
    onSuccess: () => {
      notifications.show({
        title: t('qrTemplate.notifications.success.title'),
        message: t('qrTemplate.notifications.success.created'),
        color: 'green',
        autoClose: 3000,
      });
      onDownload?.();
    },
    onError: (err) => {
      console.error('Error adding QR code:', err.message);
      notifications.show({
        title: t('qrTemplate.notifications.error.title'),
        message: t('qrTemplate.notifications.error.createFailed'),
        color: 'red',
        autoClose: 3000,
      });
    },
  });

  const { mutate: updateQRTemplate, isPending: isLoadingUpdateQRTemplate } = useUpdateQRTemplate({
    onSuccess: () => {
      notifications.show({
        title: t('qrTemplate.notifications.success.title'),
        message: t('qrTemplate.notifications.success.updated'),
        color: 'green',
        autoClose: 3000,
      });
      onDownload?.();
    },
    onError: (err) => {
      console.error('Error updating QR code:', err.message);
      notifications.show({
        title: t('qrTemplate.notifications.error.title'),
        message: t('qrTemplate.notifications.error.updateFailed'),
        color: 'red',
        autoClose: 3000,
      });
    },
  });

  const assignmentSelectData = assignmentList?.map((item) => ({
    value: item?.Id.toString(),
    label: item?.Name,
  })) || [];

  const form = useForm({
    initialValues: {
      id: 0,
      createdBy: '',
      assignmentId: '',
      headerText: initialHeaderText ?? t('qrTemplate.defaults.headerText', { level }),
      footerText: initialFooterText ?? t('qrTemplate.defaults.footerText'),
      headerBody: initialHeaderBody ?? '',
      footerBody: initialFooterBody ?? '',
      headerPosition: initialHeaderPosition ?? 'top',
      footerPosition: initialFooterPosition ?? 'bottom',
      headerAlignment: initialHeaderAlignment ?? 'center',
      footerAlignment: initialFooterAlignment ?? 'center',
      locationNamePosition: initialLocationNamePosition ?? 'bottom',
      format: 'pdf',
      paperSize: 'a4',
      rows: '2',
      columns: '3',
    },
    validate: yupResolver(makeValidationSchema(t)),
  });

  // Set form values from defaultValues when available
  useEffect(() => {
    if (defaultValues) {
      form.setValues({
        id: defaultValues?.Id || 0,
        createdBy: defaultValues?.CreatedBy || '',
        assignmentId: defaultValues.AssignmentId.toString(),
        headerText: defaultValues.HeaderText,
        footerText: defaultValues.FooterText,
        headerBody: defaultValues.HeaderBody,
        footerBody: defaultValues.FooterBody,
        headerPosition: defaultValues.HeaderPosition === 'top' || defaultValues.HeaderPosition === 'bottom' ? defaultValues.HeaderPosition : 'top',
        footerPosition: defaultValues.FooterPosition === 'top' || defaultValues.FooterPosition === 'bottom' ? defaultValues.FooterPosition : 'bottom',
        headerAlignment: defaultValues.HeaderAlignment === 'left' || defaultValues.HeaderAlignment === 'center' || defaultValues.HeaderAlignment === 'right' ? defaultValues.HeaderAlignment : 'center',
        footerAlignment: defaultValues.FooterAlignment === 'left' || defaultValues.FooterAlignment === 'center' || defaultValues.FooterAlignment === 'right' ? defaultValues.FooterAlignment : 'center',
        locationNamePosition: defaultValues.LocationNamePosition === 'top' || defaultValues.LocationNamePosition === 'bottom' ? defaultValues.LocationNamePosition : 'bottom',
        format: defaultValues.Format,
        paperSize: defaultValues.PaperSize,
        rows: defaultValues.Rows.toString(),
        columns: defaultValues.Columns.toString(),
      });
    }
  }, [defaultValues]);

  const handleSaveTemplate = () => {
    // Validate the form before proceeding
    const validation = form.validate();
    
    if (validation.hasErrors) {
      notifications.show({
        title: t('qrTemplate.notifications.validation.title'),
        message: t('qrTemplate.notifications.validation.requiredFields'),
        color: 'red',
        autoClose: 3000,
      });
      return;
    }

    const payload = {
      id: isEdit ? Number(form.values.id) : 0,
      assignmentId: Number(form.values.assignmentId),
      accountId: accountId,
      headerText: form.values.headerText,
      footerText: form.values.footerText,
      headerBody: form.values.headerBody,
      footerBody: form.values.footerBody,
      headerPosition: form.values.headerPosition,
      footerPosition: form.values.footerPosition,
      headerAlignment: form.values.headerAlignment,
      footerAlignment: form.values.footerAlignment,
      locationNamePosition: form.values.locationNamePosition,
      format: form.values.format,
      paperSize: form.values.paperSize,
      rows: Number(form.values.rows),
      columns: Number(form.values.columns),
      createdBy: isEdit ? form.values.createdBy : session?.data?.user?.name || '',
    };

    if (isEdit && defaultValues) {
      updateQRTemplate({ id: Number(form.values.id), body: payload });
    } else {
      const hasQRTemplate = qrCodeTemplates?.some((item) => item?.AssignmentId === Number(form.values.assignmentId));
      if (hasQRTemplate) {
        notifications.show({
          title: t('qrTemplate.notifications.error.title'),
          message: t('qrTemplate.notifications.error.duplicate'),
          color: 'red',
          autoClose: 3000,
        });
        return;
      }

      mutate(payload);
    }
  };

  const renderHeader = () => (
    <Box style={{ width: '100%', padding: '8px' }}>
      <Text
        size="lg"
        fw={700}
        c="#1f2937"
        style={{
          lineHeight: 1.2,
          textAlign: form.values.headerAlignment,
          width: '100%',
        }}
      >
        {form.values.headerText}
      </Text>
      {form.values.headerBody && (
        <Text
          size="sm"
          c="#4b5563"
          mt={4}
          style={{
            lineHeight: 1.5,
            textAlign: form.values.headerAlignment,
            width: '100%',
          }}
        >
          {form.values.headerBody}
        </Text>
      )}
    </Box>
  );

  const renderFooter = () => (
    <Box style={{ width: '100%', padding: '8px' }}>
      <Text
        size="sm"
        fw={600}
        c="#374151"
        style={{
          lineHeight: 1.4,
          textAlign: form.values.footerAlignment,
          width: '100%',
        }}
      >
        {form.values.footerText}
      </Text>
      {form.values.footerBody && (
        <Text
          size="xs"
          c="#6b7280"
          mt={4}
          style={{
            lineHeight: 1.5,
            textAlign: form.values.footerAlignment,
            width: '100%',
          }}
        >
          {form.values.footerBody}
        </Text>
      )}
    </Box>
  );

  const renderQRSection = () => (
    <Box style={{ textAlign: 'center', padding: '16px' }}>
      <Stack align="center" gap="md">
        {form.values.locationNamePosition === 'top' && (
          <Text size="md" fw="500" c="dark">
            {locationName}
          </Text>
        )}

        {qrCodeUrl && (
          <Image
            src={qrCodeUrl}
            alt={t('qrTemplate.alt.qrCodeFor', { name: locationName })}
            style={{
              maxWidth: fitToCell ? '160px' : '200px',
              width: '100%',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
            width={500}
            height={500}
          />
        )}

        {form.values.locationNamePosition === 'bottom' && (
          <Text size="md" fw="500" c="dark">
            {locationName}
          </Text>
        )}
      </Stack>
    </Box>
  );

  const renderTemplate = () => {
    const sections = [];

    if (form.values.headerPosition === 'top') {
      sections.push({ key: 'header', component: renderHeader() });
    }

    sections.push({ key: 'qr', component: renderQRSection() });

    if (form.values.footerPosition === 'bottom') {
      sections.push({ key: 'footer', component: renderFooter() });
    }

    if (form.values.headerPosition === 'bottom') {
      sections.push({ key: 'header', component: renderHeader() });
    }

    if (form.values.footerPosition === 'top') {
      sections.push({ key: 'footer', component: renderFooter() });
    }

    return sections;
  };

  return (
    <Box p={0} className="overflow-hidden">
     

     
      {/* QR Code Template Preview */}
      <Grid >
        <Grid.Col
        p={0}
        // className='!border-r-1 !border-gray-300'
        
          span={{
            base: 12,
            md: 7,
          }}
         

        >
            <Box pt={16} px={25} pb={32} className='!border-b-1 !border-r-1 !border-gray-300' >
            <Title order={4} c="dark.8">
              {t('qrTemplate.titles.templateFor', { name: locationName })}
            </Title>
            <Text size="sm" c="dimmed" mt={4}>
              {t('qrTemplate.descriptions.subtitle')}
            </Text>
          </Box>
          
          {showControls && (
            <Stack gap="md" p={24} className=' border-r-1 !border-gray-300'>
              <SimpleGrid cols={{ base: 2, md: 4 }}>
                <Select
                  label={t('qrTemplate.form.formatLabel')}
                  placeholder={t('qrTemplate.form.selectFormatPlaceholder')}
                  withAsterisk
                  {...form.getInputProps('format')}
                  data={[
                    { value: 'pdf', label: t('qrTemplate.options.format.pdf') },
                    { value: 'png', label: t('qrTemplate.options.format.png') },
                    { value: 'jpg', label: t('qrTemplate.options.format.jpg') },
                  ]}
                />
                <Select
                  label={t('qrTemplate.form.paperSizeLabel')}
                  placeholder={t('qrTemplate.form.selectPaperSizePlaceholder')}
                  withAsterisk
                  {...form.getInputProps('paperSize')}
                  data={[
                    { value: 'a4', label: t('qrTemplate.options.paperSize.a4') },
                    { value: 'letter', label: t('qrTemplate.options.paperSize.letter') },
                    { value: 'legal', label: t('qrTemplate.options.paperSize.legal') },
                    { value: 'a3', label: t('qrTemplate.options.paperSize.a3') },
                  ]}
                />
                <Select
                  label={t('qrTemplate.form.rowsLabel')}
                  placeholder={t('qrTemplate.form.selectRowsPlaceholder')}
                  withAsterisk
                  {...form.getInputProps('rows')}
                  data={[
                    { value: '1', label: t('qrTemplate.options.rows', { count: 1 }) },
                    { value: '2', label: t('qrTemplate.options.rows', { count: 2 }) },
                    { value: '3', label: t('qrTemplate.options.rows', { count: 3 }) },
                    { value: '4', label: t('qrTemplate.options.rows', { count: 4 }) },
                    { value: '5', label: t('qrTemplate.options.rows', { count: 5 }) },
                  ]}
                />
                <Select
                  w={'100%'}
                  label={t('qrTemplate.form.columnsLabel')}
                  placeholder={t('qrTemplate.form.selectColumnsPlaceholder')}
                  withAsterisk
                  {...form.getInputProps('columns')}
                  data={[
                    { value: '1', label: t('qrTemplate.options.columns', { count: 1 }) },
                    { value: '2', label: t('qrTemplate.options.columns', { count: 2 }) },
                    { value: '3', label: t('qrTemplate.options.columns', { count: 3 }) },
                    { value: '4', label: t('qrTemplate.options.columns', { count: 4 }) },
                    { value: '5', label: t('qrTemplate.options.columns', { count: 5 }) },
                  ]}
                />
              </SimpleGrid>

              {/* Assignment selection */}

              <SimpleGrid cols={{ base: 1, md: 2 }}>
                <Select
                  w={'100%'}
                  label={t('labels.selectAssignment')}
                  placeholder={t('filters.selectAssignmentPlaceholder')}
                  withAsterisk
                  searchable
                  {...form.getInputProps('assignmentId')}
                  data={assignmentSelectData || []}
                />
                <Select
                  label={t('qrTemplate.form.locationTitlePositionLabel')}
                  {...form.getInputProps('locationNamePosition')}
                  data={[
                    { value: 'top', label: t('qrTemplate.options.locationTitlePosition.top') },
                    { value: 'bottom', label: t('qrTemplate.options.locationTitlePosition.bottom') },
                  ]}
                />
              </SimpleGrid>

              <Group grow></Group>

              <SimpleGrid cols={{ base: 1, md: 2 }}>
                <TextInput
                  label={t('qrTemplate.form.headerTitleLabel')}
                  {...form.getInputProps('headerText')}
                  placeholder={t('qrTemplate.form.headerTitlePlaceholder')}
                />
                <TextInput
                  label={t('qrTemplate.form.footerTitleLabel')}
                  {...form.getInputProps('footerText')}
                  placeholder={t('qrTemplate.form.footerTitlePlaceholder')}
                />
              </SimpleGrid>
              <SimpleGrid cols={{ base: 1, md: 2 }}>
                <Select
                  label={t('qrTemplate.form.headerAlignmentLabel')}
                  {...form.getInputProps('headerAlignment')}
                  data={[
                    { value: 'left', label: t('qrTemplate.options.alignment.left') },
                    { value: 'center', label: t('qrTemplate.options.alignment.center') },
                    { value: 'right', label: t('qrTemplate.options.alignment.right') },
                  ]}
                />
                <Select
                  label={t('qrTemplate.form.footerAlignmentLabel')}
                  {...form.getInputProps('footerAlignment')}
                  data={[
                    { value: 'left', label: t('qrTemplate.options.alignment.left') },
                    { value: 'center', label: t('qrTemplate.options.alignment.center') },
                    { value: 'right', label: t('qrTemplate.options.alignment.right') },
                  ]}
                />
              </SimpleGrid>

              <Group grow></Group>

              <Group grow>
                <Textarea
                  label={t('qrTemplate.form.headerBodyLabel')}
                  {...form.getInputProps('headerBody')}
                  placeholder={t('qrTemplate.form.headerBodyPlaceholder')}
                  autosize
                  minRows={2}
                />
              </Group>
              

              <Group grow></Group>

              <Group grow>
                <Textarea
                  label={t('qrTemplate.form.footerBodyLabel')}
                  {...form.getInputProps('footerBody')}
                  placeholder={t('qrTemplate.form.footerBodyPlaceholder')}
                  autosize
                  minRows={2}
                />
              </Group>
              <Group grow></Group>
            </Stack>
          )}
        </Grid.Col>

      

        {/* QR Code Template Preview */}
        <Grid.Col
        p={0}
        // bg="red"
          span={{
            base: 12,
            md: 5,
          }}
        >
          
           <Box pt={16}  pb={32} px={25}  className='!border-b-1  !border-gray-300'>
            <Title order={4} c="dark.8">
              {t('qrTemplate.titles.preview')}
            </Title>
            <Text size="sm" c="dimmed" mt={4}>
              {t('qrTemplate.descriptions.preview')}
            </Text>
          </Box>
          <Paper h={'100%'} unstyled p={15} >
            <Stack justify="center" h={'90%'} gap="xs" >
              {renderTemplate().map(({ key, component }) => (
                <Box key={key} style={{ width: '100%' }}>
                  {component}
                </Box>
              ))}
               <Group justify="center" m={20}  >
              <Button
                
                loading={
                  isEdit ? isLoadingUpdateQRTemplate : isLoadingAddQRTemplate
                }
                onClick={handleSaveTemplate}
                size="md"
                variant="outline"
              >
                {isEdit ? t('qrTemplate.actions.updateTemplate') : t('qrTemplate.actions.saveTemplate')}
              </Button>
            </Group>
            </Stack>
            <Group justify="center" mb={20}  >
              <Button
                
                loading={
                  isEdit ? isLoadingUpdateQRTemplate : isLoadingAddQRTemplate
                }
                onClick={handleSaveTemplate}
                size="md"
                variant="outline"
              >
                {isEdit ? t('qrTemplate.actions.updateTemplate') : t('qrTemplate.actions.saveTemplate')}
              </Button>
            </Group>
          </Paper>
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default QRCodeTemplate2;