'use client';


import { Card, Stack, Text, Group, Image, Modal, Skeleton, Badge, Button, } from '@mantine/core';

import { useDisclosure } from '@mantine/hooks';
import QRTemplateDeleteModal from './QRTemplateDeleteModal';
import QRCodeTemplate2 from './QRCodeTemplate2';
import { useGetAssignmentDetails } from '../../hooks/useGetAssignmentDetails';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';


export interface QRCodeTemplateItem {
  Id: number;
  AssignmentId: number;
  AccountId: number;
  HeaderText: string;
  FooterText: string;
  HeaderBody: string;
  FooterBody: string;
  HeaderPosition: string;
  FooterPosition: string;
  HeaderAlignment: string;
  FooterAlignment: string;
  LocationNamePosition: string;
  Format: string;
  PaperSize: string;
  Rows: number;
  Columns: number;
  CreatedBy: string;
  CreatedOn: string;
}

interface QRTemplateCardProps {
  template: QRCodeTemplateItem;
}

const QRTemplateCard = ({ template }: QRTemplateCardProps) => {
  // const [isQRTemplateModalOpen, setIsQRTemplateModalOpen] = useState(false);
  const dummyQRCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=sample';
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const { data: assignmentDetails, isLoading } = useGetAssignmentDetails({
    accountId: template?.AccountId,
    id: template?.AssignmentId,

  })
  const t = useTranslations('LocationManagement');
  return (
    <>
      <Card withBorder shadow="sm" p={0} mih={350}>
        {/* top header */}
        <Stack bg="#F6F8FA" p={10} gap={10} className='!border-b-1 border-gray-200'>
          {/* icons and assignment title */}
          <Group justify="space-between" wrap="nowrap">
            {/* left section */}
            <Group gap={5} className="flex-1 min-w-0">
              <Icon
                icon="famicons:qr-code"
                className="flex-shrink-0 text-gray-400"

              />
              {
                isLoading ?
                  <Skeleton height={25} w="70%" />
                  : <Text c="dimmed" size='sm' fw={500} className="truncate flex-1">
                    {assignmentDetails?.data?.Name}
                  </Text>
              }

            </Group>
            {/* right section */}
            <Group gap={5} className="flex-shrink-0">

              <Button c="var(--mantine-color-red-7)" variant="default" onClick={openDelete}>{t('actions.delete')}</Button>
              <Button c="primary" variant="default" onClick={openEdit}>{t('actions.edit')}</Button>


            </Group>
          </Group>
          {/* badges */}
          <Group justify="center">
            <Badge radius="lg" size="xs" variant="default" c="dimmed" fz={10}>
              {t('qrTemplate.form.formatLabel')}: {template?.Format}
            </Badge>
            <Badge radius="lg" size="xs" variant="default" c="dimmed" fz={10}>
              {t('qrTemplate.form.paperSizeLabel')}: {template?.PaperSize}
            </Badge>
            <Badge radius="lg" size="xs" variant="default" c="dimmed" fz={10}>
              {t('qrTemplate.form.rowsLabel')}: {template?.Rows}
            </Badge>
            <Badge radius="lg" size="xs" variant="default" c="dimmed" fz={10}>
              {t('qrTemplate.form.columnsLabel')}: {template?.Columns}
            </Badge>
          </Group>
        </Stack>
        <Group justify="space-between">

        </Group>
        {/* top right icons */}

        <Stack gap="md" align="center" p={15}>
          {/* Header */}
          <Stack gap="xs" w="100%" pt={15}>
            <Text
              size="lg"
              fw={700}
              c="#1f2937"
              style={{
                textAlign: template.HeaderAlignment as
                  | 'left'
                  | 'center'
                  | 'right',
              }}
            >
              {template.HeaderText}
            </Text>
            {template.HeaderBody && (
              <Text
                size="sm"
                c="#4b5563"
                style={{
                  textAlign: template.HeaderAlignment as
                    | 'left'
                    | 'center'
                    | 'right',
                }}
              >
                {template.HeaderBody}
              </Text>
            )}
          </Stack>

          {/* QR Code */}
          <Image src={dummyQRCodeUrl} alt={t('qrTemplate.alt.qrCode')} w={60} />

          {/* Footer */}
          <Stack gap="xs" w="100%">
            <Text
              size="sm"
              fw={600}
              c="#374151"
              style={{
                textAlign: template.FooterAlignment as
                  | 'left'
                  | 'center'
                  | 'right',
              }}
            >
              {template.FooterText}
            </Text>
            {template.FooterBody ? (
              <Text
                size="xs"
                c="#6b7280"
                style={{
                  textAlign: template.FooterAlignment as
                    | 'left'
                    | 'center'
                    | 'right',
                }}
              >
                {template.FooterBody}
              </Text>
            ) : (
              <Text
                size="xs"
                c="#6b7280"
                style={{
                  textAlign: template.FooterAlignment as
                    | 'left'
                    | 'center'
                    | 'right',
                }}
              >
                {t('labels.notAvailable')}
              </Text>
            )}
          </Stack>

        </Stack>
      </Card>

      {/* delete modal  */}
      <Modal
        opened={deleteOpened}
        onClose={closeDelete}
        withCloseButton={false}
        padding={0}
        centered
      >
        {/* Modal content */}
        <QRTemplateDeleteModal templateId={template?.Id} close={closeDelete} />
      </Modal>

      {/* edit modal */}

      <Modal
        opened={editOpened}
        onClose={closeEdit}
        withCloseButton={false}
        padding={0}
        centered
        size="xxl"
      >
        <QRCodeTemplate2
          isEdit={true}
          qrCodeUrl="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=sample"
          locationName="Sample Location"
          level="Campus"
          allowEditTitle={true}
          showControls={true}
          defaultValues={template}
          onDownload={() => {
            closeEdit();
          }}
        />
      </Modal>
    </>
  );
};

export default QRTemplateCard;