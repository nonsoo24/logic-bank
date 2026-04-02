import {
  HomePage,
  ConsentPage,
  TermsPage,
  IdentityDocumentPage,
} from '@/features/account-management/pages';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ROUTES } from '@/shared/constants';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.CONSENT} element={<ConsentPage />} />
        <Route path={ROUTES.TERMS} element={<TermsPage />} />
        <Route path={ROUTES.IDENTITY_DOCUMENT} element={<IdentityDocumentPage />} />
      </Routes>
    </BrowserRouter>
  );
};
