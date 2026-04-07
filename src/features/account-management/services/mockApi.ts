/**
 * Mock API service for simulating backend calls
 * In a real app, these would be actual API calls
 */

import { bankAccounts, MOCK_OTP, OTP_EXPIRY_SECONDS, type BankAccount } from '@/shared/constants';

// Simulated network delay range (ms)
const MIN_DELAY = 300;
const MAX_DELAY = 700;
const OTP_VERIFY_DELAY = 3000; // 3 seconds for OTP verification

/**
 * Network failure simulation settings
 * Set FAILURE_RATE to a value between 0 and 1 to simulate random failures
 * Use window.__SIMULATE_NETWORK_FAILURE__ = true in console for guaranteed failure
 */
const FAILURE_RATE = 0; // 0 = no random failures, 0.3 = 30% failure rate

declare global {
  interface Window {
    __SIMULATE_NETWORK_FAILURE__?: boolean;
  }
}

function shouldSimulateFailure(): boolean {
  // Check for manual override first
  if (typeof window !== 'undefined' && window.__SIMULATE_NETWORK_FAILURE__) {
    return true;
  }
  // Random failure based on rate
  return Math.random() < FAILURE_RATE;
}

function simulateNetworkError(): never {
  throw new Error('Network error. Please check your connection and try again.');
}

const delay = (ms: number, signal?: AbortSignal): Promise<void> =>
  new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }
    const timer = setTimeout(resolve, ms);
    const onAbort = () => {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    };
    signal?.addEventListener('abort', onAbort, { once: true });
  });

const randomDelay = (signal?: AbortSignal) =>
  delay(MIN_DELAY + Math.random() * (MAX_DELAY - MIN_DELAY), signal);

export interface VerifyAccountResponse {
  success: boolean;
  data?: {
    account: BankAccount;
    otpSent: boolean;
  };
  error?: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  data?: {
    verified: boolean;
  };
  error?: string;
  errorCode?: 'INVALID_OTP' | 'EXPIRED_OTP';
}

export interface ResendOTPResponse {
  success: boolean;
  data?: {
    sent: boolean;
    expiresIn: number;
  };
  error?: string;
}

// Track OTP expiry per account (for simulation)
const otpExpiryMap = new Map<string, number>();

/**
 * POST /verify-account
 * Validates account number and sends OTP if valid
 */
export async function verifyAccount(
  accountNumber: string,
  signal?: AbortSignal
): Promise<VerifyAccountResponse> {
  await randomDelay(signal);

  const account = bankAccounts.find((acc) => acc.accountNumber === accountNumber);

  if (!account) {
    return {
      success: false,
      error: 'Account not found',
    };
  }

  // Set OTP expiry time
  otpExpiryMap.set(accountNumber, Date.now() + OTP_EXPIRY_SECONDS * 1000);

  return {
    success: true,
    data: {
      account,
      otpSent: true,
    },
  };
}

/**
 * POST /verify-otp
 * Validates the OTP entered by user
 */
export async function verifyOTP(
  accountNumber: string,
  otp: string,
  signal?: AbortSignal
): Promise<VerifyOTPResponse> {
  // Longer delay for OTP verification (8 seconds)
  await delay(OTP_VERIFY_DELAY, signal);

  // Validate OTP - must match the mock OTP
  if (otp !== MOCK_OTP) {
    return {
      success: false,
      error: 'Invalid OTP. Please check and try again.',
      errorCode: 'INVALID_OTP',
    };
  }

  // Check if OTP has expired (only if expiry was set)
  const expiryTime = otpExpiryMap.get(accountNumber);
  if (expiryTime && Date.now() > expiryTime) {
    return {
      success: false,
      error: 'OTP has expired. Please request a new one.',
      errorCode: 'EXPIRED_OTP',
    };
  }

  // Clear expiry on successful verification
  otpExpiryMap.delete(accountNumber);

  return {
    success: true,
    data: {
      verified: true,
    },
  };
}

/**
 * POST /resend-otp
 * Resends OTP to user's registered phone/email
 */
export async function resendOTP(
  accountNumber: string,
  signal?: AbortSignal
): Promise<ResendOTPResponse> {
  await randomDelay(signal);

  const account = bankAccounts.find((acc) => acc.accountNumber === accountNumber);

  if (!account) {
    return {
      success: false,
      error: 'Account not found',
    };
  }

  // Reset OTP expiry time
  otpExpiryMap.set(accountNumber, Date.now() + OTP_EXPIRY_SECONDS * 1000);

  return {
    success: true,
    data: {
      sent: true,
      expiresIn: OTP_EXPIRY_SECONDS,
    },
  };
}

/**
 * POST /validate-documents
 * Validates the identity documents before proceeding
 */
export async function validateDocuments(signal?: AbortSignal): Promise<{
  success: boolean;
  error?: string;
}> {
  await randomDelay(signal);

  // Simulate successful validation
  return {
    success: true,
  };
}

/**
 * POST /submit-identity-update
 * Submits the identity document update request
 * @param data - Form data to submit
 * @param idempotencyKey - Unique key to prevent duplicate submissions
 * @param signal - Optional AbortSignal for cancellation
 */
export async function submitIdentityUpdate(
  data: Record<string, unknown>,
  idempotencyKey?: string,
  signal?: AbortSignal
): Promise<{
  success: boolean;
  error?: string;
}> {
  await randomDelay(signal);

  // Simulate network failure if enabled
  if (shouldSimulateFailure()) {
    simulateNetworkError();
  }

  // In a real API, the idempotency key would be sent as a header:
  // headers: { 'Idempotency-Key': idempotencyKey }
  // The server would check if this key was already processed
  // and return the cached response if so.
  console.log('Identity update submitted:', { data, idempotencyKey });

  return {
    success: true,
  };
}
