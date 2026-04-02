import {
  useCallback,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
  type DragEvent,
  type ChangeEvent,
} from 'react';
import { AppHintText } from '../AppHintText';
import { UploadIcon, AttachmentIcon } from '@/assets/svg';

export interface FileUploadHandle {
  triggerUpload: () => void;
}

export interface FileUploadProps {
  label?: string;
  hint?: string;
  error?: string;
  accept?: string;
  maxSizeMB?: number;
  disabled?: boolean;
  value?: File | null;
  onChange?: (file: File | null) => void;
  onError?: (message: string) => void;
  onBeforeUpload?: () => boolean | void;
  id?: string;
  name?: string;
}

const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg'];

function formatFileSize(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(2)} MB`;
}

export const FileUpload = forwardRef<FileUploadHandle, FileUploadProps>(function FileUpload(
  {
    label,
    hint = 'Supported files: PDF and JPG, 10.00MB maximum size',
    error,
    accept = '.pdf,.jpg,.jpeg',
    maxSizeMB = 10,
    disabled = false,
    value,
    onChange,
    onError,
    onBeforeUpload,
    id,
    name,
  },
  ref
) {
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const skipBeforeUploadRef = useRef(false);
  const inputId = id || name;
  const displayError = error || localError;
  const hasError = Boolean(displayError);
  const hasFile = Boolean(value);

  useImperativeHandle(ref, () => ({
    triggerUpload: () => {
      // Skip the onBeforeUpload check when triggered programmatically
      skipBeforeUploadRef.current = true;
      inputRef.current?.click();
    },
  }));

  const validateAndSetFile = useCallback(
    (file: File | null) => {
      // Clear previous local error
      setLocalError(null);

      if (!file) {
        onChange?.(null);
        return;
      }

      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        const errorMsg = 'Only PDF and JPG files are allowed';
        setLocalError(errorMsg);
        onError?.(errorMsg);
        return;
      }

      // Validate file size
      if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
        const errorMsg = `File size (${formatFileSize(file.size)}) exceeds ${maxSizeMB}MB limit`;
        setLocalError(errorMsg);
        onError?.(errorMsg);
        return;
      }

      onChange?.(file);
    },
    [maxSizeMB, onChange, onError]
  );

  const handleDragOver = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!disabled) setIsDragging(true);
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled) return;

      // Check onBeforeUpload for drag-drop as well
      if (onBeforeUpload) {
        const shouldContinue = onBeforeUpload();
        if (shouldContinue === false) return;
      }

      const file = e.dataTransfer.files[0];
      if (file) {
        validateAndSetFile(file);
      }
    },
    [disabled, validateAndSetFile, onBeforeUpload]
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      validateAndSetFile(file);
    },
    [validateAndSetFile]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return;

      // Skip onBeforeUpload if triggered programmatically via triggerUpload
      if (skipBeforeUploadRef.current) {
        skipBeforeUploadRef.current = false;
        return;
      }

      if (onBeforeUpload) {
        const shouldContinue = onBeforeUpload();
        if (shouldContinue === false) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
      }
    },
    [disabled, onBeforeUpload]
  );

  const baseClasses = `
    relative flex flex-col items-center justify-center
    min-h-[120px] px-6 py-8
    border-2 border-dashed rounded-lg
    transition-colors cursor-pointer
  `;

  const stateClasses = disabled
    ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
    : hasError
      ? 'border-error bg-red-50'
      : hasFile
        ? 'border-primary/50 bg-primary/5'
        : isDragging
          ? 'border-primary bg-primary/10'
          : 'border-neutral-gray/30 bg-white hover:border-primary/50 hover:bg-primary/5';

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-base font-normal text-neutral-gray mb-2">
          {label}
        </label>
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`${baseClasses} ${stateClasses}`}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        aria-describedby={displayError ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
      >
        <input
          ref={inputRef}
          type="file"
          id={inputId}
          name={name}
          accept={accept}
          disabled={disabled}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          aria-invalid={hasError}
        />

        {hasFile && value ? (
          <div className="flex flex-col items-center text-center">
            <img src={AttachmentIcon} alt="" className="w-6 h-6 mb-2" aria-hidden="true" />
            <a
              href={URL.createObjectURL(value)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline text-sm font-medium"
              onClick={(e) => e.stopPropagation()}
            >
              {value.name}
            </a>
            <span className="text-neutral-gray text-sm mt-1">({formatFileSize(value.size)})</span>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <img src={UploadIcon} alt="" className="w-6 h-6 mb-2" aria-hidden="true" />
            <p className="text-sm">
              <span className="text-primary underline font-light text-xs">Choose file</span>
              <span className="text-black text-xs"> or drag here</span>
            </p>
            <p className="text-xs text-black mt-1 font-light">{hint}</p>
          </div>
        )}
      </div>

      {displayError && (
        <AppHintText variant="error" id={`${inputId}-error`}>
          {displayError}
        </AppHintText>
      )}
    </div>
  );
});
