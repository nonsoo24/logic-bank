import type { ReactNode } from 'react';
import { Navbar, type NavbarProps } from '../Navbar';
import { Footer } from '../Footer';

const LAYOUT_TOP_SPACING = 'pt-32 sm:pt-36';

export interface LayoutProps extends NavbarProps {
  /** Page content */
  children: ReactNode;
  /** Whether to show the footer. Defaults to true */
  showFooter?: boolean;
  /** Background color class. Defaults to 'bg-white' */
  bgColor?: string;
  /** Additional className for the main wrapper */
  className?: string;
}

/**
 * Layout component that wraps pages with Navbar and optional Footer.
 * Provides consistent spacing for the fixed header.
 *
 * @example
 * ```tsx
 * <Layout showFooter>
 *   <main className="max-w-7xl mx-auto px-4">
 *     <h1>Page Content</h1>
 *   </main>
 * </Layout>
 * ```
 */
export function Layout({
  children,
  showFooter = false,
  bgColor = 'bg-white',
  className = '',
  ...navbarProps
}: LayoutProps) {
  return (
    <div className={`min-h-screen ${bgColor} ${LAYOUT_TOP_SPACING} ${className}`.trim()}>
      <Navbar {...navbarProps} />
      {children}
      {showFooter && <Footer />}
    </div>
  );
}
