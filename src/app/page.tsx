'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import InvoiceForm from '@/components/InvoiceForm';
import InvoicePreview from '@/components/InvoicePreview';
import DownloadPDFButton from '@/components/DownloadPDFButton';
import DraftManager from '@/components/DraftManager';
import ShareButtons from '@/components/ShareButtons';
import PROFeaturesModal from '@/components/PROFeaturesModal';
import LicenseKeyInput from '@/components/LicenseKeyInput';
import ProSettingsPanel from '@/components/ProSettingsPanel';
import DataManager from '@/components/DataManager';
import HeaderImageUploader from '@/components/HeaderImageUploader';
import { InvoiceData, InvoiceDraft, AppSettings, PaymentQRCode, DEFAULT_SETTINGS } from '@/types/invoice';
import { DEFAULT_CURRENCY, DEFAULT_TAX_RATE, DEFAULT_TAX_NAME, DEFAULT_PAYMENT_TERMS, generateId } from '@/lib/i18n';
import { useLicense } from '@/hooks/useLicense';
import { useClients } from '@/hooks/useClients';
import { useDrafts, useAutoSave } from '@/hooks/useDrafts';
import TemplateBadge from '@/components/TemplateBadge';

const createInitialInvoiceData = (): InvoiceData => ({
  documentType: 'invoice',
  template: 'modern',
  paymentMethod: 'eft',
  currency: DEFAULT_CURRENCY,
  tax: {
    enabled: false,
    rate: DEFAULT_TAX_RATE,
    name: DEFAULT_TAX_NAME,
  },
  senderName: '',
  senderEmail: '',
  senderPhone: '',
  senderAddress: '',
  registrationNumber: '',
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
  lineItems: [
    {
      id: 'initial-item',
      description: '',
      quantity: 1,
      unitPrice: 0,
    },
  ],
  notes: 'Payment is due within 30 days. Thank you for your business!',
  paymentTermsDays: DEFAULT_PAYMENT_TERMS,
  // Default colors — Zenvoice brand teal
  primaryColor: '#2EC4B6',
  accentColor: '#2EC4B6',
});

const createInitialPaymentQR = (): PaymentQRCode => ({
  enabled: false,
  type: 'paypal',
  value: '',
  label: 'Scan to Pay',
});



export default function Home() {
  const [baseInvoiceData, setBaseInvoiceData] = useState<InvoiceData>(createInitialInvoiceData);
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [showPROModal, setShowPROModal] = useState(false);
  const [showLicenseInput, setShowLicenseInput] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state after hydration to prevent mismatch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Valid pattern for client-side hydration detection
    setIsMounted(true);
  }, []);

  // Hydration Fix: Load data and set dates only on client
  useEffect(() => {
    const loadSavedData = () => {
      try {
        const autoSaveKey = 'invoice_gen_autosave';
        const stored = localStorage.getItem(autoSaveKey);

        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.data) {
            // Check if dates are already set
            if (parsed.data.invoiceDate && parsed.data.dueDate) {
              setBaseInvoiceData(parsed.data);
              return;
            }

            // Set dates if missing in saved data
            const today = new Date().toISOString().split('T')[0];
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + (parsed.data.paymentTermsDays || DEFAULT_PAYMENT_TERMS));

            setBaseInvoiceData({
              ...parsed.data,
              invoiceDate: today,
              dueDate: dueDate.toISOString().split('T')[0],
              lineItems: parsed.data.lineItems.map((item: { id: string; description: string; quantity: number; unitPrice: number }) => ({
                ...item,
                id: item.id === 'initial-item' ? generateId() : item.id,
              })),
            });
            return;
          }
        }
      } catch {
        // Ignore parsing errors
      }

      // If no saved data, set defaults with dates
      const today = new Date().toISOString().split('T')[0];
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + DEFAULT_PAYMENT_TERMS);

      setBaseInvoiceData(prev => ({
        ...prev,
        invoiceDate: today,
        dueDate: dueDate.toISOString().split('T')[0],
      }));
    };

    loadSavedData();
  }, []);

  const {
    licenseInfo,
    activate,
    canUseLogo,
    canUseCustomColors,
    canUseProTemplates,
    canImportExport,
    canUsePaymentQR,
    canCustomizeWhatsApp,
  } = useLicense();

  const { clients, saveClient, deleteClient } = useClients();
  const { drafts, saveDraft, deleteDraft } = useDrafts();
  useAutoSave(baseInvoiceData, true);

  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [paymentQR, setPaymentQR] = useState<PaymentQRCode>(createInitialPaymentQR);
  const [settings, setSettings] = useState<AppSettings>(() => ({ ...DEFAULT_SETTINGS }));
  const [headerImageUrl, setHeaderImageUrl] = useState<string | null>(null);

  // Note: Date initialization is handled in loadInitialData lazy initialization

  // Merge base invoice data with Pro settings
  const invoiceData = useMemo(() => ({
    ...baseInvoiceData,
    paymentQR: canUsePaymentQR ? paymentQR : undefined,
    settings: canCustomizeWhatsApp ? settings : undefined,
    headerImageUrl: canUseProTemplates ? headerImageUrl : undefined,
  }), [baseInvoiceData, paymentQR, settings, headerImageUrl, canUsePaymentQR, canCustomizeWhatsApp, canUseProTemplates]);



  const handleSaveDraft = useCallback(() => {
    const name = prompt('Enter a name for this draft:', `${invoiceData.documentType === 'quotation' ? 'Quote' : 'Invoice'} - ${invoiceData.clientName || 'Unnamed'}`);
    if (name) {
      saveDraft(name, invoiceData);
    }
  }, [invoiceData, saveDraft]);

  const handleLoadDraft = useCallback((draft: InvoiceDraft) => {
    setBaseInvoiceData(draft.data);
  }, []);

  const handleLogoChange = useCallback((base64: string) => {
    setLogoUrl(base64);
  }, []);

  const handleLogoRemove = useCallback(() => {
    setLogoUrl(null);
  }, []);

  const handleHeaderImageChange = useCallback((base64: string | null) => {
    setHeaderImageUrl(base64);
  }, []);

  const handleImportData = useCallback((jsonData: string) => {
    try {
      const parsed = JSON.parse(jsonData);

      if (!parsed.version || !parsed.data) {
        alert('Invalid backup file format');
        return;
      }

      // Restore all data
      if (parsed.data.license) {
        localStorage.setItem('invoice_gen_pro_license', parsed.data.license);
      }
      if (parsed.data.features) {
        localStorage.setItem('invoice_gen_pro_features', parsed.data.features);
      }
      if (parsed.data.clients) {
        localStorage.setItem('invoice_gen_clients', parsed.data.clients);
      }
      if (parsed.data.drafts) {
        localStorage.setItem('invoice_gen_drafts', parsed.data.drafts);
      }
      if (parsed.data.settings) {
        localStorage.setItem('invoice_gen_settings', parsed.data.settings);
      }
      if (parsed.data.autoSave) {
        localStorage.setItem('invoice_gen_autosave', parsed.data.autoSave);
      }

      alert('Data imported successfully! Please refresh the page to see changes.');
      window.location.reload();
    } catch (error) {
      console.error('Import error:', error);
      alert('Failed to import data. Please check the file and try again.');
    }
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-brand-bg)' }}>
      <header role="banner" className="bg-white border-b border-gray-200 lg:sticky lg:top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/Zenvoice_Logo.png" alt="Zenvoice" className="h-10 w-auto" />
              <div>
                <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-brand-primary)' }}>
                  Zenvoice
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  Simple invoices. No signup. No subscriptions.
                </p>
              </div>
              {isMounted && licenseInfo.isValid && (
                <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#2EC4B620', color: '#2EC4B6' }}>
                  PRO
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <DraftManager
                drafts={drafts}
                onLoad={handleLoadDraft}
                onSave={handleSaveDraft}
                onDelete={deleteDraft}
              />
              <ShareButtons
                invoiceData={invoiceData}
                logoUrl={licenseInfo.isValid && canUseLogo ? logoUrl : null}
                isPro={licenseInfo.isValid}
                canCustomizeWhatsApp={canCustomizeWhatsApp}
              />
              <DownloadPDFButton
                invoiceRef={invoiceRef}
                invoiceData={invoiceData}
                logoUrl={licenseInfo.isValid && canUseLogo ? logoUrl : null}
                isPro={licenseInfo.isValid}
              />
              {isMounted && !licenseInfo.isValid && (
                <button
                  onClick={() => setShowPROModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-semibold hover:from-teal-600 hover:to-teal-700 transition-colors flex items-center gap-2"
                >
                  <TemplateBadge />
                  <span className="hidden sm:inline">Upgrade</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation - All Screen Sizes (Sticky) */}
      <div className="bg-white border-b border-gray-200 sticky top-[72px] z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex">
            <button
              onClick={() => setActiveTab('form')}
              className={`flex-1 py-3 text-sm font-medium text-center transition-colors flex items-center justify-center gap-2 ${activeTab === 'form'
                ? 'border-b-2'
                : 'text-gray-500 hover:text-gray-700'
                }`}
              style={activeTab === 'form' ? { color: 'var(--color-brand-primary)', borderColor: 'var(--color-brand-primary)' } : undefined}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Document Settings
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex-1 py-3 text-sm font-medium text-center transition-colors flex items-center justify-center gap-2 ${activeTab === 'preview'
                ? 'border-b-2'
                : 'text-gray-500 hover:text-gray-700'
                }`}
              style={activeTab === 'preview' ? { color: 'var(--color-brand-primary)', borderColor: 'var(--color-brand-primary)' } : undefined}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Live Preview
            </button>
          </div>
        </div>
      </div>

      <main role="main" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Document Settings Tab */}
        <div className={`${activeTab === 'preview' ? 'hidden' : ''}`}>
          <InvoiceForm
            data={baseInvoiceData}
            onChange={setBaseInvoiceData}
            logoUrl={licenseInfo.isValid && canUseLogo ? logoUrl : null}
            onLogoChange={handleLogoChange}
            onLogoRemove={handleLogoRemove}
            savedClients={clients}
            onSaveClient={saveClient}
            onDeleteClient={deleteClient}
            canUseLogo={licenseInfo.isValid && canUseLogo}
            canUseProTemplates={licenseInfo.isValid && canUseProTemplates}
            mounted={isMounted}
          />

          {isMounted && licenseInfo.isValid && (
            <div className="mt-6 space-y-6">
              {(canUseCustomColors || canUsePaymentQR || canCustomizeWhatsApp) && (
                <ProSettingsPanel
                  paymentQR={paymentQR}
                  onPaymentQRChange={setPaymentQR}
                  settings={settings}
                  onSettingsChange={setSettings}
                  templateId={baseInvoiceData.template}
                  primaryColor={baseInvoiceData.primaryColor}
                  accentColor={baseInvoiceData.accentColor}
                  onPrimaryColorChange={canUseCustomColors ? (color: string) => setBaseInvoiceData(prev => ({ ...prev, primaryColor: color })) : undefined}
                  onAccentColorChange={canUseCustomColors ? (color: string) => setBaseInvoiceData(prev => ({ ...prev, accentColor: color })) : undefined}
                />
              )}

              {canUseProTemplates && baseInvoiceData.template === 'letterhead' && (
                <HeaderImageUploader
                  headerImageUrl={headerImageUrl}
                  onHeaderImageChange={handleHeaderImageChange}
                />
              )}

              {canImportExport && (
                <DataManager
                  canImportExport={canImportExport}
                  onImport={handleImportData}
                />
              )}
            </div>
          )}

          {showLicenseInput && !licenseInfo.isValid && (
            <div className="mt-6">
              <LicenseKeyInput
                onActivate={(key) => activate(key)}
                onCancel={() => setShowLicenseInput(false)}
              />
            </div>
          )}
        </div>

        {/* Live Preview Tab */}
        <div className={`${activeTab === 'form' ? 'hidden' : ''}`}>
          <div className="max-w-3xl mx-auto">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-700">Live Preview</h2>
              <p className="text-sm text-gray-500">
                This is how your {invoiceData.documentType} will look when printed or downloaded
              </p>
            </div>

            {/* PDF Accessibility Notice */}
            <div role="note" aria-label="PDF Accessibility Notice" className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700 flex items-start gap-2">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  PDFs are visual documents and may not be fully accessible to screen readers.
                  For accessible formats, please contact the document sender.
                </span>
              </p>
            </div>
            <InvoicePreview
              ref={invoiceRef}
              data={invoiceData}
              logoUrl={licenseInfo.isValid && canUseLogo ? logoUrl : null}
              isPro={licenseInfo.isValid}
              mounted={isMounted}
            />
          </div>
        </div>
      </main>

      <footer role="contentinfo" className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500" suppressHydrationWarning>
            Zenvoice — Simple invoices. No signup. No subscriptions. All data stays in your browser.
            {isMounted && licenseInfo.isValid ? ' PRO activated.' : ''}
          </p>
        </div>
      </footer>

      {/* SEO Content Section — visible to Google, useful to users */}
      <section className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Why Use Zenvoice?
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Zenvoice is a <strong>free invoice generator</strong> that works entirely in your browser — no signup, no watermarks, no subscriptions.
            Whether you&apos;re a freelancer, small business owner, or side hustler, you can create professional invoices and quotations in seconds.
            Your data never leaves your device, making it the most <strong>private invoice maker</strong> available.
          </p>

          <h3 className="text-xl font-semibold text-gray-700 mb-3">Built for Freelancers & Small Businesses</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Stop paying monthly fees for bloated invoicing software. Zenvoice gives you everything you need to send clean, professional invoices —
            multi-currency support, customizable templates, tax configuration, and <strong>WhatsApp sharing</strong> built right in.
            Need to work offline? No problem — Zenvoice works without an internet connection and saves everything locally.
          </p>

          <h3 className="text-xl font-semibold text-gray-700 mb-3">PRO Features for Growing Businesses</h3>
          <p className="text-gray-600 leading-relaxed">
            Upgrade once, use forever. For a one-time payment, unlock company logo uploads, full color customization,
            6 premium templates, payment QR codes, and data backup. No recurring charges — just a simple tool that gets out of your way
            so you can focus on your work.
          </p>
        </div>
      </section>

      <PROFeaturesModal
        isOpen={showPROModal}
        onClose={() => setShowPROModal(false)}
        onShowLicenseInput={() => {
          setShowPROModal(false);
          setShowLicenseInput(true);
        }}
      />
    </div>
  );
}
