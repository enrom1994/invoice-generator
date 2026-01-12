'use client';

import { InvoiceData } from '@/types/invoice';
import { formatCurrency } from '@/lib/utils';

interface ShareButtonsProps {
    invoiceData: InvoiceData;
}

export default function ShareButtons({ invoiceData }: ShareButtonsProps) {
    const isQuote = invoiceData.documentType === 'quotation';
    const documentLabel = isQuote ? 'Quotation' : 'Invoice';

    // Calculate total
    const subtotal = invoiceData.lineItems.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0
    );
    const vatAmount = invoiceData.includeVAT ? subtotal * 0.15 : 0;
    const total = subtotal + vatAmount;

    // Generate WhatsApp share message
    const generateWhatsAppMessage = (): string => {
        const lines = [
            `📄 *${documentLabel} #${invoiceData.invoiceNumber || 'N/A'}*`,
            '',
            `From: ${invoiceData.freelancerName || 'Your Business'}`,
            `To: ${invoiceData.clientName || 'Client'}`,
            '',
            `*Total: ${formatCurrency(total)}*`,
            invoiceData.includeVAT ? `(Incl. VAT: ${formatCurrency(vatAmount)})` : '',
            '',
            isQuote ? `Valid Until: ${invoiceData.dueDate}` : `Due Date: ${invoiceData.dueDate}`,
            '',
            '---',
            'I\'ll send the PDF shortly.',
        ].filter(Boolean);

        return lines.join('\n');
    };

    // Generate email subject and body
    const generateEmailSubject = (): string => {
        return `${documentLabel} #${invoiceData.invoiceNumber || 'N/A'} from ${invoiceData.freelancerName || 'Your Business'}`;
    };

    const generateEmailBody = (): string => {
        const lines = [
            `Dear ${invoiceData.clientName || 'Client'},`,
            '',
            `Please find attached ${documentLabel.toLowerCase()} #${invoiceData.invoiceNumber || 'N/A'}.`,
            '',
            `Total Amount: ${formatCurrency(total)}`,
            isQuote ? `Valid Until: ${invoiceData.dueDate}` : `Due Date: ${invoiceData.dueDate}`,
            '',
            'Please let me know if you have any questions.',
            '',
            'Kind regards,',
            invoiceData.freelancerName || 'Your Name',
            invoiceData.freelancerEmail ? `\n${invoiceData.freelancerEmail}` : '',
            invoiceData.freelancerPhone ? `Tel: ${invoiceData.freelancerPhone}` : '',
        ].filter(Boolean);

        return lines.join('\n');
    };

    const handleWhatsAppShare = () => {
        const message = encodeURIComponent(generateWhatsAppMessage());
        window.open(`https://wa.me/?text=${message}`, '_blank');
    };

    const handleEmailShare = () => {
        const subject = encodeURIComponent(generateEmailSubject());
        const body = encodeURIComponent(generateEmailBody());
        const to = invoiceData.clientEmail ? invoiceData.clientEmail : '';
        window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    };

    return (
        <div className="flex items-center gap-2">
            {/* WhatsApp Share */}
            <button
                onClick={handleWhatsAppShare}
                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                title="Share via WhatsApp"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
            </button>

            {/* Email Share */}
            <button
                onClick={handleEmailShare}
                className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                title="Compose Email"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            </button>
        </div>
    );
}
