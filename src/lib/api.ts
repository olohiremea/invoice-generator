/**
 * All Supabase database and storage calls live here.
 * Components and the store call these functions — nothing else touches supabase directly.
 */
import { supabase } from './supabase';
import type { BusinessSettings, Package, ActiveInvoice } from '../types';

// ─── Settings ────────────────────────────────────────────────────────────────

export async function fetchSettings(userId: string): Promise<Partial<BusinessSettings> | null> {
  const { data, error } = await supabase
    .from('business_settings')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  return {
    businessName: data.business_name,
    logoDataUrl: data.logo_url ?? null,
    invoicePrefix: data.invoice_prefix,
    nextInvoiceNumber: data.next_invoice_number,
    currency: data.currency,
    footerNote: data.footer_note ?? '',
    paymentTerms: data.payment_terms ?? 'Due on Receipt',
    accentColor: data.accent_color ?? '#2563EB',
    bankDetails: data.bank_details ?? {
      bankName: '', accountName: '', accountNumber: '', sortCode: '', iban: '', swift: '',
    },
  };
}

export async function saveSettings(userId: string, settings: Partial<BusinessSettings>) {
  const row = {
    user_id: userId,
    business_name: settings.businessName,
    logo_url: settings.logoDataUrl,
    invoice_prefix: settings.invoicePrefix,
    next_invoice_number: settings.nextInvoiceNumber,
    currency: settings.currency,
    footer_note: settings.footerNote,
    payment_terms: settings.paymentTerms,
    accent_color: settings.accentColor,
    bank_details: settings.bankDetails,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('business_settings')
    .upsert(row, { onConflict: 'user_id' });
  if (error) throw error;
}

// ─── Logo ─────────────────────────────────────────────────────────────────────

export async function uploadLogo(userId: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'png';
  const path = `${userId}/logo.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('logos')
    .upload(path, file, { upsert: true, contentType: file.type });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from('logos').getPublicUrl(path);
  // Bust cache by appending a timestamp query param
  return `${data.publicUrl}?t=${Date.now()}`;
}

export async function deleteLogo(userId: string) {
  // Try common extensions — remove whichever exists
  const paths = ['png', 'jpg', 'jpeg', 'webp', 'svg'].map((e) => `${userId}/logo.${e}`);
  await supabase.storage.from('logos').remove(paths);
}

// ─── Packages ─────────────────────────────────────────────────────────────────

export async function fetchPackages(userId: string): Promise<Package[]> {
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });
  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description ?? '',
    unitPrice: Number(row.unit_price),
    unit: row.unit,
    currency: row.currency,
  }));
}

export async function insertPackage(
  userId: string,
  pkg: Omit<Package, 'id'>,
  id: string
): Promise<void> {
  const { error } = await supabase.from('packages').insert({
    id,
    user_id: userId,
    name: pkg.name,
    description: pkg.description,
    unit_price: pkg.unitPrice,
    unit: pkg.unit,
    currency: pkg.currency,
  });
  if (error) throw error;
}

export async function patchPackage(
  id: string,
  patch: Partial<Omit<Package, 'id'>>
): Promise<void> {
  const row: Record<string, unknown> = {};
  if (patch.name !== undefined)        row.name = patch.name;
  if (patch.description !== undefined) row.description = patch.description;
  if (patch.unitPrice !== undefined)   row.unit_price = patch.unitPrice;
  if (patch.unit !== undefined)        row.unit = patch.unit;
  if (patch.currency !== undefined)    row.currency = patch.currency;

  const { error } = await supabase.from('packages').update(row).eq('id', id);
  if (error) throw error;
}

export async function removePackage(id: string): Promise<void> {
  const { error } = await supabase.from('packages').delete().eq('id', id);
  if (error) throw error;
}

// ─── Invoices ─────────────────────────────────────────────────────────────────

export async function saveInvoice(userId: string, invoice: ActiveInvoice): Promise<void> {
  const { error } = await supabase.from('invoices').upsert(
    {
      user_id: userId,
      invoice_number: invoice.invoiceNumber,
      issue_date: invoice.issueDate,
      client_name: invoice.client.name,
      client_phone: invoice.client.phone,
      line_items: invoice.lineItems,
      discount: invoice.discount,
      notes: invoice.notes,
    },
    { onConflict: 'invoice_number,user_id' }
  );
  if (error) throw error;
}

export async function fetchInvoices(userId: string) {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}
