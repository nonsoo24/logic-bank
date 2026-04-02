import { Link } from 'react-router-dom';
import { Layout } from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import {
  ListImage1,
  ListImage2,
  ListImage3,
  AccountDetails,
  AccountSync,
  BookAccount,
  FluentPhone,
  PhoneAddFilled,
  SolarUser,
} from '@/assets/svg';

interface ServiceRequirement {
  text: string;
  note?: string;
}

interface ServiceCard {
  id: string;
  title: string;
  icon: string;
  requirements: ServiceRequirement[];
  actionText: string;
  actionLink: string;
}

const services: ServiceCard[] = [
  {
    id: 'account-conversion',
    title: 'Account Conversion/ Migration',
    icon: AccountSync,
    requirements: [
      { text: 'BVN' },
      { text: 'NIN' },
      { text: 'Proof of Identity', note: '(Notarized if applicable)' },
      { text: 'Proof of Address', note: '(Notarized if applicable)' },
    ],
    actionText: 'Convert your account',
    actionLink: '/account-conversion',
  },
  {
    id: 'account-upgrade',
    title: 'Account Upgrade (Tier 1 and 2)',
    icon: SolarUser,
    requirements: [{ text: 'BVN' }, { text: 'NIN' }, { text: 'Proof of Identity' }],
    actionText: 'Upgrade Tier 1 or Tier 2 account',
    actionLink: '/account-upgrade',
  },
  {
    id: 'address-update',
    title: 'Address Update',
    icon: AccountDetails,
    requirements: [
      { text: 'BVN' },
      { text: 'NIN' },
      { text: 'Proof of Identity' },
      { text: 'Proof of Address' },
    ],
    actionText: 'Update address',
    actionLink: '/address-update',
  },
  {
    id: 'dob-update',
    title: 'Date of Birth Update',
    icon: BookAccount,
    requirements: [
      { text: 'BVN' },
      { text: 'Valid ID Card' },
      { text: 'Proof of Identity or Court Affidavit' },
    ],
    actionText: 'Update your date of birth',
    actionLink: '/dob-update',
  },
  {
    id: 'dormant-reactivation',
    title: 'Dormant Account Reactivation',
    icon: ListImage2,
    requirements: [
      { text: 'BVN' },
      { text: 'NIN' },
      { text: 'Proof of Identity', note: '(Notarized if applicable)' },
      { text: 'Proof of Address', note: '(Notarized if applicable)' },
    ],
    actionText: 'Reactivate an account',
    actionLink: '/dormant-reactivation',
  },
  {
    id: 'email-update',
    title: 'Email Update',
    icon: ListImage1,
    requirements: [{ text: 'BVN' }, { text: 'NIN' }],
    actionText: 'Update your email address',
    actionLink: '/email-update',
  },
  {
    id: 'identity-document',
    title: 'Identity Document Update',
    icon: ListImage3,
    requirements: [{ text: 'BVN' }, { text: 'NIN' }, { text: 'Proof of Identity' }],
    actionText: 'Update identification document',
    actionLink: ROUTES.CONSENT,
  },
  {
    id: 'phone-update',
    title: 'Phone Number Update',
    icon: FluentPhone,
    requirements: [{ text: 'BVN' }, { text: 'NIN' }],
    actionText: 'Update your phone number',
    actionLink: '/phone-update',
  },
  {
    id: 'bvn-update',
    title: 'BVN Update',
    icon: PhoneAddFilled,
    requirements: [{ text: 'Proof of Identity' }, { text: 'Affidavit' }],
    actionText: 'Update your BVN',
    actionLink: '/bvn-update',
  },
];

function ServiceIcon({ icon }: { icon: string }) {
  return (
    <div className="w-12 h-12 bg-navy rounded-[10px] p-3 flex items-center justify-center">
      <img src={icon} alt="" className="w-full h-full" />
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-success shrink-0" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function HomePage() {
  return (
    <Layout showFooter bgColor="bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <p className="text-sm text-neutral-gray mb-6">
          Kindly select an account management service
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-surface-light rounded-lg border border-gray-200 p-4 sm:p-6 flex flex-col"
            >
              <ServiceIcon icon={service.icon} />

              <h3 className="text-xl font-normal text-navy mt-4 mb-3">{service.title}</h3>

              <ul className="space-y-1.5 flex-1 mb-4">
                {service.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-neutral-gray">
                    <CheckIcon />
                    <span>
                      {req.text}
                      {req.note && (
                        <span className="text-neutral-black/70 text-base font-normal">
                          {' '}
                          {req.note}
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                to={service.actionLink}
                className="text-navy font-bold text-sm underline hover:text-navy/80 mt-auto"
              >
                {service.actionText}
              </Link>
            </div>
          ))}
        </div>
      </main>
    </Layout>
  );
}

export default HomePage;
