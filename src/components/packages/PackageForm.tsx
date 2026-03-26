import React, { useState, useEffect } from 'react';
import type { Package } from '../../types';
import { Input, Textarea } from '../ui/Input';
import { Button } from '../ui/Button';

interface PackageFormProps {
  initial?: Package;
  onSubmit: (data: Omit<Package, 'id'>) => void;
  onCancel: () => void;
}

export function PackageForm({ initial, onSubmit, onCancel }: PackageFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [unitPrice, setUnitPrice] = useState(initial?.unitPrice?.toString() ?? '');
  const [unit, setUnit] = useState(initial?.unit ?? 'item');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initial) {
      setName(initial.name);
      setDescription(initial.description);
      setUnitPrice(initial.unitPrice.toString());
      setUnit(initial.unit);
    }
  }, [initial]);

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Name is required';
    const price = parseFloat(unitPrice);
    if (isNaN(price) || price < 0) e.unitPrice = 'Enter a valid price (0 or more)';
    if (!unit.trim()) e.unit = 'Unit label is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      unitPrice: parseFloat(unitPrice),
      unit: unit.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Package Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Website Design"
        error={errors.name}
        autoFocus
      />
      <Textarea
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Brief description of what's included"
        rows={3}
      />
      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            label="Price"
            type="number"
            min="0"
            step="0.01"
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
            placeholder="0.00"
            error={errors.unitPrice}
          />
        </div>
        <div className="w-32">
          <Input
            label="Unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="item"
            error={errors.unit}
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initial ? 'Save Changes' : 'Add Package'}
        </Button>
      </div>
    </form>
  );
}
