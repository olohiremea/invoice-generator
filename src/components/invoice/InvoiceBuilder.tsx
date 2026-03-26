import { ShoppingCart } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../ui/Button';
import { ClientInfoSection } from './ClientInfoSection';
import { PackageSelector } from './PackageSelector';
import { LineItemRow } from './LineItemRow';
import { DiscountSection } from './DiscountSection';
import { InvoiceSummary } from './InvoiceSummary';

export function InvoiceBuilder() {
  const lineItems = useAppStore((s) => s.activeInvoice.lineItems);
  const invoiceNumber = useAppStore((s) => s.activeInvoice.invoiceNumber);
  const resetActiveInvoice = useAppStore((s) => s.resetActiveInvoice);

  return (
    <div className="p-6 flex flex-col gap-5 max-w-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">New Invoice</h1>
          <p className="text-sm text-gray-500 mt-0.5">#{invoiceNumber}</p>
        </div>
        <Button variant="secondary" size="sm" onClick={resetActiveInvoice}>
          Clear
        </Button>
      </div>

      {/* Client info */}
      <ClientInfoSection />

      {/* Package selector */}
      <PackageSelector />

      {/* Selected line items */}
      {lineItems.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Selected Items</h2>
          <div>
            {lineItems.map((item) => (
              <LineItemRow key={item.packageId} item={item} />
            ))}
          </div>
        </div>
      )}

      {lineItems.length === 0 && (
        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-6 text-center">
          <ShoppingCart size={28} className="mx-auto text-gray-300 mb-2" />
          <p className="text-sm text-gray-400">No packages selected yet.</p>
        </div>
      )}

      {/* Discount */}
      <DiscountSection />

      {/* Summary */}
      <InvoiceSummary />
    </div>
  );
}
