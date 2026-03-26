import { useState } from 'react';
import { Plus, Package } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { Package as PackageType } from '../../types';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { EmptyState } from '../ui/EmptyState';
import { PackageCard } from './PackageCard';
import { PackageForm } from './PackageForm';

export function PackageManager() {
  const packages = useAppStore((s) => s.packages);
  const addPackage = useAppStore((s) => s.addPackage);
  const updatePackage = useAppStore((s) => s.updatePackage);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<PackageType | null>(null);

  function openAdd() {
    setEditingPkg(null);
    setIsModalOpen(true);
  }

  function openEdit(pkg: PackageType) {
    setEditingPkg(pkg);
    setIsModalOpen(true);
  }

  function handleSubmit(data: Omit<PackageType, 'id'>) {
    if (editingPkg) {
      updatePackage(editingPkg.id, data);
    } else {
      addPackage(data);
    }
    setIsModalOpen(false);
    setEditingPkg(null);
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Packages</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Pre-define your services to quickly add them to invoices.
          </p>
        </div>
        <Button onClick={openAdd}>
          <Plus size={16} />
          Add Package
        </Button>
      </div>

      {packages.length === 0 ? (
        <EmptyState
          icon={<Package size={48} />}
          title="No packages yet"
          description="Add your services or products so you can select them when creating invoices."
          action={
            <Button onClick={openAdd}>
              <Plus size={16} />
              Add your first package
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} onEdit={openEdit} />
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPkg ? 'Edit Package' : 'Add Package'}
      >
        <PackageForm
          initial={editingPkg ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
