import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { AppHintText } from '../AppHintText';

export interface AppCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode;
  children?: ReactNode;
  hint?: string;
  error?: string;
}

export const AppCheckbox = forwardRef<HTMLInputElement, AppCheckboxProps>(
  ({ label, children, hint, error, disabled, className = '', id, ...props }, ref) => {
    const labelContent = children || label;
    const checkboxId = id || props.name;
    const hasError = Boolean(error);

    return (
      <div className="w-full">
        <label
          htmlFor={checkboxId}
          className={`inline-flex items-start gap-3 cursor-pointer ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          <div className="relative flex items-center justify-center mt-0.5">
            <input
              ref={ref}
              type="checkbox"
              id={checkboxId}
              disabled={disabled}
              aria-invalid={hasError}
              aria-describedby={
                error ? `${checkboxId}-error` : hint ? `${checkboxId}-hint` : undefined
              }
              className={`
                peer
                w-5 h-5
                border-2 rounded
                appearance-none cursor-pointer
                transition-colors
                ${hasError ? 'border-error' : 'border-primary hover:border-primary/80'}
                checked:bg-primary checked:border-primary
                focus:ring-2 focus:ring-primary/30 focus:outline-none
                disabled:cursor-not-allowed disabled:opacity-50
                ${className}
              `}
              {...props}
            />
            <svg
              className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {labelContent && (
            <span className="text-sm text-primary underline select-none">{labelContent}</span>
          )}
        </label>

        {error && (
          <AppHintText variant="error" id={`${checkboxId}-error`}>
            {error}
          </AppHintText>
        )}

        {hint && !error && <AppHintText id={`${checkboxId}-hint`}>{hint}</AppHintText>}
      </div>
    );
  }
);

AppCheckbox.displayName = 'AppCheckbox';
