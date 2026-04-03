import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateDocuments, submitIdentityUpdate } from '../services/mockApi';
import type { IdentityDocumentFormData } from '../schema';
import { useModalStore } from '@/shared/store';
import { ROUTES, FLOW_STEPS, type FlowStep } from '@/shared/constants';
import type { UseFormTrigger } from 'react-hook-form';

interface UseFormSubmissionOptions {
  setStep: (step: FlowStep) => void;
  resetFlow: () => void;
  clearFiles: () => void;
  showProceedModal: () => void;
  hideProceedModal: () => void;
}

interface UseFormSubmissionReturn {
  isUpdating: boolean;
  handleUpdateClick: (trigger: UseFormTrigger<IdentityDocumentFormData>) => Promise<void>;
  handleCompleteNow: () => void;
  onSubmit: (data: IdentityDocumentFormData) => Promise<void>;
}

const isAbortError = (err: unknown): boolean =>
  err instanceof DOMException && err.name === 'AbortError';

export function useFormSubmission({
  setStep,
  resetFlow,
  clearFiles,
  showProceedModal,
  hideProceedModal,
}: UseFormSubmissionOptions): UseFormSubmissionReturn {
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const isSubmittingRef = useRef(false);

  const { openModal, closeModal } = useModalStore();

  // Handle Update button click - validate and show proceed modal
  const handleUpdateClick = useCallback(
    async (trigger: UseFormTrigger<IdentityDocumentFormData>) => {
      if (isUpdating || isSubmittingRef.current) return;

      const isValid = await trigger([
        'nin',
        'documentType',
        'documentNumber',
        'documentFront',
        'documentBack',
        'acceptTerms',
      ]);

      if (isValid) {
        isSubmittingRef.current = true;
        setIsUpdating(true);

        try {
          const response = await validateDocuments();

          if (response.success) {
            showProceedModal();
          } else {
            openModal({
              variant: 'error',
              title: 'Validation Failed',
              description: response.error || 'Document validation failed. Please try again.',
              primaryLabel: 'Close',
              onPrimary: closeModal,
            });
          }
        } catch (err) {
          openModal({
            variant: 'error',
            title: 'Validation Failed',
            description: isAbortError(err)
              ? 'Request was cancelled.'
              : 'Network error. Please check your connection and try again.',
            primaryLabel: 'Close',
            onPrimary: closeModal,
          });
        } finally {
          setIsUpdating(false);
          isSubmittingRef.current = false;
        }
      }
    },
    [isUpdating, showProceedModal, openModal, closeModal]
  );

  // Handle Complete now - go to outstanding info step
  const handleCompleteNow = useCallback(() => {
    hideProceedModal();
    setStep(FLOW_STEPS.OUTSTANDING);
  }, [hideProceedModal, setStep]);

  const onSubmit = useCallback(
    async (data: IdentityDocumentFormData) => {
      if (isUpdating || isSubmittingRef.current) return;

      isSubmittingRef.current = true;
      setIsUpdating(true);

      try {
        const response = await submitIdentityUpdate(data);

        if (response.success) {
          openModal({
            variant: 'success',
            title: 'Submission successful',
            description: 'Your update request is in progress. It will be treated within 24 hours',
            primaryLabel: 'Home',
            secondaryLabel: 'Close',
            onPrimary: () => {
              closeModal();
              navigate(ROUTES.HOME, { replace: true });
              // Delay cleanup to allow navigation to complete before resetting
              setTimeout(() => {
                resetFlow();
                clearFiles();
              }, 100);
            },
            onSecondary: () => {
              closeModal();
              navigate(ROUTES.HOME, { replace: true });
              setTimeout(() => {
                resetFlow();
                clearFiles();
              }, 100);
            },
          });
        } else {
          openModal({
            variant: 'error',
            title: 'Update request failed',
            description:
              response.error || 'Your update request failed. Kindly visit the nearest branch',
            primaryLabel: 'Retry',
            secondaryLabel: 'Close',
            onPrimary: () => {
              closeModal();
              // Will need to re-trigger submit from parent
            },
            onSecondary: closeModal,
          });
        }
      } catch (err) {
        openModal({
          variant: 'error',
          title: 'Update request failed',
          description: isAbortError(err)
            ? 'Request was cancelled.'
            : 'Network error. Please check your connection and try again.',
          primaryLabel: 'Home',
          secondaryLabel: 'Close',
          onPrimary: () => {
            closeModal();
            setTimeout(() => {
              resetFlow();
              clearFiles();
            }, 0);
            navigate(ROUTES.HOME, { replace: true });
          },
          onSecondary: closeModal,
        });
      } finally {
        setIsUpdating(false);
        isSubmittingRef.current = false;
      }
    },
    [isUpdating, openModal, closeModal, resetFlow, clearFiles, navigate]
  );

  return {
    isUpdating,
    handleUpdateClick,
    handleCompleteNow,
    onSubmit,
  };
}
