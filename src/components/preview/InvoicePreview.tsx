import { useAppStore } from '../../store/useAppStore';
import { buildMultiCurrencyTotals } from '../../utils/calculations';
import { formatCurrency, formatDate } from '../../utils/formatters';

export function InvoicePreview() {
  const invoice = useAppStore((s) => s.activeInvoice);
  const settings = useAppStore((s) => s.settings);
  const groups = buildMultiCurrencyTotals(invoice.lineItems, invoice.discount);

  return (
    <div
      id="invoice-preview"
      className="bg-white shadow-sm border border-gray-200 rounded-xl p-8 text-sm print-only"
      style={{ minWidth: 480 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          {settings.logoDataUrl ? (
            <img
              src={settings.logoDataUrl}
              alt="Business logo"
              className="max-h-16 max-w-40 object-contain mb-2"
            />
          ) : (
            <div className="w-14 h-14 rounded-lg bg-blue-100 flex items-center justify-center mb-2">
              <span className="text-blue-600 font-bold text-xl">
                {settings.businessName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <p className="font-bold text-gray-900 text-base">{settings.businessName}</p>
        </div>
        <div className="text-right">
          <h1 className="text-2xl font-bold text-blue-700 mb-1">INVOICE</h1>
          <p className="text-gray-500">#{invoice.invoiceNumber}</p>
          <p className="text-gray-500 mt-1">Date: {formatDate(invoice.issueDate)}</p>
        </div>
      </div>

      {/* Bill To */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Bill To</p>
        {invoice.client.name ? (
          <>
            <p className="font-semibold text-gray-900">{invoice.client.name}</p>
            {invoice.client.phone && (
              <p className="text-gray-600">{invoice.client.phone}</p>
            )}
          </>
        ) : (
          <p className="text-gray-300 italic">Client name will appear here</p>
        )}
      </div>

      {/* Line Items */}
      <div className="mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-900">
              <th className="text-left py-2 font-semibold text-gray-700 pr-4">Description</th>
              <th className="text-center py-2 font-semibold text-gray-700 w-14">Qty</th>
              <th className="text-right py-2 font-semibold text-gray-700 w-28">Unit Price</th>
              <th className="text-right py-2 font-semibold text-gray-700 w-28">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.lineItems.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 text-center text-gray-300 italic">
                  No items added yet
                </td>
              </tr>
            ) : (
              invoice.lineItems.map((item) => (
                <tr key={item.packageId} className="border-b border-gray-100">
                  <td className="py-3 pr-4">
                    <p className="font-medium text-gray-900">{item.packageName}</p>
                    {item.description && (
                      <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                    )}
                  </td>
                  <td className="py-3 text-center text-gray-700">{item.quantity}</td>
                  <td className="py-3 text-right text-gray-700">
                    {formatCurrency(item.unitPrice, item.currency)}
                    <span className="text-xs text-gray-400 ml-1">{item.currency}</span>
                  </td>
                  <td className="py-3 text-right font-medium text-gray-900">
                    {formatCurrency(item.unitPrice * item.quantity, item.currency)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Totals — one block per currency */}
      <div className="flex flex-col items-end gap-4 mb-8">
        {groups.length === 0 ? (
          <div className="w-56 flex justify-between text-gray-400">
            <span>Total</span><span>—</span>
          </div>
        ) : (
          groups.map(({ currency, subtotal, discountAmount, total }) => (
            <div key={currency} className="w-56 flex flex-col gap-1.5">
              {groups.length > 1 && (
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{currency}</p>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal, currency)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>
                    Discount{invoice.discount?.type === 'percentage' ? ` (${invoice.discount.value}%)` : ''}
                  </span>
                  <span>-{formatCurrency(discountAmount, currency)}</span>
                </div>
              )}
              <div className="flex justify-between border-t-2 border-gray-900 pt-2 mt-1">
                <span className="font-bold text-gray-900 text-base">
                  Total{groups.length > 1 ? ` (${currency})` : ''}
                </span>
                <span className="font-bold text-blue-700 text-base">
                  {formatCurrency(total, currency)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer note */}
      {settings.footerNote && (
        <div className="border-t border-gray-200 pt-4">
          <p className="text-xs text-gray-400 text-center">{settings.footerNote}</p>
        </div>
      )}
    </div>
  );
}
