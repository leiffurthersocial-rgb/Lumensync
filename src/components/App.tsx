'use client';

import { useEffect, useState } from 'react';
import { registerServiceWorker } from '@/lib/platform/pwa';

export function App() {
  const [isolated, setIsolated] = useState<boolean | null>(null);
  useEffect(() => {
    setIsolated(window.crossOriginIsolated);
    void registerServiceWorker();
  }, []);
  return (
    <div className="app-root flex flex-col">
      <header className="flex h-14 items-center gap-3 border-b border-line bg-panel px-4">
        <span className="text-lg font-semibold tracking-tight">LumenSync</span>
      </header>
      <main className="flex flex-1 items-center justify-center text-muted" data-testid="empty-state">
        <p>Setting up… {isolated === false ? '(cross-origin isolation unavailable)' : ''}</p>
      </main>
    </div>
  );
}
