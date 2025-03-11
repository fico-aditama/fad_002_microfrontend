import { lazy, Suspense, Component, ErrorInfo } from 'react';

const WeatherWidget = lazy(() => import('remoteApp/WeatherWidget'));

class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error loading remote module:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="text-red-500">Failed to load Weather Widget</div>;
    }
    return this.props.children;
  }
}

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Welcome to Microfrontend Dashboard
        </h1>
        <div className="flex justify-center">
          <ErrorBoundary>
            <Suspense fallback={<div className="text-gray-500">Loading Weather Widget...</div>}>
              <WeatherWidget />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}

export default App;