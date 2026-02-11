'use client';

import React from 'react';
import { InvoiceData } from '@/types/invoice';
import { formatCurrency, formatDate, getPaymentMethodLabel } from './TemplateBase';
import QRCodeDisplay from '../QRCodeDisplay';

interface CompactLayoutProps {
    data: InvoiceData;
    colors: {
        primary: string;
        accent: string;
        background: string;
        text: string;
        textMuted: string;
        border: string;
        headerBg?: string;
    };
    logoUrl?: string | null;
    documentTitle: string;
    dateLabel: string;
    dueDateLabel: string;
    subtotal: number;
    taxAmount: number;
    total: number;
}

export default function CompactLayout({
    data,
    colors,
    logoUrl,
    documentTitle,
    dateLabel,
    dueDateLabel,
    subtotal,
    taxAmount,
    total,
}: CompactLayoutProps): React.ReactElement {
    const showLogo = logoUrl && !data.headerImageUrl;
    const headerBg = colors.headerBg || '#f8fafc';

    return (
        <>
            {/* Dense Header Bar */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: headerBg,
                margin: '-24px -24px 16px -24px',
                padding: '14px 24px',
                borderBottom: `2px solid ${colors.border}`,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {showLogo && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={logoUrl}
                            alt="Company logo"
                            style={{ maxHeight: '36px', maxWidth: '100px', objectFit: 'contain' }}
                        />
                    )}
                    <div>
                        <span style={{ fontSize: '16px', fontWeight: 'bold', color: colors.text }}>{documentTitle}</span>
                        <span style={{ fontSize: '13px', color: colors.textMuted, marginLeft: '8px' }}>#{data.invoiceNumber || 'INV-001'}</span>
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: colors.text }}>{data.senderName || 'Your Business Name'}</div>
                    {data.registrationNumber && <div style={{ fontSize: '10px', color: colors.textMuted }}>Reg: {data.registrationNumber}</div>}
                </div>
            </div>

            {/* Three-column info: Sender | Client | Dates */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '12px',
                marginBottom: '14px',
                fontSize: '11px',
            }}>
                {/* Sender details */}
                <div>
                    <p style={{ fontSize: '9px', fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px 0' }}>From</p>
                    {data.senderEmail && <p style={{ color: colors.textMuted, margin: '1px 0' }}>{data.senderEmail}</p>}
                    {data.senderPhone && <p style={{ color: colors.textMuted, margin: '1px 0' }}>{data.senderPhone}</p>}
                    {data.senderAddress && <p style={{ color: colors.textMuted, margin: '1px 0' }}>{data.senderAddress}</p>}
                </div>

                {/* Client details */}
                <div>
                    <p style={{ fontSize: '9px', fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px 0' }}>Bill To</p>
                    <p style={{ color: colors.text, fontWeight: '600', fontSize: '12px', margin: '0 0 2px 0' }}>{data.clientName || 'Client Name'}</p>
                    {data.clientEmail && <p style={{ color: colors.textMuted, margin: '1px 0' }}>{data.clientEmail}</p>}
                    {data.clientAddress && <p style={{ color: colors.textMuted, margin: '1px 0' }}>{data.clientAddress}</p>}
                </div>

                {/* Dates */}
                <div>
                    <p style={{ fontSize: '9px', fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px 0' }}>Details</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '2px 0' }}>
                        <span style={{ color: colors.textMuted }}>{dateLabel}</span>
                        <span style={{ color: colors.text, fontWeight: '500' }}>{formatDate(data.invoiceDate, data.currency.locale) || 'Not set'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '2px 0' }}>
                        <span style={{ color: colors.textMuted }}>{dueDateLabel}</span>
                        <span style={{ color: colors.text, fontWeight: '500' }}>{formatDate(data.dueDate, data.currency.locale) || 'Not set'}</span>
                    </div>
                </div>
            </div>

            {/* Dense Items Table with grey header */}
            <div style={{ marginBottom: '14px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '400px' }}>
                    <thead>
                        <tr style={{ background: headerBg }}>
                            <th style={{ textAlign: 'left', padding: '6px 8px', fontSize: '10px', fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', width: '48%', borderBottom: `1px solid ${colors.border}` }}>Description</th>
                            <th style={{ textAlign: 'center', padding: '6px 8px', fontSize: '10px', fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', width: '12%', borderBottom: `1px solid ${colors.border}` }}>Qty</th>
                            <th style={{ textAlign: 'right', padding: '6px 8px', fontSize: '10px', fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', width: '20%', borderBottom: `1px solid ${colors.border}` }}>Price</th>
                            <th style={{ textAlign: 'right', padding: '6px 8px', fontSize: '10px', fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', width: '20%', borderBottom: `1px solid ${colors.border}` }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.lineItems.map((item, index) => (
                            <tr key={item.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                                <td style={{ padding: '5px 8px', color: colors.text, fontSize: '12px' }}>{item.description || `Item ${index + 1}`}</td>
                                <td style={{ padding: '5px 8px', textAlign: 'center', color: colors.textMuted, fontSize: '12px' }}>{item.quantity}</td>
                                <td style={{ padding: '5px 8px', textAlign: 'right', color: colors.textMuted, fontSize: '12px' }}>{formatCurrency(item.unitPrice, data.currency)}</td>
                                <td style={{ padding: '5px 8px', textAlign: 'right', color: colors.text, fontWeight: '500', fontSize: '12px' }}>{formatCurrency(item.quantity * item.unitPrice, data.currency)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Totals — inline right-aligned, compact */}
            <div style={{
                display: 'flex',
                justifyContent: data.paymentQR?.enabled ? 'space-between' : 'flex-end',
                alignItems: 'flex-start',
                marginBottom: '14px',
                flexWrap: 'wrap',
                gap: '12px',
            }}>
                {data.paymentQR?.enabled && data.paymentQR.value && (
                    <div style={{ textAlign: 'center' }}>
                        <QRCodeDisplay value={data.paymentQR.value} size={72} />
                        <p style={{ color: colors.textMuted, fontSize: '9px', marginTop: '3px', marginBottom: 0 }}>
                            {data.paymentQR.label || 'Scan to Pay'}
                        </p>
                    </div>
                )}

                <div style={{ width: '200px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '12px' }}>
                        <span style={{ color: colors.textMuted }}>Subtotal</span>
                        <span style={{ color: colors.text }}>{formatCurrency(subtotal, data.currency)}</span>
                    </div>
                    {data.tax.enabled && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '12px' }}>
                            <span style={{ color: colors.textMuted }}>{data.tax.name} ({data.tax.rate}%)</span>
                            <span style={{ color: colors.text }}>{formatCurrency(taxAmount, data.currency)}</span>
                        </div>
                    )}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '6px 8px',
                        marginTop: '4px',
                        background: headerBg,
                        borderRadius: '4px',
                    }}>
                        <span style={{ fontSize: '13px', fontWeight: 'bold', color: colors.text }}>Total</span>
                        <span style={{ fontSize: '13px', fontWeight: 'bold', color: colors.text }}>{formatCurrency(total, data.currency)}</span>
                    </div>
                </div>
            </div>

            {/* Payment Details & Notes — side by side when both exist */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: data.notes ? '1fr 1fr' : '1fr',
                gap: '12px',
                borderTop: `1px solid ${colors.border}`,
                paddingTop: '10px',
            }}>
                <div>
                    <p style={{ fontSize: '9px', fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px 0' }}>Payment Details</p>
                    <div style={{ fontSize: '11px' }}>
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

                {data.notes && (
                    <div>
                        <p style={{ fontSize: '9px', fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px 0' }}>Notes</p>
                        <p style={{ color: colors.text, fontSize: '11px', whiteSpace: 'pre-wrap', margin: 0 }}>{data.notes}</p>
                    </div>
                )}
            </div>
        </>
    );
}
