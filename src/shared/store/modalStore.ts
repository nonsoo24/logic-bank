import { create } from 'zustand';
import type { ModalVariant } from '@/shared/components';

interface ModalState {
  isOpen: boolean;
  variant: ModalVariant;
  title: string;
  description?: string;
  primaryLabel: string;
  secondaryLabel?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
}

interface ModalActions {
  openModal: (config: Omit<ModalState, 'isOpen'>) => void;
  closeModal: () => void;
}

const initialState: ModalState = {
  isOpen: false,
  variant: 'info',
  title: '',
  description: undefined,
  primaryLabel: 'OK',
  secondaryLabel: undefined,
  onPrimary: undefined,
  onSecondary: undefined,
};

export const useModalStore = create<ModalState & ModalActions>()((set) => ({
  ...initialState,

  openModal: (config) => set({ ...config, isOpen: true }),

  closeModal: () => set(initialState),
}));
