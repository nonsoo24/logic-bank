export * from './routes';

/**
 * App/Bank Identity Constants
 * Change these values to rebrand the app
 */
export const APP_CONFIG = {
  // Bank Names
  BANK_NAME_FULL: 'First Bank of Nigeria Limited',
  BANK_NAME_SHORT: 'FirstBank',
  BANK_NAME_DISPLAY: 'First Bank',
  PARENT_COMPANY: 'FBN Holdings Plc Group',

  // Legal Entity
  LEGAL_ENTITY: 'FirstBank of Nigeria Ltd',
  HEAD_OFFICE_ADDRESS: '35 Marina, Lagos',
  FULL_ADDRESS: 'FirstBank of Nigeria Ltd of 35 Marina, Lagos',

  // Contact Information
  CONTACT_EMAIL: 'firstcontact@firstbankgroup.com',
  DATA_PROTECTION_EMAIL: 'dataprotectionoffice@firstbankgroup.com',

  // URLs
  PRIVACY_POLICY_URL: 'https://www.firstbanknigeria.com/home/legal/privacy-policy/',
  WEBSITE_URL: 'https://www.firstbanknigeria.com',

  // Legal References
  DATA_PROTECTION_ACT: 'Nigeria Data Protection Act, 2023',
  DATA_PROTECTION_ACT_SHORT: 'Nigerian Data Protection Act, 2023',

  // App Info
  APP_NAME: 'First Bank Portal',
  RESPONSE_DAYS: 30,
} as const;

// Convenient aliases for common usage
export const BANK_NAME = APP_CONFIG.BANK_NAME_DISPLAY;
export const BANK_NAME_FULL = APP_CONFIG.BANK_NAME_FULL;
export const BANK_NAME_SHORT = APP_CONFIG.BANK_NAME_SHORT;

/**
 * Flow steps for identity document update process
 */
export const FLOW_STEPS = {
  CONSENT: 'consent',
  VERIFICATION: 'verification',
  DOCUMENTS: 'documents',
  OUTSTANDING: 'outstanding',
  SUBMITTED: 'submitted',
} as const;

export type FlowStep = (typeof FLOW_STEPS)[keyof typeof FLOW_STEPS];

export interface BankAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  accountNumber: string;
}

export const bankAccounts: BankAccount[] = [
  {
    id: '1',
    name: 'Daniel Chukwurah',
    email: 'dan****ah@gmail.com',
    phone: '+23480*****78',
    accountNumber: '2100110207',
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'joh****oe@gmail.com',
    phone: '+23481*****23',
    accountNumber: '1234567890',
  },
  {
    id: '3',
    name: 'Jane Smith',
    email: 'jan****th@gmail.com',
    phone: '+23470*****56',
    accountNumber: '9876543210',
  },
];

// Mock OTP for validation (in real app, this would be generated server-side)
export const MOCK_OTP = '000000';

// OTP expiry time in seconds
export const OTP_EXPIRY_SECONDS = 60;
