import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Input, Textarea } from '../ui/Input';
import { Button } from '../ui/Button';
import { LogoUploader } from './LogoUploader';
import { BankDetailsSection } from './BankDetailsSection';
import { ColorPicker } from './ColorPicker';
import { CURRENCIES } from '../../utils/currencies';
import type { BankDetails } from '../../types';

const PAYMENT_TERM_PRESETS = [
  'Due on Receipt',
  'Net 7',
  'Net 14',
  'Net 30',
  'Net 60',
  'Custom',
];

export function SettingsPage() {
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);

  const [businessName, setBusinessName] = useState(settings.businessName);
  const [invoicePrefix, setInvoicePrefix] = useState(settings.invoicePrefix);
  const [currency, setCurrency] = useState(settings.currency);
  const [footerNote, setFooterNote] = useState(settings.footerNote);
  const [accentColor, setAccentColor] = useState(settings.accentColor ?? '#2563EB');
  const [bankDetails, setBankDetails] = useState<BankDetails>(
    settings.bankDetails ?? {
      bankName: '', accountName: '', accountNumber: '', sortCode: '', iban: '', swift: '',
    }
  );

  // Payment terms: track whether a preset is selected or custom text
  const isCustom = !PAYMENT_TERM_PRESETS.slice(0, -1).includes(settings.paymentTerms ?? '');
  const [paymentTermsPreset, setPaymentTermsPreset] = useState(
    isCustom ? 'Custom' : (settings.paymentTerms ?? 'Due on Receipt')
  );
  const [customPaymentTerms, setCustomPaymentTerms] = useState(isCustom ? (settings.paymentTerms ?? '') : '');

  const [saved, setSaved] = useState(false);

  function getEffectivePaymentTerms() {
    return paymentTermsPreset === 'Custom' ? customPaymentTerms : paymentTermsPreset;
  }

  function handleAccentChange(color: string) {
    setAccentColor(color);
    // Apply immediately so the page updates in real time
    document.documentElement.style.setProperty('--accent', color);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    updateSettings({
      businessName,
      invoicePrefix,
      currency,
      footerNote,
      accentColor,
      bankDetails,
      paymentTerms: getEffectivePaymentTerms(),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Configure your business information and invoice defaults.
        </p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        {/* Logo */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <LogoUploader />
        </div>

        {/* Accent colour */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <ColorPicker value={accentColor} onChange={handleAccentChange} />
        </div>

        {/* Business info */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-gray-700">Business Information</h2>
          <Input
            label="Business Name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="My Business"
          />
        </div>

        {/* Invoice defaults */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-gray-700">Invoice Defaults</h2>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                label="Invoice Prefix"
                value={invoicePrefix}
                onChange={(e) => setInvoicePrefix(e.target.value)}
                placeholder="INV-"
              />
            </div>
            <div className="w-44">
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} — {c.symbol}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Textarea
            label="Footer Note"
            value={footerNote}
            onChange={(e) => setFooterNote(e.target.value)}
            placeholder="Thank you for your business!"
            rows={2}
          />
        </div>

        {/* Payment terms */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-gray-700">Payment Terms</h2>
          <div className="flex flex-wrap gap-2">
            {PAYMENT_TERM_PRESETS.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => setPaymentTermsPreset(term)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors cursor-pointer
                  ${paymentTermsPreset === term
                    ? 'btn-accent border-transparent'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'}`}
              >
                {term}
              </button>
            ))}
          </div>
          {paymentTermsPreset === 'Custom' && (
            <Input
              label="Custom payment terms"
              value={customPaymentTerms}
              onChange={(e) => setCustomPaymentTerms(e.target.value)}
              placeholder="e.g. 50% upfront, 50% on delivery"
            />
          )}
        </div>

        {/* Bank details */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-700">Bank Details</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              These will appear on your invoices so clients know where to send payment.
            </p>
          </div>
          <BankDetailsSection value={bankDetails} onChange={setBankDetails} />
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit">Save Settings</Button>
          {saved && <span className="text-sm text-green-600 font-medium">Saved!</span>}
        </div>
      </form>
    </div>
  );
}
