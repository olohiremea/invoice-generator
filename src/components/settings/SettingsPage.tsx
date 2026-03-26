import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Input, Textarea } from '../ui/Input';
import { Button } from '../ui/Button';
import { LogoUploader } from './LogoUploader';
import { CURRENCIES } from '../../utils/currencies';

export function SettingsPage() {
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);

  const [businessName, setBusinessName] = useState(settings.businessName);
  const [invoicePrefix, setInvoicePrefix] = useState(settings.invoicePrefix);
  const [currency, setCurrency] = useState(settings.currency);
  const [footerNote, setFooterNote] = useState(settings.footerNote);
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    updateSettings({ businessName, invoicePrefix, currency, footerNote });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="p-6 max-w-lg">
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
            <div className="w-40">
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

        <div className="flex items-center gap-3">
          <Button type="submit">Save Settings</Button>
          {saved && <span className="text-sm text-green-600 font-medium">Saved!</span>}
        </div>
      </form>
    </div>
  );
}
