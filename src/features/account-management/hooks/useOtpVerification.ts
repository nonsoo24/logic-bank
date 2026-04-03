import { useState, useEffect, useCallback, useRef } from 'react';
import { verifyOTP, resendOTP } from '../services/mockApi';
import { OTP_EXPIRY_SECONDS, FLOW_STEPS, type FlowStep } from '@/shared/constants';
import type { UseFormSetValue } from 'react-hook-form';
import type { IdentityDocumentFormData } from '../schema';

interface UseOtpVerificationOptions {
  otp: string;
  accountNumber: string;
  isAccountVerified: boolean;
  isOtpVerified: boolean;
  currentStep: FlowStep;
  setValue: UseFormSetValue<IdentityDocumentFormData>;
  setOtpVerified: (verified: boolean) => void;
  setStep: (step: FlowStep) => void;
  setAccountNumber: (accountNumber: string) => void;
  setVerified: (verified: boolean) => void;
  showErrorModal: () => void;
}

interface UseOtpVerificationReturn {
  isVerifying: boolean;
  isResending: boolean;
  error: string | null;
  countdown: number;
  hasResentCode: boolean;
  handleResendOtp: () => Promise<void>;
  handleCancelRequest: () => void;
  clearError: () => void;
}

const isAbortError = (err: unknown): boolean =>
  err instanceof DOMException && err.name === 'AbortError';

export function useOtpVerification({
  otp,
  accountNumber,
  isAccountVerified,
  isOtpVerified,
  currentStep,
  setValue,
  setOtpVerified,
  setStep,
  setAccountNumber,
  setVerified,
  showErrorModal,
}: UseOtpVerificationOptions): UseOtpVerificationReturn {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [hasResentCode, setHasResentCode] = useState(false);

  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isVerifyingRef = useRef(false);
  const isResendingRef = useRef(false);
  const lastAttemptedOtpRef = useRef<string | null>(null);
  const showErrorModalRef = useRef(showErrorModal);

  // Keep ref up to date
  useEffect(() => {
    showErrorModalRef.current = showErrorModal;
  }, [showErrorModal]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const startCountdown = useCallback(() => {
    // Clear existing countdown
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }

    setCountdown(OTP_EXPIRY_SECONDS);

    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownRef.current) {
            clearInterval(countdownRef.current);
            countdownRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // Start countdown when account is verified
  useEffect(() => {
    if (isAccountVerified && currentStep === FLOW_STEPS.VERIFICATION && !isOtpVerified) {
      startCountdown();
    }

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    };
  }, [isAccountVerified, currentStep, isOtpVerified, startCountdown]);

  // Clear error when OTP changes
  useEffect(() => {
    if (error && otp?.length < 6) {
      setError(null);
    }
  }, [otp, error]);

  // Verify OTP when 6 digits entered
  useEffect(() => {
    const controller = new AbortController();

    const verifyOtpCode = async () => {
      if (
        otp?.length === 6 &&
        accountNumber?.length === 10 &&
        !isOtpVerified &&
        isAccountVerified &&
        !isVerifyingRef.current &&
        otp !== lastAttemptedOtpRef.current
      ) {
        isVerifyingRef.current = true;
        lastAttemptedOtpRef.current = otp;
        setIsVerifying(true);

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
            lastAttemptedOtpRef.current = null;
            setOtpVerified(true);
            setAccountNumber(accountNumber);
            setVerified(true);
            // Show checkmark for 3 seconds before moving to documents step
            setTimeout(() => setStep(FLOW_STEPS.DOCUMENTS), 3000);
          } else {
            setError(response.error || 'OTP verification failed');
            showErrorModalRef.current?.();
          }
        } catch (err) {
          if (isAbortError(err)) return;
          setError('Network error. Please check your connection and try again.');
          showErrorModalRef.current?.();
        } finally {
          if (!controller.signal.aborted) {
            setIsVerifying(false);
            isVerifyingRef.current = false;
          }
        }
      }
    };

    verifyOtpCode();

    return () => {
      controller.abort();
      isVerifyingRef.current = false;
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
    if (countdown > 0 || !accountNumber || isResendingRef.current) return;

    isResendingRef.current = true;
    setIsResending(true);
    setError(null);

    try {
      const response = await resendOTP(accountNumber);

      if (response.success) {
        setHasResentCode(true);
        startCountdown();
      } else {
        setError(response.error || 'Failed to resend OTP');
      }
    } catch (err) {
      if (!isAbortError(err)) {
        setError('Network error. Please try again.');
      }
    } finally {
      setIsResending(false);
      isResendingRef.current = false;
    }
  }, [countdown, accountNumber, startCountdown]);

  const handleCancelRequest = useCallback(() => {
    // Stop and reset countdown
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    setCountdown(0);
    setHasResentCode(false);
    setError(null);
    isVerifyingRef.current = false;
    lastAttemptedOtpRef.current = null;
    // Clear OTP field
    setValue('otp', '');
  }, [setValue]);

  return {
    isVerifying,
    isResending,
    error,
    countdown,
    hasResentCode,
    handleResendOtp,
    handleCancelRequest,
    clearError,
  };
}
