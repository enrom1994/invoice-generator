'use client';

import React from 'react';
import { InvoiceData } from '@/types/invoice';
import { formatCurrency, formatDate, getPaymentMethodLabel } from './TemplateBase';
import QRCodeDisplay from '../QRCodeDisplay';

interface StandardLayoutProps {
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
  isCompact?: boolean;
  documentTitle: string;
  dateLabel: string;
  dueDateLabel: string;
  subtotal: number;
  taxAmount: number;
  total: number;
}

export default function StandardLayout({
  data,
  colors,
  logoUrl,
  documentTitle,
  dateLabel,
  dueDateLabel,
  subtotal,
  taxAmount,
  total,
}: StandardLayoutProps): React.ReactElement {
  const showLogo = logoUrl && !data.headerImageUrl;

  return (
    <>
      {/* Modern Accent Bar */}
      <div style={{
        margin: '-24px -24px 0 -24px',
        height: '6px',
        background: `linear-gradient(90deg, ${colors.accent}, ${colors.accent}dd)`,
        borderRadius: '0 0 0 0',
      }} />

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginTop: '20px',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          {showLogo && (
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
            <h1 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: colors.accent,
              margin: 0
            }}>{documentTitle}</h1>
            <p style={{ color: colors.textMuted, margin: '4px 0 0 0', fontSize: '14px' }}>#{data.invoiceNumber || 'INV-001'}</p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: colors.text,
          }}>
            {data.senderName || 'Your Business Name'}
          </div>
          {data.senderEmail && (
            <p style={{ color: colors.textMuted, fontSize: '13px', margin: '2px 0' }}>{data.senderEmail}</p>
          )}
          {data.senderPhone && (
            <p style={{ color: colors.textMuted, fontSize: '13px', margin: '2px 0' }}>{data.senderPhone}</p>
          )}
          {data.senderAddress && (
            <p style={{ color: colors.textMuted, fontSize: '13px', margin: '2px 0' }}>{data.senderAddress}</p>
          )}
          {data.registrationNumber && (
            <p style={{ color: colors.textMuted, fontSize: '12px', marginTop: '4px' }}>Reg: {data.registrationNumber}</p>
          )}
          {data.tax.enabled && data.tax.name && (
            <p style={{ color: colors.textMuted, fontSize: '12px', marginTop: '4px' }}>{data.tax.name} No: {data.registrationNumber || 'N/A'}</p>
          )}
        </div>
      </div>

      {/* Client & Date Info */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <h3 style={{
            fontSize: '11px',
            fontWeight: '600',
            color: colors.accent,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '6px',
            marginTop: 0
          }}>
            Bill To
          </h3>
          <p style={{ color: colors.text, fontWeight: '600', margin: '0 0 4px 0', fontSize: '15px' }}>
            {data.clientName || 'Client Name'}
          </p>
          {data.clientEmail && (
            <p style={{ color: colors.textMuted, fontSize: '13px', margin: '2px 0' }}>{data.clientEmail}</p>
          )}
          {data.clientAddress && (
            <p style={{ color: colors.textMuted, fontSize: '13px', margin: '2px 0' }}>{data.clientAddress}</p>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
            <span style={{ fontSize: '13px', color: colors.textMuted }}>{dateLabel}</span>
            <span style={{ fontSize: '13px', fontWeight: '500', color: colors.text }}>
              {formatDate(data.invoiceDate, data.currency.locale) || 'Not set'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
            <span style={{ fontSize: '13px', color: colors.textMuted }}>{dueDateLabel}</span>
            <span style={{ fontSize: '13px', fontWeight: '500', color: colors.text }}>
              {formatDate(data.dueDate, data.currency.locale) || 'Not set'}
            </span>
          </div>
        </div>
      </div>

      {/* Items Table with colored header */}
      <div style={{ marginBottom: '24px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '400px' }}>
          <thead>
            <tr style={{
              background: colors.accent,
              borderRadius: '6px',
            }}>
              <th style={{
                textAlign: 'left',
                padding: '10px 12px',
                fontSize: '11px',
                fontWeight: '700',
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                width: '50%',
                borderRadius: '6px 0 0 6px',
              }}>Description</th>
              <th style={{
                textAlign: 'center',
                padding: '10px 12px',
                fontSize: '11px',
                fontWeight: '700',
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                width: '15%'
              }}>Qty</th>
              <th style={{
                textAlign: 'right',
                padding: '10px 12px',
                fontSize: '11px',
                fontWeight: '700',
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                width: '17%'
              }}>Price</th>
              <th style={{
                textAlign: 'right',
                padding: '10px 12px',
                fontSize: '11px',
                fontWeight: '700',
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                width: '18%',
                borderRadius: '0 6px 6px 0',
              }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.lineItems.map((item, index) => (
              <tr key={item.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td style={{
                  padding: '10px 12px',
                  color: colors.text,
                  fontSize: '14px'
                }}>{item.description || `Item ${index + 1}`}</td>
                <td style={{
                  padding: '10px 12px',
                  textAlign: 'center',
                  color: colors.textMuted,
                  fontSize: '14px'
                }}>{item.quantity}</td>
                <td style={{
                  padding: '10px 12px',
                  textAlign: 'right',
                  color: colors.textMuted,
                  fontSize: '14px'
                }}>{formatCurrency(item.unitPrice, data.currency)}</td>
                <td style={{
                  padding: '10px 12px',
                  textAlign: 'right',
                  color: colors.text,
                  fontWeight: '500',
                  fontSize: '14px'
                }}>{formatCurrency(item.quantity * item.unitPrice, data.currency)}</td>
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
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {data.paymentQR?.enabled && data.paymentQR.value && (
          <div style={{ textAlign: 'center' }}>
            <QRCodeDisplay value={data.paymentQR.value} size={100} />
            <p style={{ color: colors.textMuted, fontSize: '11px', marginTop: '4px', marginBottom: 0 }}>
              {data.paymentQR.label || 'Scan to Pay'}
            </p>
          </div>
        )}

        <div style={{ width: '220px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
            <span style={{ color: colors.textMuted, fontSize: '13px' }}>Subtotal</span>
            <span style={{ color: colors.text, fontWeight: '500', fontSize: '13px' }}>
              {formatCurrency(subtotal, data.currency)}
            </span>
          </div>
          {data.tax.enabled && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
              <span style={{ color: colors.textMuted, fontSize: '13px' }}>{data.tax.name} ({data.tax.rate}%)</span>
              <span style={{ color: colors.text, fontWeight: '500', fontSize: '13px' }}>
                {formatCurrency(taxAmount, data.currency)}
              </span>
            </div>
          )}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px 12px',
            background: `${colors.accent}10`,
            borderLeft: `3px solid ${colors.accent}`,
            borderRadius: '0 6px 6px 0',
            marginTop: '8px',
          }}>
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: colors.text }}>Total</span>
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: colors.accent }}>
              {formatCurrency(total, data.currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div style={{
        marginTop: '24px',
        paddingTop: '16px',
        borderTop: `1px solid ${colors.border}`
      }}>
        <h3 style={{
          fontSize: '11px',
          fontWeight: '600',
          color: colors.accent,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '6px',
          marginTop: 0
        }}>
          Payment Details
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '13px' }}>
          <div>
            <span style={{ color: colors.textMuted }}>Method: </span>
            <span style={{ color: colors.text, fontWeight: '500' }}>{getPaymentMethodLabel(data.paymentMethod)}</span>
          </div>
          {data.paymentMethod !== 'cash' && (
            <>
              {data.bankName && (
                <div>
                  <span style={{ color: colors.textMuted }}>Bank: </span>
                  <span style={{ color: colors.text }}>{data.bankName}</span>
                </div>
              )}
              {data.accountNumber && (
                <div>
                  <span style={{ color: colors.textMuted }}>Account: </span>
                  <span style={{ color: colors.text }}>{data.accountNumber}</span>
                  {data.accountType && ` (${data.accountType})`}
                </div>
              )}
              {data.branchCode && (
                <div>
                  <span style={{ color: colors.textMuted }}>Branch: </span>
                  <span style={{ color: colors.text }}>{data.branchCode}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Notes */}
      {data.notes && (
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: `1px solid ${colors.border}` }}>
          <h3 style={{
            fontSize: '11px',
            fontWeight: '600',
            color: colors.accent,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '6px',
            marginTop: 0
          }}>
            Notes
          </h3>
          <p style={{ color: colors.text, fontSize: '13px', whiteSpace: 'pre-wrap' }}>{data.notes}</p>
        </div>
      )}
    </>
  );
}
