import { useState, useEffect } from 'react';
import type { AppView } from './types';
import { useAppStore } from './store/useAppStore';
import { AppShell } from './components/layout/AppShell';
import { PackageManager } from './components/packages/PackageManager';
import { InvoiceBuilder } from './components/invoice/InvoiceBuilder';
import { InvoicePreview } from './components/preview/InvoicePreview';
import { PreviewActions } from './components/preview/PreviewActions';
import { SettingsPage } from './components/settings/SettingsPage';

function App() {
  const [view, setView] = useState<AppView>('invoice');
  const accentColor = useAppStore((s) => s.settings.accentColor);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', accentColor ?? '#2563EB');
  }, [accentColor]);

  return (
    <AppShell currentView={view} onNavigate={setView}>
      {view === 'packages' && <PackageManager />}

      {view === 'invoice' && (
        <div className="flex h-full">
          {/* Left: form */}
          <div className="w-[480px] shrink-0 overflow-y-auto border-r border-gray-200">
            <InvoiceBuilder />
          </div>
          {/* Right: live preview */}
          <div className="flex-1 overflow-y-auto bg-gray-100 p-6">
            <div className="flex items-center justify-between mb-4 no-print">
              <h2 className="text-sm font-semibold text-gray-600">Preview</h2>
              <PreviewActions />
            </div>
            <InvoicePreview />
          </div>
        </div>
      )}

      {view === 'settings' && <SettingsPage />}
    </AppShell>
  );
}

export default App;
