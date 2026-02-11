import { InvoiceData, TemplateType } from '@/types/invoice';

export const DEMO_DATA: Record<TemplateType, Partial<InvoiceData>> = {
  minimal: {
    senderName: 'Your Company',
    senderEmail: 'billing@company.com',
    clientName: 'Client Name',
    lineItems: [
      { id: '1', description: 'Sample service', quantity: 1, unitPrice: 100 },
    ],
  },
  modern: {
    senderName: 'Your Company',
    senderEmail: 'billing@company.com',
    clientName: 'Client Name',
    lineItems: [
      { id: '1', description: 'Sample service', quantity: 1, unitPrice: 100 },
    ],
  },
  sidebar: {
    senderName: 'Your Company',
    senderEmail: 'billing@company.com',
    clientName: 'Client Name',
    lineItems: [
      { id: '1', description: 'Sample service', quantity: 1, unitPrice: 100 },
    ],
  },
  compact: {
    senderName: 'Your Company',
    senderEmail: 'billing@company.com',
    clientName: 'Client Name',
    lineItems: [
      { id: '1', description: 'Sample service', quantity: 1, unitPrice: 100 },
    ],
  },
  letterhead: {
    senderName: 'Your Company',
    senderEmail: 'billing@company.com',
    clientName: 'Client Name',
    lineItems: [
      { id: '1', description: 'Sample service', quantity: 1, unitPrice: 100 },
    ],
  },
  executive: {
    senderName: 'Sterling & Cooper Corp',
    senderEmail: 'billing@sterlingcooper.com',
    senderPhone: '+1 (555) 234-5678',
    senderAddress: '1705 Broadway, New York, NY 10019',
    registrationNumber: 'EIN: 12-3456789',
    
    clientName: 'Prestige Worldwide Ltd',
    clientEmail: 'accounts@prestigeworldwide.com',
    clientAddress: '8502 Preston Road, Inglewood, CA 90301',
    
    invoiceNumber: 'INV-2024-0847',
    invoiceDate: '2024-01-15',
    dueDate: '2024-02-15',
    paymentReference: 'INV-2024-0847-PAY',
    
    bankName: 'Chase Bank',
    accountNumber: '****4567',
    branchCode: 'Chase NY',
    accountType: 'cheque',
    
    lineItems: [
      { id: '1', description: 'Strategic Consulting Services', quantity: 40, unitPrice: 250 },
      { id: '2', description: 'Market Analysis & Research Report', quantity: 1, unitPrice: 3500 },
      { id: '3', description: 'Implementation Framework Development', quantity: 1, unitPrice: 8000 },
      { id: '4', description: 'Q1 Quarterly Review Meeting', quantity: 4, unitPrice: 500 },
    ],
    
    notes: 'Payment is due within 30 days. Thank you for your continued partnership.\n\nFor wire transfers, please use the payment reference number in your transfer memo.',
  },
  split: {
    senderName: 'Design Studio Alpha',
    senderEmail: 'hello@designstudioalpha.com',
    senderPhone: '+1 (555) 891-0112',
    senderAddress: '1200 Main Street, Austin, TX 78701',
    
    clientName: 'Boutique Hotel Group',
    clientEmail: 'creative@botiquehotels.com',
    clientAddress: '789 Ocean Drive, Miami, FL 33139',
    
    invoiceNumber: 'DSA-2024-012',
    invoiceDate: '2024-01-20',
    dueDate: '2024-02-20',
    
    bankName: 'Silicon Valley Bank',
    accountNumber: '****8901',
    accountType: 'cheque',
    
    lineItems: [
      { id: '1', description: 'Complete Brand Identity Package', quantity: 1, unitPrice: 4500 },
      { id: '2', description: 'Website Design Mockups (8 pages)', quantity: 8, unitPrice: 350 },
      { id: '3', description: 'Brand Guidelines Document', quantity: 1, unitPrice: 1200 },
    ],
    
    notes: 'This quotation is valid for 30 days from the date of issuance.\n\nIncludes: Logo design, color palette, typography system, brand voice guidelines, and social media templates.',
  },
  card: {
    senderName: 'TechStart Inc',
    senderEmail: 'billing@techstart.io',
    senderPhone: '+1 (555) 123-4567',
    senderAddress: '100 Tech Boulevard, San Francisco, CA 94105',
    registrationNumber: 'Tax ID: 98-7654321',
    
    clientName: 'Innovation Labs',
    clientEmail: 'ap@innolabs.tech',
    clientAddress: '500 Innovation Way, Palo Alto, CA 94301',
    
    invoiceNumber: 'TS-2024-8841',
    invoiceDate: '2024-01-22',
    dueDate: '2024-02-22',
    
    bankName: 'Stripe Atlas Bank',
    accountNumber: '****1234',
    accountType: 'cheque',
    branchCode: 'SF-001',
    
    lineItems: [
      { id: '1', description: 'SaaS Platform License (Annual)', quantity: 1, unitPrice: 2400 },
      { id: '2', description: 'API Integration Support (Hours)', quantity: 10, unitPrice: 150 },
      { id: '3', description: 'Custom Feature Development', quantity: 24, unitPrice: 175 },
      { id: '4', description: 'Priority Support Package', quantity: 1, unitPrice: 500 },
    ],
    
    notes: 'Your annual subscription includes:\n\u2022 24/7 Technical Support\n\u2022 Weekly system backups\n\u2022 Monthly security audits\n\u2022 Quarterly business reviews',
  },
  'luxury-minimal': {
    senderName: 'Vanguard Partners',
    senderEmail: 'consulting@vanguardpartners.com',
    senderPhone: '+1 (555) 999-0000',
    senderAddress: '1500 Park Avenue, New York, NY 10028',
    
    clientName: 'Estate Holdings LLC',
    clientEmail: 'finance@estateholdings.com',
    clientAddress: '2000 Fifth Avenue, New York, NY 10021',
    
    invoiceNumber: 'VP-2024-001',
    invoiceDate: '2024-01-25',
    dueDate: '2024-03-25',
    
    lineItems: [
      { id: '1', description: 'Wealth Management Consultation', quantity: 12, unitPrice: 500 },
      { id: '2', description: 'Investment Strategy Session', quantity: 2, unitPrice: 1500 },
    ],
    
    notes: 'All services rendered with the highest standard of confidentiality and professionalism.\n\nPlease direct any inquiries to your dedicated relationship manager.',
  },
};

export function getDemoDataForTemplate(templateId: TemplateType): Partial<InvoiceData> {
  return DEMO_DATA[templateId] || DEMO_DATA.minimal;
}
