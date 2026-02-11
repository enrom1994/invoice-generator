'use client';

import { PaymentMethod } from '@/types/invoice';

interface PaymentMethodToggleProps {
    value: PaymentMethod;
    onChange: (value: PaymentMethod) => void;
}

export default function PaymentMethodToggle({ value, onChange }: PaymentMethodToggleProps) {
    const methods: { value: PaymentMethod; label: string }[] = [
        { value: 'eft', label: 'Bank' },
        { value: 'cash', label: 'Cash' },
        { value: 'bank_transfer', label: 'Transfer' },
        { value: 'credit_card', label: 'Card' },
        { value: 'paypal', label: 'PayPal' },
        { value: 'other', label: 'Other' },
    ];

    return (
        <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg overflow-x-auto">
            {methods.map((method) => (
                <button
                    key={method.value}
                    type="button"
                    onClick={() => onChange(method.value)}
                    className={`flex-shrink-0 px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                        value === method.value
                            ? 'bg-white text-teal-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                    {method.label}
                </button>
            ))}
        </div>
    );
}
