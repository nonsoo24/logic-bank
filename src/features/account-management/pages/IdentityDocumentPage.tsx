import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import {
  Layout,
  BackHeader,
  AppInput,
  OTPInput,
  AppButton,
  Modal,
  DocumentUploadModal,
} from '@/shared/components';
import type { FileUploadHandle } from '@/shared/components';
import { DynamicField, DynamicForm } from '@/shared/form';
import { CheckMark } from '@/assets/svg';
import { identityDocumentSchema, type IdentityDocumentFormData } from '../schema';
import {
  getDocumentFields,
  getFileUploadFields,
  getUtilityBillField,
  getTermsCheckboxField,
  getOutstandingInfoFields,
  type FormConfigOptions,
} from '../config';
import { useAccountStore, useIdentityDocumentStore, useFileUploadStore } from '../store';
import { useModal } from '../hooks';
import { useModalStore } from '@/shared/store';
import { ROUTES, OTP_EXPIRY_SECONDS, FLOW_STEPS } from '@/shared/constants';
import {
  verifyAccount,
  verifyOTP,
  resendOTP,
  validateDocuments,
  submitIdentityUpdate,
} from '../services/mockApi';

const ACTION_BUTTON_CLASS = 'w-full sm:w-[18rem]';

const isAbortError = (err: unknown): boolean =>
  err instanceof DOMException && err.name === 'AbortError';

export function IdentityDocumentPage() {
  const navigate = useNavigate();

  // Store state
  const {
    currentStep,
    hasAcceptedConsent,
    isOtpVerified,
    formData: persistedFormData,
    setStep,
    setOtpVerified,
    updateFormData,
    resetFlow,
    acceptTerms,
    rejectTerms,
  } = useIdentityDocumentStore();

  // File upload store (in-memory, survives navigation)
  const {
    documentFront,
    documentBack,
    utilityBill,
    documentFrontUploaded,
    documentBackUploaded,
    utilityBillUploaded,
    setDocumentFront,
    setDocumentBack,
    setUtilityBill,
    clearFiles,
  } = useFileUploadStore();

  // Modal hooks
  const {
    isOpen: isProceedModalOpen,
    showModal: showProceedModal,
    hideModal: hideProceedModal,
  } = useModal();

  const {
    isOpen: isOtpErrorModalOpen,
    showModal: showOtpErrorModal,
    hideModal: hideOtpErrorModal,
  } = useModal();

  const {
    isOpen: isUtilityBillModalOpen,
    showModal: showUtilityBillModal,
    hideModal: hideUtilityBillModal,
  } = useModal();

  const {
    isOpen: isDocumentUploadModalOpen,
    showModal: showDocumentUploadModal,
    hideModal: hideDocumentUploadModal,
  } = useModal();

  // Loading states
  const [isVerifyingAccount, setIsVerifyingAccount] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Account verification state
  const [accountError, setAccountError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isAccountVerified, setIsAccountVerified] = useState(false);
  const [maskedPhone, setMaskedPhone] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');

  const [countdown, setCountdown] = useState(0);
  const [hasResentCode, setHasResentCode] = useState(false);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const verificationAttemptedRef = useRef(false);
  const isVerifyingOtpRef = useRef(false);
  const isResendingOtpRef = useRef(false);
  const isSubmittingRef = useRef(false);
  const utilityBillRef = useRef<FileUploadHandle>(null);
  const documentFrontRef = useRef<FileUploadHandle>(null);
  const documentBackRef = useRef<FileUploadHandle>(null);
  const activeDocumentFieldRef = useRef<'front' | 'back'>('front');

  const { setAccountNumber, setAccountName, setVerified } = useAccountStore();
  const {
    openModal,
    closeModal,
    isOpen,
    variant,
    title,
    description,
    primaryLabel,
    secondaryLabel,
    onPrimary,
    onSecondary,
  } = useModalStore();

  const {
    register,
    control,
    handleSubmit,
    watch,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<IdentityDocumentFormData>({
    resolver: zodResolver(identityDocumentSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      accountNumber: persistedFormData.accountNumber || '',
      otp: persistedFormData.otp || '',
      nin: persistedFormData.nin || '',
      documentType: persistedFormData.documentType || '',
      documentNumber: persistedFormData.documentNumber || '',
      acceptTerms: persistedFormData.acceptTerms,
      occupation: persistedFormData.occupation || '',
      natureOfBusiness: persistedFormData.natureOfBusiness || '',
      employerName: persistedFormData.employerName || '',
      employerAddress: persistedFormData.employerAddress || '',
      annualTurnOver: persistedFormData.annualTurnOver || '',
    },
  });

  const accountNumber = watch('accountNumber');
  const otp = watch('otp');

  // Form configuration options for dynamic fields
  const formConfigOptions = useMemo<FormConfigOptions>(
    () => ({
      currentStep,
      documentFrontRef,
      documentBackRef,
      utilityBillRef,
      documentFront,
      documentBack,
      utilityBill,
      documentFrontUploaded,
      documentBackUploaded,
      utilityBillUploaded,
      setDocumentFront,
      setDocumentBack,
      setUtilityBill,
      onDocumentFrontBeforeUpload: () => {
        if (!documentFront && !documentFrontUploaded) {
          activeDocumentFieldRef.current = 'front';
          showDocumentUploadModal();
          return false;
        }
        return true;
      },
      onDocumentBackBeforeUpload: () => {
        if (!documentBack && !documentBackUploaded) {
          activeDocumentFieldRef.current = 'back';
          showDocumentUploadModal();
          return false;
        }
        return true;
      },
      onUtilityBillBeforeUpload: () => {
        if (!utilityBill && !utilityBillUploaded) {
          showUtilityBillModal();
          return false;
        }
        return true;
      },
      acceptTerms,
      rejectTerms,
    }),
    [
      currentStep,
      documentFront,
      documentBack,
      utilityBill,
      documentFrontUploaded,
      documentBackUploaded,
      utilityBillUploaded,
      setDocumentFront,
      setDocumentBack,
      setUtilityBill,
      showDocumentUploadModal,
      showUtilityBillModal,
      acceptTerms,
      rejectTerms,
    ]
  );

  // Memoized field configurations
  const documentFields = useMemo(() => getDocumentFields(formConfigOptions), [formConfigOptions]);
  const fileUploadFields = useMemo(
    () => getFileUploadFields(formConfigOptions),
    [formConfigOptions]
  );
  const utilityBillField = useMemo(
    () => getUtilityBillField(formConfigOptions),
    [formConfigOptions]
  );
  const termsCheckboxField = useMemo(
    () => getTermsCheckboxField(formConfigOptions),
    [formConfigOptions]
  );
  const outstandingInfoFields = useMemo(() => getOutstandingInfoFields(), []);

  // Redirect to consent page if not accepted
  useEffect(() => {
    if (!hasAcceptedConsent) {
      navigate(ROUTES.CONSENT, { replace: true });
    }
  }, [hasAcceptedConsent, navigate]);

  // Reset stale isOtpVerified state if on verification step
  // This handles cases where localStorage has old state
  useEffect(() => {
    if (currentStep === FLOW_STEPS.VERIFICATION && isOtpVerified) {
      setOtpVerified(false);
    }
  }, [currentStep, isOtpVerified, setOtpVerified]);

  // Sync files from store to form on mount (files survive navigation)
  useEffect(() => {
    if (documentFront) setValue('documentFront', documentFront);
    if (documentBack) setValue('documentBack', documentBack);
    if (utilityBill) setValue('utilityBill', utilityBill);
  }, [documentFront, documentBack, utilityBill, setValue]);

  // Persist form data on changes
  useEffect(() => {
    const subscription = watch((data) => {
      updateFormData(data as Partial<IdentityDocumentFormData>);
    });
    return () => subscription.unsubscribe();
  }, [watch, updateFormData]);

  // Start countdown timer
  const startCountdown = useCallback(() => {
    // Clear any existing interval
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }

    setCountdown(OTP_EXPIRY_SECONDS);
    countdownRef.current = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          if (countdownRef.current) {
            clearInterval(countdownRef.current);
            countdownRef.current = null;
          }
          setHasResentCode(false);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);
  }, []);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  // Verify account when 10 digits entered
  useEffect(() => {
    const controller = new AbortController();

    const verifyAccountNumber = async () => {
      if (
        currentStep === FLOW_STEPS.VERIFICATION &&
        accountNumber?.length === 10 &&
        !isOtpVerified &&
        !verificationAttemptedRef.current &&
        !isAccountVerified
      ) {
        verificationAttemptedRef.current = true;
        setIsVerifyingAccount(true);
        setAccountError(null);

        try {
          const response = await verifyAccount(accountNumber, controller.signal);

          if (response.success && response.data) {
            setIsAccountVerified(true);
            setMaskedPhone(response.data.account.phone);
            setMaskedEmail(response.data.account.email);
            setAccountName(response.data.account.name);
            startCountdown();
          } else {
            setAccountError(response.error || 'Account verification failed');
            verificationAttemptedRef.current = false;
          }
        } catch (err) {
          if (isAbortError(err)) return;
          setAccountError('Network error. Please check your connection and try again.');
          verificationAttemptedRef.current = false;
        } finally {
          if (!controller.signal.aborted) {
            setIsVerifyingAccount(false);
          }
        }
      }
    };

    verifyAccountNumber();
    return () => controller.abort();
  }, [
    accountNumber,
    currentStep,
    isOtpVerified,
    isAccountVerified,
    startCountdown,
    setAccountName,
  ]);

  // Reset verification state when account number changes (less than 10 digits)
  useEffect(() => {
    if (accountNumber?.length !== 10) {
      verificationAttemptedRef.current = false;
      setIsAccountVerified(false);
      setAccountError(null);
      setOtpError(null);
      // Clear OTP when account number changes
      setValue('otp', '');
    }
  }, [accountNumber, setValue]);

  // Verify OTP when 6 digits entered
  useEffect(() => {
    const controller = new AbortController();

    const verifyOtpCode = async () => {
      if (
        otp?.length === 6 &&
        accountNumber?.length === 10 &&
        !isOtpVerified &&
        isAccountVerified &&
        !isVerifyingOtpRef.current
      ) {
        isVerifyingOtpRef.current = true;
        setIsVerifyingOtp(true);
        setOtpError(null);

        try {
          const response = await verifyOTP(accountNumber, otp, controller.signal);

          if (response.success) {
            // Stop countdown
            if (countdownRef.current) {
              clearInterval(countdownRef.current);
              countdownRef.current = null;
            }

            // Clear OTP on success
            setValue('otp', '');
            setOtpVerified(true);
            setAccountNumber(accountNumber);
            setVerified(true);
            // Move to documents step after short delay
            setTimeout(() => setStep(FLOW_STEPS.DOCUMENTS), 500);
          } else {
            setOtpError(response.error || 'OTP verification failed');
            showOtpErrorModal();
          }
        } catch (err) {
          if (isAbortError(err)) return;
          setOtpError('Network error. Please check your connection and try again.');
          showOtpErrorModal();
        } finally {
          if (!controller.signal.aborted) {
            setIsVerifyingOtp(false);
            isVerifyingOtpRef.current = false;
          }
        }
      }
    };

    verifyOtpCode();
    return () => {
      controller.abort();
      isVerifyingOtpRef.current = false;
    };
  }, [
    otp,
    accountNumber,
    setAccountNumber,
    setVerified,
    isOtpVerified,
    isAccountVerified,
    setOtpVerified,
    setStep,
    setValue,
    showOtpErrorModal,
  ]);

  // Clear hasResentCode after brief display
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (hasResentCode) {
      timeout = setTimeout(() => setHasResentCode(false), 2000);
    }
    return () => clearTimeout(timeout);
  }, [hasResentCode]);

  const handleResendOtp = useCallback(async () => {
    if (countdown > 0 || !accountNumber || isResendingOtpRef.current) return;

    isResendingOtpRef.current = true;
    setIsResendingOtp(true);
    setOtpError(null);

    try {
      const response = await resendOTP(accountNumber);

      if (response.success) {
        setHasResentCode(true);
        startCountdown();
      } else {
        setOtpError(response.error || 'Failed to resend OTP');
      }
    } catch (err) {
      if (!isAbortError(err)) {
        setOtpError('Network error. Please try again.');
      }
    } finally {
      setIsResendingOtp(false);
      isResendingOtpRef.current = false;
    }
  }, [countdown, accountNumber, startCountdown]);

  // Handle cancel request from OTP error modal or inline OTP error
  const handleCancelRequest = useCallback(() => {
    hideOtpErrorModal();
    // Stop and reset countdown
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    setCountdown(0);
    setHasResentCode(false);
    // Reset verification state so OTP input hides
    setIsAccountVerified(false);
    setAccountError(null);
    setOtpError(null);
    verificationAttemptedRef.current = false;
    isVerifyingOtpRef.current = false;
    // Clear form fields
    setValue('accountNumber', '');
    setValue('otp', '');
  }, [hideOtpErrorModal, setValue]);

  // Handle Update button click - validate and show proceed modal
  const handleUpdateClick = async () => {
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
  };

  // Handle Complete now - go to outstanding info step
  const handleCompleteNow = () => {
    hideProceedModal();
    setStep(FLOW_STEPS.OUTSTANDING);
  };

  const onSubmit = async (data: IdentityDocumentFormData) => {
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
            resetFlow();
            clearFiles();
          },
          onSecondary: () => {
            closeModal();
            navigate(ROUTES.HOME, { replace: true });
            resetFlow();
            clearFiles();
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
            handleSubmit(onSubmit)();
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
          navigate(ROUTES.HOME, { replace: true });
          resetFlow();
          clearFiles();
        },
        onSecondary: closeModal,
      });
    } finally {
      setIsUpdating(false);
      isSubmittingRef.current = false;
    }
  };

  return (
    <Layout>
      <BackHeader title="Identity Document Update" onBack={() => navigate(-1)} />

      <main className="max-w-3xl mx-auto px-6 pb-8 pt-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Account Number - Always visible */}
          <div>
            <AppInput
              label="Account number"
              placeholder="Enter your 10-digits account number"
              maxLength={10}
              numbersOnly
              isLoading={isVerifyingAccount}
              disabled={
                currentStep === FLOW_STEPS.DOCUMENTS ||
                currentStep === FLOW_STEPS.OUTSTANDING ||
                isVerifyingAccount
              }
              error={errors.accountNumber?.message || accountError || undefined}
              {...register('accountNumber')}
            />
          </div>

          {/* OTP Section - Only in verification step after account is verified */}
          {currentStep === FLOW_STEPS.VERIFICATION && isAccountVerified && (
            <div className="space-y-3">
              <div className="flex items-center gap-7">
                <div className="flex items-center gap-4">
                  <Controller
                    name="otp"
                    control={control}
                    render={({ field }) => (
                      <OTPInput
                        label="Phone number verification"
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.otp?.message || otpError || undefined}
                        isLoading={isVerifyingOtp}
                        disabled={isVerifyingOtp}
                        onCancelRequest={otpError ? handleCancelRequest : undefined}
                      />
                    )}
                  />
                  {isOtpVerified && <img src={CheckMark} alt="Verified" className="w-6 h-6 mt-6" />}
                </div>

                <div className="flex items-center gap-1 text-sm mt-6">
                  <span className="text-neutral-600">Didn't receive OTP?</span>
                  {!hasResentCode && countdown < 1 && !isResendingOtp && (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-primary font-medium hover:underline cursor-pointer underline"
                    >
                      Resend code
                    </button>
                  )}
                  {isResendingOtp && (
                    <span className="text-primary font-medium flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                      Sending...
                    </span>
                  )}
                  {!hasResentCode && countdown > 0 && !isResendingOtp && (
                    <span className="text-primary font-medium underline">
                      Resend in {`0:${countdown.toString().padStart(2, '0')}`} secs
                    </span>
                  )}
                  {hasResentCode && !isResendingOtp && (
                    <span className="text-primary font-medium">Code resent!</span>
                  )}
                </div>
              </div>

              <p className="text-sm text-neutral-600">
                Kindly input the 6-digit OTP sent to your registered phone number {maskedPhone} and
                email address {maskedEmail}
              </p>
            </div>
          )}

          {/* Document Fields - After verification and in outstanding step */}
          {(currentStep === FLOW_STEPS.DOCUMENTS || currentStep === FLOW_STEPS.OUTSTANDING) && (
            <>
              {/* NIN, Document Type, Document Number */}
              <DynamicForm fields={documentFields} control={control} currentStep={currentStep} />

              {/* File Upload Fields - in a 2-column grid */}
              <div className="grid grid-cols-2 gap-4">
                {fileUploadFields.map((field) => (
                  <DynamicField
                    key={field.name}
                    config={field}
                    control={control}
                    currentStep={currentStep}
                  />
                ))}
              </div>

              <p className="text-xs text-black font-light italic -mt-2">
                Document must be clear, legible and genuine. Upload uprightly
              </p>

              {/* Utility Bill - half width */}
              <div className="w-1/2 pr-2">
                <DynamicField
                  config={utilityBillField}
                  control={control}
                  currentStep={currentStep}
                />
              </div>

              {/* Terms Checkbox */}
              <DynamicField
                config={termsCheckboxField}
                control={control}
                currentStep={currentStep}
              />

              {currentStep === FLOW_STEPS.DOCUMENTS && (
                <AppButton
                  type="button"
                  variant="solid"
                  color="primary"
                  label="Update"
                  onClick={handleUpdateClick}
                  isLoading={isUpdating}
                  disabled={isUpdating}
                  className={ACTION_BUTTON_CLASS}
                />
              )}
            </>
          )}

          {/* Outstanding Information - After proceed modal */}
          {currentStep === FLOW_STEPS.OUTSTANDING && (
            <>
              <h3 className="text-lg font-semibold text-neutral-dark">Outstanding Information</h3>

              <DynamicForm
                fields={outstandingInfoFields}
                control={control}
                currentStep={currentStep}
              />

              <AppButton
                type="submit"
                variant="solid"
                color="primary"
                label="Submit"
                isLoading={isUpdating}
                disabled={isUpdating}
                className={ACTION_BUTTON_CLASS}
              />
            </>
          )}
        </form>
      </main>

      {/* Proceed to update modal */}
      <Modal
        isOpen={isProceedModalOpen}
        variant="info"
        hideIcon
        title="Please proceed to update information on your account"
        primaryButton={{ label: 'Complete now', onClick: handleCompleteNow }}
        onClose={hideProceedModal}
      >
        <ul className="space-y-2 text-sm text-neutral-dark text-left mt-4">
          <li>
            Occupation (<span className="text-primary italic">compulsory</span>
            <span className="text-error">*</span>)
          </li>
          <li>
            Nature of Business (<span className="text-primary italic">compulsory</span>
            <span className="text-error">*</span>)
          </li>
          <li>Employer Name</li>
          <li>Employer Address</li>
          <li>Annual Turn-Over</li>
        </ul>
      </Modal>

      {/* OTP Error Modal */}
      <Modal
        isOpen={isOtpErrorModalOpen}
        variant="warning"
        title="OTP Validation Failed"
        description="Your phone number validation failed."
        primaryButton={{ label: 'Cancel request', onClick: handleCancelRequest }}
        secondaryButton={{ label: 'Close', onClick: hideOtpErrorModal }}
        onClose={hideOtpErrorModal}
      />

      {/* Document Upload Instructions Modal */}
      <DocumentUploadModal
        isOpen={isDocumentUploadModalOpen}
        onUpload={() => {
          if (activeDocumentFieldRef.current === 'front') {
            documentFrontRef.current?.triggerUpload();
          } else {
            documentBackRef.current?.triggerUpload();
          }
        }}
        onClose={hideDocumentUploadModal}
      />

      {/* Utility Bill Upload Modal */}
      <Modal
        isOpen={isUtilityBillModalOpen}
        variant="info"
        title="Additional document required"
        description="Utility bill (less than six months)"
        primaryButton={{
          label: 'Upload now',
          onClick: () => {
            hideUtilityBillModal();
            // Trigger file upload after modal closes
            setTimeout(() => {
              utilityBillRef.current?.triggerUpload();
            }, 100);
          },
        }}
        secondaryButton={{
          label: 'Skip for now',
          onClick: hideUtilityBillModal,
        }}
        onClose={hideUtilityBillModal}
      />

      {/* Success/Error Modal */}
      <Modal
        isOpen={isOpen}
        variant={variant}
        title={title}
        description={description}
        primaryButton={{ label: primaryLabel, onClick: onPrimary || closeModal }}
        secondaryButton={
          secondaryLabel ? { label: secondaryLabel, onClick: onSecondary || closeModal } : undefined
        }
        onClose={closeModal}
      />
    </Layout>
  );
}
