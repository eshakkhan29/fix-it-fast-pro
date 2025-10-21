import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAccountIdStore } from '@/stores/user/accountId-store';

export function useAccountIdInitializer() {
  const session = useSession();
  const { initializeAccountId, isInitialized, userAccountId, clearAccountId } =
    useAccountIdStore();

  useEffect(() => {
    // if not authenticated then clear the accountId
    if (session.status === 'unauthenticated') {
      clearAccountId();
    }

    // Only initialize when session is loaded and we have a user and not userAccountId have
    if (!userAccountId && session.status === 'authenticated') {
      initializeAccountId((session.data?.user as any).id);
    }
  }, [
    session.status,
    session.data?.user,
    isInitialized,
    userAccountId,
    initializeAccountId,
    clearAccountId,
  ]);

  return {
    isSessionLoading: session.status === 'loading',
    isAuthenticated: session.status === 'authenticated',
    session,
  };
}
