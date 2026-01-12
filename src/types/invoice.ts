export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export type TemplateType = 'modern' | 'classic' | 'minimal';
export type DocumentType = 'invoice' | 'quotation';

export interface InvoiceData {
  // Document settings
  documentType: DocumentType;
  template: TemplateType;

  // Freelancer details
  freelancerName: string;
  freelancerEmail: string;
  freelancerPhone: string;
  freelancerAddress: string;
  companyRegistration: string; // SA Company Registration Number (e.g., 2024/123456/07)

  // Banking details
  bankName: string;
  accountNumber: string;
  branchCode: string;
  accountType: 'cheque' | 'savings' | ''; // SA bank account type

  // Client details
  clientName: string;
  clientEmail: string;
  clientAddress: string;

  // Invoice details
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  paymentReference: string; // Auto-generated or custom payment reference

  // VAT
  includeVAT: boolean;
  vatNumber: string;

  // Line items
  lineItems: LineItem[];

  // Notes
  notes: string;
}

// Saved client profile for quick selection
export interface SavedClient {
  id: string;
  name: string;
  email: string;
  address: string;
  createdAt: string;
}

// Invoice draft for auto-save
export interface InvoiceDraft {
  id: string;
  name: string;
  data: InvoiceData;
  savedAt: string;
}
