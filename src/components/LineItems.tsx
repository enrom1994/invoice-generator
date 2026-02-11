'use client';

import { useState } from 'react';
import { LineItem } from '@/types/invoice';
import { generateId } from '@/lib/i18n';

interface LineItemsProps {
    lineItems: LineItem[];
    onChange: (items: LineItem[]) => void;
    currencySymbol?: string;
}

// Track temporary input values for each item
interface InputState {
    [key: string]: {
        quantity: string;
        unitPrice: string;
    };
}

export default function LineItems({ lineItems, onChange, currencySymbol = '$' }: LineItemsProps) {
    const [inputState, setInputState] = useState<InputState>({});

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
            // Clean up input state
            const newState = { ...inputState };
            delete newState[id];
            setInputState(newState);
        }
    };

    const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
        onChange(
            lineItems.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };

    const handleQuantityChange = (id: string, value: string) => {
        // Update temporary state immediately
        setInputState(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                quantity: value
            }
        }));

        // Parse as float to allow decimals (e.g., 1.5, 4.5)
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && numValue > 0) {
            updateItem(id, 'quantity', numValue);
        } else if (value === '') {
            // Allow empty temporarily, will reset to 1 on blur
            updateItem(id, 'quantity', 1);
        }
    };

    const handleQuantityBlur = (id: string) => {
        const item = lineItems.find(i => i.id === id);
        if (item) {
            // Reset input state to actual value
            setInputState(prev => ({
                ...prev,
                [id]: {
                    ...prev[id],
                    quantity: item.quantity.toString()
                }
            }));
        }
    };

    const handlePriceChange = (id: string, value: string) => {
        // Update temporary state immediately
        setInputState(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                unitPrice: value
            }
        }));

        // Only update the actual data if it's a valid number
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && numValue >= 0) {
            updateItem(id, 'unitPrice', numValue);
        } else if (value === '') {
            // Allow empty temporarily, will reset to 0 on blur
            updateItem(id, 'unitPrice', 0);
        }
    };

    const handlePriceBlur = (id: string) => {
        const item = lineItems.find(i => i.id === id);
        if (item) {
            // Reset input state to actual value
            setInputState(prev => ({
                ...prev,
                [id]: {
                    ...prev[id],
                    unitPrice: item.unitPrice.toString()
                }
            }));
        }
    };

    const getQuantityValue = (item: LineItem): string => {
        const tempValue = inputState[item.id]?.quantity;
        if (tempValue !== undefined) {
            return tempValue;
        }
        return item.quantity === 0 ? '' : item.quantity.toString();
    };

    const getPriceValue = (item: LineItem): string => {
        const tempValue = inputState[item.id]?.unitPrice;
        if (tempValue !== undefined) {
            return tempValue;
        }
        return item.unitPrice === 0 ? '' : item.unitPrice.toString();
    };

    const calculateTotal = (quantity: number, unitPrice: number): string => {
        return (quantity * unitPrice).toFixed(2);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h3 className="text-lg font-semibold text-gray-900">Services / Products</h3>
                <button
                    type="button"
                    onClick={addItem}
                    className="w-full sm:w-auto px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Item
                </button>
            </div>

            <div className="space-y-3">
                <div className="hidden md:grid md:grid-cols-12 gap-3 text-sm font-medium text-gray-600 px-2">
                    <div className="col-span-6">Description</div>
                    <div className="col-span-2 text-center">Qty</div>
                    <div className="col-span-3 text-right">Price ({currencySymbol})</div>
                    <div className="col-span-1"></div>
                </div>

                {lineItems.map((item, index) => (
                    <div
                        key={item.id}
                        className="bg-gray-50 rounded-lg p-3 space-y-3 md:space-y-0 md:grid md:grid-cols-12 md:gap-3 md:items-center md:p-3"
                    >
                        <div className="md:col-span-6">
                            <label className="md:hidden text-xs text-gray-500 mb-1 block">
                                Item {index + 1}
                            </label>
                            <input
                                type="text"
                                value={item.description}
                                onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                placeholder="Service or product description"
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="md:hidden text-xs text-gray-500 mb-1 block">
                                Quantity
                            </label>
                            <input
                                type="text"
                                inputMode="decimal"
                                pattern="[0-9]*[.,]?[0-9]*"
                                min="0"
                                step="0.01"
                                value={getQuantityValue(item)}
                                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                onBlur={() => handleQuantityBlur(item.id)}
                                placeholder="1"
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm text-center"
                            />
                        </div>

                        <div className="md:col-span-3">
                            <label className="md:hidden text-xs text-gray-500 mb-1 block">
                                Unit Price
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">{currencySymbol}</span>
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    pattern="[0-9]*[.,]?[0-9]*"
                                    min="0"
                                    step="0.01"
                                    value={getPriceValue(item)}
                                    onChange={(e) => handlePriceChange(item.id, e.target.value)}
                                    onBlur={() => handlePriceBlur(item.id)}
                                    placeholder="0.00"
                                    className="w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm text-right"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-1 flex items-center justify-between md:justify-end gap-2">
                            <div className="md:hidden text-sm">
                                <span className="text-gray-500">Total: </span>
                                <span className="font-semibold text-gray-900">{currencySymbol}{calculateTotal(item.quantity, item.unitPrice)}</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeItem(item.id)}
                                disabled={lineItems.length === 1}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Remove item"
                                aria-label={`Remove item ${index + 1}`}
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

            {lineItems.length === 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No items added yet</p>
                    <button
                        type="button"
                        onClick={addItem}
                        className="mt-2 text-teal-600 hover:text-teal-700 font-medium text-sm"
                    >
                        Add your first item
                    </button>
                </div>
            )}
        </div>
    );
}
