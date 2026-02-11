import React from 'react';
import { InvoiceData, CurrencyConfig, PaymentMethod } from '@/types/invoice';

// Payment method label mapping
export function getPaymentMethodLabel(method: PaymentMethod): string {
    const labels: Record<PaymentMethod, string> = {
        eft: 'EFT / Bank Transfer',
        cash: 'Cash',
        bank_transfer: 'Bank Transfer',
        credit_card: 'Credit Card',
        paypal: 'PayPal',
        venmo: 'Venmo',
        crypto: 'Cryptocurrency',
        other: 'Other',
    };
    return labels[method] || method;
}

// Shared color type
export interface TemplateColors {
    primary: string;
    accent: string;
    background: string;
    text: string;
    textMuted: string;
    border: string;
}

// Base calculation utilities
export interface CalculatedValues {
    subtotal: number;
    taxAmount: number;
    total: number;
}

export function calculateInvoiceTotals(lineItems: InvoiceData['lineItems'], taxEnabled: boolean, taxRate: number): CalculatedValues {
    const subtotal = lineItems.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0
    );
    const taxAmount = taxEnabled ? subtotal * (taxRate / 100) : 0;
    const total = subtotal + taxAmount;

    return { subtotal, taxAmount, total };
}

// Format currency with fallbacks - exported for template use
export function formatCurrency(amount: number, currency: CurrencyConfig): string {
    try {
        return new Intl.NumberFormat(currency.locale, {
            style: 'currency',
            currency: currency.code,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    } catch {
        return `${currency.symbol}${amount.toFixed(2)}`;
    }
}

// Format date with fallbacks
export function formatDate(dateString: string, locale: string = 'en-US'): string {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch {
        return dateString;
    }
}


// Common header component with logo
interface HeaderProps {
    documentTitle: string;
    invoiceNumber: string;
    senderName: string;
    senderEmail?: string;
    senderPhone?: string;
    logoUrl?: string | null;
    colors: TemplateColors;
}

export function InvoiceHeader({
    documentTitle,
    invoiceNumber,
    senderName,
    senderEmail,
    senderPhone,
    logoUrl,
    colors,
}: HeaderProps): React.ReactElement {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '24px',
                flexWrap: 'wrap',
                gap: '16px',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                {logoUrl && (
                    // eslint-disable-next-line @next/next/no-img-element -- User-uploaded logo data URL
                    <img
                        src={logoUrl}
                        alt="Company logo"
                        style={{
                            maxHeight: '64px',
                            maxWidth: '150px',
                            objectFit: 'contain',
                        }}
                    />
                )}
                <div>
                    <h1
                        style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: colors.text,
                            margin: 0,
                        }}
                    >
                        {documentTitle}
                    </h1>
                    <p style={{ color: colors.textMuted, margin: '4px 0 0 0', fontSize: '14px' }}>
                        #{invoiceNumber || 'INV-001'}
                    </p>
                </div>
            </div>
            <div style={{ textAlign: 'right' }}>
                <div
                    style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: colors.accent,
                    }}
                >
                    {senderName || 'Your Business Name'}
                </div>
                {senderEmail && (
                    <div style={{ fontSize: '14px', color: colors.textMuted }}>
                        {senderEmail}
                    </div>
                )}
                {senderPhone && (
                    <div style={{ fontSize: '14px', color: colors.textMuted }}>
                        {senderPhone}
                    </div>
                )}
            </div>
        </div>
    );
}

// Common line items table
interface LineItemsTableProps {
    items: InvoiceData['lineItems'];
    currency: CurrencyConfig;
    colors: TemplateColors;
}

export function LineItemsTable({ items, currency, colors }: LineItemsTableProps): React.ReactElement {
    return (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
            <thead>
                <tr style={{ borderBottom: `2px solid ${colors.border}` }}>
                    <th
                        style={{
                            textAlign: 'left',
                            padding: '12px 8px',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: colors.textMuted,
                            textTransform: 'uppercase',
                        }}
                    >
                        Description
                    </th>
                    <th
                        style={{
                            textAlign: 'center',
                            padding: '12px 8px',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: colors.textMuted,
                            textTransform: 'uppercase',
                        }}
                    >
                        Qty
                    </th>
                    <th
                        style={{
                            textAlign: 'right',
                            padding: '12px 8px',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: colors.textMuted,
                            textTransform: 'uppercase',
                        }}
                    >
                        Unit Price
                    </th>
                    <th
                        style={{
                            textAlign: 'right',
                            padding: '12px 8px',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: colors.textMuted,
                            textTransform: 'uppercase',
                        }}
                    >
                        Amount
                    </th>
                </tr>
            </thead>
            <tbody>
                {items.map((item, index) => (
                    <tr
                        key={item.id}
                        style={{
                            borderBottom: `1px solid ${colors.border}`,
                            backgroundColor: index % 2 === 0 ? 'transparent' : colors.background,
                        }}
                    >
                        <td style={{ padding: '12px 8px', color: colors.text }}>{item.description}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'center', color: colors.textMuted }}>
                            {item.quantity}
                        </td>
                        <td style={{ padding: '12px 8px', textAlign: 'right', color: colors.textMuted }}>
                            {formatCurrency(item.unitPrice, currency)}
                        </td>
                        <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: 500, color: colors.text }}>
                            {formatCurrency(item.quantity * item.unitPrice, currency)}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

// Common totals section
interface TotalsSectionProps {
    subtotal: number;
    taxEnabled: boolean;
    taxRate: number;
    taxName: string;
    total: number;
    currency: CurrencyConfig;
    colors: TemplateColors;
}

export function TotalsSection({
    subtotal,
    taxEnabled,
    taxRate,
    taxName,
    total,
    currency,
    colors,
}: TotalsSectionProps): React.ReactElement {
    return (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
            <div style={{ minWidth: '250px' }}>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '8px 0',
                        borderBottom: `1px solid ${colors.border}`,
                    }}
                >
                    <span style={{ color: colors.textMuted }}>Subtotal</span>
                    <span style={{ fontWeight: 500, color: colors.text }}>{formatCurrency(subtotal, currency)}</span>
                </div>
                {taxEnabled && (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '8px 0',
                            borderBottom: `1px solid ${colors.border}`,
                        }}
                    >
                        <span style={{ color: colors.textMuted }}>
                            {taxName} ({taxRate}%)
                        </span>
                        <span style={{ fontWeight: 500, color: colors.text }}>
                            {formatCurrency(subtotal * (taxRate / 100), currency)}
                        </span>
                    </div>
                )}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '12px 0',
                        borderTop: `2px solid ${colors.primary}`,
                        fontSize: '18px',
                        fontWeight: 'bold',
                    }}
                >
                    <span style={{ color: colors.text }}>Total</span>
                    <span style={{ color: colors.primary }}>{formatCurrency(total, currency)}</span>
                </div>
            </div>
        </div>
    );
}

// Common footer component
interface FooterProps {
    footerText: string;
    colors: TemplateColors;
    bankName?: string;
    accountNumber?: string;
    branchCode?: string;
    accountType?: string;
    notes?: string;
}

export function InvoiceFooter({
    footerText,
    colors,
    bankName,
    accountNumber,
    branchCode,
    accountType,
    notes,
}: FooterProps): React.ReactElement {
    return (
        <div
            style={{
                marginTop: '32px',
                paddingTop: '24px',
                borderTop: `1px solid ${colors.border}`,
            }}
        >
            {(bankName || accountNumber) && (
                <div style={{ marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '12px', fontWeight: '600', color: colors.textMuted, marginBottom: '8px' }}>
                        Payment Details
                    </h4>
                    {bankName && <div style={{ color: colors.text }}>{bankName}</div>}
                    {accountNumber && (
                        <div style={{ color: colors.text }}>
                            Account: {accountNumber}
                            {accountType && ` (${accountType})`}
                        </div>
                    )}
                    {branchCode && <div style={{ color: colors.text }}>Branch: {branchCode}</div>}
                </div>
            )}
            {notes && (
                <div style={{ marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '12px', fontWeight: '600', color: colors.textMuted, marginBottom: '8px' }}>
                        Notes
                    </h4>
                    <p style={{ color: colors.text, whiteSpace: 'pre-wrap' }}>{notes}</p>
                </div>
            )}
            <div style={{ textAlign: 'center', color: colors.textMuted, fontSize: '14px' }}>{footerText}</div>
        </div>
    );
}
