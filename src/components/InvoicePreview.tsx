'use client';

import { InvoiceData, TemplateType } from '@/types/invoice';
import { formatCurrency, formatDate } from '@/lib/utils';
import { forwardRef } from 'react';
import { MONETIZATION } from '@/lib/config';

interface InvoicePreviewProps {
    data: InvoiceData;
    logoUrl?: string | null;
}

// Template color schemes for html2canvas compatibility
const templateColors = {
    modern: {
        white: '#ffffff',
        primary: '#059669', // emerald-600
        primaryLight: '#d1fae5', // emerald-100
        accent: '#059669',
        gray900: '#111827',
        gray700: '#374151',
        gray600: '#4b5563',
        gray500: '#6b7280',
        gray400: '#9ca3af',
        gray200: '#e5e7eb',
        gray100: '#f3f4f6',
        headerBg: '#ffffff',
        tableBorder: '#e5e7eb',
    },
    classic: {
        white: '#ffffff',
        primary: '#1e3a5f', // navy blue
        primaryLight: '#dbeafe', // blue-100
        accent: '#b8860b', // dark gold
        gray900: '#1e293b',
        gray700: '#334155',
        gray600: '#475569',
        gray500: '#64748b',
        gray400: '#94a3b8',
        gray200: '#e2e8f0',
        gray100: '#f1f5f9',
        headerBg: '#1e3a5f',
        tableBorder: '#cbd5e1',
    },
    minimal: {
        white: '#ffffff',
        primary: '#18181b', // zinc-900
        primaryLight: '#f4f4f5', // zinc-100
        accent: '#18181b',
        gray900: '#18181b',
        gray700: '#3f3f46',
        gray600: '#52525b',
        gray500: '#71717a',
        gray400: '#a1a1aa',
        gray200: '#e4e4e7',
        gray100: '#f4f4f5',
        headerBg: '#ffffff',
        tableBorder: '#e4e4e7',
    },
};

const InvoicePreview = forwardRef<HTMLDivElement, InvoicePreviewProps>(
    ({ data, logoUrl }, ref) => {
        // Get colors based on selected template
        const colors = templateColors[data.template || 'modern'];

        // Determine if this is a quotation
        const isQuote = data.documentType === 'quotation';
        const documentTitle = isQuote ? 'QUOTATION' : 'INVOICE';
        const dateLabel = isQuote ? 'Quote Date:' : 'Invoice Date:';
        const dueDateLabel = isQuote ? 'Valid Until:' : 'Due Date:';

        // Calculate totals
        const subtotal = data.lineItems.reduce(
            (sum, item) => sum + item.quantity * item.unitPrice,
            0
        );
        const vatAmount = data.includeVAT ? subtotal * 0.15 : 0;
        const total = subtotal + vatAmount;

        // Template-specific styles
        const isClassic = data.template === 'classic';
        const isMinimal = data.template === 'minimal';

        return (
            <div
                ref={ref}
                style={{
                    backgroundColor: colors.white,
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    width: '100%',
                }}
            >
                {/* Invoice Content */}
                <div style={{ padding: '32px', backgroundColor: colors.white }}>
                    {/* Header with optional logo */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                            {/* Company Logo (if provided) */}
                            {logoUrl && (
                                <img
                                    src={logoUrl}
                                    alt="Company logo"
                                    style={{
                                        maxHeight: `${MONETIZATION.MAX_LOGO_HEIGHT}px`,
                                        maxWidth: `${MONETIZATION.MAX_LOGO_WIDTH}px`,
                                        objectFit: 'contain',
                                    }}
                                />
                            )}
                            <div>
                                <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: colors.gray900, margin: 0 }}>{documentTitle}</h1>
                                <p style={{ color: colors.gray500, marginTop: '4px', margin: '4px 0 0 0' }}>#{data.invoiceNumber || 'INV-001'}</p>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: colors.accent }}>
                                {data.freelancerName || 'Your Business Name'}
                            </div>
                            {data.freelancerEmail && (
                                <p style={{ color: colors.gray600, fontSize: '14px', margin: '2px 0' }}>{data.freelancerEmail}</p>
                            )}
                            {data.freelancerPhone && (
                                <p style={{ color: colors.gray600, fontSize: '14px', margin: '2px 0' }}>{data.freelancerPhone}</p>
                            )}
                            {data.freelancerAddress && (
                                <p style={{ color: colors.gray600, fontSize: '14px', margin: '2px 0' }}>{data.freelancerAddress}</p>
                            )}
                            {data.companyRegistration && (
                                <p style={{ color: colors.gray500, fontSize: '14px', marginTop: '4px' }}>Reg: {data.companyRegistration}</p>
                            )}
                            {data.includeVAT && data.vatNumber && (
                                <p style={{ color: colors.gray500, fontSize: '14px', marginTop: '4px' }}>VAT No: {data.vatNumber}</p>
                            )}
                        </div>
                    </div>

                    {/* Invoice Meta & Client */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
                        <div>
                            <h3 style={{ fontSize: '12px', fontWeight: '600', color: colors.gray400, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                                Bill To
                            </h3>
                            <p style={{ color: colors.gray900, fontWeight: '600', margin: '0 0 4px 0' }}>
                                {data.clientName || 'Client Name'}
                            </p>
                            {data.clientEmail && (
                                <p style={{ color: colors.gray600, fontSize: '14px', margin: '2px 0' }}>{data.clientEmail}</p>
                            )}
                            {data.clientAddress && (
                                <p style={{ color: colors.gray600, fontSize: '14px', margin: '2px 0' }}>{data.clientAddress}</p>
                            )}
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginBottom: '4px' }}>
                                <span style={{ fontSize: '14px', color: colors.gray500 }}>{dateLabel}</span>
                                <span style={{ fontSize: '14px', fontWeight: '500', color: colors.gray900 }}>
                                    {formatDate(data.invoiceDate) || 'Not set'}
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                                <span style={{ fontSize: '14px', color: colors.gray500 }}>{dueDateLabel}</span>
                                <span style={{ fontSize: '14px', fontWeight: '500', color: colors.gray900 }}>
                                    {formatDate(data.dueDate) || 'Not set'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Line Items Table */}
                    <div style={{ marginBottom: '32px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: `2px solid ${colors.gray200}` }}>
                                    <th style={{ textAlign: 'left', padding: '12px 0', fontSize: '14px', fontWeight: '600', color: colors.gray600 }}>
                                        Description
                                    </th>
                                    <th style={{ textAlign: 'center', padding: '12px 0', fontSize: '14px', fontWeight: '600', color: colors.gray600, width: '80px' }}>
                                        Qty
                                    </th>
                                    <th style={{ textAlign: 'right', padding: '12px 0', fontSize: '14px', fontWeight: '600', color: colors.gray600, width: '128px' }}>
                                        Unit Price
                                    </th>
                                    <th style={{ textAlign: 'right', padding: '12px 0', fontSize: '14px', fontWeight: '600', color: colors.gray600, width: '128px' }}>
                                        Amount
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.lineItems.map((item, index) => (
                                    <tr key={item.id} style={{ borderBottom: `1px solid ${colors.gray100}` }}>
                                        <td style={{ padding: '12px 0', color: colors.gray900 }}>
                                            {item.description || `Item ${index + 1}`}
                                        </td>
                                        <td style={{ padding: '12px 0', textAlign: 'center', color: colors.gray700 }}>{item.quantity}</td>
                                        <td style={{ padding: '12px 0', textAlign: 'right', color: colors.gray700 }}>
                                            {formatCurrency(item.unitPrice)}
                                        </td>
                                        <td style={{ padding: '12px 0', textAlign: 'right', color: colors.gray900, fontWeight: '500' }}>
                                            {formatCurrency(item.quantity * item.unitPrice)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <div style={{ width: '256px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                                <span style={{ color: colors.gray600 }}>Subtotal</span>
                                <span style={{ color: colors.gray900, fontWeight: '500' }}>
                                    {formatCurrency(subtotal)}
                                </span>
                            </div>
                            {data.includeVAT && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                                    <span style={{ color: colors.gray600 }}>VAT (15%)</span>
                                    <span style={{ color: colors.gray900, fontWeight: '500' }}>
                                        {formatCurrency(vatAmount)}
                                    </span>
                                </div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: `2px solid ${colors.gray900}`, marginTop: '8px' }}>
                                <span style={{ fontSize: '20px', fontWeight: 'bold', color: colors.gray900 }}>Total</span>
                                <span style={{ fontSize: '20px', fontWeight: 'bold', color: colors.accent }}>
                                    {formatCurrency(total)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Bank Details - Hide for cash payments */}
                    {data.paymentMethod !== 'cash' && (data.bankName || data.accountNumber) && (
                        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: `1px solid ${colors.gray200}` }}>
                            <h3 style={{ fontSize: '12px', fontWeight: '600', color: colors.gray400, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                                Banking Details
                            </h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '14px' }}>
                                {data.bankName && (
                                    <div>
                                        <span style={{ color: colors.gray500 }}>Bank: </span>
                                        <span style={{ color: colors.gray900 }}>{data.bankName}</span>
                                    </div>
                                )}
                                {data.accountNumber && (
                                    <div>
                                        <span style={{ color: colors.gray500 }}>Account: </span>
                                        <span style={{ color: colors.gray900 }}>{data.accountNumber}</span>
                                    </div>
                                )}
                                {data.accountType && (
                                    <div>
                                        <span style={{ color: colors.gray500 }}>Type: </span>
                                        <span style={{ color: colors.gray900 }}>{data.accountType.charAt(0).toUpperCase() + data.accountType.slice(1)}</span>
                                    </div>
                                )}
                                {data.branchCode && (
                                    <div>
                                        <span style={{ color: colors.gray500 }}>Branch: </span>
                                        <span style={{ color: colors.gray900 }}>{data.branchCode}</span>
                                    </div>
                                )}
                            </div>
                            {data.paymentReference && (
                                <div style={{ marginTop: '12px', padding: '8px 12px', backgroundColor: colors.primaryLight, borderRadius: '6px', display: 'inline-block' }}>
                                    <span style={{ color: colors.gray500, fontSize: '12px' }}>Payment Reference: </span>
                                    <span style={{ color: colors.primary, fontWeight: 'bold', fontSize: '14px' }}>{data.paymentReference}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Notes */}
                    {data.notes && (
                        <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: `1px solid ${colors.gray200}` }}>
                            <h3 style={{ fontSize: '12px', fontWeight: '600', color: colors.gray400, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                                Notes
                            </h3>
                            <p style={{ color: colors.gray600, fontSize: '14px', whiteSpace: 'pre-wrap', margin: 0 }}>{data.notes}</p>
                        </div>
                    )}

                    {/* Footer */}
                    <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: `1px solid ${colors.gray200}`, textAlign: 'center' }}>
                        <p style={{ color: colors.gray400, fontSize: '14px', margin: 0 }}>Thank you for your business!</p>
                    </div>
                </div>
            </div>
        );
    }
);

InvoicePreview.displayName = 'InvoicePreview';

export default InvoicePreview;
