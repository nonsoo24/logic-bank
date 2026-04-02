import { useNavigate } from 'react-router-dom';
import { Layout, AppButton } from '@/shared/components';
import { ArrowLeft } from '@/assets/svg';
import { BANK_NAME, ROUTES } from '@/shared/constants';
import { useIdentityDocumentStore, useAccountStore } from '../store';

const ACTION_BUTTON_CLASS = 'w-full sm:w-[18rem]';

export function TermsPage() {
  const navigate = useNavigate();
  const { acceptTerms, rejectTerms } = useIdentityDocumentStore();
  const { accountName } = useAccountStore();

  const handleBack = () => {
    navigate(-1);
  };

  const handleReject = () => {
    rejectTerms();
    navigate(ROUTES.HOME);
  };

  const handleAgree = () => {
    acceptTerms();
    navigate(-1);
  };

  return (
    <Layout>
      <main className="px-4 sm:px-6 md:px-12 pb-8">
        <div className="max-w-4xl mx-auto">
          <button
            type="button"
            onClick={handleBack}
            className="mb-6 hover:opacity-70 transition-opacity cursor-pointer"
            aria-label="Go back"
          >
            <img src={ArrowLeft} alt="" className="w-6 h-6" />
          </button>

          <h2 className="text-lg sm:text-xl font-bold text-black mb-4 sm:mb-6">
            Account Maintenance Terms and Conditions
          </h2>

          <div className="space-y-3 sm:space-y-4 text-sm text-black leading-relaxed mb-6 sm:mb-8">
            <p>
              I, <strong>{accountName || '[Your Full Name or Legal Entity Name]'}</strong>, hereby
              provide my consent to {BANK_NAME}
              {` `}to open the following account(s) on my behalf:
            </p>

            <ol className="list-decimal list-inside space-y-1 pl-2">
              <li>Account Type: [e.g., Savings Account/Checking Account]</li>
              <li>Account Currency: [e.g., USD, EUR]</li>
              <li>Additional Account (if applicable): [Specify if opening multiple accounts]</li>
            </ol>

            <p>
              I understand and agree to abide by the terms and conditions set forth by {BANK_NAME},
              and I acknowledge receipt of the bank's account agreement and related documents. I
              confirm that all information provided for the account opening process is true,
              accurate, and complete to the best of my knowledge.
            </p>

            <p>
              I authorize the bank to conduct any necessary background checks and verifications to
              assess my eligibility for opening and maintaining the specified account(s). This
              includes, but is not limited to, obtaining credit reports, verifying employment
              details, and contacting references.
            </p>

            <p>
              I am aware that the account(s) may be subject to applicable fees, charges, and terms
              as outlined by the bank, and I accept responsibility for any such fees incurred in
              connection with the account(s).
            </p>

            <p>
              I understand that the bank may provide electronic statements, notices, and other
              communications related to my account(s), and I consent to receive such communications
              electronically.
            </p>

            <p>
              I acknowledge that the account(s) may be governed by the laws and regulations of the
              jurisdiction in which the bank operates, and I agree to comply with all applicable
              laws and regulations.
            </p>

            <p>
              I understand that the bank may update its terms and conditions from time to time, and
              I agree to be bound by the revised terms upon notification by the bank.
            </p>

            <p>
              I further authorize the bank to disclose information related to my account(s) to its
              affiliates, agents, and regulatory authorities, as required by law or for the purpose
              of providing banking services.
            </p>

            <p>
              By signing below, I acknowledge that I have read and understood the contents of this
              Account Opening Consent Form, and I willingly provide my consent to open the specified
              account(s) with {BANK_NAME}.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <AppButton
              variant="outline"
              color="primary"
              className={ACTION_BUTTON_CLASS}
              onClick={handleReject}
            >
              I Reject
            </AppButton>
            <AppButton
              variant="solid"
              color="primary"
              className={ACTION_BUTTON_CLASS}
              onClick={handleAgree}
            >
              I Agree
            </AppButton>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default TermsPage;
