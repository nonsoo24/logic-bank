import type { ReactNode, RefObject } from 'react';
import type { Control, FieldValues, Path } from 'react-hook-form';
import type { InputType } from './inputTypes';
import type { AppInputProps } from '../components/AppInput';
import type { AppSelectProps, SelectOption } from '../components/AppSelect';
import type { OTPInputProps } from '../components/OTPInput';
import type { FileUploadProps, FileUploadHandle } from '../components/FileUpload';
import type { AppCheckboxProps } from '../components/AppCheckbox';

/**
 * Base configuration shared by all field types
 */
interface BaseFieldConfig<TFieldValues extends FieldValues> {
  /** Unique field name matching the form schema */
  name: Path<TFieldValues>;
  /** Field type determining which component to render */
  type: InputType;
  /** Step identifier for multi-step forms. Field shows when currentStep === step (if string) or >= step (if number) */
  step?: number | string;
  /** Condition to hide the field. Return true to hide */
  hidden?: boolean | ((currentStep: number | string) => boolean);
  /** Condition to disable the field. Return true to disable */
  disabled?: boolean | ((currentStep: number | string) => boolean);
}

/**
 * Text input field configuration
 */
export interface TextFieldConfig<
  TFieldValues extends FieldValues,
> extends BaseFieldConfig<TFieldValues> {
  type: 'text';
  props?: Omit<AppInputProps, 'name' | 'error'>;
}

/**
 * Select field configuration
 */
export interface SelectFieldConfig<
  TFieldValues extends FieldValues,
> extends BaseFieldConfig<TFieldValues> {
  type: 'select';
  props?: Omit<AppSelectProps, 'name' | 'error' | 'options'> & {
    options: SelectOption[];
  };
}

/**
 * OTP input field configuration
 */
export interface OTPFieldConfig<
  TFieldValues extends FieldValues,
> extends BaseFieldConfig<TFieldValues> {
  type: 'otp';
  props?: Omit<OTPInputProps, 'name' | 'error' | 'value' | 'onChange'>;
}

/**
 * File upload field configuration
 */
export interface FileFieldConfig<
  TFieldValues extends FieldValues,
> extends BaseFieldConfig<TFieldValues> {
  type: 'file';
  props?: Omit<FileUploadProps, 'name' | 'error' | 'value' | 'onChange'>;
  /** Ref for programmatic control (e.g., triggerUpload) */
  ref?: RefObject<FileUploadHandle | null>;
  /** Callback to sync file to external store (for persistence across navigation) */
  onFileChange?: (file: File | null) => void;
  /** External file value from store (takes precedence over form value) */
  externalValue?: File | null;
  /** Callback before upload. Return false to cancel the upload */
  onBeforeUpload?: () => boolean | void;
}

/**
 * Checkbox field configuration
 */
export interface CheckboxFieldConfig<
  TFieldValues extends FieldValues,
> extends BaseFieldConfig<TFieldValues> {
  type: 'checkbox';
  props?: Omit<AppCheckboxProps, 'name' | 'error' | 'checked' | 'onChange'>;
  /** Children to render inside the checkbox label */
  children?: ReactNode;
  /** Callback when checkbox value changes */
  onCheckedChange?: (checked: boolean) => void;
}

/**
 * Custom component field configuration.
 * Use `render` for dynamic components that need form values,
 * or `component` for static components.
 */
export interface CustomFieldConfig<
  TFieldValues extends FieldValues,
> extends BaseFieldConfig<TFieldValues> {
  type: 'custom';
  /** Custom render function. Receives field value and onChange if connected to form */
  render?: (props: {
    value: unknown;
    onChange: (value: unknown) => void;
    error?: string;
    disabled?: boolean;
  }) => ReactNode;
  /** Static component to render (alternative to render function) */
  component?: ReactNode;
}

/**
 * Union type of all field configurations
 */
export type FieldConfig<TFieldValues extends FieldValues> =
  | TextFieldConfig<TFieldValues>
  | SelectFieldConfig<TFieldValues>
  | OTPFieldConfig<TFieldValues>
  | FileFieldConfig<TFieldValues>
  | CheckboxFieldConfig<TFieldValues>
  | CustomFieldConfig<TFieldValues>;

/**
 * Props for the DynamicField component
 */
export interface DynamicFieldProps<TFieldValues extends FieldValues> {
  /** Field configuration */
  config: FieldConfig<TFieldValues>;
  /** React Hook Form control object */
  control: Control<TFieldValues>;
  /** Current step for multi-step forms */
  currentStep?: number | string;
}

/**
 * Props for the DynamicForm component
 */
export interface DynamicFormProps<TFieldValues extends FieldValues> {
  /** Array of field configurations */
  fields: FieldConfig<TFieldValues>[];
  /** React Hook Form control object */
  control: Control<TFieldValues>;
  /** Current step for multi-step forms */
  currentStep?: number | string;
  /** Class name for the form wrapper */
  className?: string;
  /** Gap between fields. Defaults to 'space-y-6' */
  gap?: string;
}
