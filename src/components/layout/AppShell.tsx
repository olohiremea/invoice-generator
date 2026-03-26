import React from 'react';
import { Package, FileText, Settings } from 'lucide-react';
import type { AppView } from '../../types';

interface AppShellProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  children: React.ReactNode;
}

const navItems: { view: AppView; label: string; icon: React.ReactNode }[] = [
  { view: 'packages', label: 'Packages', icon: <Package size={18} /> },
  { view: 'invoice', label: 'New Invoice', icon: <FileText size={18} /> },
  { view: 'settings', label: 'Settings', icon: <Settings size={18} /> },
];

export function AppShell({ currentView, onNavigate, children }: AppShellProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="no-print w-56 shrink-0 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-5 py-5 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <FileText size={20} className="accent-text" />
            <span className="font-semibold text-gray-900 text-sm">InvoiceApp</span>
          </div>
        </div>
        <nav className="flex-1 p-3 flex flex-col gap-1">
          {navItems.map(({ view, label, icon }) => (
            <button
              key={view}
              onClick={() => onNavigate(view)}
              className={`
                flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium w-full text-left
                transition-colors duration-150 cursor-pointer
                ${currentView === view
                  ? 'nav-active'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
              `}
            >
              {icon}
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
