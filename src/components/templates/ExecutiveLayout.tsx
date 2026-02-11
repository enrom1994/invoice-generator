'use client';

import React from 'react';
import { InvoiceData } from '@/types/invoice';
import { formatCurrency, formatDate, getPaymentMethodLabel } from './TemplateBase';
import QRCodeDisplay from '../QRCodeDisplay';

interface ExecutiveLayoutProps {
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

export default function ExecutiveLayout({
  data,
  colors,
  logoUrl,
  documentTitle,
  dateLabel,
  dueDateLabel,
  subtotal,
  taxAmount,
  total,
}: ExecutiveLayoutProps): React.ReactElement {
  const showLogo = logoUrl && !data.headerImageUrl;

  // Function to create a lighter tint of the primary color for backgrounds
  // Simple approximation by opacity if using hex, or just use a low opacity generic color overlay
  const headerBgColor = colors.primary;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      {/* Full-width header banner */}
      <div style={{
        backgroundColor: headerBgColor,
        margin: '-24px -24px 24px -24px',
        padding: '32px 24px',
        color: '#ffffff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {showLogo && (
            // eslint-disable-next-line @next/next/no-img-element -- User-uploaded logo data URL
            <img
              src={logoUrl}
              alt="Company logo"
              style={{ maxHeight: '72px', maxWidth: '180px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
            />
          )}
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>{documentTitle}</h1>
            <p style={{ color: 'rgba(255,255,255,0.85)', margin: '4px 0 0 0', fontSize: '15px', fontWeight: '500' }}>#{data.invoiceNumber || 'INV-001'}</p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff', marginBottom: '4px' }}>{data.senderName || 'Your Business Name'}</div>
          {data.senderEmail && <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', margin: '2px 0' }}>{data.senderEmail}</p>}
          {data.senderPhone && <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', margin: '2px 0' }}>{data.senderPhone}</p>}
        </div>
      </div>

      {/* Main Content Area - flex grow to push footer down if needed */}
      <div style={{ flex: 1 }}>
        {/* Three-column meta row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', marginBottom: '32px' }}>
          <div>
            <h3 style={{ fontSize: '12px', fontWeight: '700', color: colors.primary, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', marginTop: 0 }}>From</h3>
            <p style={{ color: colors.text, fontWeight: '600', margin: '0 0 4px 0', fontSize: '15px' }}>{data.senderName || 'Your Business Name'}</p>
            {data.senderAddress && <p style={{ color: colors.textMuted, fontSize: '13px', margin: '2px 0', lineHeight: 1.4 }}>{data.senderAddress}</p>}
            {data.registrationNumber && <p style={{ color: colors.textMuted, fontSize: '13px', margin: '4px 0 0 0' }}>Reg: {data.registrationNumber}</p>}
          </div>
          <div>
            <h3 style={{ fontSize: '12px', fontWeight: '700', color: colors.primary, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', marginTop: 0 }}>Bill To</h3>
            <p style={{ color: colors.text, fontWeight: '600', margin: '0 0 4px 0', fontSize: '15px' }}>{data.clientName || 'Client Name'}</p>
            {data.clientAddress && <p style={{ color: colors.textMuted, fontSize: '13px', margin: '2px 0', lineHeight: 1.4 }}>{data.clientAddress}</p>}
            {data.clientEmail && <p style={{ color: colors.textMuted, fontSize: '13px', margin: '4px 0 0 0' }}>{data.clientEmail}</p>}
          </div>
          <div>
            <h3 style={{ fontSize: '12px', fontWeight: '700', color: colors.primary, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', marginTop: 0 }}>Details</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', borderBottom: `1px solid ${colors.border}`, paddingBottom: '4px' }}>
              <span style={{ fontSize: '13px', color: colors.textMuted }}>{dateLabel}</span>
              <span style={{ fontSize: '13px', fontWeight: '600', color: colors.text }}>{formatDate(data.invoiceDate, data.currency.locale) || 'Not set'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', borderBottom: `1px solid ${colors.border}`, paddingBottom: '4px' }}>
              <span style={{ fontSize: '13px', color: colors.textMuted }}>{dueDateLabel}</span>
              <span style={{ fontSize: '13px', fontWeight: '600', color: colors.text }}>{formatDate(data.dueDate, data.currency.locale) || 'Not set'}</span>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div style={{ marginBottom: '32px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
            <thead>
              <tr style={{ backgroundColor: colors.background, borderTop: `2px solid ${colors.primary}`, borderBottom: `1px solid ${colors.border}` }}>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', fontWeight: '700', color: colors.text, textTransform: 'uppercase' }}>Description</th>
                <th style={{ textAlign: 'center', padding: '12px 16px', fontSize: '12px', fontWeight: '700', color: colors.text, textTransform: 'uppercase' }}>Qty</th>
                <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: '12px', fontWeight: '700', color: colors.text, textTransform: 'uppercase' }}>Price</th>
                <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: '12px', fontWeight: '700', color: colors.text, textTransform: 'uppercase' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.lineItems.map((item, index) => (
                <tr key={item.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <td style={{ padding: '14px 16px', color: colors.text, fontSize: '14px', fontWeight: '500' }}>{item.description || `Item ${index + 1}`}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'center', color: colors.textMuted, fontSize: '14px' }}>{item.quantity}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', color: colors.textMuted, fontSize: '14px' }}>{formatCurrency(item.unitPrice, data.currency)}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', color: colors.text, fontWeight: '600', fontSize: '14px' }}>{formatCurrency(item.quantity * item.unitPrice, data.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals & QR Row */}
        <div style={{ display: 'flex', gap: '48px' }}>
          <div style={{ flex: '1' }}>
            {/* Payment Details */}
            <div style={{ marginBottom: '24px', padding: '20px', backgroundColor: colors.background, borderRadius: '4px', borderLeft: `3px solid ${colors.primary}` }}>
              <h3 style={{ fontSize: '12px', fontWeight: '700', color: colors.primary, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', marginTop: 0 }}>Payment Methods</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: '16px', rowGap: '8px', fontSize: '13px' }}>
                <span style={{ color: colors.textMuted }}>Method:</span><span style={{ color: colors.text, fontWeight: '500' }}>{getPaymentMethodLabel(data.paymentMethod)}</span>
                {data.paymentMethod !== 'cash' && (
                  <>
                    {data.bankName && <><span style={{ color: colors.textMuted }}>Bank Name:</span><span style={{ color: colors.text, fontWeight: '500' }}>{data.bankName}</span></>}
                    {data.accountNumber && <><span style={{ color: colors.textMuted }}>Account No:</span><span style={{ color: colors.text, fontWeight: '500' }}>{data.accountNumber}</span></>}
                    {data.branchCode && <><span style={{ color: colors.textMuted }}>Branch Code:</span><span style={{ color: colors.text, fontWeight: '500' }}>{data.branchCode}</span></>}
                  </>
                )}
              </div>
            </div>

            {/* Notes */}
            {data.notes && (
              <div>
                <h3 style={{ fontSize: '12px', fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', marginTop: 0 }}>Notes</h3>
                <p style={{ color: colors.text, fontSize: '13px', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{data.notes}</p>
              </div>
            )}
          </div>

          {/* Totals */}
          <div style={{ minWidth: '260px' }}>
            <div style={{
              backgroundColor: colors.background,
              borderRadius: '8px',
              padding: '24px',
              border: `1px solid ${colors.border}`,
              boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${colors.border}` }}>
                <span style={{ color: colors.textMuted, fontSize: '13px' }}>Subtotal</span>
                <span style={{ color: colors.text, fontWeight: '600', fontSize: '13px' }}>{formatCurrency(subtotal, data.currency)}</span>
              </div>
              {data.tax.enabled && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${colors.border}` }}>
                  <span style={{ color: colors.textMuted, fontSize: '13px' }}>{data.tax.name} ({data.tax.rate}%)</span>
                  <span style={{ color: colors.text, fontWeight: '600', fontSize: '13px' }}>{formatCurrency(taxAmount, data.currency)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0 4px 0', marginTop: '4px' }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: colors.primary }}>Total</span>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: colors.primary }}>{formatCurrency(total, data.currency)}</span>
              </div>

              {/* QR Code */}
              {data.paymentQR?.enabled && data.paymentQR.value && (
                <div style={{ marginTop: '20px', textAlign: 'center', paddingTop: '20px', borderTop: `1px dashed ${colors.border}` }}>
                  <QRCodeDisplay value={data.paymentQR.value} size={90} />
                  <p style={{ color: colors.textMuted, fontSize: '10px', marginTop: '8px', marginBottom: 0 }}>{data.paymentQR.label || 'Scan to Pay'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Banner */}
      <div style={{
        marginTop: '40px',
        margin: '0 -24px -24px -24px',
        padding: '16px 24px',
        backgroundColor: colors.primary,
        color: '#ffffff',
        textAlign: 'center',
        fontSize: '13px',
        fontWeight: '500'
      }}>
        Thank you for your business!
      </div>
    </div>
  );
}
