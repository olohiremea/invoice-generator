import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import type { ActiveInvoice, BusinessSettings } from '../../types';
import { buildInvoiceTotals } from '../../utils/calculations';
import { formatCurrency, formatDate } from '../../utils/formatters';

Font.register({
  family: 'Helvetica',
  fonts: [],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#374151',
    padding: 48,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  logo: {
    width: 80,
    height: 40,
    objectFit: 'contain',
  },
  logoPlaceholder: {
    width: 48,
    height: 48,
    backgroundColor: '#DBEAFE',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoPlaceholderText: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: '#2563EB',
  },
  businessName: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
    marginTop: 4,
  },
  invoiceTitle: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: '#2563EB',
    textAlign: 'right',
  },
  invoiceMeta: {
    color: '#6B7280',
    textAlign: 'right',
    marginTop: 2,
  },
  billTo: {
    marginBottom: 24,
  },
  billToLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  clientName: {
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
    fontSize: 11,
  },
  clientPhone: {
    color: '#6B7280',
    marginTop: 2,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#111827',
    paddingBottom: 6,
    marginBottom: 0,
  },
  tableHeaderText: {
    fontFamily: 'Helvetica-Bold',
    color: '#374151',
    fontSize: 9,
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingVertical: 8,
  },
  colDescription: { flex: 1 },
  colQty: { width: 40, textAlign: 'center' },
  colUnitPrice: { width: 70, textAlign: 'right' },
  colTotal: { width: 70, textAlign: 'right' },
  itemName: { fontFamily: 'Helvetica-Bold', color: '#111827', fontSize: 10 },
  itemDesc: { color: '#6B7280', fontSize: 8, marginTop: 2 },
  totalsSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  totalsBox: { width: 180 },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  totalLabel: { color: '#6B7280' },
  totalValue: { color: '#6B7280' },
  discountLabel: { color: '#059669' },
  discountValue: { color: '#059669' },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 2,
    borderTopColor: '#111827',
    paddingTop: 6,
    marginTop: 4,
  },
  grandTotalLabel: { fontFamily: 'Helvetica-Bold', fontSize: 12, color: '#111827' },
  grandTotalValue: { fontFamily: 'Helvetica-Bold', fontSize: 12, color: '#2563EB' },
  footer: {
    position: 'absolute',
    bottom: 32,
    left: 48,
    right: 48,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 8,
  },
  footerText: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 9,
  },
});

interface Props {
  invoice: ActiveInvoice;
  settings: BusinessSettings;
}

export function InvoicePDFDocument({ invoice, settings }: Props) {
  const { subtotal, discountAmount, total } = buildInvoiceTotals(
    invoice.lineItems,
    invoice.discount
  );
  const currency = settings.currency;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            {settings.logoDataUrl ? (
              <Image src={settings.logoDataUrl} style={styles.logo} />
            ) : (
              <View style={styles.logoPlaceholder}>
                <Text style={styles.logoPlaceholderText}>
                  {settings.businessName.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <Text style={styles.businessName}>{settings.businessName}</Text>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceMeta}>#{invoice.invoiceNumber}</Text>
            <Text style={styles.invoiceMeta}>Date: {formatDate(invoice.issueDate)}</Text>
          </View>
        </View>

        {/* Bill To */}
        <View style={styles.billTo}>
          <Text style={styles.billToLabel}>Bill To</Text>
          <Text style={styles.clientName}>{invoice.client.name || 'N/A'}</Text>
          {invoice.client.phone && (
            <Text style={styles.clientPhone}>{invoice.client.phone}</Text>
          )}
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.colDescription]}>Description</Text>
          <Text style={[styles.tableHeaderText, styles.colQty]}>Qty</Text>
          <Text style={[styles.tableHeaderText, styles.colUnitPrice]}>Unit Price</Text>
          <Text style={[styles.tableHeaderText, styles.colTotal]}>Total</Text>
        </View>

        {/* Line Items */}
        {invoice.lineItems.map((item) => (
          <View key={item.packageId} style={styles.tableRow}>
            <View style={styles.colDescription}>
              <Text style={styles.itemName}>{item.packageName}</Text>
              {item.description ? (
                <Text style={styles.itemDesc}>{item.description}</Text>
              ) : null}
            </View>
            <Text style={[{ fontSize: 10 }, styles.colQty]}>{item.quantity}</Text>
            <Text style={[{ fontSize: 10 }, styles.colUnitPrice]}>
              {formatCurrency(item.unitPrice, currency)}
            </Text>
            <Text style={[{ fontSize: 10 }, styles.colTotal]}>
              {formatCurrency(item.unitPrice * item.quantity, currency)}
            </Text>
          </View>
        ))}

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsBox}>
            <View style={styles.totalsRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>{formatCurrency(subtotal, currency)}</Text>
            </View>
            {discountAmount > 0 && (
              <View style={styles.totalsRow}>
                <Text style={styles.discountLabel}>
                  Discount
                  {invoice.discount?.type === 'percentage'
                    ? ` (${invoice.discount.value}%)`
                    : ''}
                </Text>
                <Text style={styles.discountValue}>
                  -{formatCurrency(discountAmount, currency)}
                </Text>
              </View>
            )}
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Total</Text>
              <Text style={styles.grandTotalValue}>{formatCurrency(total, currency)}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        {settings.footerNote ? (
          <View style={styles.footer}>
            <Text style={styles.footerText}>{settings.footerNote}</Text>
          </View>
        ) : null}
      </Page>
    </Document>
  );
}
