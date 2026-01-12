'use client';

import { useState } from 'react';
import { SavedClient } from '@/types/invoice';

interface ClientSelectorProps {
    clients: SavedClient[];
    onSelect: (client: SavedClient) => void;
    onSave: (client: Omit<SavedClient, 'id' | 'createdAt'>) => void;
    onDelete: (id: string) => void;
    currentClientName: string;
    currentClientEmail: string;
    currentClientAddress: string;
}

export default function ClientSelector({
    clients,
    onSelect,
    onSave,
    onDelete,
    currentClientName,
    currentClientEmail,
    currentClientAddress,
}: ClientSelectorProps) {
    const [showDropdown, setShowDropdown] = useState(false);

    const handleSaveClient = () => {
        if (!currentClientName.trim()) {
            alert('Please enter a client name first');
            return;
        }
        onSave({
            name: currentClientName,
            email: currentClientEmail,
            address: currentClientAddress,
        });
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                    Saved Clients
                </label>
                <button
                    type="button"
                    onClick={handleSaveClient}
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                >
                    + Save Current Client
                </button>
            </div>

            <div className="relative">
                <button
                    type="button"
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-lg text-sm text-gray-600 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                    {clients.length > 0
                        ? 'Select a saved client...'
                        : 'No saved clients yet'}
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        ▼
                    </span>
                </button>

                {showDropdown && clients.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {clients.map((client) => (
                            <div
                                key={client.id}
                                className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                            >
                                <button
                                    type="button"
                                    onClick={() => {
                                        onSelect(client);
                                        setShowDropdown(false);
                                    }}
                                    className="flex-1 text-left"
                                >
                                    <div className="text-sm font-medium text-gray-900">
                                        {client.name}
                                    </div>
                                    {client.email && (
                                        <div className="text-xs text-gray-500">{client.email}</div>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(client.id);
                                    }}
                                    className="ml-2 p-1 text-gray-400 hover:text-red-500"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
