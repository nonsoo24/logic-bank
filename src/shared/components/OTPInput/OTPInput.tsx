import {
  useCallback,
  useRef,
  type KeyboardEvent,
  type ClipboardEvent,
  type ChangeEvent,
} from 'react';
import { AppHintText } from '../AppHintText';
import { InfoIconError } from '@/assets/svg';

export interface OTPInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  isLoading?: boolean;
  id?: string;
  name?: string;
  onCancelRequest?: () => void;
}

export function OTPInput({
  length = 6,
  value = '',
  onChange,
  label,
  hint,
  error,
  disabled = false,
  isLoading = false,
  id,
  name,
  onCancelRequest,
}: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const inputId = id || name || 'otp';
  const hasError = Boolean(error);
  const isDisabled = disabled || isLoading;

  const focusInput = useCallback((index: number) => {
    const input = inputRefs.current[index];
    if (input) {
      input.focus();
      input.select();
    }
  }, []);

  const handleChange = useCallback(
    (index: number, e: ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      // Only allow single digit
      const digit = inputValue.slice(-1);
      if (digit && !/^\d$/.test(digit)) return;

      const newValue = value.split('');
      newValue[index] = digit;
      const updatedValue = newValue.join('').slice(0, length);

      onChange?.(updatedValue);

      // Move to next input if digit entered
      if (digit && index < length - 1) {
        focusInput(index + 1);
      }
    },
    [value, length, onChange, focusInput]
  );

  const handleKeyDown = useCallback(
    (index: number, e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace') {
        e.preventDefault();

        const newValue = value.split('');

        if (newValue[index]) {
          // Clear current input
          newValue[index] = '';
          onChange?.(newValue.join(''));
        } else if (index > 0) {
          // Clear previous input and focus it
          newValue[index - 1] = '';
          onChange?.(newValue.join(''));
          focusInput(index - 1);
        }
      } else if (e.key === 'ArrowLeft' && index > 0) {
        e.preventDefault();
        focusInput(index - 1);
      } else if (e.key === 'ArrowRight' && index < length - 1) {
        e.preventDefault();
        focusInput(index + 1);
      }
    },
    [value, length, onChange, focusInput]
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);

      if (pastedData) {
        onChange?.(pastedData);

        // Focus last filled input or last input
        const focusIndex = Math.min(pastedData.length, length) - 1;
        focusInput(focusIndex);
      }
    },
    [length, onChange, focusInput]
  );

  const baseInputClasses = `
    w-10 h-12 sm:w-12 sm:h-14 md:w-[60px] md:h-[60px]
    !text-center text-base sm:text-lg font-medium
    border rounded-sm
    outline-none transition-colors text-black
  `;

  const stateClasses = isDisabled
    ? 'bg-gray-100 border-gray-200 text-neutral-gray cursor-not-allowed'
    : hasError
      ? 'border-error focus:border-error focus:ring-1 focus:ring-error'
      : 'border-navy focus:border-primary focus:ring-1 focus:ring-primary';

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={`${inputId}-0`} className="block text-sm font-normal text-black/70 mb-2">
          {label}
        </label>
      )}

      <div className="flex items-center gap-2 sm:gap-3">
        <div
          className="flex gap-2 sm:gap-3"
          role="group"
          aria-label={label || 'OTP Input'}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        >
          {Array.from({ length }, (_, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              id={`${inputId}-${index}`}
              type="text"
              inputMode="numeric"
              pattern="\d*"
              maxLength={1}
              value={value[index] || ''}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              disabled={isDisabled}
              aria-invalid={hasError}
              aria-label={`Digit ${index + 1} of ${length}`}
              className={`${baseInputClasses} ${stateClasses}`}
              autoComplete={index === 0 ? 'one-time-code' : 'off'}
            />
          ))}
        </div>
        {isLoading && (
          <span className="animate-spin inline-block h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
        )}
      </div>

      <div className="flex items-center justify-between gap-2">
        {error && (
          <div
            id={`${inputId}-error`}
            className="flex items-center gap-1.5 mt-1 flex-wrap"
            role="alert"
          >
            <img src={InfoIconError} alt="" className="w-4 h-4 shrink-0" />
            <AppHintText variant="error" className="font-light text-base! ml-1!">
              {error}
            </AppHintText>
          </div>
        )}

        {/* Cancel link - always show when handler provided */}
        {onCancelRequest && error && (
          <button
            type="button"
            onClick={onCancelRequest}
            className="font-light text-base text-primary underline mt-1 hover:text-primary/80 cursor-pointer"
          >
            Cancel Request
          </button>
        )}
      </div>

      {hint && !error && <AppHintText id={`${inputId}-hint`}>{hint}</AppHintText>}
    </div>
  );
}
