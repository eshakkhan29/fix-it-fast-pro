'use client';
import { useAccountIdInitializer } from '@/hooks/useAccountIdInitializer';
import { Icon } from '@iconify/react';
import { Button, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Cookies from 'js-cookie';
import { signOut, useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const publicRoutes = [
  '/',
  '/login',
  '/create-incident',
  '/how-fixit-fast-works',
];

function AccountIdProvider({ children }: { children: React.ReactNode }) {
  useAccountIdInitializer();
  const router = useRouter()
  const [isOpen, { open, close }] = useDisclosure(false)
  const session: any = useSession()
  const pathname = usePathname();



  const issuedTime = new Date(session.data?.issued
    || '').getTime();
  const expiresAt = issuedTime + (session.data?.expiresIn || 0) * 1000;
  const now = Date.now();
  const isTokenExpired = now >= expiresAt;

  const logoutProcess = async () => {
    // Small delay to show animation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Clear cookies
    Cookies.remove('fifRoleId', { path: '/' });
    Cookies.remove('fifRoleName', { path: '/' });

    // Sign out
    await signOut({ redirect: false });

    // Redirect
    router.replace('/');
  };



  useEffect(() => {
    if (isTokenExpired && !publicRoutes.includes(pathname)) {
      open()
    }
  }, [session.status, open, pathname, isTokenExpired])

  return <>{children}
    {/* session expired modal open */}
    <Modal
      opened={isOpen}
      onClose={close}
      title={<Text c={"error.3"} fw={600} fz={18} >Session Expired</Text>}
      centered
      withOverlay={true}
      closeOnClickOutside={false}
      withCloseButton={false}
      overlayProps={{
        blur: 5,
      }}
    >
      <div className='flex items-center justify-center flex-col gap-4'>
        <Icon icon="tabler:alert-circle" color="#DF1C41" width={100} />
        <Text c={"error.3"} fw={600} fz={18} ta="center" >Your session has expired. Please Login again.</Text>
        <Button variant='default' color={"primary.1"} onClick={async () => {
          await logoutProcess()
          close()
        }} fw={600} fz={18} >Ok</Button>
      </div>
    </Modal>
  </>;
}

export default AccountIdProvider;
