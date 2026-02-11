import React from 'react';
import { render, screen } from '@testing-library/react';
import StandardLayout from '../components/templates/StandardLayout';
import SidebarLayout from '../components/templates/SidebarLayout';
import CardLayout from '../components/templates/CardLayout';
import SplitLayout from '../components/templates/SplitLayout';
import ExecutiveLayout from '../components/templates/ExecutiveLayout';
import LuxuryMinimalLayout from '../components/templates/LuxuryMinimalLayout';
import { InvoiceData, TemplateType } from '../types/invoice';
import { DEFAULT_CURRENCY } from '../lib/i18n';

const mockInvoiceData: InvoiceData = {
  documentType: 'invoice',
  template: 'modern' as TemplateType,
  paymentMethod: 'eft',
  currency: DEFAULT_CURRENCY,
  tax: { enabled: true, rate: 10, name: 'VAT' },
  senderName: 'Test Business',
  senderEmail: 'test@example.com',
  senderPhone: '+1234567890',
  senderAddress: '123 Test St, Test City',
  registrationNumber: 'TEST123',
  bankName: 'Test Bank',
  accountNumber: '123456789',
  branchCode: 'TEST001',
  accountType: 'cheque',
  clientName: 'Test Client',
  clientEmail: 'client@example.com',
  clientAddress: '456 Client Ave',
  invoiceNumber: 'INV-001',
  invoiceDate: '2024-01-15',
  dueDate: '2024-02-15',
  paymentReference: 'INV001-CLIE',
  lineItems: [
    { id: '1', description: 'Test Item 1', quantity: 2, unitPrice: 100 },
    { id: '2', description: 'Test Item 2', quantity: 1, unitPrice: 50 },
  ],
  notes: 'Test notes for the invoice',
  paymentTermsDays: 30,
};

const mockColors = {
  primary: '#059669',
  accent: '#059669',
  background: '#ffffff',
  text: '#111827',
  textMuted: '#6b7280',
  border: '#e5e7eb',
};

describe('Template Rendering Tests', () => {
  describe('StandardLayout', () => {
    it('should render without errors', () => {
      const { container } = render(
        <StandardLayout
          data={mockInvoiceData}
          colors={mockColors}
          logoUrl={null}
          isCompact={false}
          documentTitle="Invoice"
          dateLabel="Invoice Date"
          dueDateLabel="Due Date"
          subtotal={250}
          taxAmount={25}
          total={275}
        />
      );
      expect(container).toBeTruthy();
    });

    it('should display invoice number', () => {
      render(
        <StandardLayout
          data={mockInvoiceData}
          colors={mockColors}
          logoUrl={null}
          isCompact={false}
          documentTitle="Invoice"
          dateLabel="Invoice Date"
          dueDateLabel="Due Date"
          subtotal={250}
          taxAmount={25}
          total={275}
        />
      );
      expect(screen.getByText('#INV-001')).toBeInTheDocument();
    });

    it('should display sender name', () => {
      render(
        <StandardLayout
          data={mockInvoiceData}
          colors={mockColors}
          logoUrl={null}
          isCompact={false}
          documentTitle="Invoice"
          dateLabel="Invoice Date"
          dueDateLabel="Due Date"
          subtotal={250}
          taxAmount={25}
          total={275}
        />
      );
      expect(screen.getByText('Test Business')).toBeInTheDocument();
    });

    it('should display client name', () => {
      render(
        <StandardLayout
          data={mockInvoiceData}
          colors={mockColors}
          logoUrl={null}
          isCompact={false}
          documentTitle="Invoice"
          dateLabel="Invoice Date"
          dueDateLabel="Due Date"
          subtotal={250}
          taxAmount={25}
          total={275}
        />
      );
      expect(screen.getByText('Test Client')).toBeInTheDocument();
    });

    it('should display line items', () => {
      render(
        <StandardLayout
          data={mockInvoiceData}
          colors={mockColors}
          logoUrl={null}
          isCompact={false}
          documentTitle="Invoice"
          dateLabel="Invoice Date"
          dueDateLabel="Due Date"
          subtotal={250}
          taxAmount={25}
          total={275}
        />
      );
      expect(screen.getByText('Test Item 1')).toBeInTheDocument();
      expect(screen.getByText('Test Item 2')).toBeInTheDocument();
    });

    it('should display total amount', () => {
      render(
        <StandardLayout
          data={mockInvoiceData}
          colors={mockColors}
          logoUrl={null}
          isCompact={false}
          documentTitle="Invoice"
          dateLabel="Invoice Date"
          dueDateLabel="Due Date"
          subtotal={250}
          taxAmount={25}
          total={275}
        />
      );
      expect(screen.getByText(/\$275\.00/)).toBeInTheDocument();
    });

    it('should handle empty line items', () => {
      const emptyData = { ...mockInvoiceData, lineItems: [] };
      render(
        <StandardLayout
          data={emptyData}
          colors={mockColors}
          logoUrl={null}
          isCompact={false}
          documentTitle="Invoice"
          dateLabel="Invoice Date"
          dueDateLabel="Due Date"
          subtotal={0}
          taxAmount={0}
          total={0}
        />
      );
      expect(screen.getByText('Test Business')).toBeInTheDocument();
    });

    it('should render in compact mode', () => {
      const { container } = render(
        <StandardLayout
          data={mockInvoiceData}
          colors={mockColors}
          logoUrl={null}
          isCompact={true}
          documentTitle="Invoice"
          dateLabel="Invoice Date"
          dueDateLabel="Due Date"
          subtotal={250}
          taxAmount={25}
          total={275}
        />
      );
      expect(container).toBeTruthy();
    });
  });

  describe('SidebarLayout', () => {
    it('should render without errors', () => {
      const { container } = render(
        <SidebarLayout
          data={mockInvoiceData}
          colors={mockColors}
          logoUrl={null}
          documentTitle="Invoice"
          dateLabel="Invoice Date"
          dueDateLabel="Due Date"
          subtotal={250}
          taxAmount={25}
          total={275}
        />
      );
      expect(container).toBeTruthy();
    });

    it('should display sender information', () => {
      render(
        <SidebarLayout
          data={mockInvoiceData}
          colors={mockColors}
          logoUrl={null}
          documentTitle="Invoice"
          dateLabel="Invoice Date"
          dueDateLabel="Due Date"
          subtotal={250}
          taxAmount={25}
          total={275}
        />
      );
      expect(screen.getByText('Test Business')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    it('should display client information', () => {
      render(
        <SidebarLayout
          data={mockInvoiceData}
          colors={mockColors}
          logoUrl={null}
          documentTitle="Invoice"
          dateLabel="Invoice Date"
          dueDateLabel="Due Date"
          subtotal={250}
          taxAmount={25}
          total={275}
        />
      );
      expect(screen.getByText('Test Client')).toBeInTheDocument();
    });

    it('should display invoice details', () => {
      render(
        <SidebarLayout
          data={mockInvoiceData}
          colors={mockColors}
          logoUrl={null}
          documentTitle="Invoice"
          dateLabel="Invoice Date"
          dueDateLabel="Due Date"
          subtotal={250}
          taxAmount={25}
          total={275}
        />
      );
      expect(screen.getByText('#INV-001')).toBeInTheDocument();
    });
  });

  describe('CardLayout', () => {
    it('should render without errors', () => {
      const { container } = render(
        <CardLayout
          data={mockInvoiceData}
          colors={mockColors}
          logoUrl={null}
          documentTitle="Invoice"
          dateLabel="Invoice Date"
          dueDateLabel="Due Date"
          subtotal={250}
          taxAmount={25}
          total={275}
        />
      );
      expect(container).toBeTruthy();
    });

    it('should display sender name', () => {
      render(
        <CardLayout
          data={mockInvoiceData}
          colors={mockColors}
          logoUrl={null}
          documentTitle="Invoice"
          dateLabel="Invoice Date"
          dueDateLabel="Due Date"
          subtotal={250}
          taxAmount={25}
          total={275}
        />
      );
      expect(screen.getByText('Test Business')).toBeInTheDocument();
    });

    it('should display client name', () => {
      render(
        <CardLayout
          data={mockInvoiceData}
          colors={mockColors}
          logoUrl={null}
          documentTitle="Invoice"
          dateLabel="Invoice Date"
          dueDateLabel="Due Date"
          subtotal={250}
          taxAmount={25}
          total={275}
        />
      );
      expect(screen.getByText('Test Client')).toBeInTheDocument();
    });
  });

  describe('SplitLayout', () => {
    it('should render without errors', () => {
      const { container } = render(
        <SplitLayout
          data={mockInvoiceData}
          colors={mockColors}
          logoUrl={null}
          documentTitle="Invoice"
          dateLabel="Invoice Date"
          dueDateLabel="Due Date"
          subtotal={250}
          taxAmount={25}
          total={275}
        />
      );
      expect(container).toBeTruthy();
    });

    it('should display sender name', () => {
      render(
        <SplitLayout
          data={mockInvoiceData}
          colors={mockColors}
          logoUrl={null}
          documentTitle="Invoice"
          dateLabel="Invoice Date"
          dueDateLabel="Due Date"
          subtotal={250}
          taxAmount={25}
          total={275}
        />
      );
      // SplitLayout shows sender in header and in sidebar - use findAllByText
      const senderElements = screen.getAllByText('Test Business');
      expect(senderElements.length).toBeGreaterThanOrEqual(1);
    });

    it('should display client name', () => {
      render(
        <SplitLayout
          data={mockInvoiceData}
          colors={mockColors}
          logoUrl={null}
          documentTitle="Invoice"
          dateLabel="Invoice Date"
          dueDateLabel="Due Date"
          subtotal={250}
          taxAmount={25}
          total={275}
        />
      );
      expect(screen.getByText('Test Client')).toBeInTheDocument();
    });
  });

  describe('ExecutiveLayout', () => {
    it('should render without errors', () => {
      const { container } = render(
        <ExecutiveLayout
          data={mockInvoiceData}
          colors={mockColors}
          logoUrl={null}
          documentTitle="Invoice"
          dateLabel="Invoice Date"
          dueDateLabel="Due Date"
          subtotal={250}
          taxAmount={25}
          total={275}
        />
      );
      expect(container).toBeTruthy();
    });

    it('should display sender name', () => {
      render(
        <ExecutiveLayout
          data={mockInvoiceData}
          colors={mockColors}
          logoUrl={null}
          documentTitle="Invoice"
          dateLabel="Invoice Date"
          dueDateLabel="Due Date"
          subtotal={250}
          taxAmount={25}
          total={275}
        />
      );
      const senderElements = screen.getAllByText('Test Business');
      expect(senderElements.length).toBeGreaterThanOrEqual(1);
    });

    it('should display client name', () => {
      render(
        <ExecutiveLayout
          data={mockInvoiceData}
          colors={mockColors}
          logoUrl={null}
          documentTitle="Invoice"
          dateLabel="Invoice Date"
          dueDateLabel="Due Date"
          subtotal={250}
          taxAmount={25}
          total={275}
        />
      );
      expect(screen.getByText('Test Client')).toBeInTheDocument();
    });
  });

  describe('LuxuryMinimalLayout', () => {
    it('should render without errors', () => {
      const { container } = render(
        <LuxuryMinimalLayout
          data={mockInvoiceData}
          colors={mockColors}
          logoUrl={null}
          documentTitle="Invoice"
          dateLabel="Invoice Date"
          dueDateLabel="Due Date"
          subtotal={250}
          taxAmount={25}
          total={275}
        />
      );
      expect(container).toBeTruthy();
    });

    it('should display sender name', () => {
      render(
        <LuxuryMinimalLayout
          data={mockInvoiceData}
          colors={mockColors}
          logoUrl={null}
          documentTitle="Invoice"
          dateLabel="Invoice Date"
          dueDateLabel="Due Date"
          subtotal={250}
          taxAmount={25}
          total={275}
        />
      );
      const senderElements = screen.getAllByText('Test Business');
      expect(senderElements.length).toBeGreaterThanOrEqual(1);
    });

    it('should display client name', () => {
      render(
        <LuxuryMinimalLayout
          data={mockInvoiceData}
          colors={mockColors}
          logoUrl={null}
          documentTitle="Invoice"
          dateLabel="Invoice Date"
          dueDateLabel="Due Date"
          subtotal={250}
          taxAmount={25}
          total={275}
        />
      );
      expect(screen.getByText('Test Client')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing optional fields', () => {
      const minimalData: InvoiceData = {
        documentType: 'invoice',
        template: 'modern' as TemplateType,
        paymentMethod: 'cash',
        currency: DEFAULT_CURRENCY,
        tax: { enabled: false, rate: 0, name: 'Tax' },
        senderName: 'Minimal Business',
        senderEmail: '',
        senderPhone: '',
        senderAddress: '',
        registrationNumber: '',
        bankName: '',
        accountNumber: '',
        branchCode: '',
        accountType: '',
        clientName: 'Minimal Client',
        clientEmail: '',
        clientAddress: '',
        invoiceNumber: 'MIN-001',
        invoiceDate: '2024-01-15',
        dueDate: '2024-02-15',
        paymentReference: '',
        lineItems: [{ id: '1', description: 'One Item', quantity: 1, unitPrice: 100 }],
        notes: '',
        paymentTermsDays: 30,
      };

      render(
        <StandardLayout
          data={minimalData}
          colors={mockColors}
          logoUrl={null}
          isCompact={false}
          documentTitle="Invoice"
          dateLabel="Invoice Date"
          dueDateLabel="Due Date"
          subtotal={100}
          taxAmount={0}
          total={100}
        />
      );

      expect(screen.getByText('Minimal Business')).toBeInTheDocument();
      expect(screen.getByText('Minimal Client')).toBeInTheDocument();
    });

    it('should handle very long text', () => {
      const longData = {
        ...mockInvoiceData,
        senderName: 'This is a very long business name that might cause layout issues',
        clientName: 'This is a very long client name that might cause layout issues',
        notes: 'This is a very long note that might cause layout issues. '.repeat(10),
      };

      const { container } = render(
        <StandardLayout
          data={longData}
          colors={mockColors}
          logoUrl={null}
          isCompact={false}
          documentTitle="Invoice"
          dateLabel="Invoice Date"
          dueDateLabel="Due Date"
          subtotal={250}
          taxAmount={25}
          total={275}
        />
      );
      expect(container).toBeTruthy();
    });
  });
});
