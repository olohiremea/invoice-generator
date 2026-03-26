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
import { buildMultiCurrencyTotals } from '../../utils/calculations';
import { formatCurrency, formatDate } from '../../utils/formatters';

Font.register({ family: 'Helvetica', fonts: [] });

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
  logo: { width: 80, height: 40, objectFit: 'contain' },
  logoPlaceholder: {
    width: 48, height: 48, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  logoPlaceholderText: { fontSize: 20, fontFamily: 'Helvetica-Bold' },
  businessName: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#111827', marginTop: 4 },
  invoiceTitle: { fontSize: 24, fontFamily: 'Helvetica-Bold', textAlign: 'right' },
  invoiceMeta: { color: '#6B7280', textAlign: 'right', marginTop: 2 },

  billToRow: { flexDirection: 'row', gap: 40, marginBottom: 24 },
  metaLabel: {
    fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#9CA3AF',
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4,
  },
  clientName: { fontFamily: 'Helvetica-Bold', color: '#111827', fontSize: 11 },
  clientPhone: { color: '#6B7280', marginTop: 2 },
  paymentTermsText: { fontFamily: 'Helvetica-Bold', color: '#111827' },

  tableHeader: {
    flexDirection: 'row', borderBottomWidth: 2, borderBottomColor: '#111827', paddingBottom: 6,
  },
  tableHeaderText: { fontFamily: 'Helvetica-Bold', color: '#374151', fontSize: 9, textTransform: 'uppercase' },
  tableRow: {
    flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F3F4F6', paddingVertical: 8,
  },
  colDescription: { flex: 1 },
  colQty: { width: 40, textAlign: 'center' },
  colCurrency: { width: 36, textAlign: 'center' },
  colUnitPrice: { width: 70, textAlign: 'right' },
  colTotal: { width: 70, textAlign: 'right' },
  itemName: { fontFamily: 'Helvetica-Bold', color: '#111827', fontSize: 10 },
  itemDesc: { color: '#6B7280', fontSize: 8, marginTop: 2 },
  currencyBadge: { color: '#9CA3AF', fontSize: 8 },

  totalsSection: { flexDirection: 'column', alignItems: 'flex-end', marginTop: 16, gap: 12 },
  totalsBox: { width: 200 },
  currencyGroupLabel: {
    fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#9CA3AF',
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4,
  },
  totalsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  totalLabel: { color: '#6B7280' },
  totalValue: { color: '#6B7280' },
  discountLabel: { color: '#059669' },
  discountValue: { color: '#059669' },
  grandTotalRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    borderTopWidth: 2, borderTopColor: '#111827', paddingTop: 6, marginTop: 4,
  },
  grandTotalLabel: { fontFamily: 'Helvetica-Bold', fontSize: 12, color: '#111827' },
  grandTotalValue: { fontFamily: 'Helvetica-Bold', fontSize: 12 },

  bankSection: {
    borderTopWidth: 1, borderTopColor: '#E5E7EB', marginTop: 24, paddingTop: 12,
  },
  bankGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  bankItem: { flexDirection: 'row', gap: 6, width: '48%' },
  bankKey: { color: '#9CA3AF', fontSize: 9 },
  bankVal: { fontFamily: 'Helvetica-Bold', color: '#111827', fontSize: 9 },

  footer: {
    position: 'absolute', bottom: 32, left: 48, right: 48,
    borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 8,
  },
  footerText: { textAlign: 'center', color: '#9CA3AF', fontSize: 9 },
});

interface Props {
  invoice: ActiveInvoice;
  settings: BusinessSettings;
}

export function InvoicePDFDocument({ invoice, settings }: Props) {
  const groups = buildMultiCurrencyTotals(invoice.lineItems, invoice.discount);
  const multiCurrency = groups.length > 1;
  const accent = settings.accentColor ?? '#2563EB';
  const accentLight = accent + '1a'; // ~10% opacity
  const bank = settings.bankDetails;
  const hasBankDetails = bank && (bank.bankName || bank.accountNumber || bank.iban);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            {settings.logoDataUrl ? (
              <Image src={settings.logoDataUrl} style={styles.logo} />
            ) : (
              <View style={[styles.logoPlaceholder, { backgroundColor: accentLight }]}>
                <Text style={[styles.logoPlaceholderText, { color: accent }]}>
                  {settings.businessName.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <Text style={styles.businessName}>{settings.businessName}</Text>
          </View>
          <View>
            <Text style={[styles.invoiceTitle, { color: accent }]}>INVOICE</Text>
            <Text style={styles.invoiceMeta}>#{invoice.invoiceNumber}</Text>
            <Text style={styles.invoiceMeta}>Date: {formatDate(invoice.issueDate)}</Text>
          </View>
        </View>

        {/* Bill To + Payment Terms */}
        <View style={styles.billToRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.metaLabel}>Bill To</Text>
            <Text style={styles.clientName}>{invoice.client.name || 'N/A'}</Text>
            {invoice.client.phone ? (
              <Text style={styles.clientPhone}>{invoice.client.phone}</Text>
            ) : null}
          </View>
          {settings.paymentTerms ? (
            <View>
              <Text style={styles.metaLabel}>Payment Terms</Text>
              <Text style={styles.paymentTermsText}>{settings.paymentTerms}</Text>
            </View>
          ) : null}
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.colDescription]}>Description</Text>
          <Text style={[styles.tableHeaderText, styles.colQty]}>Qty</Text>
          <Text style={[styles.tableHeaderText, styles.colCurrency]}>CCY</Text>
          <Text style={[styles.tableHeaderText, styles.colUnitPrice]}>Unit Price</Text>
          <Text style={[styles.tableHeaderText, styles.colTotal]}>Total</Text>
        </View>

        {/* Line Items */}
        {invoice.lineItems.map((item) => (
          <View key={item.packageId} style={styles.tableRow}>
            <View style={styles.colDescription}>
              <Text style={styles.itemName}>{item.packageName}</Text>
              {item.description ? <Text style={styles.itemDesc}>{item.description}</Text> : null}
            </View>
            <Text style={[{ fontSize: 10 }, styles.colQty]}>{item.quantity}</Text>
            <Text style={[styles.currencyBadge, styles.colCurrency]}>{item.currency}</Text>
            <Text style={[{ fontSize: 10 }, styles.colUnitPrice]}>
              {formatCurrency(item.unitPrice, item.currency)}
            </Text>
            <Text style={[{ fontSize: 10 }, styles.colTotal]}>
              {formatCurrency(item.unitPrice * item.quantity, item.currency)}
            </Text>
          </View>
        ))}

        {/* Totals */}
        <View style={styles.totalsSection}>
          {groups.map(({ currency, subtotal, discountAmount, total }) => (
            <View key={currency} style={styles.totalsBox}>
              {multiCurrency && <Text style={styles.currencyGroupLabel}>{currency}</Text>}
              <View style={styles.totalsRow}>
                <Text style={styles.totalLabel}>Subtotal</Text>
                <Text style={styles.totalValue}>{formatCurrency(subtotal, currency)}</Text>
              </View>
              {discountAmount > 0 && (
                <View style={styles.totalsRow}>
                  <Text style={styles.discountLabel}>
                    Discount{invoice.discount?.type === 'percentage' ? ` (${invoice.discount.value}%)` : ''}
                  </Text>
                  <Text style={styles.discountValue}>-{formatCurrency(discountAmount, currency)}</Text>
                </View>
              )}
              <View style={styles.grandTotalRow}>
                <Text style={styles.grandTotalLabel}>
                  Total{multiCurrency ? ` (${currency})` : ''}
                </Text>
                <Text style={[styles.grandTotalValue, { color: accent }]}>
                  {formatCurrency(total, currency)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Bank Details */}
        {hasBankDetails && (
          <View style={styles.bankSection}>
            <Text style={styles.metaLabel}>Payment Details</Text>
            <View style={styles.bankGrid}>
              {bank.bankName ? (
                <View style={styles.bankItem}>
                  <Text style={styles.bankKey}>Bank</Text>
                  <Text style={styles.bankVal}>{bank.bankName}</Text>
                </View>
              ) : null}
              {bank.accountName ? (
                <View style={styles.bankItem}>
                  <Text style={styles.bankKey}>Account Name</Text>
                  <Text style={styles.bankVal}>{bank.accountName}</Text>
                </View>
              ) : null}
              {bank.accountNumber ? (
                <View style={styles.bankItem}>
                  <Text style={styles.bankKey}>Account No.</Text>
                  <Text style={styles.bankVal}>{bank.accountNumber}</Text>
                </View>
              ) : null}
              {bank.sortCode ? (
                <View style={styles.bankItem}>
                  <Text style={styles.bankKey}>Sort Code</Text>
                  <Text style={styles.bankVal}>{bank.sortCode}</Text>
                </View>
              ) : null}
              {bank.iban ? (
                <View style={styles.bankItem}>
                  <Text style={styles.bankKey}>IBAN</Text>
                  <Text style={styles.bankVal}>{bank.iban}</Text>
                </View>
              ) : null}
              {bank.swift ? (
                <View style={styles.bankItem}>
                  <Text style={styles.bankKey}>SWIFT/BIC</Text>
                  <Text style={styles.bankVal}>{bank.swift}</Text>
                </View>
              ) : null}
            </View>
          </View>
        )}

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
