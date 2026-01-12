'use client';

import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
} from '@react-pdf/renderer';
import { InvoiceData, TemplateType } from '@/types/invoice';

// Format currency for PDF (can't use Intl in react-pdf)
const formatCurrency = (amount: number): string => {
    return `R ${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Format date for PDF
const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

// Template color schemes
const templateColors: Record<TemplateType, {
    primary: string;
    accent: string;
    gray900: string;
    gray600: string;
    gray500: string;
    gray400: string;
    gray200: string;
    gray100: string;
}> = {
    modern: {
        primary: '#059669',
        accent: '#059669',
        gray900: '#111827',
        gray600: '#4b5563',
        gray500: '#6b7280',
        gray400: '#9ca3af',
        gray200: '#e5e7eb',
        gray100: '#f3f4f6',
    },
    classic: {
        primary: '#1e3a5f',
        accent: '#b8860b',
        gray900: '#1e293b',
        gray600: '#475569',
        gray500: '#64748b',
        gray400: '#94a3b8',
        gray200: '#e2e8f0',
        gray100: '#f1f5f9',
    },
    minimal: {
        primary: '#18181b',
        accent: '#18181b',
        gray900: '#18181b',
        gray600: '#52525b',
        gray500: '#71717a',
        gray400: '#a1a1aa',
        gray200: '#e4e4e7',
        gray100: '#f4f4f5',
    },
};

interface InvoicePDFProps {
    data: InvoiceData;
    logoUrl?: string | null;
}

// Create base styles
const createStyles = (colors: typeof templateColors.modern) =>
    StyleSheet.create({
        page: {
            padding: 40, // ~15mm margins
            fontFamily: 'Helvetica',
            fontSize: 10,
            backgroundColor: '#ffffff',
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 30,
        },
        headerLeft: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 12,
        },
        logo: {
            maxWidth: 80,
            maxHeight: 40,
            objectFit: 'contain',
        },
        documentTitle: {
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.gray900,
        },
        invoiceNumber: {
            color: colors.gray500,
            marginTop: 4,
            fontSize: 10,
        },
        companyInfo: {
            textAlign: 'right',
        },
        companyName: {
            fontSize: 16,
            fontWeight: 'bold',
            color: colors.accent,
        },
        companyDetail: {
            color: colors.gray600,
            fontSize: 9,
            marginTop: 2,
        },
        metaRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 30,
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
            color: colors.gray400,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            marginBottom: 6,
        },
        clientName: {
            color: colors.gray900,
            fontWeight: 'bold',
            marginBottom: 3,
        },
        clientDetail: {
            color: colors.gray600,
            fontSize: 9,
            marginTop: 2,
        },
        dateRow: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginBottom: 4,
        },
        dateLabel: {
            color: colors.gray500,
            fontSize: 9,
            marginRight: 8,
        },
        dateValue: {
            color: colors.gray900,
            fontSize: 9,
            fontWeight: 'medium',
        },
        table: {
            marginBottom: 30,
        },
        tableHeader: {
            flexDirection: 'row',
            borderBottomWidth: 2,
            borderBottomColor: colors.gray200,
            paddingBottom: 8,
            marginBottom: 8,
        },
        tableRow: {
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderBottomColor: colors.gray100,
            paddingVertical: 8,
        },
        colDescription: {
            flex: 3,
            color: colors.gray900,
        },
        colQty: {
            flex: 1,
            textAlign: 'center',
            color: colors.gray600,
        },
        colPrice: {
            flex: 1.5,
            textAlign: 'right',
            color: colors.gray600,
        },
        colAmount: {
            flex: 1.5,
            textAlign: 'right',
            color: colors.gray900,
            fontWeight: 'medium',
        },
        headerText: {
            fontSize: 9,
            fontWeight: 'bold',
            color: colors.gray600,
        },
        totalsContainer: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
        },
        totalsBox: {
            width: 180,
        },
        totalRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 6,
        },
        totalLabel: {
            color: colors.gray600,
        },
        totalValue: {
            color: colors.gray900,
            fontWeight: 'medium',
        },
        grandTotalRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: 10,
            marginTop: 6,
            borderTopWidth: 2,
            borderTopColor: colors.gray900,
        },
        grandTotalLabel: {
            fontSize: 14,
            fontWeight: 'bold',
            color: colors.gray900,
        },
        grandTotalValue: {
            fontSize: 14,
            fontWeight: 'bold',
            color: colors.accent,
        },
        bankSection: {
            marginTop: 30,
            paddingTop: 20,
            borderTopWidth: 1,
            borderTopColor: colors.gray200,
        },
        bankGrid: {
            flexDirection: 'row',
            gap: 20,
        },
        bankItem: {
            flexDirection: 'row',
        },
        bankLabel: {
            color: colors.gray500,
            fontSize: 9,
        },
        bankValue: {
            color: colors.gray900,
            fontSize: 9,
            marginLeft: 4,
        },
        notesSection: {
            marginTop: 20,
            paddingTop: 20,
            borderTopWidth: 1,
            borderTopColor: colors.gray200,
        },
        notesText: {
            color: colors.gray600,
            fontSize: 9,
        },
        footer: {
            marginTop: 30,
            paddingTop: 20,
            borderTopWidth: 1,
            borderTopColor: colors.gray200,
            textAlign: 'center',
        },
        footerText: {
            color: colors.gray400,
            fontSize: 10,
        },
    });

export default function InvoicePDF({
    data,
    logoUrl,
}: InvoicePDFProps) {
    const colors = templateColors[data.template || 'modern'];
    const styles = createStyles(colors);

    const isQuote = data.documentType === 'quotation';
    const documentTitle = isQuote ? 'QUOTATION' : 'INVOICE';
    const dateLabel = isQuote ? 'Quote Date:' : 'Invoice Date:';
    const dueDateLabel = isQuote ? 'Valid Until:' : 'Due Date:';

    // Calculate totals
    const subtotal = data.lineItems.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0
    );
    const vatAmount = data.includeVAT ? subtotal * 0.15 : 0;
    const total = subtotal + vatAmount;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        {logoUrl && (
                            <Image src={logoUrl} style={styles.logo} />
                        )}
                        <View>
                            <Text style={styles.documentTitle}>{documentTitle}</Text>
                            <Text style={styles.invoiceNumber}>
                                #{data.invoiceNumber || 'INV-001'}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.companyInfo}>
                        <Text style={styles.companyName}>
                            {data.freelancerName || 'Your Business Name'}
                        </Text>
                        {data.freelancerEmail && (
                            <Text style={styles.companyDetail}>{data.freelancerEmail}</Text>
                        )}
                        {data.freelancerPhone && (
                            <Text style={styles.companyDetail}>{data.freelancerPhone}</Text>
                        )}
                        {data.freelancerAddress && (
                            <Text style={styles.companyDetail}>{data.freelancerAddress}</Text>
                        )}
                        {data.companyRegistration && (
                            <Text style={styles.companyDetail}>Reg: {data.companyRegistration}</Text>
                        )}
                        {data.includeVAT && data.vatNumber && (
                            <Text style={styles.companyDetail}>VAT No: {data.vatNumber}</Text>
                        )}
                    </View>
                </View>

                {/* Meta & Client */}
                <View style={styles.metaRow}>
                    <View style={styles.billTo}>
                        <Text style={styles.sectionLabel}>Bill To</Text>
                        <Text style={styles.clientName}>
                            {data.clientName || 'Client Name'}
                        </Text>
                        {data.clientEmail && (
                            <Text style={styles.clientDetail}>{data.clientEmail}</Text>
                        )}
                        {data.clientAddress && (
                            <Text style={styles.clientDetail}>{data.clientAddress}</Text>
                        )}
                    </View>
                    <View style={styles.dateInfo}>
                        <View style={styles.dateRow}>
                            <Text style={styles.dateLabel}>{dateLabel}</Text>
                            <Text style={styles.dateValue}>
                                {formatDate(data.invoiceDate) || 'Not set'}
                            </Text>
                        </View>
                        <View style={styles.dateRow}>
                            <Text style={styles.dateLabel}>{dueDateLabel}</Text>
                            <Text style={styles.dateValue}>
                                {formatDate(data.dueDate) || 'Not set'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Line Items Table */}
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.colDescription, styles.headerText]}>
                            Description
                        </Text>
                        <Text style={[styles.colQty, styles.headerText]}>Qty</Text>
                        <Text style={[styles.colPrice, styles.headerText]}>Unit Price</Text>
                        <Text style={[styles.colAmount, styles.headerText]}>Amount</Text>
                    </View>
                    {data.lineItems.map((item, index) => (
                        <View key={item.id} style={styles.tableRow} wrap={false}>
                            <Text style={styles.colDescription}>
                                {item.description || `Item ${index + 1}`}
                            </Text>
                            <Text style={styles.colQty}>{item.quantity}</Text>
                            <Text style={styles.colPrice}>{formatCurrency(item.unitPrice)}</Text>
                            <Text style={styles.colAmount}>
                                {formatCurrency(item.quantity * item.unitPrice)}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Totals */}
                <View style={styles.totalsContainer}>
                    <View style={styles.totalsBox}>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Subtotal</Text>
                            <Text style={styles.totalValue}>{formatCurrency(subtotal)}</Text>
                        </View>
                        {data.includeVAT && (
                            <View style={styles.totalRow}>
                                <Text style={styles.totalLabel}>VAT (15%)</Text>
                                <Text style={styles.totalValue}>{formatCurrency(vatAmount)}</Text>
                            </View>
                        )}
                        <View style={styles.grandTotalRow} wrap={false}>
                            <Text style={styles.grandTotalLabel}>Total</Text>
                            <Text style={styles.grandTotalValue}>{formatCurrency(total)}</Text>
                        </View>
                    </View>
                </View>

                {/* Banking Details */}
                {(data.bankName || data.accountNumber) && (
                    <View style={styles.bankSection} wrap={false}>
                        <Text style={styles.sectionLabel}>Banking Details</Text>
                        <View style={styles.bankGrid}>
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
                        </View>
                    </View>
                )}

                {/* Notes */}
                {data.notes && (
                    <View style={styles.notesSection} wrap={false}>
                        <Text style={styles.sectionLabel}>Notes</Text>
                        <Text style={styles.notesText}>{data.notes}</Text>
                    </View>
                )}

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Thank you for your business!</Text>
                </View>
            </Page>
        </Document>
    );
}
