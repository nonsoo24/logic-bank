import { forwardRef, type SelectHTMLAttributes } from 'react';
import { ArrowDown } from '@/assets/svg/ArrowDown';
import { AppHintText } from '../AppHintText';

export interface SelectOption {
  value: string;
  label: string;
}

export interface AppSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

const baseClasses =
  'w-full h-12 px-4 pr-10 text-base bg-white border rounded-lg transition-colors outline-none appearance-none cursor-pointer';

const stateClasses = {
  default:
    'border-neutral-gray/30 hover:border-neutral-gray focus:border-primary focus:ring-1 focus:ring-primary',
  error: 'border-error focus:border-error focus:ring-1 focus:ring-error',
  disabled: 'bg-gray-100 border-gray-200 text-neutral-gray cursor-not-allowed',
};

export const AppSelect = forwardRef<HTMLSelectElement, AppSelectProps>(
  (
    { label, hint, error, disabled, options, placeholder, className = '', id, required, ...props },
    ref
  ) => {
    const selectId = id || props.name;
    const hasError = Boolean(error);

    const stateClass = disabled
      ? stateClasses.disabled
      : hasError
        ? stateClasses.error
        : stateClasses.default;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-normal text-neutral-gray mb-2">
            {label}
            {required && <span className="text-error ml-0.5">*</span>}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined}
            className={`${baseClasses} ${stateClass} ${!props.value ? 'text-neutral-gray' : 'text-black'} ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
            <ArrowDown className="w-4 h-4 text-neutral-gray" />
          </div>
        </div>

        {error && (
          <AppHintText variant="error" id={`${selectId}-error`}>
            {error}
          </AppHintText>
        )}

        {hint && !error && <AppHintText id={`${selectId}-hint`}>{hint}</AppHintText>}
      </div>
    );
  }
);

AppSelect.displayName = 'AppSelect';
