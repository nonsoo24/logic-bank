import { useNavigate } from 'react-router-dom';
import { Layout, AppButton } from '@/shared/components';
import { ROUTES, APP_CONFIG } from '@/shared/constants';
import { useIdentityDocumentStore } from '../store';

const ACTION_BUTTON_CLASS = 'w-full sm:w-[18rem]';

export function ConsentPage() {
  const navigate = useNavigate();
  const { acceptConsent, resetFlow } = useIdentityDocumentStore();

  const handleReject = () => {
    resetFlow();
    navigate(ROUTES.HOME);
  };

  const handleAgree = () => {
    acceptConsent();
    navigate(ROUTES.IDENTITY_DOCUMENT);
  };

  return (
    <Layout>
      <main className="px-4 sm:px-6 md:px-12 pb-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg sm:text-xl font-medium text-black uppercase tracking-wide text-left mb-4 sm:mb-6">
            Personal Data Processing Consent Form
          </h2>

          <p className="text-black font-medium text-base sm:text-lg md:text-[20px] mb-3 text-left">
            Kindly read and accept the following conditions to proceed
          </p>

          <div className="space-y-3 sm:space-y-4 text-sm text-black leading-5 sm:leading-6 mb-6 sm:mb-8 text-left py-2">
            <p>
              To enable {APP_CONFIG.BANK_NAME_FULL} ("{APP_CONFIG.BANK_NAME_SHORT}") provide you
              with its products and services, you hereby fully authorize{' '}
              {APP_CONFIG.BANK_NAME_SHORT} and its affiliates in the {APP_CONFIG.PARENT_COMPANY} to
              collect, record, use, share, store, process and disclose all information (including
              Personal Data and Sensitive Personal Data as defined in the{' '}
              {APP_CONFIG.DATA_PROTECTION_ACT} and other applicable Data protection
              laws/regulations) relating to you and your accounts, including, without limitation,
              any personal data, information obtained from you or from third parties, usage of your
              account(s), transactions/payments conducted on your account(s), references provided
              and any other credit information maintained with or obtained by{' '}
              {APP_CONFIG.BANK_NAME_SHORT} and its affiliates in the {APP_CONFIG.PARENT_COMPANY}{' '}
              (including those obtained from credit reference agencies).
            </p>

            <p>
              You further authorize {APP_CONFIG.BANK_NAME_SHORT} and its affiliates in the{' '}
              {APP_CONFIG.PARENT_COMPANY} to use your information to manage and administer your
              account, to share your information with service providers, debt collection agencies,
              third-party partners, third party intermediaries, statutory, governmental or
              regulatory bodies, credit reference and fraud prevention agencies and tax authorities.
            </p>

            <p>
              You acknowledge and agree that any such sharing or transfer of information will be on
              a confidential basis and according to the provisions of the{' '}
              {APP_CONFIG.DATA_PROTECTION_ACT_SHORT}. For more information on our privacy policy,
              please visit {APP_CONFIG.PRIVACY_POLICY_URL}
            </p>

            <p>
              If you wish to withdraw your consent or have concerns relating to the processing of
              your personal information, you may do so at any time by notifying us through{' '}
              {APP_CONFIG.CONTACT_EMAIL} or {APP_CONFIG.DATA_PROTECTION_EMAIL}. We will respond to
              your concerns within {APP_CONFIG.RESPONSE_DAYS} days of receiving your notice.
            </p>

            <p>
              You hereby confirm that you have read and understood the content of this consent form.
              You hereby grant your consent to {APP_CONFIG.FULL_ADDRESS} to process your Information
              including Personal Data and Sensitive Personal Data.
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

export default ConsentPage;
