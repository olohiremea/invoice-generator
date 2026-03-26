import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { ActiveInvoice, BusinessSettings, Package } from '../types';
import { todayISO } from '../utils/formatters';
import {
  fetchSettings,
  saveSettings,
  fetchPackages,
  insertPackage,
  patchPackage,
  removePackage,
} from '../lib/api';

const DEFAULT_SETTINGS: BusinessSettings = {
  businessName: 'My Business',
  logoDataUrl: null,
  invoicePrefix: 'INV-',
  nextInvoiceNumber: 1,
  currency: 'USD',
  footerNote: 'Thank you for your business!',
  paymentTerms: 'Due on Receipt',
  bankDetails: {
    bankName: '', accountName: '', accountNumber: '', sortCode: '', iban: '', swift: '',
  },
  accentColor: '#2563EB',
};

function makeInvoiceNumber(prefix: string, num: number): string {
  return `${prefix}${String(num).padStart(4, '0')}`;
}

function freshInvoice(prefix: string, num: number): ActiveInvoice {
  return {
    invoiceNumber: makeInvoiceNumber(prefix, num),
    issueDate: todayISO(),
    client: { name: '', phone: '' },
    lineItems: [],
    discount: null,
    notes: '',
  };
}

interface AppState {
  userId: string | null;
  settings: BusinessSettings;
  packages: Package[];
  activeInvoice: ActiveInvoice;
  dataLoading: boolean;

  // Called once after login to hydrate from Supabase
  loadFromSupabase: (userId: string) => Promise<void>;

  updateSettings: (patch: Partial<BusinessSettings>) => void;

  addPackage: (pkg: Omit<Package, 'id'>) => void;
  updatePackage: (id: string, patch: Partial<Omit<Package, 'id'>>) => void;
  deletePackage: (id: string) => void;

  updateActiveInvoice: (patch: Partial<ActiveInvoice>) => void;
  resetActiveInvoice: () => void;
}

export const useAppStore = create<AppState>()((set) => ({
  userId: null,
  settings: DEFAULT_SETTINGS,
  packages: [],
  activeInvoice: freshInvoice(DEFAULT_SETTINGS.invoicePrefix, DEFAULT_SETTINGS.nextInvoiceNumber),
  dataLoading: false,

  loadFromSupabase: async (userId: string) => {
    set({ dataLoading: true, userId });
    try {
      const [remoteSettings, remotePackages] = await Promise.all([
        fetchSettings(userId),
        fetchPackages(userId),
      ]);

      const merged: BusinessSettings = {
        ...DEFAULT_SETTINGS,
        ...(remoteSettings ?? {}),
      };

      set({
        settings: merged,
        packages: remotePackages,
        // Fresh invoice uses the loaded prefix + number
        activeInvoice: freshInvoice(merged.invoicePrefix, merged.nextInvoiceNumber),
      });
    } finally {
      set({ dataLoading: false });
    }
  },

  updateSettings: (patch) => {
    set((s) => {
      const next = { ...s.settings, ...patch };
      if (s.userId) saveSettings(s.userId, next).catch(console.error);
      return { settings: next };
    });
  },

  addPackage: (pkg) => {
    const id = uuidv4();
    set((s) => {
      const newPkg: Package = { ...pkg, id };
      if (s.userId) insertPackage(s.userId, pkg, id).catch(console.error);
      return { packages: [...s.packages, newPkg] };
    });
  },

  updatePackage: (id, patch) => {
    set((s) => {
      patchPackage(id, patch).catch(console.error);
      return {
        packages: s.packages.map((p) => (p.id === id ? { ...p, ...patch } : p)),
      };
    });
  },

  deletePackage: (id) => {
    set((s) => {
      removePackage(id).catch(console.error);
      return { packages: s.packages.filter((p) => p.id !== id) };
    });
  },

  updateActiveInvoice: (patch) =>
    set((s) => ({ activeInvoice: { ...s.activeInvoice, ...patch } })),

  resetActiveInvoice: () => {
    set((s) => {
      const num = s.settings.nextInvoiceNumber;
      const next: BusinessSettings = { ...s.settings, nextInvoiceNumber: num + 1 };
      if (s.userId) saveSettings(s.userId, next).catch(console.error);
      return {
        activeInvoice: freshInvoice(s.settings.invoicePrefix, num),
        settings: next,
      };
    });
  },
}));
