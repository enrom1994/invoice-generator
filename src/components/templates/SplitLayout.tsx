'use client';

import React from 'react';
import { InvoiceData } from '@/types/invoice';
import { formatCurrency, formatDate, getPaymentMethodLabel } from './TemplateBase';
import QRCodeDisplay from '../QRCodeDisplay';

interface SplitLayoutProps {
  data: InvoiceData;
  colors: {
    primary: string;
    accent: string;
    background: string;
    text: string;
    textMuted: string;
    border: string;
    leftPanelBg?: string;
  };
  logoUrl?: string | null;
  documentTitle: string;
  dateLabel: string;
  dueDateLabel: string;
  subtotal: number;
  taxAmount: number;
  total: number;
}

export default function SplitLayout({
  data,
  colors,
  logoUrl,
  documentTitle,
  dateLabel,
  dueDateLabel,
  subtotal,
  taxAmount,
  total,
}: SplitLayoutProps): React.ReactElement {
  const showLogo = logoUrl && !data.headerImageUrl;

  return (
    <>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: `2px solid ${colors.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {showLogo && (
            // eslint-disable-next-line @next/next/no-img-element -- User-uploaded logo data URL
            <img
              src={logoUrl}
              alt="Company logo"
              style={{ maxHeight: '64px', maxWidth: '150px', objectFit: 'contain' }}
            />
          )}
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: colors.text, margin: 0 }}>{documentTitle}</h1>
            <p style={{ color: colors.textMuted, margin: '4px 0 0 0', fontSize: '14px' }}>#{data.invoiceNumber || 'INV-001'}</p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: colors.accent }}>{data.senderName || 'Your Business Name'}</div>
          {data.senderEmail && <p style={{ color: colors.textMuted, fontSize: '13px', margin: '2px 0' }}>{data.senderEmail}</p>}
          {data.senderPhone && <p style={{ color: colors.textMuted, fontSize: '13px', margin: '2px 0' }}>{data.senderPhone}</p>}
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'flex', gap: '32px' }}>
        {/* Left Column - Colored Panel (40%) */}
        <div style={{ flex: '0 0 40%', backgroundColor: colors.leftPanelBg || '#f0fdf4', padding: '24px', borderRadius: '8px' }}>
          {/* Sender Info */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '11px', fontWeight: '600', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', marginTop: 0 }}>From</h3>
            <p style={{ color: colors.text, fontWeight: '600', margin: '0 0 4px 0', fontSize: '15px' }}>{data.senderName || 'Your Business Name'}</p>
            {data.senderEmail && <p style={{ color: colors.textMuted, fontSize: '13px', margin: '2px 0' }}>{data.senderEmail}</p>}
            {data.senderPhone && <p style={{ color: colors.textMuted, fontSize: '13px', margin: '2px 0' }}>{data.senderPhone}</p>}
            {data.senderAddress && <p style={{ color: colors.textMuted, fontSize: '13px', margin: '2px 0' }}>{data.senderAddress}</p>}
          </div>

          {/* Client Info */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '11px', fontWeight: '600', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', marginTop: 0 }}>Bill To</h3>
            <p style={{ color: colors.text, fontWeight: '600', margin: '0 0 4px 0', fontSize: '15px' }}>{data.clientName || 'Client Name'}</p>
            {data.clientEmail && <p style={{ color: colors.textMuted, fontSize: '13px', margin: '2px 0' }}>{data.clientEmail}</p>}
            {data.clientAddress && <p style={{ color: colors.textMuted, fontSize: '13px', margin: '2px 0' }}>{data.clientAddress}</p>}
          </div>

          {/* Dates */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', color: colors.textMuted, display: 'block', marginBottom: '2px' }}>{dateLabel}</span>
              <span style={{ fontSize: '14px', fontWeight: '500', color: colors.text }}>{formatDate(data.invoiceDate, data.currency.locale) || 'Not set'}</span>
            </div>
            <div>
              <span style={{ fontSize: '12px', color: colors.textMuted, display: 'block', marginBottom: '2px' }}>{dueDateLabel}</span>
              <span style={{ fontSize: '14px', fontWeight: '500', color: colors.text }}>{formatDate(data.dueDate, data.currency.locale) || 'Not set'}</span>
            </div>
          </div>

          {/* Payment Details */}
          <div>
            <h3 style={{ fontSize: '11px', fontWeight: '600', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', marginTop: 0 }}>Payment Details</h3>
            <div style={{ fontSize: '13px' }}>
              <p style={{ margin: '2px 0', color: colors.text }}><span style={{ color: colors.textMuted }}>Method: </span><span style={{ fontWeight: '500' }}>{getPaymentMethodLabel(data.paymentMethod)}</span></p>
              {data.paymentMethod !== 'cash' && (
                <>
                  {data.bankName && <p style={{ margin: '2px 0', color: colors.text }}><span style={{ color: colors.textMuted }}>Bank: </span>{data.bankName}</p>}
                  {data.accountNumber && <p style={{ margin: '2px 0', color: colors.text }}><span style={{ color: colors.textMuted }}>Account: </span>{data.accountNumber}{data.accountType && ` (${data.accountType})`}</p>}
                  {data.branchCode && <p style={{ margin: '2px 0', color: colors.text }}><span style={{ color: colors.textMuted }}>Branch: </span>{data.branchCode}</p>}
                </>
              )}
            </div>
          </div>

          {/* QR Code */}
          {data.paymentQR?.enabled && data.paymentQR.value && (
            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <QRCodeDisplay value={data.paymentQR.value} size={100} />
              <p style={{ color: colors.textMuted, fontSize: '11px', marginTop: '8px', marginBottom: 0 }}>{data.paymentQR.label || 'Scan to Pay'}</p>
            </div>
          )}
        </div>

        {/* Right Column - Items & Totals */}
        <div style={{ flex: '1' }}>
          {/* Items Table */}
          <div style={{ marginBottom: '24px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '400px' }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${colors.border}` }}>
                  <th style={{ textAlign: 'left', padding: '10px 0', fontSize: '12px', fontWeight: '600', color: colors.textMuted, width: '50%' }}>Description</th>
                  <th style={{ textAlign: 'center', padding: '10px 0', fontSize: '12px', fontWeight: '600', color: colors.textMuted, width: '15%' }}>Qty</th>
                  <th style={{ textAlign: 'right', padding: '10px 0', fontSize: '12px', fontWeight: '600', color: colors.textMuted, width: '17%' }}>Price</th>
                  <th style={{ textAlign: 'right', padding: '10px 0', fontSize: '12px', fontWeight: '600', color: colors.textMuted, width: '18%' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.lineItems.map((item, index) => (
                  <tr key={item.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                    <td style={{ padding: '10px 0', color: colors.text, fontSize: '14px' }}>{item.description || `Item ${index + 1}`}</td>
                    <td style={{ padding: '10px 0', textAlign: 'center', color: colors.textMuted, fontSize: '14px' }}>{item.quantity}</td>
                    <td style={{ padding: '10px 0', textAlign: 'right', color: colors.textMuted, fontSize: '14px' }}>{formatCurrency(item.unitPrice, data.currency)}</td>
                    <td style={{ padding: '10px 0', textAlign: 'right', color: colors.text, fontWeight: '500', fontSize: '14px' }}>{formatCurrency(item.quantity * item.unitPrice, data.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ minWidth: '200px' }}>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: `2px solid ${colors.text}`, marginTop: '8px' }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: colors.text }}>Total</span>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: colors.accent }}>{formatCurrency(total, data.currency)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {data.notes && (
            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: `1px solid ${colors.border}` }}>
              <h3 style={{ fontSize: '11px', fontWeight: '600', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', marginTop: 0 }}>Notes</h3>
              <p style={{ color: colors.text, fontSize: '13px', whiteSpace: 'pre-wrap' }}>{data.notes}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
