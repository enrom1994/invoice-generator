export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export type TemplateType = 'minimal' | 'modern' | 'sidebar' | 'compact' | 'letterhead' | 'executive' | 'split' | 'card' | 'luxury-minimal';
export type DocumentType = 'invoice' | 'quotation';
export type PaymentMethod = 'eft' | 'cash' | 'bank_transfer' | 'credit_card' | 'paypal' | 'venmo' | 'crypto' | 'other';

export interface CurrencyConfig {
  code: string;
  symbol: string;
  locale: string;
  name: string;
}

export interface TaxConfig {
  enabled: boolean;
  rate: number;
  name: string;
}

export interface BrandingConfig {
  primaryColor: string;
  accentColor: string;
  logoUrl: string | null;
}

export interface PaymentQRCode {
  enabled: boolean;
  type: 'paypal' | 'venmo' | 'crypto' | 'custom';
  value: string; // PayPal.me/username, Venmo handle, wallet address, or custom URL
  label: string;
}

export interface AppSettings {
  whatsappMessageTemplate: string;
  customFooter: string;
  enableAutoSave: boolean;
  defaultPaymentTerms: number;
}

export const DEFAULT_SETTINGS: AppSettings = {
  whatsappMessageTemplate: 'Hi {{clientName}}, here is {{documentType}} #{{invoiceNumber}} for {{currency}}{{totalAmount}}. Please let me know when you\'ve received it!',
  customFooter: 'Thank you for your business!',
  enableAutoSave: true,
  defaultPaymentTerms: 30,
};

export interface InvoiceData {
  documentType: DocumentType;
  template: TemplateType;
  paymentMethod: PaymentMethod;

  currency: CurrencyConfig;
  tax: TaxConfig;

  senderName: string;
  senderEmail: string;
  senderPhone: string;
  senderAddress: string;
  registrationNumber: string;

  bankName: string;
  accountNumber: string;
  branchCode: string;
  accountType: 'cheque' | 'savings' | '';

  clientName: string;
  clientEmail: string;
  clientAddress: string;

  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  paymentReference: string;

  lineItems: LineItem[];

  notes: string;
  paymentTermsDays: number;

  // Pro features
  paymentQR?: PaymentQRCode;
  settings?: AppSettings;
  headerImageUrl?: string | null;

  // Custom colors
  primaryColor?: string;
  accentColor?: string;
}

export interface SavedClient {
  id: string;
  name: string;
  email: string;
  address: string;
  createdAt: string;
}

export interface InvoiceDraft {
  id: string;
  name: string;
  data: InvoiceData;
  savedAt: string;
}

export interface ProFeatures {
  logo: boolean;
  customColors: boolean;
  templates: boolean;
  importExport: boolean;
  unlimitedClients: boolean;
  paymentQRCode: boolean;
  customWhatsAppMessage: boolean;
}

export interface LicenseInfo {
  isValid: boolean;
  features: ProFeatures;
  key: string | null;
  activatedAt: string | null;
}
