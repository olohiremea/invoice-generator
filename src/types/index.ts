export interface Package {
  id: string;
  name: string;
  description: string;
  unitPrice: number;
  unit: string;
  currency: string;
}

export interface LineItem {
  packageId: string;
  packageName: string;
  description: string;
  unitPrice: number;
  unit: string;
  quantity: number;
  currency: string;
}

export type DiscountType = 'percentage' | 'flat';

export interface Discount {
  type: DiscountType;
  value: number;
}

export interface CurrencyTotal {
  currency: string;
  subtotal: number;
  discountAmount: number;
  total: number;
}

export interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  sortCode: string;
  iban: string;
  swift: string;
}

export interface BusinessSettings {
  businessName: string;
  logoDataUrl: string | null;
  invoicePrefix: string;
  nextInvoiceNumber: number;
  currency: string;
  footerNote: string;
  paymentTerms: string;
  bankDetails: BankDetails;
  accentColor: string;
}

export interface ActiveInvoice {
  invoiceNumber: string;
  issueDate: string;
  client: {
    name: string;
    phone: string;
  };
  lineItems: LineItem[];
  discount: Discount | null;
  notes: string;
}

export type AppView = 'packages' | 'invoice' | 'settings';
