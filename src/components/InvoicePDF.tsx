'use client';

import {
    Document,
    Page,
    Text,
    View,
    Image,
    StyleSheet,
    Font,
} from '@react-pdf/renderer';
import { InvoiceData, CurrencyConfig, PaymentMethod } from '@/types/invoice';
import { getTemplateById } from '@/lib/templates';

// Register fonts
Font.register({
    family: 'Helvetica',
    fonts: [
        { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2' },
        { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmEU9fBBc4.woff2', fontWeight: 'bold' },
    ],
});

const formatCurrency = (amount: number, currency: CurrencyConfig): string => {
    if (!currency) {
        return '$0.00';
    }

    const amountNum = typeof amount === 'number' ? amount : parseFloat(amount) || 0;

    try {
        if (!currency.locale || !currency.code) {
            return `${currency.symbol || '$'}${amountNum.toFixed(2)}`;
        }

        return new Intl.NumberFormat(currency.locale, {
            style: 'currency',
            currency: currency.code,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amountNum);
    } catch {
        return `${currency.symbol || '$'}${amountNum.toFixed(2)}`;
    }
};

const _formatAmount = (
    quantity: number,
    unitPrice: number,
    currency: CurrencyConfig
): string => {
    const amount = quantity * unitPrice;
    return formatCurrency(amount, currency);
};

const formatDate = (dateString: string, locale: string = 'en-US'): string => {
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
};

const getPaymentMethodLabel = (method: PaymentMethod): string => {
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
};

interface InvoicePDFProps {
    data: InvoiceData;
    logoUrl?: string | null;
    isPro?: boolean;
    qrCodeDataUrl?: string | null;
}

export default function InvoicePDF({
    data,
    logoUrl,
    isPro = false,
    qrCodeDataUrl,
}: InvoicePDFProps) {
    // Debug: Log template detection
    console.log('InvoicePDF - Template received:', data.template);
    console.log('InvoicePDF - Data keys:', Object.keys(data));

    const template = getTemplateById(data.template);
    // Merge custom colors from invoice data with template colors
    // If primaryColor is set, use it for both primary AND accent (they should match)
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
        (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
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

    // Debug: Log which layout will be selected
    console.log('Layout selection:', {
        isMinimal,
        isCompact,
        isLetterhead,
        isSidebar,
        isExecutive,
        isSplit,
        isCard,
        isLuxuryMinimal,
        willRender: isMinimal ? 'minimal' : isCompact ? 'compact' : isExecutive ? 'executive' : isSplit ? 'split' : isCard ? 'card' : isLuxuryMinimal ? 'luxury-minimal' : isSidebar ? 'sidebar' : 'standard/modern'
    });

    const headerImageUrl = data.headerImageUrl;

    // Determine what to show in header
    const showHeaderImage = isLetterhead && headerImageUrl;
    const showLogo = !showHeaderImage && logoUrl;

    // Determine footer text
    const footerText = isPro && data.settings?.customFooter
        ? data.settings.customFooter
        : 'Thank you for your business!';

    const createStyles = () =>
        StyleSheet.create({
            page: {
                padding: isCompact ? 20 : 30,
                fontFamily: 'Helvetica',
                fontSize: isCompact ? 9 : 10,
                backgroundColor: '#ffffff',
            },
            // Sidebar layout styles
            sidebarContainer: {
                flexDirection: 'row',
                gap: 30,
            },
            sidebarMain: {
                flex: 2,
            },
            sidebarPanel: {
                flex: 1,
                backgroundColor: colors.sidebarBg || '#f8fafc',
                padding: 20,
                borderRadius: 8,
            },
            sidebarSectionTitle: {
                fontSize: 9,
                fontWeight: 'bold',
                color: colors.textMuted,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                marginBottom: 10,
            },
            sidebarRow: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 6,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
            },
            sidebarLabel: {
                color: colors.textMuted,
                fontSize: 10,
            },
            sidebarValue: {
                color: colors.text,
                fontSize: 10,
                fontWeight: 'normal',
            },
            sidebarTotal: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 10,
                marginTop: 4,
            },
            sidebarTotalLabel: {
                fontSize: 12,
                fontWeight: 'bold',
                color: colors.text,
            },
            sidebarTotalValue: {
                fontSize: 12,
                fontWeight: 'bold',
                color: colors.accent,
            },
            sidebarQR: {
                width: 100,
                height: 100,
                alignSelf: 'center',
                marginVertical: 10,
            },
            // Standard layout styles
            headerImage: {
                width: '100%',
                maxHeight: 100,
                objectFit: 'cover',
                marginBottom: 20,
            },
            header: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: isCompact ? 20 : 25,
            },
            headerLeft: {
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: 12,
            },
            logo: {
                maxWidth: isCompact ? 60 : 80,
                maxHeight: isCompact ? 30 : 40,
                objectFit: 'contain',
            },
            documentTitle: {
                fontSize: isCompact ? 18 : 22,
                fontWeight: 'bold',
                color: colors.text,
            },
            invoiceNumber: {
                color: colors.textMuted,
                marginTop: 4,
                fontSize: isCompact ? 9 : 10,
            },
            companyInfo: {
                textAlign: 'right',
            },
            companyName: {
                fontSize: isCompact ? 12 : 14,
                fontWeight: 'bold',
                color: colors.accent,
            },
            companyDetail: {
                color: colors.textMuted,
                fontSize: isCompact ? 8 : 9,
                marginTop: 2,
            },
            metaRow: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: isCompact ? 20 : 25,
            },
            billTo: {
                flex: 1,
            },
            dateInfo: {
                flex: 1,
                textAlign: 'right',
            },
            sectionLabel: {
                fontSize: 8,
                fontWeight: 'bold',
                color: colors.textMuted,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                marginBottom: 6,
            },
            clientName: {
                color: colors.text,
                fontWeight: 'bold',
                marginBottom: 3,
                fontSize: isCompact ? 10 : 11,
            },
            clientDetail: {
                color: colors.textMuted,
                fontSize: isCompact ? 8 : 9,
                marginTop: 2,
            },
            dateRow: {
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginBottom: 4,
            },
            dateLabel: {
                color: colors.textMuted,
                fontSize: isCompact ? 8 : 9,
                marginRight: 8,
            },
            dateValue: {
                color: colors.text,
                fontSize: isCompact ? 8 : 9,
                fontWeight: 'normal',
            },
            table: {
                marginBottom: isCompact ? 20 : 25,
            },
            tableHeader: {
                flexDirection: 'row',
                borderBottomWidth: 2,
                borderBottomColor: colors.border,
                paddingBottom: 8,
                marginBottom: 8,
            },
            tableRow: {
                flexDirection: 'row',
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
                paddingVertical: isCompact ? 6 : 8,
            },
            colDescription: {
                flex: 3,
                color: colors.text,
            },
            colQty: {
                flex: 1,
                textAlign: 'center',
                color: colors.textMuted,
            },
            colPrice: {
                flex: 1.5,
                textAlign: 'right',
                color: colors.textMuted,
            },
            colAmount: {
                flex: 1.5,
                textAlign: 'right',
                color: colors.textMuted,
                fontWeight: 'normal',
            },
            headerText: {
                fontSize: isCompact ? 8 : 9,
                fontWeight: 'bold',
                color: colors.textMuted,
            },
            totalsSection: {
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'flex-start',
            },
            qrCode: {
                width: isCompact ? 70 : 90,
                height: isCompact ? 70 : 90,
            },
            qrLabel: {
                fontSize: isCompact ? 8 : 9,
                color: colors.textMuted,
                textAlign: 'center',
                marginTop: 4,
            },
            totalsBox: {
                width: 200,
                marginLeft: 'auto',
            },
            totalRow: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 6,
            },
            totalLabel: {
                color: colors.textMuted,
            },
            totalValue: {
                color: colors.text,
                fontWeight: 'normal',
            },
            grandTotalRow: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: 10,
                marginTop: 6,
                borderTopWidth: 2,
                borderTopColor: colors.text,
            },
            grandTotalLabel: {
                fontSize: isCompact ? 11 : 12,
                fontWeight: 'bold',
                color: colors.text,
            },
            grandTotalValue: {
                fontSize: isCompact ? 11 : 12,
                fontWeight: 'bold',
                color: colors.accent,
            },
            bankSection: {
                marginTop: isCompact ? 20 : 25,
                paddingTop: 16,
                borderTopWidth: 1,
                borderTopColor: colors.border,
            },
            bankGrid: {
                flexDirection: 'row',
                gap: 20,
                flexWrap: 'wrap',
            },
            bankItem: {
                flexDirection: 'row',
            },
            bankLabel: {
                color: colors.textMuted,
                fontSize: isCompact ? 8 : 9,
            },
            bankValue: {
                color: colors.text,
                fontSize: isCompact ? 8 : 9,
                marginLeft: 4,
            },
            notesSection: {
                marginTop: 16,
                paddingTop: 16,
                borderTopWidth: 1,
                borderTopColor: colors.border,
            },
            notesText: {
                color: colors.textMuted,
                fontSize: isCompact ? 8 : 9,
            },
            footer: {
                marginTop: isCompact ? 20 : 25,
                paddingTop: 16,
                borderTopWidth: 1,
                borderTopColor: colors.border,
                textAlign: 'center',
            },
            footerText: {
                color: colors.textMuted,
                fontSize: isCompact ? 9 : 10,
            },
        });

    const styles = createStyles();


    // Split Layout
    if (isSplit) {
        return (
            <Document>
                <Page size="A4" style={styles.page}>
                    <View style={{ flexDirection: 'row', minHeight: '100%' }}>
                        {/* Left Panel */}
                        <View style={{
                            width: '35%',
                            backgroundColor: colors.leftPanelBg || '#ecfdf5',
                            padding: 24,
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            {/* Logo */}
                            {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf Image doesn't support alt */}
                            {showLogo && <Image src={logoUrl} style={{ width: 80, height: 40, objectFit: 'contain', marginBottom: 20 }} />}

                            {/* Company Info */}
                            <View style={{ marginBottom: 30 }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.primary, marginBottom: 8 }}>
                                    {data.senderName || 'Your Business Name'}
                                </Text>
                                {data.senderEmail && (
                                    <Text style={{ fontSize: 9, color: colors.textMuted, marginBottom: 4 }}>{data.senderEmail}</Text>
                                )}
                                {data.senderPhone && (
                                    <Text style={{ fontSize: 9, color: colors.textMuted, marginBottom: 4 }}>{data.senderPhone}</Text>
                                )}
                                {data.senderAddress && (
                                    <Text style={{ fontSize: 9, color: colors.textMuted }}>{data.senderAddress}</Text>
                                )}
                            </View>

                            {/* Invoice Details */}
                            <View style={{ marginBottom: 30 }}>
                                <Text style={{ fontSize: 8, fontWeight: 'bold', color: colors.textMuted, textTransform: 'uppercase', marginBottom: 8 }}>
                                    {documentTitle}
                                </Text>
                                <Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.text, marginBottom: 4 }}>
                                    #{data.invoiceNumber || 'INV-001'}
                                </Text>
                                <Text style={{ fontSize: 9, color: colors.textMuted }}>
                                    {formatDate(data.invoiceDate, data.currency.locale) || 'Not set'}
                                </Text>
                            </View>

                            {/* Client Info */}
                            <View>
                                <Text style={{ fontSize: 8, fontWeight: 'bold', color: colors.textMuted, textTransform: 'uppercase', marginBottom: 8 }}>
                                    Bill To
                                </Text>
                                <Text style={{ fontSize: 11, fontWeight: 'bold', color: colors.text, marginBottom: 4 }}>
                                    {data.clientName || 'Client Name'}
                                </Text>
                                {data.clientEmail && (
                                    <Text style={{ fontSize: 9, color: colors.textMuted, marginBottom: 2 }}>{data.clientEmail}</Text>
                                )}
                                {data.clientAddress && (
                                    <Text style={{ fontSize: 9, color: colors.textMuted }}>{data.clientAddress}</Text>
                                )}
                            </View>
                        </View>

                        {/* Right Panel */}
                        <View style={{ width: '65%', padding: 24 }}>
                            {/* Right Header */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 }}>
                                <View>
                                    <Text style={{ fontSize: 8, fontWeight: 'bold', color: colors.textMuted, textTransform: 'uppercase', marginBottom: 6 }}>
                                        Due Date
                                    </Text>
                                    <Text style={{ fontSize: 11, fontWeight: 'normal', color: colors.text }}>
                                        {formatDate(data.dueDate, data.currency.locale) || 'Not set'}
                                    </Text>
                                </View>
                                {data.paymentReference && (
                                    <View>
                                        <Text style={{ fontSize: 8, fontWeight: 'bold', color: colors.textMuted, textTransform: 'uppercase', marginBottom: 6 }}>
                                            Payment Ref
                                        </Text>
                                        <Text style={{ fontSize: 11, fontWeight: 'normal', color: colors.text }}>
                                            {data.paymentReference}
                                        </Text>
                                    </View>
                                )}
                            </View>

                            {/* Items Table */}
                            <View style={{ marginBottom: 24 }}>
                                <View style={{ flexDirection: 'row', borderBottomWidth: 2, borderBottomColor: colors.border, paddingBottom: 8, marginBottom: 8 }}>
                                    <Text style={[styles.colDescription, { fontSize: 9, fontWeight: 'bold', color: colors.textMuted }]}>Description</Text>
                                    <Text style={[styles.colQty, { fontSize: 9, fontWeight: 'bold', color: colors.textMuted }]}>Qty</Text>
                                    <Text style={[styles.colPrice, { fontSize: 9, fontWeight: 'bold', color: colors.textMuted }]}>Price</Text>
                                    <Text style={[styles.colAmount, { fontSize: 9, fontWeight: 'bold', color: colors.textMuted }]}>Amount</Text>
                                </View>
                                {data.lineItems.map((item, index) => (
                                    <View key={item.id} style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: 8 }}>
                                        <Text style={[styles.colDescription, { fontSize: 9 }]}>{item.description || `Item ${index + 1}`}</Text>
                                        <Text style={[styles.colQty, { fontSize: 9, color: colors.textMuted }]}>{item.quantity}</Text>
                                        <Text style={[styles.colPrice, { fontSize: 9, color: colors.textMuted }]}>{formatCurrency(item.unitPrice, data.currency)}</Text>
                                        <Text style={[styles.colAmount, { fontSize: 9, fontWeight: 'normal' }]}>
                                            {formatCurrency(Number(item.quantity) * Number(item.unitPrice), data.currency)}
                                        </Text>
                                    </View>
                                ))}
                            </View>

                            {/* Totals */}
                            <View style={{ marginLeft: 'auto', width: 180 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}>
                                    <Text style={{ fontSize: 9, color: colors.textMuted }}>Subtotal</Text>
                                    <Text style={{ fontSize: 9, fontWeight: 'normal' }}>{formatCurrency(subtotal, data.currency)}</Text>
                                </View>
                                {data.tax.enabled && (
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}>
                                        <Text style={{ fontSize: 9, color: colors.textMuted }}>{data.tax.name} ({data.tax.rate}%)</Text>
                                        <Text style={{ fontSize: 9, fontWeight: 'normal' }}>{formatCurrency(taxAmount, data.currency)}</Text>
                                    </View>
                                )}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, marginTop: 6, borderTopWidth: 1, borderTopColor: colors.border }}>
                                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: colors.primary }}>Total</Text>
                                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: colors.primary }}>{formatCurrency(total, data.currency)}</Text>
                                </View>
                            </View>

                            {/* Payment Details */}
                            <View style={{ marginTop: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.border }}>
                                <Text style={{ fontSize: 8, fontWeight: 'bold', color: colors.textMuted, textTransform: 'uppercase', marginBottom: 8 }}>Payment Details</Text>
                                <View style={{ flexDirection: 'row', gap: 20 }}>
                                    <Text style={{ fontSize: 9, color: colors.textMuted }}>Method: <Text style={{ fontWeight: 'bold' }}>{getPaymentMethodLabel(data.paymentMethod)}</Text></Text>
                                    {data.paymentMethod !== 'cash' && (
                                        <>
                                            {data.bankName && (
                                                <Text style={{ fontSize: 9, color: colors.textMuted }}>Bank: {data.bankName}</Text>
                                            )}
                                            {data.accountNumber && (
                                                <Text style={{ fontSize: 9, color: colors.textMuted }}>Account: {data.accountNumber}</Text>
                                            )}
                                        </>
                                    )}
                                </View>
                            </View>

                            {data.notes && (
                                <View style={{ marginTop: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.border }}>
                                    <Text style={{ fontSize: 8, fontWeight: 'bold', color: colors.textMuted, textTransform: 'uppercase', marginBottom: 6 }}>Notes</Text>
                                    <Text style={{ fontSize: 9, color: colors.textMuted, lineHeight: 1.4 }}>{data.notes}</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    <View style={{ position: 'absolute', bottom: 20, left: 0, right: 0, textAlign: 'center', paddingHorizontal: 20 }}>
                        <Text style={{ fontSize: 8, color: colors.textMuted }}>{footerText}</Text>
                    </View>

                </Page>
            </Document>
        );
    }

    // Card Layout - Distinct containers, grey background
    if (isCard) {
        return (
            <Document>
                <Page size="A4" style={{ ...styles.page, backgroundColor: '#f8fafc', padding: 30 }}>
                    {/* Header Card */}
                    <View style={{ backgroundColor: '#ffffff', padding: 20, borderRadius: 5, marginBottom: 15, borderWidth: 1, borderColor: colors.border }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf Image doesn't support alt */}
                                {showLogo && <Image src={logoUrl} style={{ maxHeight: 50, width: 100, objectFit: 'contain', marginRight: 15 }} />}
                                <View>
                                    <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.text }}>{documentTitle}</Text>
                                    <Text style={{ fontSize: 12, color: colors.textMuted }}>#{data.invoiceNumber || 'INV-001'}</Text>
                                </View>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.text }}>{data.senderName}</Text>
                                {data.senderEmail && <Text style={{ fontSize: 10, color: colors.textMuted }}>{data.senderEmail}</Text>}
                            </View>
                        </View>
                    </View>

                    {/* Columns */}
                    <View style={{ flexDirection: 'row', gap: 15, marginBottom: 15 }}>
                        {/* Bill To Card */}
                        <View style={{ flex: 1, backgroundColor: '#ffffff', padding: 15, borderRadius: 5, borderWidth: 1, borderColor: colors.border }}>
                            <Text style={{ fontSize: 9, fontWeight: 'bold', color: colors.textMuted, textTransform: 'uppercase', marginBottom: 5 }}>Bill To</Text>
                            <Text style={{ fontSize: 12, fontWeight: 'bold', color: colors.text, marginBottom: 4 }}>{data.clientName}</Text>
                            {data.clientAddress && <Text style={{ fontSize: 10, color: colors.textMuted, lineHeight: 1.4 }}>{data.clientAddress}</Text>}
                        </View>
                        {/* Dates Card */}
                        <View style={{ flex: 1, backgroundColor: '#ffffff', padding: 15, borderRadius: 5, borderWidth: 1, borderColor: colors.border }}>
                            <Text style={{ fontSize: 9, fontWeight: 'bold', color: colors.textMuted, textTransform: 'uppercase', marginBottom: 5 }}>Dates</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                                <Text style={{ fontSize: 10, color: colors.textMuted }}>{dateLabel}</Text>
                                <Text style={{ fontSize: 10, fontWeight: 'bold', color: colors.text }}>{formatDate(data.invoiceDate, data.currency.locale)}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontSize: 10, color: colors.textMuted }}>{dueDateLabel}</Text>
                                <Text style={{ fontSize: 10, fontWeight: 'bold', color: colors.text }}>{formatDate(data.dueDate, data.currency.locale)}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Items Card */}
                    <View style={{ backgroundColor: '#ffffff', padding: 15, borderRadius: 5, marginBottom: 15, borderWidth: 1, borderColor: colors.border }}>
                        <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 8, marginBottom: 8 }}>
                            <Text style={{ width: '40%', fontSize: 10, fontWeight: 'bold', color: colors.textMuted }}>Description</Text>
                            <Text style={{ width: '20%', fontSize: 10, fontWeight: 'bold', color: colors.textMuted, textAlign: 'center' }}>Qty</Text>
                            <Text style={{ width: '20%', fontSize: 10, fontWeight: 'bold', color: colors.textMuted, textAlign: 'right' }}>Price</Text>
                            <Text style={{ width: '20%', fontSize: 10, fontWeight: 'bold', color: colors.textMuted, textAlign: 'right' }}>Amount</Text>
                        </View>
                        {data.lineItems.map((item, index) => (
                            <View key={index} style={{ flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                                <Text style={{ width: '40%', fontSize: 11, color: colors.text }}>{item.description || `Item ${index + 1}`}</Text>
                                <Text style={{ width: '20%', fontSize: 11, color: colors.textMuted, textAlign: 'center' }}>{item.quantity}</Text>
                                <Text style={{ width: '20%', fontSize: 11, color: colors.textMuted, textAlign: 'right' }}>{formatCurrency(item.unitPrice, data.currency)}</Text>
                                <Text style={{ width: '20%', fontSize: 11, fontWeight: 'bold', color: colors.text, textAlign: 'right' }}>{formatCurrency(item.quantity * item.unitPrice, data.currency)}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Footer Row */}
                    <View style={{ flexDirection: 'row', gap: 15 }}>
                        {/* Notes & Bank Card */}
                        <View style={{ flex: 1, backgroundColor: '#ffffff', padding: 15, borderRadius: 5, borderWidth: 1, borderColor: colors.border }}>
                            <View style={{ marginBottom: 15 }}>
                                <Text style={{ fontSize: 9, fontWeight: 'bold', color: colors.textMuted, textTransform: 'uppercase', marginBottom: 5 }}>Payment</Text>
                                <Text style={{ fontSize: 10, color: colors.text }}>Method: {getPaymentMethodLabel(data.paymentMethod)}</Text>
                                {data.paymentMethod !== 'cash' && (
                                    <>
                                        {data.bankName && <Text style={{ fontSize: 10, color: colors.text }}>Bank: {data.bankName}</Text>}
                                        {data.accountNumber && <Text style={{ fontSize: 10, color: colors.text }}>Account: {data.accountNumber}</Text>}
                                    </>
                                )}
                            </View>
                            {data.notes && (
                                <View>
                                    <Text style={{ fontSize: 9, fontWeight: 'bold', color: colors.textMuted, textTransform: 'uppercase', marginBottom: 5 }}>Notes</Text>
                                    <Text style={{ fontSize: 10, color: colors.text }}>{data.notes}</Text>
                                </View>
                            )}
                        </View>
                        {/* Totals Card */}
                        <View style={{ width: 220, backgroundColor: '#ffffff', padding: 15, borderRadius: 5, borderWidth: 1, borderColor: colors.border }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 }}>
                                <Text style={{ fontSize: 10, color: colors.textMuted }}>Subtotal</Text>
                                <Text style={{ fontSize: 10, color: colors.text }}>{formatCurrency(subtotal, data.currency)}</Text>
                            </View>
                            {taxAmount > 0 && (
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 }}>
                                    <Text style={{ fontSize: 10, color: colors.textMuted }}>{data.tax.name}</Text>
                                    <Text style={{ fontSize: 10, color: colors.text }}>{formatCurrency(taxAmount, data.currency)}</Text>
                                </View>
                            )}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border, marginTop: 5 }}>
                                <Text style={{ fontSize: 12, fontWeight: 'bold', color: colors.text }}>Total</Text>
                                <Text style={{ fontSize: 12, fontWeight: 'bold', color: colors.primary }}>{formatCurrency(total, data.currency)}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Footer Text */}
                    <View style={{ alignItems: 'center', marginTop: 20 }}>
                        <Text style={{ fontSize: 10, color: colors.textMuted }}>{footerText}</Text>
                    </View>
                </Page>
            </Document>
        );
    }

    // Luxury Minimal Layout - Serif fonts, Double Border, Centered
    if (isLuxuryMinimal) {
        return (
            <Document>
                <Page size="A4" style={{ ...styles.page, fontFamily: 'Times-Roman', padding: 40 }}>
                    {/* Outer Border */}
                    <View style={{
                        borderWidth: 1,
                        borderColor: colors.border,
                        padding: 30,
                        height: '100%',
                        position: 'relative'
                    }}>
                        {/* Inner Border */}
                        <View style={{
                            borderWidth: 1,
                            borderColor: colors.border,
                            padding: 20,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>

                            {/* Header */}
                            <View style={{ alignItems: 'center', marginBottom: 40 }}>
                                {logoUrl && !headerImageUrl && (
                                    <View style={{ marginBottom: 20, height: 60, justifyContent: 'center' }}>
                                        {/* eslint-disable-next-line jsx-a11y/alt-text */}
                                        <Image src={logoUrl} style={{ maxHeight: 60, objectFit: 'contain' }} />
                                    </View>
                                )}
                                <Text style={{ fontSize: 28, fontFamily: 'Times-Roman', color: colors.text, marginBottom: 8, letterSpacing: 2, textTransform: 'uppercase' }}>{documentTitle}</Text>
                                <Text style={{ fontSize: 12, fontFamily: 'Times-Italic', color: colors.textMuted }}>#{data.invoiceNumber || 'INV-001'}</Text>
                            </View>

                            {/* Sender Info - Centered */}
                            <View style={{ alignItems: 'center', marginBottom: 40 }}>
                                <Text style={{ fontSize: 14, fontFamily: 'Times-Bold', color: colors.text, marginBottom: 4 }}>{data.senderName}</Text>
                                {data.senderEmail && <Text style={{ fontSize: 10, color: colors.textMuted, fontFamily: 'Times-Roman' }}>{data.senderEmail}</Text>}
                                {data.senderPhone && <Text style={{ fontSize: 10, color: colors.textMuted, fontFamily: 'Times-Roman' }}>{data.senderPhone}</Text>}
                            </View>

                            {/* Client & Dates - Clean Row */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                                <View>
                                    <Text style={{ fontSize: 9, color: colors.textMuted, textTransform: 'uppercase', marginBottom: 8, letterSpacing: 1 }}>Bill To</Text>
                                    <Text style={{ fontSize: 12, color: colors.text, marginBottom: 4 }}>{data.clientName}</Text>
                                    {data.clientEmail && <Text style={{ fontSize: 10, color: colors.textMuted }}>{data.clientEmail}</Text>}
                                    {data.clientAddress && <Text style={{ fontSize: 10, color: colors.textMuted }}>{data.clientAddress}</Text>}
                                </View>
                                <View style={{ alignItems: 'flex-end' }}>
                                    <View style={{ marginBottom: 10 }}>
                                        <Text style={{ fontSize: 9, color: colors.textMuted, textTransform: 'uppercase', marginBottom: 4, letterSpacing: 1 }}>{dateLabel}</Text>
                                        <Text style={{ fontSize: 11, color: colors.text }}>{formatDate(data.invoiceDate, data.currency.locale)}</Text>
                                    </View>
                                    <View>
                                        <Text style={{ fontSize: 9, color: colors.textMuted, textTransform: 'uppercase', marginBottom: 4, letterSpacing: 1 }}>{dueDateLabel}</Text>
                                        <Text style={{ fontSize: 11, color: colors.text }}>{formatDate(data.dueDate, data.currency.locale)}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Table */}
                            <View style={{ marginBottom: 40 }}>
                                <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 10, marginBottom: 10 }}>
                                    <Text style={{ width: '40%', fontSize: 9, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Description</Text>
                                    <Text style={{ width: '20%', fontSize: 9, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center' }}>Qty</Text>
                                    <Text style={{ width: '20%', fontSize: 9, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1, textAlign: 'right' }}>Price</Text>
                                    <Text style={{ width: '20%', fontSize: 9, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1, textAlign: 'right' }}>Amount</Text>
                                </View>
                                {data.lineItems.map((item, index) => (
                                    <View key={index} style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: 10 }}>
                                        <Text style={{ width: '40%', fontSize: 11, color: colors.text }}>{item.description || `Item ${index + 1}`}</Text>
                                        <Text style={{ width: '20%', fontSize: 11, color: colors.textMuted, textAlign: 'center' }}>{item.quantity}</Text>
                                        <Text style={{ width: '20%', fontSize: 11, color: colors.textMuted, textAlign: 'right' }}>{formatCurrency(item.unitPrice, data.currency)}</Text>
                                        <Text style={{ width: '20%', fontSize: 11, color: colors.text, textAlign: 'right' }}>{formatCurrency(item.quantity * item.unitPrice, data.currency)}</Text>
                                    </View>
                                ))}
                            </View>

                            {/* Totals - Right Aligned */}
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 40 }}>
                                <View style={{ width: '40%' }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                                        <Text style={{ fontSize: 10, color: colors.textMuted }}>Subtotal</Text>
                                        <Text style={{ fontSize: 10, color: colors.text }}>{formatCurrency(subtotal, data.currency)}</Text>
                                    </View>
                                    {taxAmount > 0 && (
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                                            <Text style={{ fontSize: 10, color: colors.textMuted }}>{data.tax.name} ({data.tax.rate}%)</Text>
                                            <Text style={{ fontSize: 10, color: colors.text }}>{formatCurrency(taxAmount, data.currency)}</Text>
                                        </View>
                                    )}
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 }}>
                                        <Text style={{ fontSize: 14, fontFamily: 'Times-Roman', color: colors.text }}>Total</Text>
                                        <Text style={{ fontSize: 14, fontFamily: 'Times-Bold', color: colors.accent }}>{formatCurrency(total, data.currency)}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Bottom Row - Payment & Footer */}
                            <View style={{ marginTop: 'auto', paddingTop: 20, borderTopWidth: 1, borderTopColor: colors.border }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ width: '60%' }}>
                                        <View>
                                            <Text style={{ fontSize: 9, color: colors.textMuted, textTransform: 'uppercase', marginBottom: 5 }}>Payment Details</Text>
                                            <Text style={{ fontSize: 10, color: colors.text }}>Method: {getPaymentMethodLabel(data.paymentMethod)}</Text>
                                            {data.paymentMethod !== 'cash' && (
                                                <>
                                                    {data.bankName && <Text style={{ fontSize: 10, color: colors.text }}>Bank: {data.bankName}</Text>}
                                                    {data.accountNumber && <Text style={{ fontSize: 10, color: colors.text }}>Account: {data.accountNumber}</Text>}
                                                </>
                                            )}
                                        </View>
                                    </View>
                                    {data.paymentQR?.enabled && data.paymentQR.value && (
                                        <View style={{ alignItems: 'center' }}>
                                            {/* eslint-disable-next-line jsx-a11y/alt-text */}
                                            <Image src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data.paymentQR.value)}`} style={{ width: 60, height: 60 }} />
                                            <Text style={{ fontSize: 8, color: colors.textMuted, marginTop: 4 }}>Scan to Pay</Text>
                                        </View>
                                    )}
                                </View>
                                <View style={{ alignItems: 'center', marginTop: 20 }}>
                                    <Text style={{ fontSize: 9, color: colors.textMuted }}>{footerText}</Text>
                                </View>
                            </View>

                        </View>
                    </View>
                </Page>
            </Document>
        );
    }

    // Executive Layout - Clean, Corporate, Header/Footer Banners
    if (isExecutive) {
        return (
            <Document>
                <Page size="A4" style={{ ...styles.page, padding: 0 }}>
                    {/* Header Banner */}
                    <View style={{
                        backgroundColor: colors.primary,
                        padding: 30,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {logoUrl && !headerImageUrl && (
                                <View style={{ marginRight: 15, height: 50, justifyContent: 'center' }}>
                                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                                    <Image src={logoUrl} style={{ maxHeight: 50, width: 100, objectFit: 'contain' }} />
                                </View>
                            )}
                            <View>
                                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#ffffff', marginBottom: 4 }}>{documentTitle}</Text>
                                <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>#{data.invoiceNumber || 'INV-001'}</Text>
                            </View>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#ffffff', marginBottom: 4 }}>{data.senderName}</Text>
                            {data.senderEmail && <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)' }}>{data.senderEmail}</Text>}
                            {data.senderPhone && <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)' }}>{data.senderPhone}</Text>}
                        </View>
                    </View>

                    <View style={{ padding: 40 }}>
                        {/* 3 Col Meta */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 }}>
                            <View style={{ width: '30%' }}>
                                <Text style={{ fontSize: 9, fontWeight: 'bold', color: colors.textMuted, textTransform: 'uppercase', marginBottom: 6 }}>From</Text>
                                <Text style={{ fontSize: 11, fontWeight: 'bold', color: colors.text, marginBottom: 4 }}>{data.senderName}</Text>
                                {data.senderAddress && <Text style={{ fontSize: 10, color: colors.textMuted, lineHeight: 1.4 }}>{data.senderAddress}</Text>}
                            </View>
                            <View style={{ width: '30%' }}>
                                <Text style={{ fontSize: 9, fontWeight: 'bold', color: colors.textMuted, textTransform: 'uppercase', marginBottom: 6 }}>Bill To</Text>
                                <Text style={{ fontSize: 11, fontWeight: 'bold', color: colors.text, marginBottom: 4 }}>{data.clientName}</Text>
                                {data.clientAddress && <Text style={{ fontSize: 10, color: colors.textMuted, lineHeight: 1.4 }}>{data.clientAddress}</Text>}
                            </View>
                            <View style={{ width: '30%' }}>
                                <Text style={{ fontSize: 9, fontWeight: 'bold', color: colors.textMuted, textTransform: 'uppercase', marginBottom: 6 }}>Details</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                                    <Text style={{ fontSize: 10, color: colors.textMuted }}>{dateLabel}</Text>
                                    <Text style={{ fontSize: 10, fontWeight: 'bold', color: colors.text }}>{formatDate(data.invoiceDate, data.currency.locale)}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ fontSize: 10, color: colors.textMuted }}>{dueDateLabel}</Text>
                                    <Text style={{ fontSize: 10, fontWeight: 'bold', color: colors.text }}>{formatDate(data.dueDate, data.currency.locale)}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Table */}
                        <View style={{ marginBottom: 30 }}>
                            <View style={{ flexDirection: 'row', borderBottomWidth: 2, borderBottomColor: colors.primary, paddingBottom: 10, marginBottom: 10 }}>
                                <Text style={{ width: '40%', fontSize: 9, fontWeight: 'bold', color: colors.textMuted, textTransform: 'uppercase' }}>Description</Text>
                                <Text style={{ width: '20%', fontSize: 9, fontWeight: 'bold', color: colors.textMuted, textTransform: 'uppercase', textAlign: 'center' }}>Qty</Text>
                                <Text style={{ width: '20%', fontSize: 9, fontWeight: 'bold', color: colors.textMuted, textTransform: 'uppercase', textAlign: 'right' }}>Price</Text>
                                <Text style={{ width: '20%', fontSize: 9, fontWeight: 'bold', color: colors.textMuted, textTransform: 'uppercase', textAlign: 'right' }}>Amount</Text>
                            </View>
                            {data.lineItems.map((item, index) => (
                                <View key={index} style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: 10 }}>
                                    <Text style={{ width: '40%', fontSize: 11, color: colors.text }}>{item.description || `Item ${index + 1}`}</Text>
                                    <Text style={{ width: '20%', fontSize: 11, color: colors.textMuted, textAlign: 'center' }}>{item.quantity}</Text>
                                    <Text style={{ width: '20%', fontSize: 11, color: colors.textMuted, textAlign: 'right' }}>{formatCurrency(item.unitPrice, data.currency)}</Text>
                                    <Text style={{ width: '20%', fontSize: 11, fontWeight: 'bold', color: colors.text, textAlign: 'right' }}>{formatCurrency(item.quantity * item.unitPrice, data.currency)}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Footer Section */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ width: '50%' }}>
                                {(data.bankName || data.accountNumber || data.paymentMethod) && (
                                    <View style={{ marginBottom: 20 }}>
                                        <Text style={{ fontSize: 9, fontWeight: 'bold', color: colors.textMuted, textTransform: 'uppercase', marginBottom: 5 }}>Payment Info</Text>
                                        <Text style={{ fontSize: 10, color: colors.text }}>Method: {getPaymentMethodLabel(data.paymentMethod)}</Text>
                                        {data.paymentMethod !== 'cash' && (
                                            <>
                                                {data.bankName && <Text style={{ fontSize: 10, color: colors.text }}>Bank: {data.bankName}</Text>}
                                                {data.accountNumber && <Text style={{ fontSize: 10, color: colors.text }}>Acct: {data.accountNumber}</Text>}
                                            </>
                                        )}
                                    </View>
                                )}
                                {data.notes && (
                                    <View>
                                        <Text style={{ fontSize: 9, fontWeight: 'bold', color: colors.textMuted, textTransform: 'uppercase', marginBottom: 5 }}>Notes</Text>
                                        <Text style={{ fontSize: 10, color: colors.text, lineHeight: 1.4 }}>{data.notes}</Text>
                                    </View>
                                )}
                            </View>

                            <View style={{ width: '40%', backgroundColor: colors.background || '#f9f9f9', padding: 15, borderRadius: 5 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                                    <Text style={{ fontSize: 10, color: colors.textMuted }}>Subtotal</Text>
                                    <Text style={{ fontSize: 10, fontWeight: 'bold', color: colors.text }}>{formatCurrency(subtotal, data.currency)}</Text>
                                </View>
                                {taxAmount > 0 && (
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                                        <Text style={{ fontSize: 10, color: colors.textMuted }}>{data.tax.name} ({data.tax.rate}%)</Text>
                                        <Text style={{ fontSize: 10, fontWeight: 'bold', color: colors.text }}>{formatCurrency(taxAmount, data.currency)}</Text>
                                    </View>
                                )}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderTopWidth: 2, borderTopColor: colors.primary, marginTop: 5 }}>
                                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: colors.text }}>Total</Text>
                                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: colors.primary }}>{formatCurrency(total, data.currency)}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Footer Banner - Absolute Bottom */}
                    <View style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: colors.primary,
                        padding: 15,
                        alignItems: 'center'
                    }}>
                        <Text style={{ color: '#ffffff', fontSize: 10 }}>{footerText}</Text>
                    </View>
                </Page>
            </Document>
        );
    }

    // Sidebar Layout
    if (isSidebar) {
        return (
            <Document>
                <Page size="A4" style={styles.page}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf Image doesn't support alt */}
                            {showLogo && <Image src={logoUrl} style={styles.logo} />}
                            <View>
                                <Text style={styles.documentTitle}>{documentTitle}</Text>
                                <Text style={styles.invoiceNumber}>#{data.invoiceNumber || 'INV-001'}</Text>
                            </View>
                        </View>
                        <View style={styles.companyInfo}>
                            <Text style={styles.companyName}>{data.senderName || 'Your Business Name'}</Text>
                            {data.senderEmail && <Text style={styles.companyDetail}>{data.senderEmail}</Text>}
                            {data.senderPhone && <Text style={styles.companyDetail}>{data.senderPhone}</Text>}
                        </View>
                    </View>

                    {/* Two Column Layout */}
                    <View style={styles.sidebarContainer}>
                        {/* Main Content */}
                        <View style={styles.sidebarMain}>
                            {/* Client Info */}
                            <View style={{ marginBottom: 20 }}>
                                <Text style={styles.sectionLabel}>Bill To</Text>
                                <Text style={styles.clientName}>{data.clientName || 'Client Name'}</Text>
                                {data.clientEmail && <Text style={styles.clientDetail}>{data.clientEmail}</Text>}
                                {data.clientAddress && <Text style={styles.clientDetail}>{data.clientAddress}</Text>}
                            </View>

                            {/* Dates */}
                            <View style={{ flexDirection: 'row', gap: 30, marginBottom: 20 }}>
                                <View>
                                    <Text style={{ fontSize: 9, color: colors.textMuted, marginBottom: 2 }}>{dateLabel}</Text>
                                    <Text style={{ fontSize: 11, fontWeight: 'normal', color: colors.text }}>
                                        {formatDate(data.invoiceDate, data.currency.locale) || 'Not set'}
                                    </Text>
                                </View>
                                <View>
                                    <Text style={{ fontSize: 9, color: colors.textMuted, marginBottom: 2 }}>{dueDateLabel}</Text>
                                    <Text style={{ fontSize: 11, fontWeight: 'normal', color: colors.text }}>
                                        {formatDate(data.dueDate, data.currency.locale) || 'Not set'}
                                    </Text>
                                </View>
                            </View>

                            {/* Items Table */}
                            <View style={styles.table}>
                                <View style={styles.tableHeader}>
                                    <Text style={[styles.colDescription, styles.headerText]}>Description</Text>
                                    <Text style={[styles.colQty, styles.headerText]}>Qty</Text>
                                    <Text style={[styles.colPrice, styles.headerText]}>Price</Text>
                                    <Text style={[styles.colAmount, styles.headerText]}>Amount</Text>
                                </View>
                                {data.lineItems.map((item, index) => (
                                    <View key={item.id} style={styles.tableRow} wrap={false}>
                                        <Text style={styles.colDescription}>{item.description || `Item ${index + 1}`}</Text>
                                        <Text style={styles.colQty}>{item.quantity}</Text>
                                        <Text style={styles.colPrice}>{formatCurrency(item.unitPrice, data.currency)}</Text>
                                        <Text style={styles.colAmount}>
                                            {formatCurrency(Number(item.quantity) * Number(item.unitPrice), data.currency)}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* Sidebar Panel */}
                        <View style={styles.sidebarPanel}>
                            {/* Totals */}
                            <View style={{ marginBottom: 20 }}>
                                <Text style={styles.sidebarSectionTitle}>Summary</Text>
                                <View style={styles.sidebarRow}>
                                    <Text style={styles.sidebarLabel}>Subtotal</Text>
                                    <Text style={styles.sidebarValue}>{formatCurrency(subtotal, data.currency)}</Text>
                                </View>
                                {data.tax.enabled && (
                                    <View style={styles.sidebarRow}>
                                        <Text style={styles.sidebarLabel}>{data.tax.name}</Text>
                                        <Text style={styles.sidebarValue}>{formatCurrency(taxAmount, data.currency)}</Text>
                                    </View>
                                )}
                                <View style={styles.sidebarTotal}>
                                    <Text style={styles.sidebarTotalLabel}>Total</Text>
                                    <Text style={styles.sidebarTotalValue}>{formatCurrency(total, data.currency)}</Text>
                                </View>
                            </View>

                            {/* QR Code */}
                            {data.paymentQR?.enabled && qrCodeDataUrl && (
                                <View style={{ marginBottom: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                                    {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf Image doesn't support alt */}
                                    <Image src={qrCodeDataUrl} style={styles.sidebarQR} />
                                    <Text style={{ fontSize: 9, color: colors.textMuted, textAlign: 'center' }}>
                                        {data.paymentQR.label || 'Scan to Pay'}
                                    </Text>
                                </View>
                            )}

                            {/* Payment Details */}
                            <View style={{ marginBottom: 15 }}>
                                <Text style={styles.sidebarSectionTitle}>Payment Info</Text>
                                <View style={{ flexDirection: 'row', marginBottom: 4 }}>
                                    <Text style={{ fontSize: 9, color: colors.textMuted, width: 45 }}>Method:</Text>
                                    <Text style={{ fontSize: 9, color: colors.text }}>{getPaymentMethodLabel(data.paymentMethod)}</Text>
                                </View>
                                {data.paymentMethod !== 'cash' && (
                                    <>
                                        {data.bankName && (
                                            <View style={{ flexDirection: 'row', marginBottom: 4 }}>
                                                <Text style={{ fontSize: 9, color: colors.textMuted, width: 45 }}>Bank:</Text>
                                                <Text style={{ fontSize: 9, color: colors.text }}>{data.bankName}</Text>
                                            </View>
                                        )}
                                        {data.accountNumber && (
                                            <View style={{ flexDirection: 'row', marginBottom: 4 }}>
                                                <Text style={{ fontSize: 9, color: colors.textMuted, width: 45 }}>Account:</Text>
                                                <Text style={{ fontSize: 9, color: colors.text }}>{data.accountNumber}</Text>
                                            </View>
                                        )}
                                    </>
                                )}
                            </View>

                            {/* Notes */}
                            {data.notes && (
                                <View>
                                    <Text style={styles.sidebarSectionTitle}>Notes</Text>
                                    <Text style={{ fontSize: 9, color: colors.textMuted, lineHeight: 1.4 }}>{data.notes}</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>{footerText}</Text>
                    </View>

                </Page>
            </Document>
        );
    }

    // Minimal Layout - center-aligned, elegant, generous whitespace
    if (isMinimal) {
        return (
            <Document>
                <Page size="A4" style={styles.page}>
                    {/* Centered Header */}
                    <View style={{ alignItems: 'center', marginBottom: 24 }}>
                        {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf Image doesn't support alt */}
                        {showLogo && <Image src={logoUrl} style={{ maxHeight: 48, maxWidth: 120, marginBottom: 10 }} />}
                        <Text style={{ fontSize: 22, fontWeight: 'bold', letterSpacing: 3, color: colors.text, textTransform: 'uppercase' }}>
                            {documentTitle}
                        </Text>
                        <Text style={{ fontSize: 10, color: colors.textMuted, marginTop: 4 }}>
                            #{data.invoiceNumber || 'INV-001'}
                        </Text>
                    </View>

                    {/* Thin separator */}
                    <View style={{ borderBottomWidth: 0.5, borderBottomColor: colors.border, marginBottom: 20 }} />

                    {/* Two-column: Sender left, Client right */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 8, fontWeight: 'bold', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>From</Text>
                            <Text style={{ fontSize: 10, fontWeight: 'bold', color: colors.text, marginBottom: 2 }}>{data.senderName || 'Your Business Name'}</Text>
                            {data.senderEmail && <Text style={{ fontSize: 9, color: colors.textMuted }}>{data.senderEmail}</Text>}
                            {data.senderPhone && <Text style={{ fontSize: 9, color: colors.textMuted }}>{data.senderPhone}</Text>}
                            {data.senderAddress && <Text style={{ fontSize: 9, color: colors.textMuted }}>{data.senderAddress}</Text>}
                            {data.registrationNumber && <Text style={{ fontSize: 8, color: colors.textMuted, marginTop: 3 }}>Reg: {data.registrationNumber}</Text>}
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <Text style={{ fontSize: 8, fontWeight: 'bold', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Bill To</Text>
                            <Text style={{ fontSize: 10, fontWeight: 'bold', color: colors.text, marginBottom: 2 }}>{data.clientName || 'Client Name'}</Text>
                            {data.clientEmail && <Text style={{ fontSize: 9, color: colors.textMuted }}>{data.clientEmail}</Text>}
                            {data.clientAddress && <Text style={{ fontSize: 9, color: colors.textMuted }}>{data.clientAddress}</Text>}
                        </View>
                    </View>

                    {/* Centered dates */}
                    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 30, marginBottom: 20 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 9, color: colors.textMuted }}>{dateLabel} </Text>
                            <Text style={{ fontSize: 9, fontWeight: 'bold', color: colors.text }}>{formatDate(data.invoiceDate, data.currency.locale) || 'Not set'}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 9, color: colors.textMuted }}>{dueDateLabel} </Text>
                            <Text style={{ fontSize: 9, fontWeight: 'bold', color: colors.text }}>{formatDate(data.dueDate, data.currency.locale) || 'Not set'}</Text>
                        </View>
                    </View>

                    {/* Thin separator */}
                    <View style={{ borderBottomWidth: 0.5, borderBottomColor: colors.border, marginBottom: 0 }} />

                    {/* Table */}
                    <View style={styles.table}>
                        <View style={{ flexDirection: 'row', paddingVertical: 8 }}>
                            <Text style={{ flex: 3, fontSize: 8, fontWeight: 'bold', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>Description</Text>
                            <Text style={{ flex: 1, fontSize: 8, fontWeight: 'bold', color: colors.textMuted, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.5 }}>Qty</Text>
                            <Text style={{ flex: 1.5, fontSize: 8, fontWeight: 'bold', color: colors.textMuted, textAlign: 'right', textTransform: 'uppercase', letterSpacing: 0.5 }}>Price</Text>
                            <Text style={{ flex: 1.5, fontSize: 8, fontWeight: 'bold', color: colors.textMuted, textAlign: 'right', textTransform: 'uppercase', letterSpacing: 0.5 }}>Amount</Text>
                        </View>
                        {data.lineItems.map((item, index) => (
                            <View key={item.id} style={{ flexDirection: 'row', borderTopWidth: 0.5, borderTopColor: colors.border, paddingVertical: 7 }} wrap={false}>
                                <Text style={{ flex: 3, fontSize: 9, color: colors.text }}>{item.description || `Item ${index + 1}`}</Text>
                                <Text style={{ flex: 1, fontSize: 9, color: colors.textMuted, textAlign: 'center' }}>{item.quantity}</Text>
                                <Text style={{ flex: 1.5, fontSize: 9, color: colors.textMuted, textAlign: 'right' }}>{formatCurrency(item.unitPrice, data.currency)}</Text>
                                <Text style={{ flex: 1.5, fontSize: 9, color: colors.text, textAlign: 'right' }}>{formatCurrency(Number(item.quantity) * Number(item.unitPrice), data.currency)}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Totals */}
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 20 }}>
                        <View style={{ width: 180, marginLeft: 'auto' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 }}>
                                <Text style={{ fontSize: 9, color: colors.textMuted }}>Subtotal</Text>
                                <Text style={{ fontSize: 9, color: colors.text }}>{formatCurrency(subtotal, data.currency)}</Text>
                            </View>
                            {data.tax.enabled && (
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 }}>
                                    <Text style={{ fontSize: 9, color: colors.textMuted }}>{data.tax.name} ({data.tax.rate}%)</Text>
                                    <Text style={{ fontSize: 9, color: colors.text }}>{formatCurrency(taxAmount, data.currency)}</Text>
                                </View>
                            )}
                            <View style={{ borderTopWidth: 0.5, borderTopColor: colors.text, marginTop: 4 }} />
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 }}>
                                <Text style={{ fontSize: 12, fontWeight: 'bold', color: colors.text }}>Total</Text>
                                <Text style={{ fontSize: 12, fontWeight: 'bold', color: colors.text }}>{formatCurrency(total, data.currency)}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Payment Details */}
                    <View style={styles.bankSection} wrap={false}>
                        <Text style={{ fontSize: 8, fontWeight: 'bold', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Payment Details</Text>
                        <View style={styles.bankGrid}>
                            <View style={styles.bankItem}><Text style={styles.bankLabel}>Method:</Text><Text style={styles.bankValue}>{getPaymentMethodLabel(data.paymentMethod)}</Text></View>
                            {data.paymentMethod !== 'cash' && (
                                <>
                                    {data.bankName && <View style={styles.bankItem}><Text style={styles.bankLabel}>Bank:</Text><Text style={styles.bankValue}>{data.bankName}</Text></View>}
                                    {data.accountNumber && <View style={styles.bankItem}><Text style={styles.bankLabel}>Account:</Text><Text style={styles.bankValue}>{data.accountNumber}</Text></View>}
                                    {data.branchCode && <View style={styles.bankItem}><Text style={styles.bankLabel}>Branch:</Text><Text style={styles.bankValue}>{data.branchCode}</Text></View>}
                                </>
                            )}
                        </View>
                    </View>

                    {data.notes && (
                        <View style={styles.notesSection} wrap={false}>
                            <Text style={{ fontSize: 8, fontWeight: 'bold', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Notes</Text>
                            <Text style={styles.notesText}>{data.notes}</Text>
                        </View>
                    )}

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>{footerText}</Text>
                    </View>

                </Page>
            </Document>
        );
    }

    // Compact Layout - dense, efficient, three-column info
    if (isCompact) {
        return (
            <Document>
                <Page size="A4" style={styles.page}>
                    {/* Dense Header Bar */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.headerBg || '#f8fafc', marginTop: -30, marginLeft: -30, marginRight: -30, paddingHorizontal: 30, paddingVertical: 10, borderBottomWidth: 1.5, borderBottomColor: colors.border, marginBottom: 12 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf Image doesn't support alt */}
                            {showLogo && <Image src={logoUrl} style={{ maxHeight: 30, maxWidth: 80 }} />}
                            <Text style={{ fontSize: 13, fontWeight: 'bold', color: colors.text }}>{documentTitle}</Text>
                            <Text style={{ fontSize: 9, color: colors.textMuted }}>#{data.invoiceNumber || 'INV-001'}</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={{ fontSize: 10, fontWeight: 'bold', color: colors.text }}>{data.senderName || 'Your Business Name'}</Text>
                            {data.registrationNumber && <Text style={{ fontSize: 7, color: colors.textMuted }}>Reg: {data.registrationNumber}</Text>}
                        </View>
                    </View>

                    {/* Three-column info: Sender | Client | Dates */}
                    <View style={{ flexDirection: 'row', gap: 12, marginBottom: 10 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 7, fontWeight: 'bold', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 }}>From</Text>
                            {data.senderEmail && <Text style={{ fontSize: 8, color: colors.textMuted }}>{data.senderEmail}</Text>}
                            {data.senderPhone && <Text style={{ fontSize: 8, color: colors.textMuted }}>{data.senderPhone}</Text>}
                            {data.senderAddress && <Text style={{ fontSize: 8, color: colors.textMuted }}>{data.senderAddress}</Text>}
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 7, fontWeight: 'bold', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 }}>Bill To</Text>
                            <Text style={{ fontSize: 9, fontWeight: 'bold', color: colors.text, marginBottom: 1 }}>{data.clientName || 'Client Name'}</Text>
                            {data.clientEmail && <Text style={{ fontSize: 8, color: colors.textMuted }}>{data.clientEmail}</Text>}
                            {data.clientAddress && <Text style={{ fontSize: 8, color: colors.textMuted }}>{data.clientAddress}</Text>}
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 7, fontWeight: 'bold', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 }}>Details</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                                <Text style={{ fontSize: 8, color: colors.textMuted }}>{dateLabel}</Text>
                                <Text style={{ fontSize: 8, fontWeight: 'bold', color: colors.text }}>{formatDate(data.invoiceDate, data.currency.locale) || 'Not set'}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontSize: 8, color: colors.textMuted }}>{dueDateLabel}</Text>
                                <Text style={{ fontSize: 8, fontWeight: 'bold', color: colors.text }}>{formatDate(data.dueDate, data.currency.locale) || 'Not set'}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Dense table with grey header */}
                    <View style={styles.table}>
                        <View style={{ flexDirection: 'row', backgroundColor: colors.headerBg || '#f8fafc', paddingVertical: 5, paddingHorizontal: 6, borderBottomWidth: 0.5, borderBottomColor: colors.border }}>
                            <Text style={{ flex: 3, fontSize: 7, fontWeight: 'bold', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>Description</Text>
                            <Text style={{ flex: 0.8, fontSize: 7, fontWeight: 'bold', color: colors.textMuted, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.5 }}>Qty</Text>
                            <Text style={{ flex: 1.5, fontSize: 7, fontWeight: 'bold', color: colors.textMuted, textAlign: 'right', textTransform: 'uppercase', letterSpacing: 0.5 }}>Price</Text>
                            <Text style={{ flex: 1.5, fontSize: 7, fontWeight: 'bold', color: colors.textMuted, textAlign: 'right', textTransform: 'uppercase', letterSpacing: 0.5 }}>Amount</Text>
                        </View>
                        {data.lineItems.map((item, index) => (
                            <View key={item.id} style={{ flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: colors.border, paddingVertical: 4, paddingHorizontal: 6 }} wrap={false}>
                                <Text style={{ flex: 3, fontSize: 8, color: colors.text }}>{item.description || `Item ${index + 1}`}</Text>
                                <Text style={{ flex: 0.8, fontSize: 8, color: colors.textMuted, textAlign: 'center' }}>{item.quantity}</Text>
                                <Text style={{ flex: 1.5, fontSize: 8, color: colors.textMuted, textAlign: 'right' }}>{formatCurrency(item.unitPrice, data.currency)}</Text>
                                <Text style={{ flex: 1.5, fontSize: 8, fontWeight: 'bold', color: colors.text, textAlign: 'right' }}>{formatCurrency(Number(item.quantity) * Number(item.unitPrice), data.currency)}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Compact Totals */}
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 12 }}>
                        <View style={{ width: 180, marginLeft: 'auto' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 }}>
                                <Text style={{ fontSize: 8, color: colors.textMuted }}>Subtotal</Text>
                                <Text style={{ fontSize: 8, color: colors.text }}>{formatCurrency(subtotal, data.currency)}</Text>
                            </View>
                            {data.tax.enabled && (
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 }}>
                                    <Text style={{ fontSize: 8, color: colors.textMuted }}>{data.tax.name} ({data.tax.rate}%)</Text>
                                    <Text style={{ fontSize: 8, color: colors.text }}>{formatCurrency(taxAmount, data.currency)}</Text>
                                </View>
                            )}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, paddingHorizontal: 6, backgroundColor: colors.headerBg || '#f8fafc', borderRadius: 3, marginTop: 3 }}>
                                <Text style={{ fontSize: 10, fontWeight: 'bold', color: colors.text }}>Total</Text>
                                <Text style={{ fontSize: 10, fontWeight: 'bold', color: colors.text }}>{formatCurrency(total, data.currency)}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Payment & Notes side by side */}
                    <View style={{ flexDirection: 'row', gap: 12, borderTopWidth: 0.5, borderTopColor: colors.border, paddingTop: 8 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 7, fontWeight: 'bold', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 }}>Payment Details</Text>
                            <View style={{ flexDirection: 'row' }}><Text style={{ fontSize: 8, color: colors.textMuted }}>Method: </Text><Text style={{ fontSize: 8, color: colors.text, fontWeight: 'bold' }}>{getPaymentMethodLabel(data.paymentMethod)}</Text></View>
                            {data.paymentMethod !== 'cash' && (
                                <>
                                    {data.bankName && <View style={{ flexDirection: 'row' }}><Text style={{ fontSize: 8, color: colors.textMuted }}>Bank: </Text><Text style={{ fontSize: 8, color: colors.text }}>{data.bankName}</Text></View>}
                                    {data.accountNumber && <View style={{ flexDirection: 'row' }}><Text style={{ fontSize: 8, color: colors.textMuted }}>Account: </Text><Text style={{ fontSize: 8, color: colors.text }}>{data.accountNumber}</Text></View>}
                                    {data.branchCode && <View style={{ flexDirection: 'row' }}><Text style={{ fontSize: 8, color: colors.textMuted }}>Branch: </Text><Text style={{ fontSize: 8, color: colors.text }}>{data.branchCode}</Text></View>}
                                </>
                            )}
                        </View>
                        {data.notes && (
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 7, fontWeight: 'bold', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 }}>Notes</Text>
                                <Text style={{ fontSize: 8, color: colors.text }}>{data.notes}</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>{footerText}</Text>
                    </View>

                </Page>
            </Document>
        );
    }

    // Standard/Modern Layout - accent bar, colored table header
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header Image (Letterhead) */}
                {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf Image doesn't support alt */}
                {showHeaderImage && <Image src={headerImageUrl} style={styles.headerImage} />}

                {/* Accent bar at top */}
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, backgroundColor: colors.accent }} />

                <View style={[styles.header, { marginTop: 4 }]}>
                    <View style={styles.headerLeft}>
                        {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf Image doesn't support alt */}
                        {showLogo && <Image src={logoUrl} style={styles.logo} />}
                        <View>
                            <Text style={[styles.documentTitle, { color: colors.accent }]}>{documentTitle}</Text>
                            <Text style={styles.invoiceNumber}>#{data.invoiceNumber || 'INV-001'}</Text>
                        </View>
                    </View>
                    <View style={styles.companyInfo}>
                        <Text style={styles.companyName}>{data.senderName || 'Your Business Name'}</Text>
                        {data.senderEmail && <Text style={styles.companyDetail}>{data.senderEmail}</Text>}
                        {data.senderPhone && <Text style={styles.companyDetail}>{data.senderPhone}</Text>}
                        {data.senderAddress && <Text style={styles.companyDetail}>{data.senderAddress}</Text>}
                        {data.registrationNumber && <Text style={styles.companyDetail}>Reg: {data.registrationNumber}</Text>}
                        {data.tax.enabled && data.registrationNumber && <Text style={styles.companyDetail}>{data.tax.name} No: {data.registrationNumber}</Text>}
                    </View>
                </View>

                <View style={styles.metaRow}>
                    <View style={styles.billTo}>
                        <Text style={[styles.sectionLabel, { color: colors.accent }]}>Bill To</Text>
                        <Text style={styles.clientName}>{data.clientName || 'Client Name'}</Text>
                        {data.clientEmail && <Text style={styles.clientDetail}>{data.clientEmail}</Text>}
                        {data.clientAddress && <Text style={styles.clientDetail}>{data.clientAddress}</Text>}
                    </View>
                    <View style={styles.dateInfo}>
                        <View style={styles.dateRow}>
                            <Text style={styles.dateLabel}>{dateLabel}</Text>
                            <Text style={styles.dateValue}>{formatDate(data.invoiceDate, data.currency.locale) || 'Not set'}</Text>
                        </View>
                        <View style={styles.dateRow}>
                            <Text style={styles.dateLabel}>{dueDateLabel}</Text>
                            <Text style={styles.dateValue}>{formatDate(data.dueDate, data.currency.locale) || 'Not set'}</Text>
                        </View>
                    </View>
                </View>

                {/* Table with colored header */}
                <View style={styles.table}>
                    <View style={{ flexDirection: 'row', backgroundColor: colors.accent, paddingVertical: 7, paddingHorizontal: 8, borderRadius: 4 }}>
                        <Text style={{ flex: 3, fontSize: 8, fontWeight: 'bold', color: '#ffffff', textTransform: 'uppercase', letterSpacing: 0.5 }}>Description</Text>
                        <Text style={{ flex: 1, fontSize: 8, fontWeight: 'bold', color: '#ffffff', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.5 }}>Qty</Text>
                        <Text style={{ flex: 1.5, fontSize: 8, fontWeight: 'bold', color: '#ffffff', textAlign: 'right', textTransform: 'uppercase', letterSpacing: 0.5 }}>Price</Text>
                        <Text style={{ flex: 1.5, fontSize: 8, fontWeight: 'bold', color: '#ffffff', textAlign: 'right', textTransform: 'uppercase', letterSpacing: 0.5 }}>Amount</Text>
                    </View>
                    {data.lineItems.map((item, index) => {
                        const qty = Number(item.quantity) || 0;
                        const price = Number(item.unitPrice) || 0;
                        const amount = qty * price;
                        return (
                            <View key={item.id} style={styles.tableRow} wrap={false}>
                                <Text style={styles.colDescription}>{item.description || `Item ${index + 1}`}</Text>
                                <Text style={styles.colQty}>{qty}</Text>
                                <Text style={styles.colPrice}>{formatCurrency(price, data.currency)}</Text>
                                <Text style={styles.colAmount}>
                                    {amount > 0 ? formatCurrency(amount, data.currency) : `${data.currency?.symbol || '$'}0.00`}
                                </Text>
                            </View>
                        );
                    })}
                </View>

                {/* Totals with accent border */}
                <View style={styles.totalsSection}>
                    {data.paymentQR?.enabled && qrCodeDataUrl ? (
                        <View style={{ marginRight: 24 }}>
                            {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf Image doesn't support alt */}
                            <Image src={qrCodeDataUrl} style={styles.qrCode} />
                            <Text style={styles.qrLabel}>{data.paymentQR.label || 'Scan to Pay'}</Text>
                        </View>
                    ) : null}

                    <View style={styles.totalsBox}>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Subtotal</Text>
                            <Text style={styles.totalValue}>{formatCurrency(subtotal, data.currency)}</Text>
                        </View>
                        {data.tax.enabled && (
                            <View style={styles.totalRow}>
                                <Text style={styles.totalLabel}>{data.tax.name} ({data.tax.rate}%)</Text>
                                <Text style={styles.totalValue}>{formatCurrency(taxAmount, data.currency)}</Text>
                            </View>
                        )}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, paddingHorizontal: 8, borderLeftWidth: 3, borderLeftColor: colors.accent, borderRadius: 2, marginTop: 6 }} wrap={false}>
                            <Text style={styles.grandTotalLabel}>Total</Text>
                            <Text style={[styles.grandTotalValue, { color: colors.accent }]}>{formatCurrency(total, data.currency)}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.bankSection} wrap={false}>
                    <Text style={[styles.sectionLabel, { color: colors.accent }]}>Payment Details</Text>
                    <View style={styles.bankGrid}>
                        <View style={styles.bankItem}>
                            <Text style={styles.bankLabel}>Method:</Text>
                            <Text style={styles.bankValue}>{getPaymentMethodLabel(data.paymentMethod)}</Text>
                        </View>
                        {data.paymentMethod !== 'cash' && (
                            <>
                                {data.bankName && (
                                    <View style={styles.bankItem}>
                                        <Text style={styles.bankLabel}>Bank:</Text>
                                        <Text style={styles.bankValue}>{data.bankName}</Text>
                                    </View>
                                )}
                                {data.accountNumber && (
                                    <View style={styles.bankItem}>
                                        <Text style={styles.bankLabel}>Account:</Text>
                                        <Text style={styles.bankValue}>{data.accountNumber}</Text>
                                    </View>
                                )}
                                {data.accountType && (
                                    <View style={styles.bankItem}>
                                        <Text style={styles.bankLabel}>Type:</Text>
                                        <Text style={styles.bankValue}>{data.accountType.charAt(0).toUpperCase() + data.accountType.slice(1)}</Text>
                                    </View>
                                )}
                                {data.branchCode && (
                                    <View style={styles.bankItem}>
                                        <Text style={styles.bankLabel}>Branch:</Text>
                                        <Text style={styles.bankValue}>{data.branchCode}</Text>
                                    </View>
                                )}
                                {data.paymentReference && (
                                    <View style={styles.bankItem}>
                                        <Text style={styles.bankLabel}>Reference:</Text>
                                        <Text style={[styles.bankValue, { fontWeight: 'bold' }]}>{data.paymentReference}</Text>
                                    </View>
                                )}
                            </>
                        )}
                    </View>
                </View>

                {data.notes && (
                    <View style={styles.notesSection} wrap={false}>
                        <Text style={[styles.sectionLabel, { color: colors.accent }]}>Notes</Text>
                        <Text style={styles.notesText}>{data.notes}</Text>
                    </View>
                )}

                <View style={styles.footer}>
                    <Text style={styles.footerText}>{footerText}</Text>
                </View>

            </Page>
        </Document>
    );
}

