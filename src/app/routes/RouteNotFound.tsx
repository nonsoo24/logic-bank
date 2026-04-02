import { Link } from 'react-router-dom';
import { AppButton, Layout } from '@/shared/components';
import { ROUTES } from '@/shared/constants';

export function RouteNotFound() {
  return (
    <Layout>
      <main className="px-4 sm:px-6 md:px-12 pb-8">
        <div className="max-w-3xl mx-auto rounded-lg border border-gray-200 bg-white p-6 sm:p-10 text-center shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-gray">
            404 Error
          </p>
          <h1 className="mt-3 text-2xl sm:text-3xl font-semibold text-navy">Page not found</h1>
          <p className="mt-3 text-sm sm:text-base text-neutral-gray">
            The page you requested does not exist or is not available yet.
          </p>

          <div className="mt-6 flex justify-center">
            <Link to={ROUTES.HOME}>
              <AppButton variant="solid" color="primary" className="w-full sm:w-[18rem]">
                Return home
              </AppButton>
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default RouteNotFound;
