import { useState, useEffect, useRef, useCallback } from 'react';
import { verifyAccount } from '../services/mockApi';
import { useAccountStore } from '../store';
import { FLOW_STEPS, type FlowStep } from '@/shared/constants';

interface UseAccountVerificationOptions {
  accountNumber: string;
  isOtpVerified: boolean;
  currentStep: FlowStep;
  onVerified?: (maskedPhone: string, maskedEmail: string) => void;
}

interface UseAccountVerificationReturn {
  isVerifying: boolean;
  isVerified: boolean;
  error: string | null;
  maskedPhone: string;
  maskedEmail: string;
  resetVerification: () => void;
}

const isAbortError = (err: unknown): boolean =>
  err instanceof DOMException && err.name === 'AbortError';

export function useAccountVerification({
  accountNumber,
  isOtpVerified,
  currentStep,
  onVerified,
}: UseAccountVerificationOptions): UseAccountVerificationReturn {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [maskedPhone, setMaskedPhone] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');

  const verificationAttemptedRef = useRef(false);
  const isVerifyingRef = useRef(false);
  const onVerifiedRef = useRef(onVerified);
  const { setAccountNumber: storeAccountNumber } = useAccountStore();

  // Keep callback ref updated
  useEffect(() => {
    onVerifiedRef.current = onVerified;
  }, [onVerified]);

  // Reset verification when account number changes
  const resetVerification = useCallback(() => {
    setIsVerified(false);
    setIsVerifying(false);
    setError(null);
    setMaskedPhone('');
    setMaskedEmail('');
    verificationAttemptedRef.current = false;
    isVerifyingRef.current = false;
  }, []);

  // Clear incomplete verification on mount (handles refresh)
  useEffect(() => {
    if (currentStep === FLOW_STEPS.VERIFICATION && !isOtpVerified && accountNumber?.length === 10) {
      resetVerification();
    }
  }, []);

  // Verify account when 10 digits entered
  useEffect(() => {
    const controller = new AbortController();

    const performVerification = async () => {
      // Only verify in verification step, with 10 digits, not already verified/verifying
      if (
        currentStep !== FLOW_STEPS.VERIFICATION ||
        accountNumber?.length !== 10 ||
        isVerified ||
        isVerifyingRef.current ||
        verificationAttemptedRef.current
      ) {
        return;
      }

      // Skip if OTP already verified (user is coming back)
      if (isOtpVerified) {
        setIsVerified(true);
        return;
      }

      verificationAttemptedRef.current = true;
      isVerifyingRef.current = true;
      setIsVerifying(true);
      setError(null);

      try {
        const response = await verifyAccount(accountNumber, controller.signal);

        if (response.success && response.data) {
          const { account } = response.data;
          setIsVerified(true);
          setMaskedPhone(account.phone);
          setMaskedEmail(account.email);
          storeAccountNumber(accountNumber);
          onVerifiedRef.current?.(account.phone, account.email);
        } else {
          setError(response.error || 'Account verification failed');
          verificationAttemptedRef.current = false;
        }
      } catch (err) {
        if (isAbortError(err)) return;
        setError('Network error. Please check your connection and try again.');
        verificationAttemptedRef.current = false;
      } finally {
        if (!controller.signal.aborted) {
          setIsVerifying(false);
          isVerifyingRef.current = false;
        }
      }
    };

    performVerification();

    return () => {
      controller.abort();
    };
  }, [accountNumber, currentStep, isOtpVerified, storeAccountNumber]);

  // Reset when account number changes (user editing)
  useEffect(() => {
    if (accountNumber?.length !== 10 && (isVerified || error)) {
      resetVerification();
    }
  }, [accountNumber, isVerified, error, resetVerification]);

  return {
    isVerifying,
    isVerified,
    error,
    maskedPhone,
    maskedEmail,
    resetVerification,
  };
}
