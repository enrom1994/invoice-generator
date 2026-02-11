'use client';

import { useState, useRef, useEffect } from 'react';

interface PaymentTermsSelectorProps {
    currentNotes: string;
    onApply: (terms: string) => void;
}

const paymentTermsTemplates = [
    {
        id: 'receipt',
        name: 'Payment on Receipt',
        terms: 'Payment is due immediately upon receipt. Thank you for your business!',
    },
    {
        id: '7days',
        name: 'Net 7 Days',
        terms: 'Payment is due within 7 days of the invoice date. Thank you for your business!',
    },
    {
        id: '14days',
        name: 'Net 14 Days',
        terms: 'Payment is due within 14 days of the invoice date. Thank you for your business!',
    },
    {
        id: '30days',
        name: 'Net 30 Days',
        terms: 'Payment is due within 30 days of the invoice date. Thank you for your business!',
    },
    {
        id: '50deposit',
        name: '50% Deposit',
        terms: 'A 50% deposit is required before work commences. The remaining balance is due upon completion. Thank you for your business!',
    },
    {
        id: 'milestone',
        name: 'Milestone Payments',
        terms: 'Payment is structured as follows:\n• 30% deposit before commencement\n• 40% upon milestone completion\n• 30% upon final delivery\nThank you for your business!',
    },
    {
        id: 'latefee',
        name: 'With Late Fee',
        terms: 'Payment is due within 30 days. Late payments will incur interest at 2% per month on the outstanding balance. Thank you for your business!',
    },
    {
        id: 'eft',
        name: 'EFT Transfer',
        terms: 'Payment is due within 30 days via bank transfer. Please use the payment reference provided. Thank you for your business!',
    },
];

export default function PaymentTermsSelector({
    currentNotes: _currentNotes,
    onApply,
}: PaymentTermsSelectorProps) {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (terms: string) => {
        onApply(terms);
        setShowDropdown(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className="px-3 py-1.5 text-sm text-teal-600 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors flex items-center gap-1"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Templates
            </button>

            {showDropdown && (
                <div className="absolute left-0 z-20 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-lg max-h-72 overflow-y-auto">
                    <div className="p-3 border-b border-gray-100 bg-gray-50">
                        <span className="text-xs font-semibold text-gray-500 uppercase">Payment Terms Templates</span>
                    </div>
                    {paymentTermsTemplates.map((template) => (
                        <button
                            key={template.id}
                            type="button"
                            onClick={() => handleSelect(template.terms)}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors"
                        >
                            <div className="text-sm font-medium text-gray-900">
                                {template.name}
                            </div>
                            <div className="text-xs text-gray-500 truncate mt-0.5">
                                {template.terms.split('\n')[0]}
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
