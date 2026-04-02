/**
 * Centralized route constants for the application.
 * Update route paths here when needed - all usages will automatically update.
 */

export const ROUTES = {
  HOME: '/',
  CONSENT: '/consent',
  TERMS: '/terms',
  IDENTITY_DOCUMENT: '/identity-document',
} as const;

// Type for route values
export type RouteValue = (typeof ROUTES)[keyof typeof ROUTES];

/**
 * Page titles for each route
 */
export const PAGE_TITLES: Record<RouteValue, string> = {
  [ROUTES.HOME]: 'Home Page',
  [ROUTES.CONSENT]: 'Consent',
  [ROUTES.TERMS]: 'Terms & Conditions',
  [ROUTES.IDENTITY_DOCUMENT]: 'Identity Document',
};
