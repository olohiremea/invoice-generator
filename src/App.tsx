import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { AppView } from './types';
import { useAppStore } from './store/useAppStore';
import { useAuth } from './hooks/useAuth';
import { AppShell } from './components/layout/AppShell';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { PackageManager } from './components/packages/PackageManager';
import { InvoiceBuilder } from './components/invoice/InvoiceBuilder';
import { InvoicePreview } from './components/preview/InvoicePreview';
import { PreviewActions } from './components/preview/PreviewActions';
import { SettingsPage } from './components/settings/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';

function AppContent() {
  const [view, setView] = useState<AppView>('invoice');
  const accentColor = useAppStore((s) => s.settings.accentColor);
  const loadFromSupabase = useAppStore((s) => s.loadFromSupabase);
  const { user } = useAuth();

  // Apply accent colour to CSS custom property
  useEffect(() => {
    document.documentElement.style.setProperty('--accent', accentColor ?? '#2563EB');
  }, [accentColor]);

  // Load user data from Supabase when logged in
  useEffect(() => {
    if (user) loadFromSupabase(user.id);
  }, [user, loadFromSupabase]);

  return (
    <AppShell currentView={view} onNavigate={setView}>
      {view === 'packages' && <PackageManager />}

      {view === 'invoice' && (
        <div className="flex h-full">
          <div className="w-[480px] shrink-0 overflow-y-auto border-r border-gray-200">
            <InvoiceBuilder />
          </div>
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppContent />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
