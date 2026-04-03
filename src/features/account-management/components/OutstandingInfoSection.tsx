import { DynamicForm } from '@/shared/form';
import { AppButton } from '@/shared/components';
import type { Control } from 'react-hook-form';
import type { FieldConfig } from '@/shared/form';
import type { IdentityDocumentFormData } from '../schema';

const ACTION_BUTTON_CLASS = 'w-full sm:w-[18rem]';

interface OutstandingInfoSectionProps {
  control: Control<IdentityDocumentFormData>;
  currentStep: string;
  outstandingInfoFields: FieldConfig<IdentityDocumentFormData>[];
  isUpdating: boolean;
}

export function OutstandingInfoSection({
  control,
  currentStep,
  outstandingInfoFields,
  isUpdating,
}: OutstandingInfoSectionProps) {
  return (
    <>
      <h3 className="text-lg font-semibold text-neutral-dark">Outstanding Information</h3>

      <DynamicForm fields={outstandingInfoFields} control={control} currentStep={currentStep} />

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
  );
}
