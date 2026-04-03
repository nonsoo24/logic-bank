import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import FooterBG from '@/assets/svg/Footer.svg';
import { AppLogoSymbol } from '@/assets/svg';
import { APP_CONFIG } from '@/shared/constants';
import {
  footerSections,
  languages,
  socialLinksData,
  SOCIAL_ICONS,
  type FooterSection,
  type LanguageOption,
} from './footer.data';

// Reusable SVG icon wrapper
function SvgIcon({ path, className = 'w-4 h-4' }: { path: string; className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d={path} />
    </svg>
  );
}

// Reusable social link component
function SocialLink({
  iconKey,
  href,
  label,
}: {
  iconKey: keyof typeof SOCIAL_ICONS;
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-full bg-navy flex items-center justify-center hover:bg-white/20 transition-colors"
      aria-label={label}
    >
      <SvgIcon path={SOCIAL_ICONS[iconKey]} />
    </a>
  );
}

// Reusable footer section component
function FooterLinkSection({ title, links }: FooterSection) {
  return (
    <div>
      <h4 className="text-xs font-bold tracking-wider mb-4">{title}</h4>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.text}>
            <Link
              to={link.href}
              className="text-sm text-white/80 hover:text-white transition-colors"
            >
              {link.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Reusable language dropdown component
function LanguageDropdown({
  languages,
  selectedLanguage,
  onSelect,
}: {
  languages: LanguageOption[];
  selectedLanguage: string;
  onSelect: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedLabel = languages.find((l) => l.value === selectedLanguage)?.label || 'English';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white text-navy px-4 py-2 rounded min-w-35 text-sm font-medium"
      >
        <span>{selectedLabel}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white rounded shadow-lg z-10 min-w-35">
          {languages.map((lang) => (
            <button
              key={lang.value}
              onClick={() => {
                onSelect(lang.value);
                setIsOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-navy ${
                selectedLanguage === lang.value ? 'bg-gray-50 font-medium' : ''
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Footer() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className="bg-navy text-white bg-cover bg-center bg-no-repeat mt-30"
      style={{ backgroundImage: `url(${FooterBG})` }}
    >
      <div className="max-w-6xl mx-auto py-10 md:py-14 px-4 sm:px-6 lg:px-8">
        {/* Top Section: Logo, Language Select, Social Icons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 pb-6 md:pb-8 border-b border-accent-gold">
          <div className="flex items-center gap-3 sm:gap-4">
            <img src={AppLogoSymbol} alt="First Bank" className="h-8 sm:h-10 w-auto" />
            <LanguageDropdown
              languages={languages}
              selectedLanguage={selectedLanguage}
              onSelect={setSelectedLanguage}
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {socialLinksData.map((link) => (
              <SocialLink key={link.label} {...link} />
            ))}
          </div>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 py-8 md:py-10">
          {footerSections.map((section) => (
            <FooterLinkSection key={section.title} {...section} />
          ))}
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 pt-6 md:pt-8 border-t border-accent-gold">
          <p className="text-xs text-white/70">
            © {new Date().getFullYear()} {APP_CONFIG.BANK_NAME_FULL}. A{' '}
            {APP_CONFIG.PARENT_COMPANY.replace(' Group', '')} Company. Licensed by the Central Bank
            of Nigeria
          </p>

          <button
            onClick={scrollToTop}
            className="text-sm text-white/80 hover:text-white transition-colors"
          >
            Back to Top
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
