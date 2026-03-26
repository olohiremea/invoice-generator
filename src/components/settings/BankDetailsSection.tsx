import type { BankDetails } from '../../types';
import { Input } from '../ui/Input';

interface BankDetailsSectionProps {
  value: BankDetails;
  onChange: (details: BankDetails) => void;
}

export function BankDetailsSection({ value, onChange }: BankDetailsSectionProps) {
  function update(field: keyof BankDetails, v: string) {
    onChange({ ...value, [field]: v });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            label="Bank Name"
            value={value.bankName}
            onChange={(e) => update('bankName', e.target.value)}
            placeholder="e.g. First Bank"
          />
        </div>
        <div className="flex-1">
          <Input
            label="Account Name"
            value={value.accountName}
            onChange={(e) => update('accountName', e.target.value)}
            placeholder="e.g. My Business Ltd"
          />
        </div>
      </div>
      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            label="Account Number"
            value={value.accountNumber}
            onChange={(e) => update('accountNumber', e.target.value)}
            placeholder="e.g. 0123456789"
          />
        </div>
        <div className="flex-1">
          <Input
            label="Sort Code / Routing No."
            value={value.sortCode}
            onChange={(e) => update('sortCode', e.target.value)}
            placeholder="e.g. 01-23-45"
          />
        </div>
      </div>
      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            label="IBAN (optional)"
            value={value.iban}
            onChange={(e) => update('iban', e.target.value)}
            placeholder="e.g. GB29NWBK..."
          />
        </div>
        <div className="flex-1">
          <Input
            label="SWIFT / BIC (optional)"
            value={value.swift}
            onChange={(e) => update('swift', e.target.value)}
            placeholder="e.g. FIRSTNGLA"
          />
        </div>
      </div>
    </div>
  );
}
