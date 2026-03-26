import type { Discount, LineItem } from '../types';

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
