import { Pencil, Trash2 } from 'lucide-react';
import type { Package } from '../../types';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../utils/formatters';
import { useAppStore } from '../../store/useAppStore';

interface PackageCardProps {
  pkg: Package;
  onEdit: (pkg: Package) => void;
}

export function PackageCard({ pkg, onEdit }: PackageCardProps) {
  const deletePackage = useAppStore((s) => s.deletePackage);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm truncate">{pkg.name}</h3>
          {pkg.description && (
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{pkg.description}</p>
          )}
        </div>
        <div className="flex gap-1 shrink-0">
          <Button variant="ghost" size="sm" onClick={() => onEdit(pkg)} className="p-1.5">
            <Pencil size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deletePackage(pkg.id)}
            className="p-1.5 text-red-500 hover:bg-red-50"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">per {pkg.unit}</span>
        <div className="text-right">
          <span className="text-base font-bold text-blue-700">
            {formatCurrency(pkg.unitPrice, pkg.currency)}
          </span>
          <span className="text-xs text-gray-400 ml-1">{pkg.currency}</span>
        </div>
      </div>
    </div>
  );
}
