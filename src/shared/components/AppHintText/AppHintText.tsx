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
  className = 'mt-1',
  id,
}: AppHintTextProps) {
  return (
    <p id={id} className={`text-sm ${variantClasses[variant]} ${className}`}>
      {children}
    </p>
  );
}
