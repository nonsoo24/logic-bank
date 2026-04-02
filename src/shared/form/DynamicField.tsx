import { memo, useMemo } from 'react';
import { Controller, type FieldValues } from 'react-hook-form';
import { AppInput, AppSelect, OTPInput, FileUpload, AppCheckbox } from '../components';
import { InputTypes } from './inputTypes';
import type {
  DynamicFieldProps,
  FieldConfig,
  TextFieldConfig,
  SelectFieldConfig,
  OTPFieldConfig,
  FileFieldConfig,
  CheckboxFieldConfig,
  CustomFieldConfig,
} from './types';

/**
 * Resolves a conditional value (boolean or function) to a boolean
 */
function resolveCondition(
  condition: boolean | ((step: number | string) => boolean) | undefined,
  currentStep: number | string
): boolean {
  if (typeof condition === 'function') {
    return condition(currentStep);
  }
  return condition ?? false;
}

/**
 * Type guard for text field config
 */
function isTextField<T extends FieldValues>(config: FieldConfig<T>): config is TextFieldConfig<T> {
  return config.type === InputTypes.text;
}

/**
 * Type guard for select field config
 */
function isSelectField<T extends FieldValues>(
  config: FieldConfig<T>
): config is SelectFieldConfig<T> {
  return config.type === InputTypes.select;
}

/**
 * Type guard for OTP field config
 */
function isOTPField<T extends FieldValues>(config: FieldConfig<T>): config is OTPFieldConfig<T> {
  return config.type === InputTypes.otp;
}

/**
 * Type guard for file field config
 */
function isFileField<T extends FieldValues>(config: FieldConfig<T>): config is FileFieldConfig<T> {
  return config.type === InputTypes.file;
}

/**
 * Type guard for checkbox field config
 */
function isCheckboxField<T extends FieldValues>(
  config: FieldConfig<T>
): config is CheckboxFieldConfig<T> {
  return config.type === InputTypes.checkbox;
}

/**
 * Type guard for custom field config
 */
function isCustomField<T extends FieldValues>(
  config: FieldConfig<T>
): config is CustomFieldConfig<T> {
  return config.type === InputTypes.custom;
}

/**
 * Renders a single form field based on its configuration.
 * Uses Controller from react-hook-form for controlled components.
 */
function DynamicFieldInner<TFieldValues extends FieldValues>({
  config,
  control,
  currentStep = 0,
}: DynamicFieldProps<TFieldValues>) {
  // Check if field should be hidden
  const isHidden = useMemo(
    () => resolveCondition(config.hidden, currentStep),
    [config.hidden, currentStep]
  );

  // Check if field should be disabled
  const isDisabled = useMemo(
    () => resolveCondition(config.disabled, currentStep),
    [config.disabled, currentStep]
  );

  // Check step visibility
  // If step is not defined, field is always visible
  // If step is defined, field shows when currentStep matches step
  const isStepVisible = useMemo(() => {
    if (config.step === undefined) {
      return true;
    }
    return currentStep === config.step;
  }, [config.step, currentStep]);

  // Don't render if hidden or step not reached
  if (isHidden || !isStepVisible) {
    return null;
  }

  // Render text input
  if (isTextField(config)) {
    return (
      <Controller
        name={config.name}
        control={control}
        render={({ field, fieldState }) => (
          <AppInput
            {...config.props}
            {...field}
            disabled={isDisabled || config.props?.disabled}
            error={fieldState.error?.message}
          />
        )}
      />
    );
  }

  // Render select input
  if (isSelectField(config)) {
    const { options, ...restProps } = config.props ?? { options: [] };
    return (
      <Controller
        name={config.name}
        control={control}
        render={({ field, fieldState }) => (
          <AppSelect
            {...restProps}
            {...field}
            options={options}
            disabled={isDisabled || restProps?.disabled}
            error={fieldState.error?.message}
          />
        )}
      />
    );
  }

  // Render OTP input
  if (isOTPField(config)) {
    return (
      <Controller
        name={config.name}
        control={control}
        render={({ field, fieldState }) => (
          <OTPInput
            {...config.props}
            value={field.value}
            onChange={field.onChange}
            disabled={isDisabled || config.props?.disabled}
            error={fieldState.error?.message}
            name={field.name}
          />
        )}
      />
    );
  }

  // Render file upload
  if (isFileField(config)) {
    return (
      <Controller
        name={config.name}
        control={control}
        render={({ field, fieldState }) => (
          <FileUpload
            ref={config.ref}
            {...config.props}
            value={config.externalValue ?? field.value}
            onChange={(file) => {
              field.onChange(file);
              config.onFileChange?.(file);
            }}
            disabled={isDisabled || config.props?.disabled}
            error={fieldState.error?.message}
            name={field.name}
            onBeforeUpload={config.onBeforeUpload}
          />
        )}
      />
    );
  }

  // Render checkbox
  if (isCheckboxField(config)) {
    return (
      <Controller
        name={config.name}
        control={control}
        render={({ field, fieldState }) => (
          <AppCheckbox
            {...config.props}
            checked={field.value === true}
            onChange={(e) => {
              const checked = e.target.checked;
              field.onChange(checked ? true : undefined);
              config.onCheckedChange?.(checked);
            }}
            disabled={isDisabled || config.props?.disabled}
            error={fieldState.error?.message}
            name={field.name}
          >
            {config.children}
          </AppCheckbox>
        )}
      />
    );
  }

  // Render custom component
  if (isCustomField(config)) {
    // Static component - just render it
    if (config.component) {
      return <>{config.component}</>;
    }

    // Dynamic render function - connect to form
    if (config.render) {
      return (
        <Controller
          name={config.name}
          control={control}
          render={({ field, fieldState }) =>
            config.render!({
              value: field.value,
              onChange: field.onChange,
              error: fieldState.error?.message,
              disabled: isDisabled,
            }) as React.ReactElement
          }
        />
      );
    }
  }

  return null;
}

/**
 * Memoized DynamicField component.
 * Prevents unnecessary re-renders when parent state changes.
 */
export const DynamicField = memo(DynamicFieldInner) as typeof DynamicFieldInner;
