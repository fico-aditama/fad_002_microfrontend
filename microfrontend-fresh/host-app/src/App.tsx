import { Suspense, Component, ErrorInfo, useRef, useEffect, useState } from 'react';
import { createApp, h, DefineComponent } from 'vue';

interface RemoteModule {
  default: DefineComponent<{ city?: string }, {}, any>;
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
      return (
        <div className="alert alert-danger text-center animate__animated animate__bounceIn" role="alert">
          <strong>Oops!</strong> Failed to load Weather Widget. Please try again later.
        </div>
      );
    }
    return this.props.children;
  }
}

const VueWrapper: React.FC<{ city: string }> = ({ city }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      console.error('Container ref is null');
      return;
    }

    console.log('Attempting to load remote module from http://localhost:5174/assets/remoteEntry.js');
    let cleanup: () => void;

    const loadModule = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      try {
        const module: RemoteModule = await import('remoteApp/WeatherWidget');
        console.log('Remote module loaded successfully:', module);
        const vueComponent = module.default;
        const app = createApp({
          render: () => h(vueComponent, { city }),
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
  }, [city]);

  return <div ref={containerRef} className="w-100" />;
};

function App() {
  const [searchCity, setSearchCity] = useState<string>('Jakarta');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem('city') as HTMLInputElement;
    setSearchCity(input.value.trim());
  };

  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #6b7280, #d1d5db)' }}>
      <div className="container my-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="card border-0 shadow-lg rounded-4 bg-white bg-opacity-90">
              <div className="card-body p-4 p-md-5">
                {/* Header */}
                <h1 className="card-title text-center mb-5 fw-bold display-5" style={{ color: '#343a40' }}>
                  Weather Dashboard
                </h1>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="mb-5">
                  <div className="input-group input-group-lg">
                    <span className="input-group-text bg-light border-0" style={{ backgroundColor: '#f8f9fa' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      name="city"
                      className="form-control py-3 px-4 border-0 shadow-sm"
                      placeholder="Enter city name (e.g., Jakarta)"
                      style={{ borderRadius: '1.5rem', backgroundColor: '#f8f9fa' }}
                    />
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg px-5 py-3 ms-2 rounded-pill shadow-sm"
                      style={{ backgroundColor: '#0d6efd', borderColor: '#0d6efd' }}
                    >
                      Search
                    </button>
                  </div>
                </form>

                {/* Weather Widget */}
                <div className="row justify-content-center">
                  <div className="col-12 col-md-10">
                    <ErrorBoundary>
                      <Suspense
                        fallback={
                          <div className="text-center text-muted py-4 animate__animated animate__pulse animate__infinite">
                            <div className="spinner-border text-primary me-2" role="status" style={{ width: '2rem', height: '2rem' }}>
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            Loading Weather Data...
                          </div>
                        }
                      >
                        <VueWrapper city={searchCity} />
                      </Suspense>
                    </ErrorBoundary>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-white mt-4 py-3 w-100" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
        <p className="mb-0">Powered by CX Microfrontend Technology</p>
      </footer>
    </div>
  );
}

export default App;