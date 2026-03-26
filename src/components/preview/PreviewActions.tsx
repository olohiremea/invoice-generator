import { useState } from 'react';
import { Download, Printer, Image } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import html2canvas from 'html2canvas';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../ui/Button';
import { InvoicePDFDocument } from '../pdf/InvoicePDFDocument';

export function PreviewActions() {
  const invoice = useAppStore((s) => s.activeInvoice);
  const settings = useAppStore((s) => s.settings);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pngLoading, setPngLoading] = useState(false);

  async function handleDownloadPDF() {
    setPdfLoading(true);
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
      setPdfLoading(false);
    }
  }

  async function handleDownloadPNG() {
    const el = document.getElementById('invoice-preview');
    if (!el) return;
    setPngLoading(true);
    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoice.invoiceNumber}.png`;
      a.click();
    } finally {
      setPngLoading(false);
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
      <Button variant="secondary" size="sm" onClick={handleDownloadPNG} disabled={pngLoading}>
        <Image size={14} />
        {pngLoading ? 'Saving...' : 'PNG'}
      </Button>
      <Button onClick={handleDownloadPDF} disabled={pdfLoading} size="sm">
        <Download size={14} />
        {pdfLoading ? 'Generating...' : 'PDF'}
      </Button>
    </div>
  );
}
