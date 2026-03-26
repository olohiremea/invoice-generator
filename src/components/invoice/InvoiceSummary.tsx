import { useAppStore } from '../../store/useAppStore';
import { buildInvoiceTotals } from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';

export function InvoiceSummary() {
  const lineItems = useAppStore((s) => s.activeInvoice.lineItems);
  const discount = useAppStore((s) => s.activeInvoice.discount);
  const settings = useAppStore((s) => s.settings);

  const { subtotal, discountAmount, total } = buildInvoiceTotals(lineItems, discount);
  const currency = settings.currency;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex flex-col gap-2">
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
          <span className="font-bold text-gray-900">Total</span>
          <span className="font-bold text-xl text-blue-700">
            {formatCurrency(total, currency)}
          </span>
        </div>
      </div>
    </div>
  );
}
