import { lazy, Suspense } from 'react';

// Lazy load RemotePage dari Remote App
const RemotePage = lazy(() => import('remoteApp/RemotePage'));

function App() {
  return (
    <div className="p-5 bg-gray-100 min-h-screen">
      <Suspense fallback={<div>Loading Remote Page...</div>}>
        <RemotePage />
      </Suspense>
    </div>
  );
}

export default App;
