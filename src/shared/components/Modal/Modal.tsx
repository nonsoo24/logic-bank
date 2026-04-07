import { useCallback, useEffect, useRef, type MouseEvent } from 'react';
import { CautionOutline, InfoIcon, ErrorIcon, SuccessIcon } from '@/assets/svg';
import { AppButton } from '@/shared/components/AppButton';

const MODAL_DIALOG_CLASS = 'backdrop:bg-navy/60 bg-transparent p-4 m-auto';
const MODAL_PANEL_CLASS =
  'bg-white rounded-lg px-8 py-10 sm:px-12 sm:py-12 w-full max-w-[calc(100vw-2rem)] sm:max-w-[480px] min-h-[354px] flex flex-col items-center justify-center text-center shadow-xl';

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
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
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

  return (
    <dialog
      ref={dialogRef}
      className={MODAL_DIALOG_CLASS}
      onClick={handleBackdropClick}
      aria-labelledby="modal-title"
      aria-describedby={description ? 'modal-description' : undefined}
    >
      {isOpen && (
        <div className={MODAL_PANEL_CLASS}>
          {!hideIcon && (
            <div className="flex justify-center mb-4">
              <img src={config.icon} alt={config.iconAlt} className="w-14 h-14" />
            </div>
          )}

          <h2
            id="modal-title"
            className="text-xl font-bold text-neutral-dark mb-2 text-center! mt-5"
          >
            {title}
          </h2>

          {children ? (
            <div className="mb-6">{children}</div>
          ) : (
            description && (
              <p id="modal-description" className="text-neutral-gray text-sm mb-6 text-center!">
                {description}
              </p>
            )
          )}

          <div className="w-full flex flex-col-reverse sm:flex-row gap-4 justify-center mt-4">
            {secondaryButton && (
              <AppButton
                variant="outline"
                color="primary"
                label={secondaryButton.label}
                onClick={secondaryButton.onClick}
                className="w-full sm:w-48 h-10 rounded px-4 py-2"
                textClassName="text-base font-semibold leading-[150%]"
              />
            )}
            <AppButton
              variant="solid"
              color="primary"
              label={primaryButton.label}
              onClick={primaryButton.onClick}
              className="w-full sm:w-48 h-10 rounded px-4 py-2"
              textClassName="text-base font-semibold leading-[150%]"
            />
          </div>
        </div>
      )}
    </dialog>
  );
}
