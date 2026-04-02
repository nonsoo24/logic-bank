import { memo, useMemo } from 'react';
import type { FieldValues } from 'react-hook-form';
import { DynamicField } from './DynamicField';
import type { DynamicFormProps } from './types';

/**
 * Renders a form from an array of field configurations.
 * Supports multi-step forms with step-based visibility.
 *
 * @example
 * ```tsx
 * const fields: FieldConfig<MyFormData>[] = [
 *   { name: 'email', type: 'text', props: { label: 'Email', placeholder: 'Enter email' } },
 *   { name: 'role', type: 'select', props: { label: 'Role', options: roleOptions } },
 * ];
 *
 * <DynamicForm fields={fields} control={control} />
 * ```
 */
function DynamicFormInner<TFieldValues extends FieldValues>({
  fields,
  control,
  currentStep = 0,
  className = '',
  gap = 'space-y-6',
}: DynamicFormProps<TFieldValues>) {
  // Memoize field keys to prevent unnecessary re-renders
  const fieldKeys = useMemo(() => fields.map((field) => field.name as string), [fields]);

  return (
    <div className={`${gap} ${className}`.trim()}>
      {fields.map((field, index) => (
        <DynamicField
          key={fieldKeys[index]}
          config={field}
          control={control}
          currentStep={currentStep}
        />
      ))}
    </div>
  );
}

/**
 * Memoized DynamicForm component.
 * Only re-renders when fields, control, or currentStep changes.
 */
export const DynamicForm = memo(DynamicFormInner) as typeof DynamicFormInner;
