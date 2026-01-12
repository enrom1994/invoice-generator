'use client';

import { PaymentMethod } from '@/types/invoice';

interface PaymentMethodToggleProps {
    value: PaymentMethod;
    onChange: (value: PaymentMethod) => void;
}

export default function PaymentMethodToggle({ value, onChange }: PaymentMethodToggleProps) {
    return (
        <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
            <button
                type="button"
                onClick={() => onChange('eft')}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${value === 'eft'
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
            >
                🏦 EFT
            </button>
            <button
                type="button"
                onClick={() => onChange('cash')}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${value === 'cash'
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
            >
                💵 Cash
            </button>
        </div>
    );
}
