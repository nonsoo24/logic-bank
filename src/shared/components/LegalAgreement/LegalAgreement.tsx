import { type ReactNode, useId } from 'react';
import { Layout, AppButton, BackHeader } from '@/shared/components';

const ACTION_BUTTON_CLASS = 'w-full sm:w-[18rem]';

export interface LegalAgreementProps {
  /** Page title displayed in the header */
  title: string;
  /** Optional subtitle/instruction text below the title */
  subtitle?: string;
  /** The legal content to display */
  children: ReactNode;
  /** Label for the reject button */
  rejectLabel?: string;
  /** Label for the agree button */
  agreeLabel?: string;
  /** Called when user rejects */
  onReject: () => void;
  /** Called when user agrees */
  onAgree: () => void;
  /** Show back button and call this when clicked */
  onBack?: () => void;
  /** Whether to show the title in uppercase */
  uppercaseTitle?: boolean;
}

export function LegalAgreement({
  title,
  subtitle,
  children,
  rejectLabel = 'I Reject',
  agreeLabel = 'I Agree',
  onReject,
  onAgree,
  onBack,
  uppercaseTitle = false,
}: LegalAgreementProps) {
  const contentId = useId();

  return (
    <Layout>
      {onBack && <BackHeader title={title} onBack={onBack} />}

      <main className="px-4 sm:px-6 md:px-12 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          {!onBack && (
            <h2
              className={`text-2xl sm:text-2xl font-medium text-black text-left mb-4 sm:mb-6 ${
                uppercaseTitle ? 'uppercase tracking-wide' : ''
              }`}
            >
              {title}
            </h2>
          )}

          {subtitle && (
            <p className="text-black font-medium text-base sm:text-lg md:text-xl mb-3 text-left">
              {subtitle}
            </p>
          )}

          <div
            id={contentId}
            className="space-y-3 sm:space-y-4 text-sm text-black leading-5 sm:leading-6 mb-6 sm:mb-8 text-left py-2"
          >
            {children}
          </div>

          <div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
            role="group"
            aria-label="Agreement actions"
          >
            <AppButton
              variant="outline"
              color="primary"
              className={ACTION_BUTTON_CLASS}
              onClick={onReject}
              aria-describedby={contentId}
            >
              {rejectLabel}
            </AppButton>
            <AppButton
              variant="solid"
              color="primary"
              className={ACTION_BUTTON_CLASS}
              onClick={onAgree}
              aria-describedby={contentId}
            >
              {agreeLabel}
            </AppButton>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default LegalAgreement;
