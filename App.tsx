import React, { Suspense } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { I18nProvider } from './src/providers/I18nProvider';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { KeyboardShortcuts } from './components/KeyboardShortcuts';

const DashboardPage = React.lazy(() => import('./app/page'));

const App: React.FC = () => {
  return (
    <I18nProvider>
      <ErrorBoundary>
        <Suspense fallback={<div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>}>
          <DashboardPage />
        </Suspense>
        <KeyboardShortcuts />
      </ErrorBoundary>
    </I18nProvider>
  );
};

export default App;