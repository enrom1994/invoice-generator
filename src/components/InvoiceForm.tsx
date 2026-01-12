'use client';

import { InvoiceData, SavedClient, TemplateType } from '@/types/invoice';
import LineItems from './LineItems';
import LogoUpload from './LogoUpload';
import DocumentTypeToggle from './DocumentTypeToggle';
import TemplateSelector from './TemplateSelector';
import ClientSelector from './ClientSelector';
import PaymentTermsSelector from './PaymentTermsSelector';

interface InvoiceFormProps {
    data: InvoiceData;
    onChange: (data: InvoiceData) => void;
    logoUrl: string | null;
    onLogoChange: (base64: string) => void;
    onLogoRemove: () => void;
    // Client management
    savedClients: SavedClient[];
    onSaveClient: (client: Omit<SavedClient, 'id' | 'createdAt'>) => void;
    onDeleteClient: (id: string) => void;
}

export default function InvoiceForm({
    data,
    onChange,
    logoUrl,
    onLogoChange,
    onLogoRemove,
    savedClients,
    onSaveClient,
    onDeleteClient,
}: InvoiceFormProps) {
    const updateField = <K extends keyof InvoiceData>(field: K, value: InvoiceData[K]) => {
        onChange({ ...data, [field]: value });
    };

    // Handle client selection
    const handleSelectClient = (client: SavedClient) => {
        onChange({
            ...data,
            clientName: client.name,
            clientEmail: client.email,
            clientAddress: client.address,
        });
    };

    // Get label based on document type
    const isQuote = data.documentType === 'quotation';
    const documentLabel = isQuote ? 'Quote' : 'Invoice';
    const dueDateLabel = isQuote ? 'Valid Until' : 'Due Date';

    return (
        <div className="space-y-8">
            {/* Document Settings */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Document Settings</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Document Type
                        </label>
                        <DocumentTypeToggle
                            value={data.documentType}
                            onChange={(value) => updateField('documentType', value)}
                        />
                    </div>
                    <TemplateSelector
                        value={data.template}
                        onChange={(value) => updateField('template', value)}
                    />
                </div>
            </section>

            {/* Freelancer Details */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    Your Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Your Name / Business Name *
                        </label>
                        <input
                            type="text"
                            value={data.freelancerName}
                            onChange={(e) => updateField('freelancerName', e.target.value)}
                            placeholder="John Doe Consulting"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={data.freelancerEmail}
                            onChange={(e) => updateField('freelancerEmail', e.target.value)}
                            placeholder="john@example.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone
                        </label>
                        <input
                            type="tel"
                            value={data.freelancerPhone}
                            onChange={(e) => updateField('freelancerPhone', e.target.value)}
                            placeholder="072 123 4567"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address
                        </label>
                        <input
                            type="text"
                            value={data.freelancerAddress}
                            onChange={(e) => updateField('freelancerAddress', e.target.value)}
                            placeholder="123 Main Street, Cape Town, 8001"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Company Registration Number
                        </label>
                        <input
                            type="text"
                            value={data.companyRegistration || ''}
                            onChange={(e) => updateField('companyRegistration', e.target.value)}
                            placeholder="2024/123456/07"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>
                </div>

                {/* Bank Details */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-600 mb-3">Banking Details (Optional)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Bank Name
                            </label>
                            <input
                                type="text"
                                value={data.bankName}
                                onChange={(e) => updateField('bankName', e.target.value)}
                                placeholder="FNB, Standard Bank, etc."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Account Number
                            </label>
                            <input
                                type="text"
                                value={data.accountNumber}
                                onChange={(e) => updateField('accountNumber', e.target.value)}
                                placeholder="1234567890"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Branch Code
                            </label>
                            <input
                                type="text"
                                value={data.branchCode}
                                onChange={(e) => updateField('branchCode', e.target.value)}
                                placeholder="250655"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Account Type
                            </label>
                            <select
                                value={data.accountType || ''}
                                onChange={(e) => updateField('accountType', e.target.value as 'cheque' | 'savings' | '')}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            >
                                <option value="">Select...</option>
                                <option value="cheque">Cheque</option>
                                <option value="savings">Savings</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Logo Upload - Always shown */}
                <LogoUpload
                    logoUrl={logoUrl}
                    onLogoChange={onLogoChange}
                    onLogoRemove={onLogoRemove}
                />
            </section>

            {/* Client Details */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    Client Details
                </h2>

                {/* Client Selector */}
                <div className="mb-4">
                    <ClientSelector
                        clients={savedClients}
                        onSelect={handleSelectClient}
                        onSave={onSaveClient}
                        onDelete={onDeleteClient}
                        currentClientName={data.clientName}
                        currentClientEmail={data.clientEmail}
                        currentClientAddress={data.clientAddress}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Client Name / Company *
                        </label>
                        <input
                            type="text"
                            value={data.clientName}
                            onChange={(e) => updateField('clientName', e.target.value)}
                            placeholder="ABC Company (Pty) Ltd"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Client Email
                        </label>
                        <input
                            type="email"
                            value={data.clientEmail}
                            onChange={(e) => updateField('clientEmail', e.target.value)}
                            placeholder="accounts@abccompany.co.za"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Client Address
                        </label>
                        <input
                            type="text"
                            value={data.clientAddress}
                            onChange={(e) => updateField('clientAddress', e.target.value)}
                            placeholder="456 Business Park, Johannesburg, 2001"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>
                </div>
            </section>

            {/* Invoice/Quote Details */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    {documentLabel} Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {documentLabel} Number *
                        </label>
                        <input
                            type="text"
                            value={data.invoiceNumber}
                            onChange={(e) => updateField('invoiceNumber', e.target.value)}
                            placeholder="INV-001"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Payment Reference
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={data.paymentReference || ''}
                                onChange={(e) => updateField('paymentReference', e.target.value)}
                                placeholder="e.g., INV001-CLIENT"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    const ref = `${data.invoiceNumber.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}-${data.clientName.slice(0, 4).replace(/[^a-zA-Z0-9]/g, '').toUpperCase() || 'REF'}`;
                                    updateField('paymentReference', ref);
                                }}
                                className="px-3 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
                                title="Auto-generate from invoice number and client name"
                            >
                                Auto
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Client uses this when making EFT payment</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {documentLabel} Date *
                        </label>
                        <input
                            type="date"
                            value={data.invoiceDate}
                            onChange={(e) => updateField('invoiceDate', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {dueDateLabel} *
                        </label>
                        <input
                            type="date"
                            value={data.dueDate}
                            onChange={(e) => updateField('dueDate', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            required
                        />
                    </div>
                </div>

                {/* VAT Toggle */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.includeVAT}
                                onChange={(e) => updateField('includeVAT', e.target.checked)}
                                className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                            />
                            <span className="text-sm font-medium text-gray-700">
                                Include VAT (15%)
                            </span>
                        </label>
                    </div>
                    {data.includeVAT && (
                        <div className="mt-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                VAT Registration Number
                            </label>
                            <input
                                type="text"
                                value={data.vatNumber}
                                onChange={(e) => updateField('vatNumber', e.target.value)}
                                placeholder="4123456789"
                                className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                        </div>
                    )}
                </div>
            </section>

            {/* Line Items */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                    Services / Products
                </h2>
                <LineItems
                    lineItems={data.lineItems}
                    onChange={(items) => updateField('lineItems', items)}
                />
            </section>

            {/* Notes */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <span className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm font-bold">5</span>
                        Notes & Payment Terms
                    </h2>
                    <PaymentTermsSelector
                        currentNotes={data.notes}
                        onApply={(terms) => updateField('notes', terms)}
                    />
                </div>
                <textarea
                    value={data.notes}
                    onChange={(e) => updateField('notes', e.target.value)}
                    placeholder="Payment is due within 30 days. Thank you for your business!"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                />
            </section>
        </div>
    );
}
