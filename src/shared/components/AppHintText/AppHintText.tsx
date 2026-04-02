interface AppHintTextProps {
  children: React.ReactNode;
  variant?: 'default' | 'error' | 'success';
  className?: string;
  id?: string;
}

const variantClasses = {
  default: 'text-neutral-gray',
  error: 'text-error',
  success: 'text-green-600',
};

export function AppHintText({
  children,
  variant = 'default',
  className = '',
  id,
}: AppHintTextProps) {
  return (
    <p id={id} className={`text-sm mt-1 ${variantClasses[variant]} ${className}`}>
      {children}
    </p>
  );
}
