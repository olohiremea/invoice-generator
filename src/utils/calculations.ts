import type { Discount, LineItem, CurrencyTotal } from '../types';

export function computeSubtotal(items: LineItem[]): number {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

export function computeDiscountAmount(subtotal: number, discount: Discount | null): number {
  if (!discount || discount.value <= 0) return 0;
  if (discount.type === 'percentage') {
    return Math.min(subtotal, subtotal * (discount.value / 100));
  }
  return Math.min(subtotal, discount.value);
}

export function computeTotal(subtotal: number, discountAmount: number): number {
  return Math.max(0, subtotal - discountAmount);
}

export function buildInvoiceTotals(items: LineItem[], discount: Discount | null) {
  const subtotal = computeSubtotal(items);
  const discountAmount = computeDiscountAmount(subtotal, discount);
  const total = computeTotal(subtotal, discountAmount);
  return { subtotal, discountAmount, total };
}

// Groups line items by currency and computes totals per group.
// Percentage discounts apply to each group; flat discounts apply per group proportionally.
export function buildMultiCurrencyTotals(
  items: LineItem[],
  discount: Discount | null
): CurrencyTotal[] {
  const groups: Record<string, LineItem[]> = {};
  for (const item of items) {
    if (!groups[item.currency]) groups[item.currency] = [];
    groups[item.currency].push(item);
  }

  return Object.entries(groups).map(([currency, groupItems]) => {
    const subtotal = computeSubtotal(groupItems);

    let discountAmount = 0;
    if (discount && discount.value > 0) {
      if (discount.type === 'percentage') {
        discountAmount = Math.min(subtotal, subtotal * (discount.value / 100));
      } else {
        // Flat discount: apply to each currency group independently
        discountAmount = Math.min(subtotal, discount.value);
      }
    }

    const total = Math.max(0, subtotal - discountAmount);
    return { currency, subtotal, discountAmount, total };
  });
}
