import { useAppStore } from '../../store/useAppStore';
import { buildMultiCurrencyTotals } from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';

export function InvoiceSummary() {
  const lineItems = useAppStore((s) => s.activeInvoice.lineItems);
  const discount = useAppStore((s) => s.activeInvoice.discount);

  const groups = buildMultiCurrencyTotals(lineItems, discount);

  if (groups.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex justify-between text-sm text-gray-400">
          <span>Total</span>
          <span>—</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-4">
      {groups.map(({ currency, subtotal, discountAmount, total }) => (
        <div key={currency} className="flex flex-col gap-2">
          {groups.length > 1 && (
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{currency}</p>
          )}
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal, currency)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>
                Discount
                {discount?.type === 'percentage' ? ` (${discount.value}%)` : ''}
              </span>
              <span>-{formatCurrency(discountAmount, currency)}</span>
            </div>
          )}
          <div className="border-t border-gray-200 pt-2 flex justify-between">
            <span className="font-bold text-gray-900">Total{groups.length > 1 ? ` (${currency})` : ''}</span>
            <span className="font-bold text-xl accent-text">
              {formatCurrency(total, currency)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
