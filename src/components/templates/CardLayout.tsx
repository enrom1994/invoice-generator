'use client';

import React from 'react';
import { InvoiceData } from '@/types/invoice';
import { formatCurrency, formatDate, getPaymentMethodLabel } from './TemplateBase';
import QRCodeDisplay from '../QRCodeDisplay';

interface CardLayoutProps {
  data: InvoiceData;
  colors: {
    primary: string;
    accent: string;
    background: string;
    text: string;
    textMuted: string;
    border: string;
    cardBg?: string;
    cardBorder?: string;
    shadowColor?: string;
  };
  logoUrl?: string | null;
  documentTitle: string;
  dateLabel: string;
  dueDateLabel: string;
  subtotal: number;
  taxAmount: number;
  total: number;
}

export default function CardLayout({
  data,
  colors,
  logoUrl,
  documentTitle,
  dateLabel,
  dueDateLabel,
  subtotal,
  taxAmount,
  total,
}: CardLayoutProps): React.ReactElement {
  const showLogo = logoUrl && !data.headerImageUrl;

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '24px',
    border: `1px solid ${colors.border}`,
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '32px', minHeight: '100%' }}>
      {/* Header Card */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            {showLogo && (
              // eslint-disable-next-line @next/next/no-img-element -- User-uploaded logo data URL
              <img
                src={logoUrl}
                alt="Company logo"
                style={{ maxHeight: '80px', maxWidth: '180px', objectFit: 'contain' }}
              />
            )}
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: colors.text, margin: '0 0 4px 0' }}>{documentTitle}</h1>
              <p style={{ color: colors.textMuted, fontSize: '14px', margin: 0 }}>#{data.invoiceNumber || 'INV-001'}</p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: colors.text, margin: '0 0 4px 0' }}>{data.senderName || 'Your Business Name'}</h2>
            {data.senderEmail && <p style={{ color: colors.textMuted, fontSize: '13px', margin: '2px 0' }}>{data.senderEmail}</p>}
            {data.senderPhone && <p style={{ color: colors.textMuted, fontSize: '13px', margin: '2px 0' }}>{data.senderPhone}</p>}
          </div>
        </div>
      </div>

      {/* Client & Dates Card */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '8px' }}>
        <div style={cardStyle}>
          <h3 style={{ fontSize: '12px', fontWeight: '600', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', marginTop: 0 }}>Bill To</h3>
          <p style={{ color: colors.text, fontWeight: '600', margin: '0 0 4px 0', fontSize: '15px' }}>{data.clientName || 'Client Name'}</p>
          {data.clientAddress && <p style={{ color: colors.textMuted, fontSize: '13px', margin: '2px 0', whiteSpace: 'pre-line', lineHeight: 1.4 }}>{data.clientAddress}</p>}
          {data.clientEmail && <p style={{ color: colors.textMuted, fontSize: '13px', margin: '4px 0 0 0' }}>{data.clientEmail}</p>}
        </div>
        <div style={cardStyle}>
          <h3 style={{ fontSize: '12px', fontWeight: '600', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', marginTop: 0 }}>Dates</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <p style={{ color: colors.textMuted, fontSize: '11px', margin: '0 0 4px 0' }}>{dateLabel}</p>
              <p style={{ color: colors.text, fontWeight: '500', margin: 0 }}>{formatDate(data.invoiceDate, data.currency.locale) || 'Not set'}</p>
            </div>
            <div>
              <p style={{ color: colors.textMuted, fontSize: '11px', margin: '0 0 4px 0' }}>{dueDateLabel}</p>
              <p style={{ color: colors.text, fontWeight: '500', margin: 0 }}>{formatDate(data.dueDate, data.currency.locale) || 'Not set'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Items Card */}
      <div style={cardStyle}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
              <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: '12px', fontWeight: '600', color: colors.textMuted, textTransform: 'uppercase' }}>Description</th>
              <th style={{ textAlign: 'center', padding: '12px 8px', fontSize: '12px', fontWeight: '600', color: colors.textMuted, textTransform: 'uppercase' }}>Qty</th>
              <th style={{ textAlign: 'right', padding: '12px 8px', fontSize: '12px', fontWeight: '600', color: colors.textMuted, textTransform: 'uppercase' }}>Price</th>
              <th style={{ textAlign: 'right', padding: '12px 8px', fontSize: '12px', fontWeight: '600', color: colors.textMuted, textTransform: 'uppercase' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.lineItems.map((item, index) => (
              <tr key={item.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td style={{ padding: '16px 8px', color: colors.text, fontSize: '14px' }}>{item.description || `Item ${index + 1}`}</td>
                <td style={{ padding: '16px 8px', textAlign: 'center', color: colors.textMuted, fontSize: '14px' }}>{item.quantity}</td>
                <td style={{ padding: '16px 8px', textAlign: 'right', color: colors.textMuted, fontSize: '14px' }}>{formatCurrency(item.unitPrice, data.currency)}</td>
                <td style={{ padding: '16px 8px', textAlign: 'right', color: colors.text, fontWeight: '500', fontSize: '14px' }}>{formatCurrency(item.quantity * item.unitPrice, data.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Section - Two Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
        {/* Payment & Notes Card */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '12px', fontWeight: '600', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', marginTop: 0 }}>Payment Information</h3>

          <div style={{ fontSize: '13px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', borderBottom: `1px dashed ${colors.border}`, paddingBottom: '6px' }}><span style={{ color: colors.textMuted }}>Method</span><span style={{ color: colors.text, fontWeight: '500' }}>{getPaymentMethodLabel(data.paymentMethod)}</span></div>
            {data.paymentMethod !== 'cash' && (
              <>
                {data.bankName && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', borderBottom: `1px dashed ${colors.border}`, paddingBottom: '6px' }}><span style={{ color: colors.textMuted }}>Bank</span><span style={{ color: colors.text }}>{data.bankName}</span></div>}
                {data.accountNumber && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', borderBottom: `1px dashed ${colors.border}`, paddingBottom: '6px' }}><span style={{ color: colors.textMuted }}>Account</span><span style={{ color: colors.text }}>{data.accountNumber}</span></div>}
                {data.branchCode && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', borderBottom: `1px dashed ${colors.border}`, paddingBottom: '6px' }}><span style={{ color: colors.textMuted }}>Branch</span><span style={{ color: colors.text }}>{data.branchCode}</span></div>}
              </>
            )}
          </div>

          {data.notes && (
            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: `1px solid ${colors.border}` }}>
              <h3 style={{ fontSize: '11px', fontWeight: '600', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', marginTop: 0 }}>Notes</h3>
              <p style={{ color: colors.text, fontSize: '13px', whiteSpace: 'pre-wrap' }}>{data.notes}</p>
            </div>
          )}
        </div>

        {/* Totals & QR Code */}
        <div style={cardStyle}>
          <div style={{ paddingBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${colors.border}` }}>
              <span style={{ color: colors.textMuted, fontSize: '13px' }}>Subtotal</span>
              <span style={{ color: colors.text, fontWeight: '500', fontSize: '13px' }}>{formatCurrency(subtotal, data.currency)}</span>
            </div>
            {data.tax.enabled && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${colors.border}` }}>
                <span style={{ color: colors.textMuted, fontSize: '13px' }}>{data.tax.name} ({data.tax.rate}%)</span>
                <span style={{ color: colors.text, fontWeight: '500', fontSize: '13px' }}>{formatCurrency(taxAmount, data.currency)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', marginTop: '8px' }}>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: colors.text }}>Total</span>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: colors.primary }}>{formatCurrency(total, data.currency)}</span>
            </div>

            {/* QR Code */}
            {data.paymentQR?.enabled && data.paymentQR.value && (
              <div style={{ marginTop: '20px', textAlign: 'center', paddingTop: '16px', borderTop: `1px solid ${colors.border}` }}>
                <QRCodeDisplay value={data.paymentQR.value} size={80} />
                <p style={{ color: colors.textMuted, fontSize: '10px', marginTop: '8px', marginBottom: 0 }}>{data.paymentQR.label || 'Scan to Pay'}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Text */}
      <div style={{ textAlign: 'center', marginTop: '8px' }}>
        <p style={{ color: colors.textMuted, fontSize: '12px' }}>Thanks for your business.</p>
      </div>
    </div>
  );
}
