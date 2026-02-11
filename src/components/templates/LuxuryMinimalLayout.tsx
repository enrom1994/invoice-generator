'use client';

import React from 'react';
import { InvoiceData } from '@/types/invoice';
import { formatCurrency, formatDate, getPaymentMethodLabel } from './TemplateBase';
import QRCodeDisplay from '../QRCodeDisplay';

interface LuxuryMinimalLayoutProps {
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

export default function LuxuryMinimalLayout({
  data,
  colors,
  logoUrl,
  documentTitle,
  dateLabel,
  dueDateLabel,
  subtotal,
  taxAmount,
  total,
}: LuxuryMinimalLayoutProps): React.ReactElement {
  const showLogo = logoUrl && !data.headerImageUrl;

  return (
    <div style={{
      padding: '40px',
      border: `1px solid ${colors.border}`,
      position: 'relative',
      fontFamily: '"Times New Roman", Times, serif', // Serif font for luxury feel
    }}>
      {/* Inner Border for double-border effect */}
      <div style={{
        border: `1px solid ${colors.border}`,
        padding: '32px',
        margin: '-8px', // Creates the double line effect
      }}>

        {/* Centered Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{ marginBottom: '24px' }}>
            {showLogo && (
              // eslint-disable-next-line @next/next/no-img-element -- User-uploaded logo data URL
              <img
                src={logoUrl}
                alt="Company logo"
                style={{ maxHeight: '90px', maxWidth: '200px', objectFit: 'contain', marginBottom: '24px' }}
              />
            )}
            <h1 style={{
              fontSize: '36px',
              fontWeight: '400',
              color: colors.text,
              margin: '0 0 12px 0',
              letterSpacing: '0.15em',
              textTransform: 'uppercase'
            }}>{documentTitle}</h1>
            <p style={{
              color: colors.textMuted,
              margin: 0,
              fontSize: '15px',
              letterSpacing: '0.1em',
              fontStyle: 'italic'
            }}>#{data.invoiceNumber || 'INV-001'}</p>
          </div>
        </div>

        {/* Company Info - Centered */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <p style={{ color: colors.text, fontSize: '18px', margin: '0 0 8px 0', letterSpacing: '0.05em' }}>{data.senderName || 'Your Business Name'}</p>
          {data.senderEmail && <p style={{ color: colors.textMuted, fontSize: '14px', margin: '2px 0' }}>{data.senderEmail}</p>}
          {data.senderPhone && <p style={{ color: colors.textMuted, fontSize: '14px', margin: '2px 0' }}>{data.senderPhone}</p>}
        </div>

        {/* Client & Dates - Clean Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '56px', paddingBottom: '40px', borderBottom: `1px solid ${colors.border}` }}>
          <div>
            <p style={{
              color: colors.textMuted,
              fontSize: '11px',
              margin: '0 0 12px 0',
              textTransform: 'uppercase',
              letterSpacing: '0.15em'
            }}>Bill To</p>
            <p style={{ color: colors.text, fontSize: '16px', margin: '0 0 6px 0', letterSpacing: '0.05em' }}>{data.clientName || 'Client Name'}</p>
            {data.clientEmail && <p style={{ color: colors.textMuted, fontSize: '14px', margin: '2px 0' }}>{data.clientEmail}</p>}
            {data.clientAddress && <p style={{ color: colors.textMuted, fontSize: '14px', margin: '2px 0' }}>{data.clientAddress}</p>}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ marginBottom: '16px' }}>
              <p style={{ color: colors.textMuted, fontSize: '11px', margin: '0 0 6px 0', textTransform: 'uppercase', letterSpacing: '0.15em' }}>{dateLabel}</p>
              <p style={{ color: colors.text, fontSize: '15px', margin: 0 }}>{formatDate(data.invoiceDate, data.currency.locale) || 'Not set'}</p>
            </div>
            <div>
              <p style={{ color: colors.textMuted, fontSize: '11px', margin: '0 0 6px 0', textTransform: 'uppercase', letterSpacing: '0.15em' }}>{dueDateLabel}</p>
              <p style={{ color: colors.text, fontSize: '15px', margin: 0 }}>{formatDate(data.dueDate, data.currency.locale) || 'Not set'}</p>
            </div>
          </div>
        </div>

        {/* Minimal Items Table */}
        <div style={{ marginBottom: '56px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <th style={{ textAlign: 'left', padding: '16px 0', fontSize: '11px', fontWeight: '400', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Description</th>
                <th style={{ textAlign: 'center', padding: '16px 0', fontSize: '11px', fontWeight: '400', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Qty</th>
                <th style={{ textAlign: 'right', padding: '16px 0', fontSize: '11px', fontWeight: '400', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Price</th>
                <th style={{ textAlign: 'right', padding: '16px 0', fontSize: '11px', fontWeight: '400', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.lineItems.map((item, index) => (
                <tr key={item.id}>
                  <td style={{ padding: '20px 0', borderBottom: `1px solid ${colors.border}`, color: colors.text, fontSize: '15px' }}>{item.description || `Item ${index + 1}`}</td>
                  <td style={{ padding: '20px 0', borderBottom: `1px solid ${colors.border}`, textAlign: 'center', color: colors.textMuted, fontSize: '15px' }}>{item.quantity}</td>
                  <td style={{ padding: '20px 0', borderBottom: `1px solid ${colors.border}`, textAlign: 'right', color: colors.textMuted, fontSize: '15px' }}>{formatCurrency(item.unitPrice, data.currency)}</td>
                  <td style={{ padding: '20px 0', borderBottom: `1px solid ${colors.border}`, textAlign: 'right', color: colors.text, fontSize: '15px' }}>{formatCurrency(item.quantity * item.unitPrice, data.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals - Right Aligned */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '56px' }}>
          <div style={{ width: '280px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${colors.border}` }}>
              <span style={{ color: colors.textMuted, fontSize: '14px', letterSpacing: '0.05em' }}>Subtotal</span>
              <span style={{ color: colors.text, fontSize: '14px' }}>{formatCurrency(subtotal, data.currency)}</span>
            </div>
            {data.tax.enabled && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${colors.border}` }}>
                <span style={{ color: colors.textMuted, fontSize: '14px', letterSpacing: '0.05em' }}>{data.tax.name} ({data.tax.rate}%)</span>
                <span style={{ color: colors.text, fontSize: '14px' }}>{formatCurrency(taxAmount, data.currency)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0', borderTop: `1px solid ${colors.text}` }}>
              <span style={{ fontSize: '20px', fontWeight: '400', color: colors.text, letterSpacing: '0.05em' }}>Total</span>
              <span style={{ fontSize: '20px', fontWeight: '400', color: colors.accent }}>{formatCurrency(total, data.currency)}</span>
            </div>
          </div>
        </div>

        {/* Bottom Row - QR & Payment Details */}
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '40px', borderTop: `1px solid ${colors.border}` }}>
          {/* Payment Details */}
          <div>
            <p style={{ color: colors.textMuted, fontSize: '11px', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Payment Details</p>
            <div style={{ fontSize: '13px' }}>
              <p style={{ margin: '4px 0', color: colors.text }}><span style={{ color: colors.textMuted }}>Method: </span><span style={{ fontWeight: '500' }}>{getPaymentMethodLabel(data.paymentMethod)}</span></p>
              {data.paymentMethod !== 'cash' && (
                <>
                  {data.bankName && <p style={{ margin: '4px 0', color: colors.text }}><span style={{ color: colors.textMuted }}>Bank: </span>{data.bankName}</p>}
                  {data.accountNumber && <p style={{ margin: '4px 0', color: colors.text }}><span style={{ color: colors.textMuted }}>Account: </span>{data.accountNumber}{data.accountType && ` (${data.accountType})`}</p>}
                  {data.branchCode && <p style={{ margin: '4px 0', color: colors.text }}><span style={{ color: colors.textMuted }}>Branch: </span>{data.branchCode}</p>}
                </>
              )}
            </div>
          </div>

          {/* QR Code */}
          {data.paymentQR?.enabled && data.paymentQR.value && (
            <div style={{ textAlign: 'center' }}>
              <QRCodeDisplay value={data.paymentQR.value} size={80} />
              <p style={{ color: colors.textMuted, fontSize: '10px', marginTop: '12px', marginBottom: 0, letterSpacing: '0.05em' }}>{data.paymentQR.label || 'Scan to Pay'}</p>
            </div>
          )}
        </div>

        {/* Notes */}
        {data.notes && (
          <div style={{ marginTop: '40px', textAlign: 'center' }}>
            <p style={{ color: colors.textMuted, fontSize: '14px', whiteSpace: 'pre-wrap', fontStyle: 'italic' }}>{data.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: '56px', textAlign: 'center', paddingTop: '24px', borderTop: `1px solid ${colors.border}` }}>
          <p style={{ color: colors.textMuted, fontSize: '13px', letterSpacing: '0.1em' }}>{data.senderName || 'Your Business Name'}</p>
          {(data.senderEmail || data.senderPhone) && (
            <p style={{ color: colors.textMuted, fontSize: '13px', marginTop: '6px' }}>
              {data.senderEmail}{data.senderEmail && data.senderPhone && ' • '}{data.senderPhone}
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
