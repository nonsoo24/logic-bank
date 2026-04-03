import { AppInput } from '@/shared/components';
import { FLOW_STEPS } from '@/shared/constants';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { IdentityDocumentFormData } from '../schema';

interface AccountNumberSectionProps {
  register: UseFormRegister<IdentityDocumentFormData>;
  errors: FieldErrors<IdentityDocumentFormData>;
  currentStep: string;
  isVerifying: boolean;
  accountError: string | null;
}

export function AccountNumberSection({
  register,
  errors,
  currentStep,
  isVerifying,
  accountError,
}: AccountNumberSectionProps) {
  const isDisabled =
    currentStep === FLOW_STEPS.DOCUMENTS || currentStep === FLOW_STEPS.OUTSTANDING || isVerifying;

  return (
    <div>
      <AppInput
        label="Account number"
        placeholder="Enter your 10-digits account number"
        maxLength={10}
        numbersOnly
        isLoading={isVerifying}
        disabled={isDisabled}
        error={errors.accountNumber?.message || accountError || undefined}
        {...register('accountNumber')}
      />
    </div>
  );
}
