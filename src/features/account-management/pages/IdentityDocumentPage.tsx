import { useState, useEffect, useRef, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Layout, BackHeader, Modal, DocumentUploadModal } from '@/shared/components';
import type { FileUploadHandle } from '@/shared/components';
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
import { useModal, useAccountVerification, useOtpVerification, useFormSubmission } from '../hooks';
import { useModalStore } from '@/shared/store';
import { ROUTES, FLOW_STEPS } from '@/shared/constants';
import {
  AccountNumberSection,
  OtpSection,
  DocumentsSection,
  OutstandingInfoSection,
} from '../components';

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
    resetFlow,
    acceptTerms,
    rejectTerms,
    updateFormData,
  } = useIdentityDocumentStore();

  // File upload store
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

  // File upload refs
  const utilityBillRef = useRef<FileUploadHandle>(null);
  const documentFrontRef = useRef<FileUploadHandle>(null);
  const documentBackRef = useRef<FileUploadHandle>(null);
  const activeDocumentFieldRef = useRef<'front' | 'back'>('front');

  // Account/OTP state for cancel request coordination
  const {
    accountNumber: storedAccountNumber,
    isVerified: storedIsVerified,
    setAccountNumber: storeSetAccountNumber,
    setVerified: storeSetVerified,
    reset: resetAccount,
  } = useAccountStore();

  // Initialize from persisted store state
  const [isAccountVerified, setIsAccountVerified] = useState(storedIsVerified);
  const [maskedPhone, setMaskedPhone] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const {
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

  // Form setup
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
      accountNumber: persistedFormData.accountNumber || storedAccountNumber || '',
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

  // Account verification hook
  const accountVerification = useAccountVerification({
    accountNumber,
    isOtpVerified,
    currentStep,
    onVerified: (phone, email) => {
      setIsAccountVerified(true);
      setMaskedPhone(phone);
      setMaskedEmail(email);
    },
  });

  // OTP verification hook
  const otpVerification = useOtpVerification({
    otp: otp || '',
    accountNumber,
    isAccountVerified,
    isOtpVerified,
    currentStep,
    setValue,
    setOtpVerified,
    setStep,
    setAccountNumber: storeSetAccountNumber,
    setVerified: storeSetVerified,
    showErrorModal: showOtpErrorModal,
  });

  // Form submission hook
  const formSubmission = useFormSubmission({
    setStep,
    resetFlow,
    resetAccount,
    clearFiles,
    showProceedModal,
    hideProceedModal,
  });

  // Combined cancel request handler
  const handleCancelRequest = () => {
    hideOtpErrorModal();
    otpVerification.handleCancelRequest();
    setIsAccountVerified(false);
    accountVerification.resetVerification();
    setValue('accountNumber', '');
  };

  // Document upload handlers
  const handleDocumentUpload = () => {
    if (activeDocumentFieldRef.current === 'front') {
      documentFrontRef.current?.triggerUpload();
    } else {
      documentBackRef.current?.triggerUpload();
    }
  };

  const handleUtilityBillUpload = () => {
    hideUtilityBillModal();
    setTimeout(() => utilityBillRef.current?.triggerUpload(), 100);
  };

  // Form configuration for dynamic fields
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

  // Redirect to consent if not accepted
  useEffect(() => {
    if (!hasAcceptedConsent && currentStep !== FLOW_STEPS.SUBMITTED) {
      navigate(ROUTES.CONSENT, { replace: true });
    }
  }, [hasAcceptedConsent, currentStep, navigate]);

  // Sync file values with form
  useEffect(() => {
    if (documentFront) setValue('documentFront', documentFront);
    if (documentBack) setValue('documentBack', documentBack);
    if (utilityBill) setValue('utilityBill', utilityBill);
  }, [documentFront, documentBack, utilityBill, setValue]);

  // Watch form fields and persist to store
  const nin = watch('nin');
  const documentType = watch('documentType');
  const documentNumber = watch('documentNumber');
  const acceptTermsValue = watch('acceptTerms');
  const occupation = watch('occupation');
  const natureOfBusiness = watch('natureOfBusiness');
  const employerName = watch('employerName');
  const employerAddress = watch('employerAddress');
  const annualTurnOver = watch('annualTurnOver');

  // Persist form data to store on change
  useEffect(() => {
    updateFormData({
      accountNumber,
      nin,
      documentType,
      documentNumber,
      acceptTerms: acceptTermsValue,
      occupation,
      natureOfBusiness,
      employerName,
      employerAddress,
      annualTurnOver,
    });
  }, [
    accountNumber,
    nin,
    documentType,
    documentNumber,
    acceptTermsValue,
    occupation,
    natureOfBusiness,
    employerName,
    employerAddress,
    annualTurnOver,
    updateFormData,
  ]);

  const showOtpSection = currentStep === FLOW_STEPS.VERIFICATION && isAccountVerified;
  const showDocumentsSection =
    currentStep === FLOW_STEPS.DOCUMENTS || currentStep === FLOW_STEPS.OUTSTANDING;
  const showOutstandingSection = currentStep === FLOW_STEPS.OUTSTANDING;

  return (
    <Layout>
      <BackHeader title="Identity Document Update" onBack={() => navigate(-1)} />

      <main className="max-w-3xl mx-auto px-6 pb-60 pt-8">
        <form onSubmit={handleSubmit(formSubmission.onSubmit)} className="space-y-6">
          {/* Account Number - Always visible */}
          <AccountNumberSection
            register={register}
            errors={errors}
            currentStep={currentStep}
            isVerifying={accountVerification.isVerifying}
            accountError={accountVerification.error}
          />

          {/* OTP Section */}
          {showOtpSection && (
            <OtpSection
              control={control}
              errors={errors}
              isVerifying={otpVerification.isVerifying}
              isResending={otpVerification.isResending}
              isOtpVerified={isOtpVerified}
              otpError={otpVerification.error}
              countdown={otpVerification.countdown}
              hasResentCode={otpVerification.hasResentCode}
              maskedPhone={maskedPhone}
              maskedEmail={maskedEmail}
              onResend={otpVerification.handleResendOtp}
              onCancelRequest={handleCancelRequest}
            />
          )}

          {/* Documents Section */}
          {showDocumentsSection && (
            <DocumentsSection
              control={control}
              currentStep={currentStep}
              documentFields={documentFields}
              fileUploadFields={fileUploadFields}
              utilityBillField={utilityBillField}
              termsCheckboxField={termsCheckboxField}
              isUpdating={formSubmission.isUpdating}
              onUpdateClick={() => formSubmission.handleUpdateClick(trigger)}
            />
          )}

          {/* Outstanding Info Section */}
          {showOutstandingSection && (
            <OutstandingInfoSection
              control={control}
              currentStep={currentStep}
              outstandingInfoFields={outstandingInfoFields}
              isUpdating={formSubmission.isUpdating}
            />
          )}
        </form>
      </main>

      {/* Proceed Modal */}
      <Modal
        isOpen={isProceedModalOpen}
        variant="info"
        hideIcon
        title="Please proceed to update information on your account"
        primaryButton={{ label: 'Complete now', onClick: formSubmission.handleCompleteNow }}
        onClose={hideProceedModal}
      >
        <ul className="space-y-2 text-sm text-neutral-dark text-left mt-4">
          {[
            { label: 'Occupation', required: true },
            { label: 'Nature of Business', required: true },
            { label: 'Employer Name', required: false },
            { label: 'Employer Address', required: false },
            { label: 'Annual Turn-Over', required: false },
          ].map(({ label, required }) => (
            <li key={label} className="font-normal text-sm text-neutral-gray">
              {label}
              {required && (
                <>
                  {' '}
                  (<span className="text-neutral-gray font-bold text-sm italic">compulsory</span>
                  <span className="text-error">*</span>)
                </>
              )}
            </li>
          ))}
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
        onUpload={handleDocumentUpload}
        onClose={hideDocumentUploadModal}
      />

      {/* Utility Bill Modal */}
      <Modal
        isOpen={isUtilityBillModalOpen}
        variant="info"
        title="Additional document required"
        description="Utility bill (less than six months)"
        primaryButton={{
          label: 'Upload now',
          onClick: handleUtilityBillUpload,
        }}
        secondaryButton={{ label: 'Skip for now', onClick: hideUtilityBillModal }}
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
