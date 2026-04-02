import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@/shared/components';
import { ROUTES } from '@/shared/constants';

const HomePage = lazy(() =>
  import('@/features/account-management/pages/HomePage').then((module) => ({
    default: module.HomePage,
  }))
);

const ConsentPage = lazy(() =>
  import('@/features/account-management/pages/ConsentPage').then((module) => ({
    default: module.ConsentPage,
  }))
);

const TermsPage = lazy(() =>
  import('@/features/account-management/pages/TermsPage').then((module) => ({
    default: module.TermsPage,
  }))
);

const IdentityDocumentPage = lazy(() =>
  import('@/features/account-management/pages/IdentityDocumentPage').then((module) => ({
    default: module.IdentityDocumentPage,
  }))
);

const RouteNotFound = lazy(() =>
  import('./RouteNotFound').then((module) => ({
    default: module.RouteNotFound,
  }))
);

function RouteLoadingFallback() {
  return (
    <Layout>
      <main className="px-4 sm:px-6 md:px-12 pb-8">
        <div className="max-w-3xl mx-auto rounded-lg border border-gray-200 bg-white p-6 sm:p-10 text-center shadow-sm">
          <p className="text-sm sm:text-base text-neutral-gray">Loading page...</p>
        </div>
      </main>
    </Layout>
  );
}

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteLoadingFallback />}>
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.CONSENT} element={<ConsentPage />} />
          <Route path={ROUTES.TERMS} element={<TermsPage />} />
          <Route path={ROUTES.IDENTITY_DOCUMENT} element={<IdentityDocumentPage />} />
          <Route path="*" element={<RouteNotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};
