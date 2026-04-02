import { forwardRef, type InputHTMLAttributes } from 'react';
import { AppHintText } from '../AppHintText';

export interface AppInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  isLoading?: boolean;
  numbersOnly?: boolean;
}

const baseClasses =
  'w-full h-12 px-4 text-base text-black bg-white border rounded-sm transition-colors outline-none';

const stateClasses = {
  default:
    'border-navy hover:border-neutral-gray focus:border-primary focus:ring-1 focus:ring-primary',
  error: 'border-error focus:border-error focus:ring-1 focus:ring-error',
  disabled: 'bg-gray-100 border-gray-200 text-neutral-gray cursor-not-allowed',
};

export const AppInput = forwardRef<HTMLInputElement, AppInputProps>(
  (
    {
      label,
      hint,
      error,
      disabled,
      isLoading,
      numbersOnly,
      className = '',
      id,
      onChange,
      ...props
    },
    ref
  ) => {
    const inputId = id || props.name;
    const hasError = Boolean(error);
    const isDisabled = disabled || isLoading;

    const stateClass = isDisabled
      ? stateClasses.disabled
      : hasError
        ? stateClasses.error
        : stateClasses.default;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (numbersOnly) {
        // Only allow digits
        const value = e.target.value.replace(/\D/g, '');
        e.target.value = value;
      }
      onChange?.(e);
    };

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-normal text-black/70 mb-2">
            {label}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            disabled={isDisabled}
            aria-invalid={hasError}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            className={`${baseClasses} ${stateClass} ${isLoading ? 'pr-12' : ''} ${className}`}
            onChange={handleChange}
            inputMode={numbersOnly ? 'numeric' : undefined}
            {...props}
          />
          {isLoading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <span className="animate-spin inline-block h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          )}
        </div>

        {error && (
          <AppHintText variant="error" id={`${inputId}-error`}>
            {error}
          </AppHintText>
        )}

        {hint && !error && <AppHintText id={`${inputId}-hint`}>{hint}</AppHintText>}
      </div>
    );
  }
);

AppInput.displayName = 'AppInput';
