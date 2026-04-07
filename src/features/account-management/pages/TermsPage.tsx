import { useNavigate } from 'react-router-dom';
import { LegalAgreement } from '@/shared/components';
import { APP_CONFIG, ROUTES } from '@/shared/constants';
import { useIdentityDocumentStore, useAccountStore } from '../store';

export function TermsPage() {
  const navigate = useNavigate();
  const { acceptTerms, rejectTerms } = useIdentityDocumentStore();
  const { accountName } = useAccountStore();

  const handleBack = () => {
    navigate(ROUTES.IDENTITY_DOCUMENT);
  };

  const handleReject = () => {
    rejectTerms();
    navigate(ROUTES.HOME);
  };

  const handleAgree = () => {
    acceptTerms();
    navigate(ROUTES.IDENTITY_DOCUMENT);
  };

  return (
    <LegalAgreement
      title="Account Maintenance Terms and Conditions"
      onBack={handleBack}
      onReject={handleReject}
      onAgree={handleAgree}
    >
      <p>
        I, <strong>{accountName || 'Account Holder'}</strong>, hereby provide my consent to{' '}
        {APP_CONFIG.BANK_NAME_FULL} ("{APP_CONFIG.BANK_NAME_SHORT}") to open the following
        account(s) on my behalf:
      </p>

      <ol className="list-decimal list-inside space-y-1 my-4">
        <li>Account Type: [e.g., Savings Account/Checking Account]</li>
        <li>Account Currency: [e.g., USD, EUR]</li>
        <li>Additional Account (if applicable): [Specify if opening multiple accounts]</li>
      </ol>

      <p>
        I understand and agree to abide by the terms and conditions set forth by{' '}
        {APP_CONFIG.BANK_NAME_SHORT}, and I acknowledge receipt of the bank's account agreement and
        related documents. I confirm that all information provided for the account maintenance
        process is true, accurate, and complete to the best of my knowledge.
      </p>

      <p>
        I authorize {APP_CONFIG.BANK_NAME_SHORT} to conduct any necessary background checks and
        verifications to assess my eligibility for maintaining the specified account(s). This
        includes, but is not limited to, verifying identity documents, employment details, and
        contacting references.
      </p>

      <p>
        I am aware that the account(s) may be subject to applicable fees, charges, and terms as
        outlined by the bank, and I accept responsibility for any such fees incurred in connection
        with the account maintenance.
      </p>

      <p>
        I understand that {APP_CONFIG.BANK_NAME_SHORT} may provide electronic statements, notices,
        and other communications related to my account(s), and I consent to receive such
        communications electronically.
      </p>

      <p>
        I acknowledge that the account(s) may be governed by the laws and regulations of the
        jurisdiction in which the bank operates, and I agree to comply with all applicable laws and
        regulations.
      </p>

      <p>
        I understand that {APP_CONFIG.BANK_NAME_SHORT} may update its terms and conditions from time
        to time, and I agree to be bound by the revised terms upon notification by the bank.
      </p>

      <p>
        I further authorize {APP_CONFIG.BANK_NAME_SHORT} to disclose information related to my
        account(s) to its affiliates, agents, and regulatory authorities, as required by law or for
        the purpose of providing banking services.
      </p>

      <p>
        By clicking "I Agree", I acknowledge that I have read and understood the contents of this
        Account Maintenance Terms and Conditions, and I willingly provide my consent to proceed with{' '}
        {APP_CONFIG.BANK_NAME_SHORT}.
      </p>
    </LegalAgreement>
  );
}

export default TermsPage;
