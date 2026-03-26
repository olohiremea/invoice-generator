import { Minus, Plus, Trash2 } from 'lucide-react';
import type { LineItem } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { useAppStore } from '../../store/useAppStore';

interface LineItemRowProps {
  item: LineItem;
  currency: string;
}

export function LineItemRow({ item, currency }: LineItemRowProps) {
  const lineItems = useAppStore((s) => s.activeInvoice.lineItems);
  const updateActiveInvoice = useAppStore((s) => s.updateActiveInvoice);

  function updateQty(delta: number) {
    const newQty = Math.max(1, item.quantity + delta);
    updateActiveInvoice({
      lineItems: lineItems.map((li) =>
        li.packageId === item.packageId ? { ...li, quantity: newQty } : li
      ),
    });
  }

  function setQty(val: number) {
    if (isNaN(val) || val < 1) return;
    updateActiveInvoice({
      lineItems: lineItems.map((li) =>
        li.packageId === item.packageId ? { ...li, quantity: val } : li
      ),
    });
  }

  function remove() {
    updateActiveInvoice({
      lineItems: lineItems.filter((li) => li.packageId !== item.packageId),
    });
  }

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{item.packageName}</p>
        <p className="text-xs text-gray-400">{formatCurrency(item.unitPrice, currency)} / {item.unit}</p>
      </div>
      {/* Quantity stepper */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => updateQty(-1)}
          className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer"
        >
          <Minus size={12} />
        </button>
        <input
          type="number"
          min={1}
          value={item.quantity}
          onChange={(e) => setQty(parseInt(e.target.value, 10))}
          className="w-12 text-center text-sm border border-gray-200 rounded py-1 outline-none focus:border-blue-400"
        />
        <button
          onClick={() => updateQty(1)}
          className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer"
        >
          <Plus size={12} />
        </button>
      </div>
      <div className="text-sm font-semibold text-gray-900 w-20 text-right">
        {formatCurrency(item.unitPrice * item.quantity, currency)}
      </div>
      <button
        onClick={remove}
        className="text-red-400 hover:text-red-600 cursor-pointer p-1"
        title="Remove"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
