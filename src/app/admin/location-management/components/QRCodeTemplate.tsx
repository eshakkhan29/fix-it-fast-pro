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
  Divider,
  Button,
  Title,
  Grid,
  SimpleGrid
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { QRCodeTemplateItem } from '../../hooks/QRTemplate/useGetQRTemplates';

interface QRCodeTemplateProps {
  qrTemplate?: QRCodeTemplateItem;
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

const QRCodeTemplate: React.FC<QRCodeTemplateProps> = ({
  qrTemplate,
  qrCodeUrl,
  locationName,
  level,
  onLocationNameChange,
  onDownload,
  allowEditTitle = true,
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
  initialLocationNamePosition
}) => {
  const t = useTranslations('LocationManagement');
  const form = useForm({
    initialValues: {
      locationName: locationName,
      headerText: initialHeaderText ?? t('qrTemplate.defaults.headerText', { level }),
      footerText: initialFooterText ?? t('qrTemplate.defaults.footerText'),
      headerBody: initialHeaderBody ?? '',
      footerBody: initialFooterBody ?? '',
      headerPosition: initialHeaderPosition ?? 'top' as 'top' | 'bottom',
      footerPosition: initialFooterPosition ?? 'bottom' as 'top' | 'bottom',
      headerAlignment: initialHeaderAlignment ?? 'center' as 'left' | 'center' | 'right',
      footerAlignment: initialFooterAlignment ?? 'center' as 'left' | 'center' | 'right',
      locationNamePosition: initialLocationNamePosition ?? 'bottom' as 'top' | 'bottom',
    },
  });

  // Set form values from qrTemplate when it's available
  useEffect(() => {
    if (qrTemplate) {
      form.setValues({
        locationName: locationName,
        headerText: qrTemplate.HeaderText || t('qrTemplate.defaults.headerText', { level }),
        footerText: qrTemplate.FooterText || t('qrTemplate.defaults.footerText'),
        headerBody: qrTemplate.HeaderBody || '',
        footerBody: qrTemplate.FooterBody || '',
        headerPosition: (qrTemplate.HeaderPosition?.toLowerCase() || 'top') as 'top' | 'bottom',
        footerPosition: (qrTemplate.FooterPosition?.toLowerCase() || 'bottom') as 'top' | 'bottom',
        headerAlignment: (qrTemplate.HeaderAlignment?.toLowerCase() || 'center') as 'left' | 'center' | 'right',
        footerAlignment: (qrTemplate.FooterAlignment?.toLowerCase() || 'center') as 'left' | 'center' | 'right',
        locationNamePosition: (qrTemplate.LocationNamePosition?.toLowerCase() || 'bottom') as 'top' | 'bottom',
      });
    }
  }, [qrTemplate]);

  const handleLocationNameChange = (value: string) => {
    form.setFieldValue('locationName', value);
    onLocationNameChange?.(value);
  };

 

  const renderHeader = () => (
    <Box style={{ textAlign: form.values.headerAlignment, padding: '8px' }}>
      <Text size="lg" fw={700} c="#1f2937" style={{ lineHeight: 1.2 }}>
        {form.values.headerText}
      </Text>
      {form.values.headerBody && (
        <Text size="sm" c="#4b5563" mt={4} style={{ lineHeight: 1.5 }}>
          {form.values.headerBody}
        </Text>
      )}
    </Box>
  );

  const renderFooter = () => (
    <Box style={{ textAlign: form.values.footerAlignment, padding: '8px' }}>
      <Text size="sm" fw={600} c="#374151" style={{ lineHeight: 1.4 }}>
        {form.values.footerText}
      </Text>
      {form.values.footerBody && (
        <Text size="xs" c="#6b7280" mt={4} style={{ lineHeight: 1.5 }}>
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
            {form.values.locationName}
          </Text>
        )}

        {qrCodeUrl && (
          <Image
            src={qrCodeUrl}
            alt={t('qrTemplate.alt.qrCodeFor', { name: form.values.locationName })}
            style={{
              maxWidth: fitToCell ? '160px' : '200px',
              width: '100%',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
            width={500}
            height={500}
          />
        )}

        {form.values.locationNamePosition === 'bottom' && (
          <Text size="md" fw="500" c="dark">
            {form.values.locationName}
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
      <Grid>
        <Grid.Col
          span={{
            base: 12,
            md: 7,
          }}
        >
          <Box pt={16} px={24} pb={32}>
            <Title order={4} c="dark.8">
              {t('qrTemplate.titles.templateFor', { name: locationName })}
            </Title>
            <Text size="sm" c="dimmed" mt={4}>
              {t('qrTemplate.descriptions.subtitle')}
            </Text>
          </Box>
        </Grid.Col>

        <Divider orientation="vertical" />

        <Grid.Col
          span={{
            base: 12,
            md: 4.9,
          }}
        >
          <Box pt={16} px={24} pb={32}>
            <Title order={4} c="dark.8">
              {t('qrTemplate.titles.preview')}
            </Title>
            <Text size="sm" c="dimmed" mt={4}>
              {t('qrTemplate.descriptions.preview')}
            </Text>
          </Box>
        </Grid.Col>
      </Grid>

      <Divider orientation="horizontal" />

      <Grid>
        <Grid.Col
          span={{
            base: 12,
            md: 7,
          }}
        >
          {showControls && (
            <Stack gap="md" p={24}>
              <Group grow>
                <TextInput
                  label={t('qrTemplate.form.locationTitleLabel')}
                  {...form.getInputProps('locationName')}
                  onChange={(e) => handleLocationNameChange(e.target.value)}
                  placeholder={t('qrTemplate.form.locationTitlePlaceholder')}
                  disabled={!allowEditTitle}
                />
              </Group>

              <Group grow>
                <Select
                  label={t('qrTemplate.form.locationTitlePositionLabel')}
                  {...form.getInputProps('locationNamePosition')}
                  data={[
                    { value: 'top', label: t('qrTemplate.options.locationTitlePosition.top') },
                    { value: 'bottom', label: t('qrTemplate.options.locationTitlePosition.bottom') },
                  ]}
                />
              </Group>

               <SimpleGrid cols={{ base: 1, md: 2 }}>
                <Select
                  label="Header Alignment"
                  {...form.getInputProps('headerAlignment')}
                  data={[
                    { value: 'left', label: t('qrTemplate.options.alignment.left') },
                    { value: 'center', label: t('qrTemplate.options.alignment.center') },
                    { value: 'right', label: t('qrTemplate.options.alignment.right') },
                  ]}
                />
                <Select
                  label="Footer Alignment"
                  {...form.getInputProps('footerAlignment')}
                  data={[
                    { value: 'left', label: t('qrTemplate.options.alignment.left') },
                    { value: 'center', label: t('qrTemplate.options.alignment.center') },
                    { value: 'right', label: t('qrTemplate.options.alignment.right') },
                  ]}
                />
              </SimpleGrid>

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

              <Group grow>
                
              </Group>

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
               
              </Group>

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

        <Divider orientation="vertical" />

        <Grid.Col
          span={{
            base: 12,
            md: 4.9,
          }}
        >
          <Paper unstyled p={24}>
            <div data-template-container>
              <Stack gap="xs">
                {renderTemplate().map(({ key, component }) => (
                  <div key={key}>{component}</div>
                ))}
              </Stack>
            </div>
            <Group justify="center" mt="md">
              <Button
                leftSection={<Icon icon="mdi:download" />}
                onClick={onDownload}
                size="md"
                variant="outline"
              >
                {t('qrTemplate.actions.downloadTemplate')}
              </Button>
            </Group>
          </Paper>
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default QRCodeTemplate;