import { useNavigate } from 'react-router-dom';
import { LegalAgreement } from '@/shared/components';
import { ROUTES, APP_CONFIG } from '@/shared/constants';
import { useIdentityDocumentStore, useAccountStore, useFileUploadStore } from '../store';

export function ConsentPage() {
  const navigate = useNavigate();
  const { acceptConsent, resetFlow } = useIdentityDocumentStore();
  const { reset: resetAccount } = useAccountStore();
  const { clearFiles } = useFileUploadStore();

  const handleReject = () => {
    // Reset all stores to clear persisted data
    resetFlow();
    resetAccount();
    clearFiles();
    navigate(ROUTES.HOME);
  };

  const handleAgree = () => {
    acceptConsent();
    navigate(ROUTES.IDENTITY_DOCUMENT);
  };

  return (
    <LegalAgreement
      title="Personal Data Processing Consent Form"
      subtitle="Kindly read and accept the following conditions to proceed"
      uppercaseTitle
      onReject={handleReject}
      onAgree={handleAgree}
    >
      <p>
        To enable {APP_CONFIG.BANK_NAME_FULL} ("{APP_CONFIG.BANK_NAME_SHORT}") provide you with its
        products and services, you hereby fully authorize {APP_CONFIG.BANK_NAME_SHORT} and its
        affiliates in the {APP_CONFIG.PARENT_COMPANY} to collect, record, use, share, store, process
        and disclose all information (including Personal Data and Sensitive Personal Data as defined
        in the {APP_CONFIG.DATA_PROTECTION_ACT} and other applicable Data protection
        laws/regulations) relating to you and your accounts, including, without limitation, any
        personal data, information obtained from you or from third parties, usage of your
        account(s), transactions/payments conducted on your account(s), references provided and any
        other credit information maintained with or obtained by {APP_CONFIG.BANK_NAME_SHORT} and its
        affiliates in the {APP_CONFIG.PARENT_COMPANY} (including those obtained from credit
        reference agencies).
      </p>

      <p>
        You further authorize {APP_CONFIG.BANK_NAME_SHORT} and its affiliates in the{' '}
        {APP_CONFIG.PARENT_COMPANY} to use your information to manage and administer your account,
        to share your information with service providers, debt collection agencies, third-party
        partners, third party intermediaries, statutory, governmental or regulatory bodies, credit
        reference and fraud prevention agencies and tax authorities.
      </p>

      <p>
        You acknowledge and agree that any such sharing or transfer of information will be on a
        confidential basis and according to the provisions of the{' '}
        {APP_CONFIG.DATA_PROTECTION_ACT_SHORT}. For more information on our privacy policy, please
        visit{' '}
        <a
          href={APP_CONFIG.PRIVACY_POLICY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline hover:opacity-80"
        >
          {APP_CONFIG.PRIVACY_POLICY_URL}
        </a>
      </p>

      <p>
        If you wish to withdraw your consent or have concerns relating to the processing of your
        personal information, you may do so at any time by notifying us through{' '}
        <a
          href={`mailto:${APP_CONFIG.CONTACT_EMAIL}`}
          className="text-primary underline hover:opacity-80"
        >
          {APP_CONFIG.CONTACT_EMAIL}
        </a>{' '}
        or{' '}
        <a
          href={`mailto:${APP_CONFIG.DATA_PROTECTION_EMAIL}`}
          className="text-primary underline hover:opacity-80"
        >
          {APP_CONFIG.DATA_PROTECTION_EMAIL}
        </a>
        . We will respond to your concerns within {APP_CONFIG.RESPONSE_DAYS} days of receiving your
        notice.
      </p>

      <p>
        You hereby confirm that you have read and understood the content of this consent form. You
        hereby grant your consent to {APP_CONFIG.FULL_ADDRESS} to process your Information including
        Personal Data and Sensitive Personal Data.
      </p>
    </LegalAgreement>
  );
}

export default ConsentPage;
