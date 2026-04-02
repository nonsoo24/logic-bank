import { AppLogo, Headset, Search } from '@/assets/svg';
import { BANK_NAME_SHORT } from '@/shared/constants';
import { AppButton } from '../AppButton';

export interface NavbarProps {
  showTermsCheckbox?: boolean;
  title?: string;
}

export function Navbar({
  showTermsCheckbox = false,
  title = 'Account Management Portal',
}: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      {/* Top navigation bar */}
      <div className="border-b border-gray-100">
        <div className="px-4 sm:px-6 md:px-10 lg:px-14 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="/" aria-label={`${BANK_NAME_SHORT} Home`}>
              <img src={AppLogo} alt={BANK_NAME_SHORT} className="h-8" />
            </a>

            {showTermsCheckbox && (
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked
                    readOnly
                    className="peer w-4 h-4 border-2 border-primary rounded appearance-none cursor-pointer checked:bg-primary checked:border-primary"
                  />
                  <svg
                    className="absolute w-2.5 h-2.5 text-white pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-sm text-primary underline">Accept Terms & Conditions</span>
              </label>
            )}
          </div>

          <nav className="flex items-center gap-1 sm:gap-2">
            <a
              href="https://www.firstbanknigeria.com"
              className="hidden sm:inline text-primary underline underline-offset-2 text-sm font-medium hover:text-primary-blue"
              target="_blank"
            >
              Open a FirstBank account
            </a>

            <button
              type="button"
              aria-label="Search"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <img src={Search} alt="" className="w-5 h-5" />
            </button>

            <AppButton
              variant="solid"
              color="accent"
              size="sm"
              className="rounded-lg!"
              iconStart={<img src={Headset} alt="" className="w-4 h-4" />}
            >
              <span className="hidden sm:inline">Help</span>
            </AppButton>
          </nav>
        </div>
      </div>

      {/* Page title bar */}
      <div className="bg-navy text-white h-12 sm:h-15 flex items-center px-4 sm:px-6 md:px-10 lg:px-14">
        <h1 className="text-lg sm:text-xl md:text-2xl font-normal">{title}</h1>
      </div>
    </header>
  );
}
