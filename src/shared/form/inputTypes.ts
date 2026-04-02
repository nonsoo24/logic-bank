/**
 * Input field types supported by the dynamic form builder.
 * These map to specific form components.
 */
export const InputTypes = {
  /** Standard text input - AppInput */
  text: 'text',
  /** Select dropdown - AppSelect */
  select: 'select',
  /** OTP input with individual digit boxes - OTPInput */
  otp: 'otp',
  /** File upload with drag & drop - FileUpload */
  file: 'file',
  /** Checkbox input - AppCheckbox */
  checkbox: 'checkbox',
  /** Custom component - renders provided component */
  custom: 'custom',
} as const;

export type InputType = (typeof InputTypes)[keyof typeof InputTypes];
