import { AppRoutes } from './app/routes';
import { ErrorBoundary } from '@/shared/components';

function App() {
  return (
    <ErrorBoundary>
      <AppRoutes />
    </ErrorBoundary>
  );
}

export default App;
