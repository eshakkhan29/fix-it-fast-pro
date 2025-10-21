import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getAccountID } from './getAccountID';

interface AccountIdState {
  userAccountId: string | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  role: any;
}

interface AccountIdActions {
  initializeAccountId: (userId: string) => Promise<void>;
  setUserAccountId: (accountId: number) => void;
  clearAccountId: () => void;
  setRole: (role: any) => void;
}

type AccountIdStore = AccountIdState & AccountIdActions;

export const useAccountIdStore = create<AccountIdStore>()(
  persist(
    (set, get) => ({
      // State
      userAccountId: null,
      isLoading: false,
      error: null,
      isInitialized: false,
      role: null,

      // Actions
      initializeAccountId: async (userId: string) => {
        const { isInitialized, userAccountId } = get();

        // Skip if already initialized and has account ID
        if (isInitialized && userAccountId) {
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await getAccountID(
            `/clientaccounts/GetUserAccountsByUserId?userId=${userId}`
          );

          const accountId = response?.[0]?.Id;

          set({
            userAccountId: accountId,
            isLoading: false,
            error: null,
            isInitialized: true,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error:
              error.response?.data?.message ||
              error.message ||
              'Failed to fetch account ID',
            isInitialized: true,
          });
        }
      },

      setUserAccountId: (accountId: number) =>
        set({ userAccountId: accountId.toString(), error: null }),

      setRole: (role: any) => set({ role: role }),

      clearAccountId: () =>
        set({ userAccountId: null, error: null, isInitialized: false }),
    }),

    {
      name: 'account-id-storage',
      partialize: (state) => ({
        userAccountId: state.userAccountId,
        isInitialized: state.isInitialized,
        role: state.role,
      }),
    }
  )
);
