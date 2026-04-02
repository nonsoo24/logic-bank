import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { IdentityDocumentFormData } from '../schema';
import { FLOW_STEPS, type FlowStep } from '@/shared/constants';

interface IdentityDocumentState {
  // Flow state
  currentStep: FlowStep;
  hasAcceptedConsent: boolean;
  hasAcceptedTerms: boolean;
  isOtpVerified: boolean;

  // Form data (persisted)
  formData: Partial<IdentityDocumentFormData>;

  // Actions
  setStep: (step: FlowStep) => void;
  acceptConsent: () => void;
  acceptTerms: () => void;
  rejectTerms: () => void;
  setOtpVerified: (verified: boolean) => void;
  updateFormData: (data: Partial<IdentityDocumentFormData>) => void;
  resetFlow: () => void;

  // Computed helpers
  canAccessForm: () => boolean;
  getNextRoute: () => string;
}

const initialState = {
  currentStep: FLOW_STEPS.CONSENT as FlowStep,
  hasAcceptedConsent: false,
  hasAcceptedTerms: false,
  isOtpVerified: false,
  formData: {},
};

export const useIdentityDocumentStore = create<IdentityDocumentState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setStep: (step) => set({ currentStep: step }, false, 'setStep'),

        acceptConsent: () =>
          set(
            {
              hasAcceptedConsent: true,
              currentStep: FLOW_STEPS.VERIFICATION,
              // Reset OTP verification for new flow
              isOtpVerified: false,
            },
            false,
            'acceptConsent'
          ),

        acceptTerms: () => set({ hasAcceptedTerms: true }, false, 'acceptTerms'),

        rejectTerms: () =>
          set(
            {
              hasAcceptedTerms: false,
              // Reset to beginning of flow when terms rejected
              currentStep: FLOW_STEPS.CONSENT,
              hasAcceptedConsent: false,
              isOtpVerified: false,
              formData: {},
            },
            false,
            'rejectTerms'
          ),

        setOtpVerified: (verified) =>
          set(
            {
              isOtpVerified: verified,
              currentStep: verified ? FLOW_STEPS.DOCUMENTS : get().currentStep,
            },
            false,
            'setOtpVerified'
          ),

        updateFormData: (data) =>
          set(
            (state) => ({
              formData: { ...state.formData, ...data },
            }),
            false,
            'updateFormData'
          ),

        resetFlow: () => set(initialState, false, 'resetFlow'),

        canAccessForm: () => {
          const state = get();
          return state.hasAcceptedConsent;
        },

        getNextRoute: () => {
          const state = get();
          if (!state.hasAcceptedConsent) return '/consent';
          return '/identity-document';
        },
      }),
      {
        name: 'identity-document-storage',
        partialize: (state) => ({
          // Only persist these fields
          currentStep: state.currentStep,
          hasAcceptedConsent: state.hasAcceptedConsent,
          hasAcceptedTerms: state.hasAcceptedTerms,
          isOtpVerified: state.isOtpVerified,
          formData: state.formData,
        }),
      }
    ),
    { name: 'IdentityDocumentStore' }
  )
);
