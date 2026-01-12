'use client';

import { InvoiceData, LineItem } from '@/types/invoice';
import { generateId } from '@/lib/utils';

interface LineItemsProps {
    lineItems: LineItem[];
    onChange: (items: LineItem[]) => void;
}

export default function LineItems({ lineItems, onChange }: LineItemsProps) {
    const addItem = () => {
        const newItem: LineItem = {
            id: generateId(),
            description: '',
            quantity: 1,
            unitPrice: 0,
        };
        onChange([...lineItems, newItem]);
    };

    const removeItem = (id: string) => {
        if (lineItems.length > 1) {
            onChange(lineItems.filter((item) => item.id !== id));
        }
    };

    const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
        onChange(
            lineItems.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Line Items</h3>
                <button
                    type="button"
                    onClick={addItem}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                >
                    + Add Item
                </button>
            </div>

            <div className="space-y-3">
                {/* Header - hidden on mobile */}
                <div className="hidden md:grid md:grid-cols-12 gap-3 text-sm font-medium text-gray-600 px-1">
                    <div className="col-span-6">Description</div>
                    <div className="col-span-2 text-center">Qty</div>
                    <div className="col-span-3 text-right">Unit Price (R)</div>
                    <div className="col-span-1"></div>
                </div>

                {lineItems.map((item, index) => (
                    <div
                        key={item.id}
                        className="bg-gray-50 rounded-lg p-4 space-y-3 md:space-y-0 md:grid md:grid-cols-12 md:gap-3 md:items-center md:p-2"
                    >
                        {/* Mobile label */}
                        <div className="md:hidden text-sm font-medium text-gray-600">
                            Item {index + 1}
                        </div>

                        {/* Description */}
                        <div className="md:col-span-6">
                            <label className="md:hidden text-xs text-gray-500 mb-1 block">
                                Description
                            </label>
                            <input
                                type="text"
                                value={item.description}
                                onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                placeholder="Service or product description"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                            />
                        </div>

                        {/* Quantity */}
                        <div className="md:col-span-2">
                            <label className="md:hidden text-xs text-gray-500 mb-1 block">
                                Quantity
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-center"
                            />
                        </div>

                        {/* Unit Price */}
                        <div className="md:col-span-3">
                            <label className="md:hidden text-xs text-gray-500 mb-1 block">
                                Unit Price (R)
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.unitPrice}
                                onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-right"
                            />
                        </div>

                        {/* Remove button */}
                        <div className="md:col-span-1 flex justify-end">
                            <button
                                type="button"
                                onClick={() => removeItem(item.id)}
                                disabled={lineItems.length === 1}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Remove item"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
