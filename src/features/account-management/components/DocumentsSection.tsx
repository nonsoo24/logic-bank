import { DynamicField, DynamicForm } from '@/shared/form';
import { AppButton } from '@/shared/components';
import { FLOW_STEPS } from '@/shared/constants';
import type { Control } from 'react-hook-form';
import type { FieldConfig } from '@/shared/form';
import type { IdentityDocumentFormData } from '../schema';

const ACTION_BUTTON_CLASS = 'w-full sm:w-[18rem]';

interface DocumentsSectionProps {
  control: Control<IdentityDocumentFormData>;
  currentStep: string;
  documentFields: FieldConfig<IdentityDocumentFormData>[];
  fileUploadFields: FieldConfig<IdentityDocumentFormData>[];
  utilityBillField: FieldConfig<IdentityDocumentFormData>;
  termsCheckboxField: FieldConfig<IdentityDocumentFormData>;
  isUpdating: boolean;
  onUpdateClick: () => void;
}

export function DocumentsSection({
  control,
  currentStep,
  documentFields,
  fileUploadFields,
  utilityBillField,
  termsCheckboxField,
  isUpdating,
  onUpdateClick,
}: DocumentsSectionProps) {
  const showUpdateButton = currentStep === FLOW_STEPS.DOCUMENTS;

  return (
    <>
      {/* NIN, Document Type, Document Number */}
      <DynamicForm fields={documentFields} control={control} currentStep={currentStep} />

      {/* File Upload Fields - stack on mobile, 2 columns on sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fileUploadFields.map((field) => (
          <DynamicField
            key={field.name}
            config={field}
            control={control}
            currentStep={currentStep}
          />
        ))}
      </div>

      <p className="text-xs text-black font-light italic -mt-2">
        Document must be clear, legible and genuine. Upload uprightly
      </p>

      {/* Utility Bill - full width on mobile, half on sm+ */}
      <div className="w-full sm:w-1/2 sm:pr-2">
        <DynamicField config={utilityBillField} control={control} currentStep={currentStep} />
      </div>

      {/* Terms Checkbox */}
      <DynamicField config={termsCheckboxField} control={control} currentStep={currentStep} />

      {showUpdateButton && (
        <AppButton
          type="button"
          variant="solid"
          color="primary"
          label="Update"
          onClick={onUpdateClick}
          isLoading={isUpdating}
          disabled={isUpdating}
          className={ACTION_BUTTON_CLASS}
        />
      )}
    </>
  );
}
