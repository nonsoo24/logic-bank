import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AppLogo } from '@/assets/svg';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  handleGoHome = (): void => {
    window.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback
          error={this.state.error}
          onRetry={this.handleRetry}
          onGoHome={this.handleGoHome}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  onRetry: () => void;
  onGoHome: () => void;
}

function ErrorFallback({ error, onRetry, onGoHome }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <img src={AppLogo} alt="First Bank" className="h-12 w-auto mx-auto mb-8" />

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-semibold text-navy mb-2">Something went wrong</h1>
          <p className="text-neutral-gray mb-6">
            We're sorry, but something unexpected happened. Please try again or return to the home
            page.
          </p>

          {error && import.meta.env.DEV && (
            <details className="mb-6 text-left bg-gray-100 rounded p-4 text-sm">
              <summary className="cursor-pointer text-navy font-medium mb-2">Error Details</summary>
              <pre className="text-red-600 whitespace-pre-wrap break-words overflow-auto max-h-40">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </details>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onRetry}
              className="px-6 py-2.5 bg-navy text-white rounded font-medium hover:bg-navy/90 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={onGoHome}
              className="px-6 py-2.5 border border-navy text-navy rounded font-medium hover:bg-navy/5 transition-colors"
            >
              Go to Home
            </button>
          </div>
        </div>

        <p className="text-sm text-neutral-gray mt-6">
          If this problem persists, please contact{' '}
          <a href="mailto:support@firstbanknigeria.com" className="text-navy underline">
            support
          </a>
        </p>
      </div>
    </div>
  );
}

export default ErrorBoundary;
