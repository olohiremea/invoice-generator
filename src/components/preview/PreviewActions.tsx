import { useState } from 'react';
import { Download, Printer } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../ui/Button';
import { InvoicePDFDocument } from '../pdf/InvoicePDFDocument';

export function PreviewActions() {
  const invoice = useAppStore((s) => s.activeInvoice);
  const settings = useAppStore((s) => s.settings);
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const blob = await pdf(
        <InvoicePDFDocument invoice={invoice} settings={settings} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoice.invoiceNumber}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="flex gap-2">
      <Button variant="secondary" size="sm" onClick={handlePrint}>
        <Printer size={14} />
        Print
      </Button>
      <Button onClick={handleDownload} disabled={loading} size="sm">
        <Download size={14} />
        {loading ? 'Generating...' : 'Download PDF'}
      </Button>
    </div>
  );
}
