import { z } from 'zod';

export const identityDocumentSchema = z.object({
  accountNumber: z
    .string()
    .min(10, 'Account number must be 10 digits')
    .max(10, 'Account number must be 10 digits')
    .regex(/^\d{10}$/, 'Account number must contain only digits'),

  // OTP is only required during account verification step, not for final submission
  otp: z.string().optional(),

  nin: z
    .string()
    .min(11, 'NIN must be 11 digits')
    .max(11, 'NIN must be 11 digits')
    .regex(/^\d{11}$/, 'NIN must contain only digits'),

  documentType: z.string().min(1, 'Please select a document type'),

  documentNumber: z.string().min(1, 'Document number is required'),

  documentFront: z
    .instanceof(File, { message: 'Please upload the front of your document' })
    .refine((file) => file.size <= 10 * 1024 * 1024, 'File must be less than 10MB')
    .refine(
      (file) => ['application/pdf', 'image/jpeg', 'image/jpg'].includes(file.type),
      'Only PDF and JPG files are allowed'
    ),

  documentBack: z
    .instanceof(File, { message: 'Please upload the back of your document' })
    .refine((file) => file.size <= 10 * 1024 * 1024, 'File must be less than 10MB')
    .refine(
      (file) => ['application/pdf', 'image/jpeg', 'image/jpg'].includes(file.type),
      'Only PDF and JPG files are allowed'
    ),

  utilityBill: z
    .instanceof(File, { message: 'Please upload your utility bill' })
    .refine((file) => file.size <= 10 * 1024 * 1024, 'File must be less than 10MB')
    .refine(
      (file) => ['application/pdf', 'image/jpeg', 'image/jpg'].includes(file.type),
      'Only PDF and JPG files are allowed'
    )
    .optional(),

  acceptTerms: z.literal(true, {
    message: 'You must accept the terms and conditions',
  }),

  // Outstanding Information fields
  occupation: z.string().min(1, 'Occupation is required'),
  natureOfBusiness: z.string().min(1, 'Nature of business is required'),
  employerName: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 5, {
      message: 'Employer name must be at least 5 characters',
    }),
  employerAddress: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 5, {
      message: 'Employer address must be at least 5 characters',
    }),
  annualTurnOver: z.string().optional(),
});

// Step 1: Account verification (OTP is required here)
export const accountVerificationSchema = z.object({
  accountNumber: z
    .string()
    .min(10, 'Account number must be 10 digits')
    .max(10, 'Account number must be 10 digits')
    .regex(/^\d{10}$/, 'Account number must contain only digits'),
  otp: z
    .string()
    .length(6, 'Please enter all 6 digits')
    .regex(/^\d{6}$/, 'OTP must be 6 digits'),
});

// Step 2: Document upload
export const documentUploadSchema = identityDocumentSchema.pick({
  nin: true,
  documentType: true,
  documentNumber: true,
  documentFront: true,
  documentBack: true,
  utilityBill: true,
  acceptTerms: true,
});

// Step 3: Outstanding information
export const outstandingInfoSchema = identityDocumentSchema.pick({
  occupation: true,
  natureOfBusiness: true,
  employerName: true,
  employerAddress: true,
  annualTurnOver: true,
});

export type IdentityDocumentFormData = z.infer<typeof identityDocumentSchema>;
export type AccountVerificationData = z.infer<typeof accountVerificationSchema>;
export type DocumentUploadData = z.infer<typeof documentUploadSchema>;
export type OutstandingInfoData = z.infer<typeof outstandingInfoSchema>;

export const documentTypeOptions = [
  { value: 'voters-card', label: 'Voters Card' },
  { value: 'drivers-license', label: "Driver's License" },
  { value: 'international-passport', label: 'International Passport' },
  { value: 'national-id', label: 'National ID Card' },
];

export const occupationOptions = [
  { value: 'banker', label: 'Banker' },
  { value: 'doctor', label: 'Doctor' },
  { value: 'engineer', label: 'Engineer' },
  { value: 'teacher', label: 'Teacher' },
  { value: 'lawyer', label: 'Lawyer' },
  { value: 'business-owner', label: 'Business Owner' },
  { value: 'civil-servant', label: 'Civil Servant' },
  { value: 'student', label: 'Student' },
  { value: 'other', label: 'Other' },
];

export const natureOfBusinessOptions = [
  { value: 'employee', label: 'Employee' },
  { value: 'self-employed', label: 'Self Employed' },
  { value: 'business-owner', label: 'Business Owner' },
  { value: 'retired', label: 'Retired' },
  { value: 'student', label: 'Student' },
  { value: 'unemployed', label: 'Unemployed' },
];

export const annualTurnOverOptions = [
  { value: '500000', label: '500,000' },
  { value: '1000000', label: '1,000,000' },
  { value: '2000000', label: '2,000,000' },
  { value: '5000000', label: '5,000,000' },
  { value: '10000000', label: '10,000,000' },
  { value: 'above-10000000', label: 'Above 10,000,000' },
];
