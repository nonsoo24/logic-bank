import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface AccountState {
  accountNumber: string;
  accountName: string;
  phone: string;
  email: string;
  isVerified: boolean;

  // Actions
  setAccountNumber: (accountNumber: string) => void;
  setAccountName: (accountName: string) => void;
  setContactInfo: (phone: string, email: string) => void;
  setVerified: (isVerified: boolean) => void;
  reset: () => void;
}

const initialState = {
  accountNumber: '',
  accountName: '',
  phone: '',
  email: '',
  isVerified: false,
};

export const useAccountStore = create<AccountState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setAccountNumber: (accountNumber) => set({ accountNumber }, false, 'setAccountNumber'),

        setAccountName: (accountName) => set({ accountName }, false, 'setAccountName'),

        setContactInfo: (phone, email) => set({ phone, email }, false, 'setContactInfo'),

        setVerified: (isVerified) => set({ isVerified }, false, 'setVerified'),

        reset: () => set(initialState, false, 'reset'),
      }),
      {
        name: 'account-storage',
      }
    ),
    { name: 'AccountStore' }
  )
);
