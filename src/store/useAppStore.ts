import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { ActiveInvoice, BusinessSettings, Package } from '../types';
import { todayISO } from '../utils/formatters';

const DEFAULT_SETTINGS: BusinessSettings = {
  businessName: 'My Business',
  logoDataUrl: null,
  invoicePrefix: 'INV-',
  nextInvoiceNumber: 1,
  currency: 'USD',
  footerNote: 'Thank you for your business!',
};

const SEED_PACKAGES: Package[] = [
  {
    id: uuidv4(),
    name: 'Website Design',
    description: 'Custom responsive website design (up to 5 pages)',
    unitPrice: 1500,
    unit: 'project',
  },
  {
    id: uuidv4(),
    name: 'SEO Package',
    description: 'Monthly search engine optimization and reporting',
    unitPrice: 500,
    unit: 'month',
  },
  {
    id: uuidv4(),
    name: 'Consulting (Hourly)',
    description: 'One-on-one business or technical consulting',
    unitPrice: 150,
    unit: 'hour',
  },
];

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
  settings: BusinessSettings;
  packages: Package[];
  activeInvoice: ActiveInvoice;

  updateSettings: (patch: Partial<BusinessSettings>) => void;

  addPackage: (pkg: Omit<Package, 'id'>) => void;
  updatePackage: (id: string, patch: Partial<Omit<Package, 'id'>>) => void;
  deletePackage: (id: string) => void;

  updateActiveInvoice: (patch: Partial<ActiveInvoice>) => void;
  resetActiveInvoice: () => void;
  bumpInvoiceNumber: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_SETTINGS,
      packages: SEED_PACKAGES,
      activeInvoice: freshInvoice(DEFAULT_SETTINGS.invoicePrefix, DEFAULT_SETTINGS.nextInvoiceNumber),

      updateSettings: (patch) =>
        set((s) => ({ settings: { ...s.settings, ...patch } })),

      addPackage: (pkg) =>
        set((s) => ({ packages: [...s.packages, { ...pkg, id: uuidv4() }] })),

      updatePackage: (id, patch) =>
        set((s) => ({
          packages: s.packages.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),

      deletePackage: (id) =>
        set((s) => ({ packages: s.packages.filter((p) => p.id !== id) })),

      updateActiveInvoice: (patch) =>
        set((s) => ({ activeInvoice: { ...s.activeInvoice, ...patch } })),

      resetActiveInvoice: () => {
        const { settings } = get();
        const num = settings.nextInvoiceNumber;
        set((s) => ({
          activeInvoice: freshInvoice(s.settings.invoicePrefix, num),
          settings: { ...s.settings, nextInvoiceNumber: num + 1 },
        }));
      },

      bumpInvoiceNumber: () => {
        const { settings, activeInvoice } = get();
        if (activeInvoice.invoiceNumber !== makeInvoiceNumber(settings.invoicePrefix, settings.nextInvoiceNumber - 1)) {
          set((s) => ({
            activeInvoice: {
              ...s.activeInvoice,
              invoiceNumber: makeInvoiceNumber(s.settings.invoicePrefix, s.settings.nextInvoiceNumber),
            },
            settings: { ...s.settings, nextInvoiceNumber: s.settings.nextInvoiceNumber + 1 },
          }));
        }
      },
    }),
    {
      name: 'invoice-app-store',
    }
  )
);
