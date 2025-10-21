'use client';
import { QRScanner } from '@/components/QRScanner';
import { BASE_URL } from '@/constants';
import { Button, Group } from '@mantine/core';
import { IconHistory, IconPlus, IconQrcode } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function BannerButtons() {
  const t = useTranslations('HomePage.action');
  const session = useSession();
  const router = useRouter();
  const [showQRScanner, setShowQRScanner] = useState(false);

  const handleScanQRCode = () => {
    setShowQRScanner(true);
  };

  const handleCloseQRScanner = () => {
    setShowQRScanner(false);
  };

  return (
    <>
      <Group gap="md" justify="center">
        <Button
          onClick={handleScanQRCode}
          size="md"
          leftSection={<IconQrcode size={20} />}
          variant="filled"
          color="primary"
          radius="md"
        >
          {t('scanQRCode')}
        </Button>
        {session?.status === 'authenticated' && (
          <>
            <Button
              onClick={() => router.push('/initiator/initiate-history')}
              size="md"
              leftSection={<IconHistory size={20} />}
              variant="filled"
              color="secondary"
              radius="md"
              className="!bg-secondary-500 !text-white"
            >
              {t('initiateHistory')}
            </Button>

            <Button
              onClick={() => router.push('/create-incident?manual=true')}
              size="md"
              leftSection={<IconPlus size={20} />}
              variant="filled"
              color="secondary"
              radius="md"
              className="!bg-secondary-500 !text-white"
            >
              {t('createTicket')}
            </Button>
          </>
        )}
      </Group>

      {showQRScanner && (
        <QRScanner baseUrl={BASE_URL} onClose={handleCloseQRScanner} />
      )}
    </>
  );
}

export default BannerButtons;
