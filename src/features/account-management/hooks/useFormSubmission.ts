import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateDocuments, submitIdentityUpdate } from '../services/mockApi';
import type { IdentityDocumentFormData } from '../schema';
import { useModalStore } from '@/shared/store';
import { ROUTES, FLOW_STEPS, type FlowStep } from '@/shared/constants';
import { generateIdempotencyKey } from '@/shared/utils/idempotency';
import type { UseFormTrigger } from 'react-hook-form';

interface UseFormSubmissionOptions {
  setStep: (step: FlowStep) => void;
  resetFlow: () => void;
  resetAccount: () => void;
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
  resetAccount,
  clearFiles,
  showProceedModal,
  hideProceedModal,
}: UseFormSubmissionOptions): UseFormSubmissionReturn {
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const isSubmittingRef = useRef(false);
  const lastSubmittedDataRef = useRef<IdentityDocumentFormData | null>(null);

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

      // Store data for potential retry
      lastSubmittedDataRef.current = data;

      isSubmittingRef.current = true;
      setIsUpdating(true);

      // Generate idempotency key for this submission attempt
      const idempotencyKey = generateIdempotencyKey();

      try {
        const response = await submitIdentityUpdate(data, idempotencyKey);

        if (response.success) {
          lastSubmittedDataRef.current = null; // Clear on success
          openModal({
            variant: 'success',
            title: 'Submission successful',
            description: 'Your update request is in progress. It will be treated within 24 hours',
            primaryLabel: 'Home',
            secondaryLabel: 'Close',
            onPrimary: () => {
              closeModal();
              setStep(FLOW_STEPS.SUBMITTED); // Prevents consent redirect
              navigate(ROUTES.HOME, { replace: true });
              setTimeout(() => {
                resetFlow();
                resetAccount();
                clearFiles();
              }, 100);
            },
            onSecondary: () => {
              closeModal();
              setStep(FLOW_STEPS.SUBMITTED); // Prevents consent redirect
              navigate(ROUTES.HOME, { replace: true });
              setTimeout(() => {
                resetFlow();
                resetAccount();
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
              // Reset flags and retry with stored data
              if (lastSubmittedDataRef.current) {
                isSubmittingRef.current = false;
                setIsUpdating(false);
                // Use setTimeout to allow state to settle before retrying
                const dataToRetry = lastSubmittedDataRef.current;
                setTimeout(() => {
                  // Manually trigger re-submission by dispatching form submit
                  // Since we can't call onSubmit recursively, we need to simulate
                  submitIdentityUpdate(dataToRetry, generateIdempotencyKey())
                    .then((retryResponse) => {
                      if (retryResponse.success) {
                        lastSubmittedDataRef.current = null;
                        openModal({
                          variant: 'success',
                          title: 'Submission successful',
                          description:
                            'Your update request is in progress. It will be treated within 24 hours',
                          primaryLabel: 'Home',
                          onPrimary: () => {
                            closeModal();
                            setStep(FLOW_STEPS.SUBMITTED);
                            navigate(ROUTES.HOME, { replace: true });
                            setTimeout(() => {
                              resetFlow();
                              resetAccount();
                              clearFiles();
                            }, 100);
                          },
                        });
                      }
                    })
                    .catch(() => {
                      openModal({
                        variant: 'error',
                        title: 'Retry failed',
                        description: 'Please try again later.',
                        primaryLabel: 'Close',
                        onPrimary: closeModal,
                      });
                    });
                }, 100);
              }
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
          primaryLabel: 'Retry',
          secondaryLabel: 'Cancel',
          onPrimary: () => {
            closeModal();
            // Reset flags and retry with stored data
            if (lastSubmittedDataRef.current) {
              isSubmittingRef.current = false;
              setIsUpdating(false);
              const dataToRetry = lastSubmittedDataRef.current;
              setTimeout(() => {
                submitIdentityUpdate(dataToRetry, generateIdempotencyKey())
                  .then((retryResponse) => {
                    if (retryResponse.success) {
                      lastSubmittedDataRef.current = null;
                      openModal({
                        variant: 'success',
                        title: 'Submission successful',
                        description:
                          'Your update request is in progress. It will be treated within 24 hours',
                        primaryLabel: 'Home',
                        onPrimary: () => {
                          closeModal();
                          setStep(FLOW_STEPS.SUBMITTED);
                          navigate(ROUTES.HOME, { replace: true });
                          setTimeout(() => {
                            resetFlow();
                            resetAccount();
                            clearFiles();
                          }, 100);
                        },
                      });
                    }
                  })
                  .catch(() => {
                    openModal({
                      variant: 'error',
                      title: 'Retry failed',
                      description: 'Network error. Please try again later.',
                      primaryLabel: 'Close',
                      onPrimary: closeModal,
                    });
                  });
              }, 100);
            }
          },
          onSecondary: () => {
            closeModal();
            lastSubmittedDataRef.current = null;
          },
        });
      } finally {
        setIsUpdating(false);
        isSubmittingRef.current = false;
      }
    },
    [isUpdating, openModal, closeModal, setStep, resetFlow, resetAccount, clearFiles, navigate]
  );

  return {
    isUpdating,
    handleUpdateClick,
    handleCompleteNow,
    onSubmit,
  };
}
