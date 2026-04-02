import { useCallback, useMemo } from 'react';
import {
  useForm,
  type UseFormProps,
  type FieldValues,
  type SubmitHandler,
  type UseFormReturn,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodType } from 'zod';

export interface UseAppFormOptions<TFieldValues extends FieldValues> extends Omit<
  UseFormProps<TFieldValues>,
  'resolver'
> {
  /** Zod schema for validation */
  schema: ZodType<TFieldValues>;
  /** Form submission handler */
  onSubmit?: SubmitHandler<TFieldValues>;
}

export interface UseAppFormReturn<TFieldValues extends FieldValues> extends Omit<
  UseFormReturn<TFieldValues>,
  'handleSubmit'
> {
  /** Memoized submit handler - use directly on form onSubmit */
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  /** Original handleSubmit from react-hook-form for custom usage */
  formHandleSubmit: UseFormReturn<TFieldValues>['handleSubmit'];
  /** Trigger validation for specific fields */
  triggerValidation: (
    fields?: Parameters<UseFormReturn<TFieldValues>['trigger']>[0]
  ) => Promise<boolean>;
}

/**
 * Custom hook that wraps react-hook-form with Zod validation.
 * Provides memoized submit handler and stable form methods.
 *
 * @example
 * ```tsx
 * const { control, handleSubmit, formState } = useAppForm({
 *   schema: mySchema,
 *   defaultValues: { email: '' },
 *   onSubmit: (data) => console.log(data),
 * });
 *
 * <form onSubmit={handleSubmit}>
 *   <DynamicForm fields={fields} control={control} />
 *   <button type="submit">Submit</button>
 * </form>
 * ```
 */
export function useAppForm<TFieldValues extends FieldValues>({
  schema,
  onSubmit,
  mode = 'onChange',
  reValidateMode = 'onChange',
  ...formOptions
}: UseAppFormOptions<TFieldValues>): UseAppFormReturn<TFieldValues> {
  const formMethods = useForm<TFieldValues>({
    resolver: zodResolver(schema as ZodType<TFieldValues, any, any>),
    mode,
    reValidateMode,
    ...formOptions,
  });

  // Memoize the submit handler to prevent unnecessary re-renders
  const handleSubmit = useMemo(() => {
    if (!onSubmit) return formMethods.handleSubmit(() => {});
    return formMethods.handleSubmit(onSubmit);
  }, [formMethods, onSubmit]);

  // Stable reference to trigger validation
  const triggerValidation = useCallback(
    (fields?: Parameters<typeof formMethods.trigger>[0]) => formMethods.trigger(fields),
    [formMethods]
  );

  // Destructure handleSubmit separately so we can rename and replace it
  const { handleSubmit: formHandleSubmit, ...restFormMethods } = formMethods;

  return {
    ...restFormMethods,
    handleSubmit,
    formHandleSubmit,
    triggerValidation,
  };
}
