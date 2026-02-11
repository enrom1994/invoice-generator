'use client';

import { DocumentType } from '@/types/invoice';

interface DocumentTypeToggleProps {
    value: DocumentType;
    onChange: (value: DocumentType) => void;
}

export default function DocumentTypeToggle({ value, onChange }: DocumentTypeToggleProps) {
    return (
        <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
            <button
                type="button"
                onClick={() => onChange('invoice')}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                    value === 'invoice'
                        ? 'bg-white text-teal-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                }`}
            >
                Invoice
            </button>
            <button
                type="button"
                onClick={() => onChange('quotation')}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                    value === 'quotation'
                        ? 'bg-white text-teal-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                }`}
            >
                Quote
            </button>
        </div>
    );
}
