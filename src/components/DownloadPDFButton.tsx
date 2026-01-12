'use client';

import { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { InvoiceData } from '@/types/invoice';
import InvoicePDF from './InvoicePDF';

interface DownloadPDFButtonProps {
    invoiceRef: React.RefObject<HTMLDivElement | null>; // Kept for backwards compatibility
    invoiceData: InvoiceData;
    logoUrl?: string | null;
}

export default function DownloadPDFButton({
    invoiceData,
    logoUrl,
}: DownloadPDFButtonProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    // Generate PDF using @react-pdf/renderer
    const generatePDF = async () => {
        setIsGenerating(true);

        try {
            // Create the PDF document
            const pdfDoc = (
                <InvoicePDF
                    data={invoiceData}
                    logoUrl={logoUrl}
                />
            );

            // Generate the PDF blob
            const blob = await pdf(pdfDoc).toBlob();

            // Generate filename with sanitized values
            const date = invoiceData.invoiceDate
                ? new Date(invoiceData.invoiceDate).toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0];
            const invoiceNum = (invoiceData.invoiceNumber || 'Invoice').replace(/[^a-zA-Z0-9-_]/g, '_');
            const filename = `${invoiceNum}_${date}.pdf`;

            // Create blob URL and open in new tab
            const blobUrl = URL.createObjectURL(blob);
            const pdfWindow = window.open(blobUrl, '_blank');

            if (pdfWindow) {
                pdfWindow.document.title = filename;
            } else {
                // If popup was blocked, fallback to direct download
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = filename;
                link.target = '_blank';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('There was an error generating the PDF. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <button
            onClick={generatePDF}
            disabled={isGenerating}
            className="p-2.5 sm:px-6 sm:py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Download PDF"
        >
            {isGenerating ? (
                <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="hidden sm:inline">Generating...</span>
                </>
            ) : (
                <>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span className="hidden sm:inline">Download PDF</span>
                </>
            )}
        </button>
    );
}
