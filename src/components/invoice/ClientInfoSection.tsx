import { useAppStore } from '../../store/useAppStore';
import { Input } from '../ui/Input';

export function ClientInfoSection() {
  const client = useAppStore((s) => s.activeInvoice.client);
  const updateActiveInvoice = useAppStore((s) => s.updateActiveInvoice);

  function update(field: 'name' | 'phone', value: string) {
    updateActiveInvoice({ client: { ...client, [field]: value } });
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">Client Information</h2>
      <div className="flex flex-col gap-4">
        <Input
          label="Client Name"
          value={client.name}
          onChange={(e) => update('name', e.target.value)}
          placeholder="e.g. Acme Corporation"
        />
        <Input
          label="Phone Number"
          type="tel"
          value={client.phone}
          onChange={(e) => update('phone', e.target.value)}
          placeholder="e.g. (555) 123-4567"
        />
      </div>
    </div>
  );
}
