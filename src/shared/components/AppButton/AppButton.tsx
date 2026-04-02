import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'solid' | 'outline' | 'ghost';
export type ButtonColor = 'primary' | 'accent' | 'neutral';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface AppButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  label?: string;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  isLoading?: boolean;
  children?: ReactNode;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-base w-[192px]',
  lg: 'h-12 px-8 text-base',
};

const variantClasses: Record<ButtonColor, Record<ButtonVariant, string>> = {
  primary: {
    solid: 'bg-navy text-white hover:bg-navy-dark',
    outline: 'bg-white border border-navy text-navy hover:bg-gray-50 rounded-xs',
    ghost: 'bg-transparent text-navy hover:bg-gray-100',
  },
  accent: {
    solid: 'bg-accent-gold text-navy-dark hover:brightness-95',
    outline: 'bg-white border border-accent-gold text-navy-dark hover:bg-amber-50',
    ghost: 'bg-transparent text-navy-dark hover:bg-amber-50',
  },
  neutral: {
    solid: 'bg-neutral-dark text-white hover:bg-neutral-black',
    outline: 'bg-white border border-neutral-gray text-neutral-dark hover:bg-gray-50',
    ghost: 'bg-transparent text-neutral-dark hover:bg-gray-100',
  },
};

const disabledClasses = 'opacity-50 cursor-not-allowed';

export function AppButton({
  variant = 'solid',
  color = 'primary',
  size = 'md',
  label,
  iconStart,
  iconEnd,
  isLoading = false,
  disabled,
  className = '',
  children,
  ...props
}: AppButtonProps) {
  const isDisabled = disabled || isLoading;
  const content = label || children;

  return (
    <button
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center gap-2
        font-medium transition-all rounded-xs cursor-pointer
        ${sizeClasses[size]}
        ${variantClasses[color][variant]}
        ${isDisabled ? disabledClasses : ''}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
      ) : (
        <>
          {iconStart}
          {content && <span className="font-medium text-xs">{content}</span>}
          {iconEnd}
        </>
      )}
    </button>
  );
}
