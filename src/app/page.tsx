'use client';

import { useState, useRef, useEffect } from 'react';
import InvoiceForm from '@/components/InvoiceForm';
import InvoicePreview from '@/components/InvoicePreview';
import DownloadPDFButton from '@/components/DownloadPDFButton';
import DraftManager from '@/components/DraftManager';
import ShareButtons from '@/components/ShareButtons';
import { InvoiceData, InvoiceDraft } from '@/types/invoice';
import { generateId, getTodayDate, getDueDate } from '@/lib/utils';
import { useUnlockState, useLogoState } from '@/hooks/useUnlockState';
import { useClients } from '@/hooks/useClients';
import { useDrafts, useAutoSave } from '@/hooks/useDrafts';

// Static initial data to avoid hydration mismatch
// All dynamic values (dates, IDs) are set in useEffect
const initialData: InvoiceData = {
  documentType: 'invoice',
  template: 'modern',
  paymentMethod: 'eft',
  freelancerName: '',
  freelancerEmail: '',
  freelancerPhone: '',
  freelancerAddress: '',
  companyRegistration: '',
  bankName: '',
  accountNumber: '',
  branchCode: '',
  accountType: '',
  clientName: '',
  clientEmail: '',
  clientAddress: '',
  invoiceNumber: 'INV-001',
  invoiceDate: '',
  dueDate: '',
  paymentReference: '',
  includeVAT: false,
  vatNumber: '',
  lineItems: [
    {
      id: 'initial-item', // Static ID to prevent hydration mismatch
      description: '',
      quantity: 1,
      unitPrice: 0,
    },
  ],
  notes: 'Payment is due within 30 days. Thank you for your business!',
};

export default function Home() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(initialData);
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');
  const invoiceRef = useRef<HTMLDivElement>(null);

  // Monetization hooks
  const { isUnlocked, isLoading: unlockLoading, unlock } = useUnlockState();
  const { logoUrl, saveLogo, removeLogo } = useLogoState();

  // Client & Draft management hooks
  const { clients, saveClient, deleteClient } = useClients();
  const { drafts, saveDraft, deleteDraft, loadDraft } = useDrafts();
  const { loadAutoSave, hasAutoSave } = useAutoSave(invoiceData, true);

  // Set dynamic values on client-side only to avoid hydration mismatch
  useEffect(() => {
    // Check for auto-saved data first
    const autoSaved = loadAutoSave();
    if (autoSaved && hasAutoSave()) {
      setInvoiceData(autoSaved);
      return;
    }

    setInvoiceData(prev => ({
      ...prev,
      invoiceDate: getTodayDate(),
      dueDate: getDueDate(),
      lineItems: prev.lineItems.map((item) => ({
        ...item,
        id: item.id === 'initial-item' ? generateId() : item.id,
      })),
    }));
  }, [loadAutoSave, hasAutoSave]);

  // Handle draft save
  const handleSaveDraft = () => {
    const name = prompt('Enter a name for this draft:', `${invoiceData.documentType === 'quotation' ? 'Quote' : 'Invoice'} - ${invoiceData.clientName || 'Unnamed'}`);
    if (name) {
      saveDraft(name, invoiceData);
    }
  };

  // Handle draft load
  const handleLoadDraft = (draft: InvoiceDraft) => {
    setInvoiceData(draft.data);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 lg:sticky lg:top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  🇿🇦 SA Invoice Generator
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Free invoice generator for South African freelancers & small businesses
                </p>
              </div>
              {/* Pro badge */}
              {isUnlocked && (
                <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                  PRO
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <DraftManager
                drafts={drafts}
                onLoad={handleLoadDraft}
                onSave={handleSaveDraft}
                onDelete={deleteDraft}
              />
              <ShareButtons invoiceData={invoiceData} />
              <DownloadPDFButton
                invoiceRef={invoiceRef}
                invoiceData={invoiceData}
                logoUrl={logoUrl}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Tabs */}
      <div className="lg:hidden bg-white border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('form')}
            className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${activeTab === 'form'
              ? 'text-emerald-600 border-b-2 border-emerald-600'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Edit Invoice
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${activeTab === 'preview'
              ? 'text-emerald-600 border-b-2 border-emerald-600'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Preview
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className={`${activeTab === 'preview' ? 'hidden lg:block' : ''}`}>
            <InvoiceForm
              data={invoiceData}
              onChange={setInvoiceData}

              logoUrl={logoUrl}
              onLogoChange={saveLogo}
              onLogoRemove={removeLogo}
              savedClients={clients}
              onSaveClient={saveClient}
              onDeleteClient={deleteClient}
            />
          </div>

          {/* Preview Section */}
          <div
            className={`${activeTab === 'form' ? 'hidden lg:block' : ''
              } lg:sticky lg:top-24 lg:self-start overflow-x-auto`}
          >
            <div className="min-w-[360px]">
              <div className="mb-4 hidden lg:block">
                <h2 className="text-lg font-semibold text-gray-700">Live Preview</h2>
                <p className="text-sm text-gray-500">
                  This is how your invoice will look
                </p>
              </div>
              <InvoicePreview
                ref={invoiceRef}
                data={invoiceData}
                logoUrl={isUnlocked ? logoUrl : null}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            Free invoice generator for South African freelancers & small businesses. No signup required.
            <br />
            All data stays in your browser - we never see your invoices.
          </p>
        </div>
      </footer>
    </main>
  );
}
