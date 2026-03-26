import { Plus } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { Package, LineItem } from '../../types';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../utils/formatters';

export function PackageSelector() {
  const packages = useAppStore((s) => s.packages);
  const lineItems = useAppStore((s) => s.activeInvoice.lineItems);
  const updateActiveInvoice = useAppStore((s) => s.updateActiveInvoice);

  function isAdded(pkg: Package): boolean {
    return lineItems.some((item) => item.packageId === pkg.id);
  }

  function addPackage(pkg: Package) {
    if (isAdded(pkg)) return;
    const newItem: LineItem = {
      packageId: pkg.id,
      packageName: pkg.name,
      description: pkg.description,
      unitPrice: pkg.unitPrice,
      unit: pkg.unit,
      currency: pkg.currency,
      quantity: 1,
    };
    updateActiveInvoice({ lineItems: [...lineItems, newItem] });
  }

  if (packages.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Select Packages</h2>
        <p className="text-sm text-gray-400">
          No packages defined yet. Go to{' '}
          <span className="font-medium text-blue-600">Packages</span> to add some.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <h2 className="text-sm font-semibold text-gray-700 mb-3">Select Packages</h2>
      <div className="flex flex-col gap-2">
        {packages.map((pkg) => {
          const added = isAdded(pkg);
          return (
            <div
              key={pkg.id}
              className={`flex items-center justify-between gap-3 p-3 rounded-lg border transition-colors
                ${added ? 'border-blue-200 bg-blue-50' : 'border-gray-100 bg-gray-50 hover:border-gray-200'}`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{pkg.name}</p>
                <p className="text-xs text-gray-500">
                  {formatCurrency(pkg.unitPrice, pkg.currency)}{' '}
                  <span className="text-gray-400">{pkg.currency}</span>
                  {' '}/ {pkg.unit}
                </p>
              </div>
              <Button
                size="sm"
                variant={added ? 'secondary' : 'primary'}
                onClick={() => addPackage(pkg)}
                disabled={added}
              >
                {added ? 'Added' : <><Plus size={14} /> Add</>}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
