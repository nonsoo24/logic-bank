/**
 * Mock API service for simulating backend calls
 * In a real app, these would be actual API calls
 */

import { bankAccounts, MOCK_OTP, OTP_EXPIRY_SECONDS, type BankAccount } from '@/shared/constants';

// Simulated network delay range (ms)
const MIN_DELAY = 1000;
const MAX_DELAY = 2000;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const randomDelay = () => delay(MIN_DELAY + Math.random() * (MAX_DELAY - MIN_DELAY));

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
export async function verifyAccount(accountNumber: string): Promise<VerifyAccountResponse> {
  await randomDelay();

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
export async function verifyOTP(accountNumber: string, otp: string): Promise<VerifyOTPResponse> {
  await randomDelay();

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
export async function resendOTP(accountNumber: string): Promise<ResendOTPResponse> {
  await randomDelay();

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
export async function validateDocuments(): Promise<{
  success: boolean;
  error?: string;
}> {
  await randomDelay();

  // Simulate successful validation
  return {
    success: true,
  };
}

/**
 * POST /submit-identity-update
 * Submits the identity document update request
 */
export async function submitIdentityUpdate(data: Record<string, unknown>): Promise<{
  success: boolean;
  error?: string;
}> {
  await randomDelay();

  // Simulate successful submission
  console.log('Identity update submitted:', data);

  return {
    success: true,
  };
}
