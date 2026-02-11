'use client';

import { InvoiceData, SavedClient } from '@/types/invoice';
import { DEFAULT_CURRENCY, CURRENCIES, DEFAULT_TAX_NAME, PAYMENT_TERMS_OPTIONS } from '@/lib/i18n';
import { getDemoDataForTemplate } from '@/lib/demoData';
import LineItems from './LineItems';
import LogoUpload from './LogoUpload';
import DocumentTypeToggle from './DocumentTypeToggle';
import PaymentMethodToggle from './PaymentMethodToggle';
import TemplateSelector from './TemplateSelector';
import ClientSelector from './ClientSelector';

interface InvoiceFormProps {
    data: InvoiceData;
    onChange: (data: InvoiceData) => void;
    logoUrl: string | null;
    onLogoChange: (base64: string) => void;
    onLogoRemove: () => void;
    savedClients: SavedClient[];
    onSaveClient: (client: Omit<SavedClient, 'id' | 'createdAt'>) => void;
    onDeleteClient: (id: string) => void;
    canUseLogo: boolean;
    canUseProTemplates: boolean;
    mounted?: boolean;
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
    canUseLogo: hasProLogo,
    canUseProTemplates: hasProTemplates,
    mounted = false,
}: InvoiceFormProps) {
    const updateField = <K extends keyof InvoiceData>(field: K, value: InvoiceData[K]) => {
        onChange({ ...data, [field]: value });
    };

    const handleSelectClient = (client: SavedClient) => {
        onChange({
            ...data,
            clientName: client.name,
            clientEmail: client.email,
            clientAddress: client.address,
        });
    };

    const handleCurrencyChange = (code: string) => {
        const currency = CURRENCIES.find(c => c.code === code) || DEFAULT_CURRENCY;
        updateField('currency', currency);
    };

    const handleTaxRateChange = (rate: number) => {
        updateField('tax', {
            ...data.tax,
            rate: Math.max(0, Math.min(100, rate)),
        });
    };

    const handleTaxToggle = (enabled: boolean) => {
        updateField('tax', {
            ...data.tax,
            enabled,
        });
    };

    const handleTaxNameChange = (name: string) => {
        updateField('tax', {
            ...data.tax,
            name: name || DEFAULT_TAX_NAME,
        });
    };

    const isQuote = data.documentType === 'quotation';
    const documentLabel = isQuote ? 'Quote' : 'Invoice';
    const dueDateLabel = isQuote ? 'Valid Until' : 'Due Date';

    const subtotal = data.lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const taxAmount = data.tax.enabled ? subtotal * (data.tax.rate / 100) : 0;
    const total = subtotal + taxAmount;

    return (
        <div className="space-y-4 md:space-y-6">
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Document Settings</h2>
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Payment Method
                        </label>
                        <PaymentMethodToggle
                            value={data.paymentMethod}
                            onChange={(value) => updateField('paymentMethod', value)}
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
                                Currency
                            </label>
                            <select
                                id="currency"
                                value={data.currency.code}
                                onChange={(e) => handleCurrencyChange(e.target.value)}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                            >
                                {CURRENCIES.map((curr) => (
                                    <option key={curr.code} value={curr.code}>
                                        {curr.symbol} {curr.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="paymentTerms" className="block text-sm font-medium text-gray-700 mb-2">
                                Payment Terms
                            </label>
                            <select
                                id="paymentTerms"
                                value={data.paymentTermsDays}
                                onChange={(e) => updateField('paymentTermsDays', parseInt(e.target.value))}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                            >
                                {PAYMENT_TERMS_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <TemplateSelector
                        value={data.template}
                        onChange={(value) => {
                            // Check if switching to a template with rich demo data
                            const demoData = getDemoDataForTemplate(value);
                            
                            if (Object.keys(demoData).length > 0 && (
                                value === 'executive' || 
                                value === 'split' || 
                                value === 'card' || 
                                value === 'luxury-minimal'
                            )) {
                                // Merge demo data with current data, preserving some fields
                                const mergedData: InvoiceData = {
                                    ...data,
                                    ...demoData,
                                    template: value,
                                    // Preserve these fields from current data
                                    currency: data.currency,
                                    tax: data.tax,
                                    documentType: data.documentType,
                                    paymentMethod: data.paymentMethod,
                                    paymentTermsDays: data.paymentTermsDays,
                                    // Preserve custom colors
                                    primaryColor: data.primaryColor,
                                    accentColor: data.accentColor,
                                };
                                onChange(mergedData);
                            } else {
                                // Just update the template
                                updateField('template', value);
                            }
                        }}
                        canUseProTemplates={hasProTemplates}
                        mounted={mounted}
                    />
                </div>
            </section>

            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    Your Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Your Name / Business Name *
                        </label>
                        <input
                            type="text"
                            value={data.senderName}
                            onChange={(e) => updateField('senderName', e.target.value)}
                            placeholder="Your Business Name"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={data.senderEmail}
                            onChange={(e) => updateField('senderEmail', e.target.value)}
                            placeholder="you@example.com"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone
                        </label>
                        <input
                            type="tel"
                            value={data.senderPhone}
                            onChange={(e) => updateField('senderPhone', e.target.value)}
                            placeholder="+1 234 567 8900"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address
                        </label>
                        <input
                            type="text"
                            value={data.senderAddress}
                            onChange={(e) => updateField('senderAddress', e.target.value)}
                            placeholder="123 Business St, City, Country"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Registration Number
                        </label>
                        <input
                            type="text"
                            value={data.registrationNumber || ''}
                            onChange={(e) => updateField('registrationNumber', e.target.value)}
                            placeholder="Company Registration / Tax ID"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                    </div>
                </div>

                {data.paymentMethod !== 'cash' && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            Bank Details <span className="text-gray-400 font-normal">(Optional)</span>
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Bank Name
                                </label>
                                <input
                                    type="text"
                                    value={data.bankName}
                                    onChange={(e) => updateField('bankName', e.target.value)}
                                    placeholder="e.g., Chase Bank"
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Account Number
                                </label>
                                <input
                                    type="text"
                                    value={data.accountNumber}
                                    onChange={(e) => updateField('accountNumber', e.target.value)}
                                    placeholder="Your account number"
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Branch / Swift Code
                                </label>
                                <input
                                    type="text"
                                    value={data.branchCode}
                                    onChange={(e) => updateField('branchCode', e.target.value)}
                                    placeholder="e.g., CHASUS33"
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                                />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="accountType" className="block text-sm font-medium text-gray-700">
                                    Account Type
                                </label>
                                <select
                                    id="accountType"
                                    value={data.accountType || ''}
                                    onChange={(e) => updateField('accountType', e.target.value as 'cheque' | 'savings' | '')}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                                >
                                    <option value="">Select type...</option>
                                    <option value="cheque">Cheque / Checking</option>
                                    <option value="savings">Savings</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-100">
                    <LogoUpload
                        logoUrl={logoUrl}
                        onLogoChange={onLogoChange}
                        onLogoRemove={onLogoRemove}
                        disabled={!hasProLogo}
                        isProFeature={!hasProLogo}
                    />
                </div>
            </section>

            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    Client Details
                </h2>

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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Client Name / Company *
                        </label>
                        <input
                            type="text"
                            value={data.clientName}
                            onChange={(e) => updateField('clientName', e.target.value)}
                            placeholder="Client Company Name"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
                            placeholder="client@example.com"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Client Address
                        </label>
                        <input
                            type="text"
                            value={data.clientAddress}
                            onChange={(e) => updateField('clientAddress', e.target.value)}
                            placeholder="456 Client Ave, City, Country"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                    </div>
                </div>
            </section>

            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    {documentLabel} Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {documentLabel} Number *
                        </label>
                        <input
                            type="text"
                            value={data.invoiceNumber}
                            onChange={(e) => updateField('invoiceNumber', e.target.value)}
                            placeholder="INV-001"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
                                placeholder="Payment Reference"
                                className="min-w-0 flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    const ref = `${data.invoiceNumber.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}-${data.clientName.slice(0, 4).replace(/[^a-zA-Z0-9]/g, '').toUpperCase() || 'REF'}`;
                                    updateField('paymentReference', ref);
                                }}
                                className="px-3 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex-shrink-0"
                                title="Auto-generate from invoice number and client name"
                            >
                                Auto
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Used for payment reference</p>
                    </div>
                    <div>
                        <label htmlFor="invoiceDate" className="block text-sm font-medium text-gray-700 mb-1">
                            {documentLabel} Date *
                        </label>
                        <input
                            id="invoiceDate"
                            type="date"
                            value={data.invoiceDate}
                            onChange={(e) => updateField('invoiceDate', e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                            {dueDateLabel} *
                        </label>
                        <input
                            id="dueDate"
                            type="date"
                            value={data.dueDate}
                            onChange={(e) => updateField('dueDate', e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                            required
                        />
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.tax.enabled}
                                onChange={(e) => handleTaxToggle(e.target.checked)}
                                className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                            />
                            <span className="text-sm font-medium text-gray-700">
                                Include {data.tax.name || 'Tax'}
                            </span>
                        </label>
                        {data.tax.enabled && (
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    value={data.tax.rate}
                                    onChange={(e) => handleTaxRateChange(parseFloat(e.target.value) || 0)}
                                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm text-center"
                                />
                                <span className="text-sm text-gray-600">%</span>
                            </div>
                        )}
                    </div>
                    {data.tax.enabled && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {data.tax.name} Name
                                </label>
                                <input
                                    type="text"
                                    value={data.tax.name}
                                    onChange={(e) => handleTaxNameChange(e.target.value)}
                                    placeholder="VAT, GST, Sales Tax..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">{data.currency.symbol}{(subtotal).toFixed(2)}</span>
                    </div>
                    {data.tax.enabled && (
                        <div className="flex justify-between text-sm mt-1">
                            <span className="text-gray-600">{data.tax.name} ({data.tax.rate}%):</span>
                            <span className="font-medium">{data.currency.symbol}{(taxAmount).toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-base font-bold mt-2 pt-2 border-t border-gray-200">
                        <span>Total:</span>
                        <span>{data.currency.symbol}{(total).toFixed(2)}</span>
                    </div>
                </div>
            </section>

            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                    Services / Products
                </h2>
                <LineItems
                    lineItems={data.lineItems}
                    onChange={(items) => updateField('lineItems', items)}
                    currencySymbol={data.currency.symbol}
                />
            </section>

            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-sm font-bold">5</span>
                    Notes & Terms
                </h2>
                <textarea
                    value={data.notes}
                    onChange={(e) => updateField('notes', e.target.value)}
                    placeholder="Payment terms, notes, or additional information..."
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
                />
            </section>
        </div>
    );
}
