'use client';

import React from 'react';
import { InvoiceData } from '@/types/invoice';
import { forwardRef } from 'react';
import { getTemplateById } from '@/lib/templates';

import StandardLayout from './templates/StandardLayout';
import MinimalLayout from './templates/MinimalLayout';
import CompactLayout from './templates/CompactLayout';
import SidebarLayout from './templates/SidebarLayout';
import CardLayout from './templates/CardLayout';
import SplitLayout from './templates/SplitLayout';
import ExecutiveLayout from './templates/ExecutiveLayout';
import LuxuryMinimalLayout from './templates/LuxuryMinimalLayout';

interface InvoicePreviewProps {
    data: InvoiceData;
    logoUrl?: string | null;
    isPro?: boolean;
    mounted?: boolean;
}

const InvoicePreview = forwardRef<HTMLDivElement, InvoicePreviewProps>(
    ({ data, logoUrl, isPro = false, mounted = false }, ref) => {
        const template = getTemplateById(data.template);
        const customPrimary = isPro && data.primaryColor ? data.primaryColor : undefined;
        const customAccent = isPro && data.accentColor ? data.accentColor : customPrimary;
        const colors = {
            ...template.colors,
            ...(customPrimary && { primary: customPrimary }),
            ...(customAccent && { accent: customAccent }),
        };

        const isQuote = data.documentType === 'quotation';
        const documentTitle = isQuote ? 'QUOTATION' : 'INVOICE';
        const dateLabel = isQuote ? 'Quote Date:' : 'Invoice Date:';
        const dueDateLabel = isQuote ? 'Valid Until:' : 'Due Date:';

        const subtotal = data.lineItems.reduce(
            (sum, item) => sum + item.quantity * item.unitPrice,
            0
        );
        const taxAmount = data.tax.enabled ? subtotal * (data.tax.rate / 100) : 0;
        const total = subtotal + taxAmount;

        const isCompact = data.template === 'compact';
        const isMinimal = data.template === 'minimal';
        const isLetterhead = data.template === 'letterhead';
        const isSidebar = data.template === 'sidebar';
        const isExecutive = data.template === 'executive';
        const isSplit = data.template === 'split';
        const isCard = data.template === 'card';
        const isLuxuryMinimal = data.template === 'luxury-minimal';
        const headerImageUrl = data.headerImageUrl;

        const showHeaderImage = isLetterhead && headerImageUrl;
        const showLogo = !showHeaderImage && logoUrl;

        const footerText = isPro && data.settings?.customFooter
            ? data.settings.customFooter
            : 'Thank you for your business!';

        const commonProps = {
            data,
            colors,
            logoUrl: showLogo ? logoUrl : null,
            documentTitle,
            dateLabel,
            dueDateLabel,
            subtotal,
            taxAmount,
            total,
        };

        return (
            <div
                ref={ref}
                className="invoice-preview"
                style={{
                    padding: '24px',
                    backgroundColor: colors.background,
                    color: colors.text,
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    minHeight: '800px',
                    maxWidth: '900px',
                    margin: '0 auto',
                }}
            >
                {/* Header Image for Letterhead template */}
                {showHeaderImage && (
                    <div style={{ margin: '-24px -24px 20px -24px' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element -- User-uploaded header image data URL */}
                        <img
                            src={headerImageUrl}
                            alt="Letterhead"
                            style={{ width: '100%', maxHeight: '120px', objectFit: 'cover' }}
                        />
                    </div>
                )}

                {/* Render appropriate layout */}
                {isMinimal ? (
                    <MinimalLayout {...commonProps} />
                ) : isCompact ? (
                    <CompactLayout {...commonProps} />
                ) : isSidebar ? (
                    <SidebarLayout {...commonProps} />
                ) : isExecutive ? (
                    <ExecutiveLayout {...commonProps} />
                ) : isSplit ? (
                    <SplitLayout {...commonProps} />
                ) : isCard ? (
                    <CardLayout {...commonProps} />
                ) : isLuxuryMinimal ? (
                    <LuxuryMinimalLayout {...commonProps} />
                ) : (
                    <StandardLayout {...commonProps} />
                )}

                {/* Footer (not shown in sidebar) */}
                {!isSidebar && (
                    <div style={{ marginTop: isCompact ? '16px' : '24px', paddingTop: '16px', borderTop: `1px solid ${colors.border}`, textAlign: 'center' }}>
                        <p style={{ color: colors.textMuted, fontSize: isCompact ? '12px' : '13px', margin: 0 }}>{footerText}</p>
                    </div>
                )}


            </div>
        );
    }
);

InvoicePreview.displayName = 'InvoicePreview';

export default InvoicePreview;
