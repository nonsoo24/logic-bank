import { useCallback, useEffect, useRef, type MouseEvent } from 'react';
import { CautionOutline, InfoIcon, ErrorIcon, SuccessIcon } from '@/assets/svg';
import { AppButton } from '@/shared/components/AppButton';

const MODAL_DIALOG_CLASS = 'backdrop:bg-navy/60 bg-transparent p-4 sm:p-6 m-auto';
const MODAL_PANEL_CLASS =
  'bg-white rounded-lg p-6 sm:p-8 w-[min(92vw,42rem)] text-center shadow-xl';

export type ModalVariant = 'info' | 'success' | 'error' | 'warning';

export interface ModalButton {
  label: string;
  onClick: () => void;
}

export interface ModalProps {
  isOpen: boolean;
  variant: ModalVariant;
  title: string;
  description?: string;
  primaryButton: ModalButton;
  secondaryButton?: ModalButton;
  onClose?: () => void;
  hideIcon?: boolean;
  children?: React.ReactNode;
}

const variantConfig: Record<ModalVariant, { icon: string; iconAlt: string }> = {
  info: {
    icon: InfoIcon,
    iconAlt: 'Information',
  },
  success: {
    icon: SuccessIcon,
    iconAlt: 'Success',
  },
  error: {
    icon: ErrorIcon,
    iconAlt: 'Error',
  },
  warning: {
    icon: CautionOutline,
    iconAlt: 'Warning',
  },
};

export function Modal({
  isOpen,
  variant,
  title,
  description,
  primaryButton,
  secondaryButton,
  onClose,
  hideIcon,
  children,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleBackdropClick = useCallback((event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) {
      dialogRef.current?.close();
    }
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => onClose?.();
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onClose]);

  const config = variantConfig[variant];

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      className={MODAL_DIALOG_CLASS}
      onClick={handleBackdropClick}
      aria-labelledby="modal-title"
      aria-describedby={description ? 'modal-description' : undefined}
    >
      <div className={MODAL_PANEL_CLASS}>
        {!hideIcon && (
          <div className="flex justify-center mb-6">
            <img src={config.icon} alt={config.iconAlt} className="w-16 h-16" />
          </div>
        )}

        <h2 id="modal-title" className="text-xl font-bold text-neutral-dark mb-2 text-center!">
          {title}
        </h2>

        {children ? (
          <div className="mb-8">{children}</div>
        ) : (
          description && (
            <p id="modal-description" className="text-neutral-gray text-sm mb-8 text-center!">
              {description}
            </p>
          )
        )}

        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 justify-center">
          {secondaryButton && (
            <AppButton
              variant="outline"
              color="primary"
              label={secondaryButton.label}
              onClick={secondaryButton.onClick}
              className="w-full sm:min-w-35"
            />
          )}
          <AppButton
            variant="solid"
            color="primary"
            label={primaryButton.label}
            onClick={primaryButton.onClick}
            className="w-full sm:min-w-35"
          />
        </div>
      </div>
    </dialog>
  );
}
