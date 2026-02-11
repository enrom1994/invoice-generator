import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import InvoiceForm from '../components/InvoiceForm';
import LineItems from '../components/LineItems';
import DownloadPDFButton from '../components/DownloadPDFButton';
import { InvoiceData } from '../types/invoice';
import { DEFAULT_CURRENCY } from '../lib/i18n';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  describe('InvoiceForm', () => {
    const mockData: InvoiceData = {
      documentType: 'invoice',
      template: 'modern',
      paymentMethod: 'eft',
      currency: DEFAULT_CURRENCY,
      tax: { enabled: false, rate: 0, name: 'Tax' },
      senderName: 'Test Business',
      senderEmail: 'test@example.com',
      senderPhone: '',
      senderAddress: '',
      registrationNumber: '',
      bankName: '',
      accountNumber: '',
      branchCode: '',
      accountType: '',
      clientName: 'Test Client',
      clientEmail: 'client@example.com',
      clientAddress: '',
      invoiceNumber: 'INV-001',
      invoiceDate: '2024-01-01',
      dueDate: '2024-02-01',
      paymentReference: '',
      lineItems: [{ id: '1', description: 'Test Item', quantity: 1, unitPrice: 100 }],
      notes: 'Test notes',
      paymentTermsDays: 30,
    };

    it('should have no critical accessibility violations', async () => {
      const { container } = render(
        <InvoiceForm
          data={mockData}
          onChange={jest.fn()}
          logoUrl={null}
          onLogoChange={jest.fn()}
          onLogoRemove={jest.fn()}
          savedClients={[]}
          onSaveClient={jest.fn()}
          onDeleteClient={jest.fn()}
          canUseLogo={false}
          canUseProTemplates={false}
          mounted={true}
        />
      );
      
      const results = await axe(container);
      expect(results.violations.length).toBe(0);
    });
  });

  describe('LineItems', () => {
    const mockItems = [
      { id: '1', description: 'Test Item 1', quantity: 2, unitPrice: 50 },
      { id: '2', description: 'Test Item 2', quantity: 1, unitPrice: 100 },
    ];

    it('should have no accessibility violations', async () => {
      const { container } = render(
        <LineItems
          lineItems={mockItems}
          onChange={jest.fn()}
          currencySymbol="$"
        />
      );
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('DownloadPDFButton', () => {
    const mockData: InvoiceData = {
      documentType: 'invoice',
      template: 'modern',
      paymentMethod: 'eft',
      currency: DEFAULT_CURRENCY,
      tax: { enabled: false, rate: 0, name: 'Tax' },
      senderName: 'Test',
      senderEmail: '',
      senderPhone: '',
      senderAddress: '',
      registrationNumber: '',
      bankName: '',
      accountNumber: '',
      branchCode: '',
      accountType: '',
      clientName: 'Test Client',
      clientEmail: '',
      clientAddress: '',
      invoiceNumber: 'INV-001',
      invoiceDate: '2024-01-01',
      dueDate: '2024-02-01',
      paymentReference: '',
      lineItems: [],
      notes: '',
      paymentTermsDays: 30,
    };

    it('should have no accessibility violations', async () => {
      const { container } = render(
        <DownloadPDFButton
          invoiceRef={{ current: null }}
          invoiceData={mockData}
          isPro={false}
        />
      );
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
