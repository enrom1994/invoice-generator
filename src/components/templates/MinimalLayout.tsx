'use client';

import React from 'react';
import { InvoiceData } from '@/types/invoice';
import { formatCurrency, formatDate, getPaymentMethodLabel } from './TemplateBase';
import QRCodeDisplay from '../QRCodeDisplay';

interface MinimalLayoutProps {
    data: InvoiceData;
    colors: {
        primary: string;
        accent: string;
        background: string;
        text: string;
        textMuted: string;
        border: string;
    };
    logoUrl?: string | null;
    documentTitle: string;
    dateLabel: string;
    dueDateLabel: string;
    subtotal: number;
    taxAmount: number;
    total: number;
}

export default function MinimalLayout({
    data,
    colors,
    logoUrl,
    documentTitle,
    dateLabel,
    dueDateLabel,
    subtotal,
    taxAmount,
    total,
}: MinimalLayoutProps): React.ReactElement {
    const showLogo = logoUrl && !data.headerImageUrl;

    return (
        <>
            {/* Centered Header */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                {showLogo && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={logoUrl}
                        alt="Company logo"
                        style={{
                            maxHeight: '56px',
                            maxWidth: '150px',
                            objectFit: 'contain',
                            margin: '0 auto 12px auto',
                            display: 'block',
                        }}
                    />
                )}
                <h1 style={{
                    fontSize: '28px',
                    fontWeight: '300',
                    letterSpacing: '0.15em',
                    color: colors.text,
                    margin: '0 0 4px 0',
                    textTransform: 'uppercase',
                }}>{documentTitle}</h1>
                <p style={{ color: colors.textMuted, margin: 0, fontSize: '13px' }}>
                    #{data.invoiceNumber || 'INV-001'}
                </p>
            </div>

            {/* Thin separator */}
            <div style={{ borderTop: `1px solid ${colors.border}`, margin: '0 0 28px 0' }} />

            {/* Two-column: Sender left, Client right */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '28px',
                gap: '32px',
                flexWrap: 'wrap',
            }}>
                {/* From */}
                <div>
                    <p style={{ fontSize: '10px', fontWeight: '600', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 6px 0' }}>
                        From
                    </p>
                    <p style={{ color: colors.text, fontWeight: '500', margin: '0 0 3px 0', fontSize: '14px' }}>
                        {data.senderName || 'Your Business Name'}
                    </p>
                    {data.senderEmail && <p style={{ color: colors.textMuted, fontSize: '12px', margin: '2px 0' }}>{data.senderEmail}</p>}
                    {data.senderPhone && <p style={{ color: colors.textMuted, fontSize: '12px', margin: '2px 0' }}>{data.senderPhone}</p>}
                    {data.senderAddress && <p style={{ color: colors.textMuted, fontSize: '12px', margin: '2px 0' }}>{data.senderAddress}</p>}
                    {data.registrationNumber && <p style={{ color: colors.textMuted, fontSize: '11px', margin: '4px 0 0 0' }}>Reg: {data.registrationNumber}</p>}
                </div>

                {/* To */}
                <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '10px', fontWeight: '600', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 6px 0' }}>
                        Bill To
                    </p>
                    <p style={{ color: colors.text, fontWeight: '500', margin: '0 0 3px 0', fontSize: '14px' }}>
                        {data.clientName || 'Client Name'}
                    </p>
                    {data.clientEmail && <p style={{ color: colors.textMuted, fontSize: '12px', margin: '2px 0' }}>{data.clientEmail}</p>}
                    {data.clientAddress && <p style={{ color: colors.textMuted, fontSize: '12px', margin: '2px 0' }}>{data.clientAddress}</p>}
                </div>
            </div>

            {/* Dates - centered */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '40px',
                marginBottom: '28px',
                fontSize: '13px',
            }}>
                <div>
                    <span style={{ color: colors.textMuted }}>{dateLabel} </span>
                    <span style={{ color: colors.text, fontWeight: '500' }}>
                        {formatDate(data.invoiceDate, data.currency.locale) || 'Not set'}
                    </span>
                </div>
                <div>
                    <span style={{ color: colors.textMuted }}>{dueDateLabel} </span>
                    <span style={{ color: colors.text, fontWeight: '500' }}>
                        {formatDate(data.dueDate, data.currency.locale) || 'Not set'}
                    </span>
                </div>
            </div>

            {/* Thin separator */}
            <div style={{ borderTop: `1px solid ${colors.border}`, margin: '0 0 0 0' }} />

            {/* Items Table — clean, borderless rows */}
            <div style={{ marginBottom: '28px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '400px' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left', padding: '12px 0', fontSize: '10px', fontWeight: '600', color: colors.textMuted, letterSpacing: '0.05em', textTransform: 'uppercase', width: '50%' }}>Description</th>
                            <th style={{ textAlign: 'center', padding: '12px 0', fontSize: '10px', fontWeight: '600', color: colors.textMuted, letterSpacing: '0.05em', textTransform: 'uppercase', width: '15%' }}>Qty</th>
                            <th style={{ textAlign: 'right', padding: '12px 0', fontSize: '10px', fontWeight: '600', color: colors.textMuted, letterSpacing: '0.05em', textTransform: 'uppercase', width: '17%' }}>Price</th>
                            <th style={{ textAlign: 'right', padding: '12px 0', fontSize: '10px', fontWeight: '600', color: colors.textMuted, letterSpacing: '0.05em', textTransform: 'uppercase', width: '18%' }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.lineItems.map((item, index) => (
                            <tr key={item.id} style={{ borderTop: `1px solid ${colors.border}` }}>
                                <td style={{ padding: '10px 0', color: colors.text, fontSize: '13px' }}>{item.description || `Item ${index + 1}`}</td>
                                <td style={{ padding: '10px 0', textAlign: 'center', color: colors.textMuted, fontSize: '13px' }}>{item.quantity}</td>
                                <td style={{ padding: '10px 0', textAlign: 'right', color: colors.textMuted, fontSize: '13px' }}>{formatCurrency(item.unitPrice, data.currency)}</td>
                                <td style={{ padding: '10px 0', textAlign: 'right', color: colors.text, fontSize: '13px' }}>{formatCurrency(item.quantity * item.unitPrice, data.currency)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Totals & QR */}
            <div style={{
                display: 'flex',
                justifyContent: data.paymentQR?.enabled ? 'space-between' : 'flex-end',
                alignItems: 'flex-start',
                marginBottom: '28px',
                flexWrap: 'wrap',
                gap: '16px',
            }}>
                {data.paymentQR?.enabled && data.paymentQR.value && (
                    <div style={{ textAlign: 'center' }}>
                        <QRCodeDisplay value={data.paymentQR.value} size={100} />
                        <p style={{ color: colors.textMuted, fontSize: '11px', marginTop: '4px', marginBottom: 0 }}>
                            {data.paymentQR.label || 'Scan to Pay'}
                        </p>
                    </div>
                )}

                <div style={{ width: '200px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                        <span style={{ color: colors.textMuted, fontSize: '13px' }}>Subtotal</span>
                        <span style={{ color: colors.text, fontSize: '13px' }}>{formatCurrency(subtotal, data.currency)}</span>
                    </div>
                    {data.tax.enabled && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                            <span style={{ color: colors.textMuted, fontSize: '13px' }}>{data.tax.name} ({data.tax.rate}%)</span>
                            <span style={{ color: colors.text, fontSize: '13px' }}>{formatCurrency(taxAmount, data.currency)}</span>
                        </div>
                    )}
                    <div style={{ borderTop: `1px solid ${colors.text}`, marginTop: '6px' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                        <span style={{ fontSize: '16px', fontWeight: '600', color: colors.text }}>Total</span>
                        <span style={{ fontSize: '16px', fontWeight: '600', color: colors.text }}>{formatCurrency(total, data.currency)}</span>
                    </div>
                </div>
            </div>

            {/* Payment Details */}
            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: `1px solid ${colors.border}` }}>
                <p style={{ fontSize: '10px', fontWeight: '600', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 6px 0' }}>
                    Payment Details
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '12px' }}>
                    <div><span style={{ color: colors.textMuted }}>Method: </span><span style={{ color: colors.text, fontWeight: '500' }}>{getPaymentMethodLabel(data.paymentMethod)}</span></div>
                    {data.paymentMethod !== 'cash' && (
                        <>
                            {data.bankName && <div><span style={{ color: colors.textMuted }}>Bank: </span><span style={{ color: colors.text }}>{data.bankName}</span></div>}
                            {data.accountNumber && <div><span style={{ color: colors.textMuted }}>Account: </span><span style={{ color: colors.text }}>{data.accountNumber}</span>{data.accountType && ` (${data.accountType})`}</div>}
                            {data.branchCode && <div><span style={{ color: colors.textMuted }}>Branch: </span><span style={{ color: colors.text }}>{data.branchCode}</span></div>}
                        </>
                    )}
                </div>
            </div>

            {/* Notes */}
            {data.notes && (
                <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: `1px solid ${colors.border}` }}>
                    <p style={{ fontSize: '10px', fontWeight: '600', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 6px 0' }}>
                        Notes
                    </p>
                    <p style={{ color: colors.text, fontSize: '12px', whiteSpace: 'pre-wrap' }}>{data.notes}</p>
                </div>
            )}
        </>
    );
}
