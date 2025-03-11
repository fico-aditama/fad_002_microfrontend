import { Suspense, Component, ErrorInfo, useRef, useEffect } from 'react';
import { createApp, h, DefineComponent } from 'vue';

interface RemoteModule {
  default: DefineComponent<{}, {}, any>;
}

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

const VueWrapper: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      console.error('Container ref is null');
      return;
    }

    console.log('Attempting to load remote module from http://localhost:5174/assets/remoteEntry.js');
    let cleanup: () => void;

    // Tambahkan penundaan 1 detik untuk memastikan server siap
    const loadModule = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      try {
        const module: RemoteModule = await import('remoteApp/WeatherWidget');
        console.log('Remote module loaded successfully:', module);
        const vueComponent = module.default;
        const app = createApp({
          render: () => h(vueComponent),
        });
        app.mount(container);
        cleanup = () => app.unmount();
      } catch (err: unknown) {
        console.error('Failed to load or mount Vue component:', err);
      }
    };

    loadModule();

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return <div ref={containerRef} />;
};

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
              <VueWrapper />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}

export default App;