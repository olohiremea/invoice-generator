import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import type { DiscountType } from '../../types';

export function DiscountSection() {
  const discount = useAppStore((s) => s.activeInvoice.discount);
  const updateActiveInvoice = useAppStore((s) => s.updateActiveInvoice);
  const [showDiscount, setShowDiscount] = useState(discount !== null);

  function toggleShow() {
    if (showDiscount) {
      updateActiveInvoice({ discount: null });
    } else {
      updateActiveInvoice({ discount: { type: 'percentage', value: 0 } });
    }
    setShowDiscount(!showDiscount);
  }

  function setType(type: DiscountType) {
    updateActiveInvoice({ discount: { type, value: discount?.value ?? 0 } });
  }

  function setValue(value: number) {
    updateActiveInvoice({ discount: { type: discount?.type ?? 'percentage', value } });
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-700">Discount</h2>
        <button
          onClick={toggleShow}
          className="text-xs text-blue-600 hover:underline cursor-pointer"
        >
          {showDiscount ? 'Remove discount' : '+ Add discount'}
        </button>
      </div>

      {showDiscount && (
        <div className="flex gap-2 items-end">
          {/* Type toggle */}
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            {(['percentage', 'flat'] as DiscountType[]).map((type) => (
              <button
                key={type}
                onClick={() => setType(type)}
                className={`px-3 py-2 text-xs font-medium cursor-pointer transition-colors
                  ${discount?.type === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                {type === 'percentage' ? '%' : '$'}
              </button>
            ))}
          </div>
          {/* Value input */}
          <div className="relative flex-1">
            {discount?.type === 'flat' && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
            )}
            <input
              type="number"
              min={0}
              step={discount?.type === 'percentage' ? 1 : 0.01}
              max={discount?.type === 'percentage' ? 100 : undefined}
              value={discount?.value ?? 0}
              onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
              className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none
                focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                ${discount?.type === 'flat' ? 'pl-6' : ''}`}
            />
            {discount?.type === 'percentage' && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">%</span>
            )}
          </div>
        </div>
      )}

      {!showDiscount && (
        <p className="text-xs text-gray-400">No discount applied.</p>
      )}
    </div>
  );
}
