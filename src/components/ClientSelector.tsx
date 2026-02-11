'use client';

import { useState, useRef, useEffect } from 'react';
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <label className="block text-sm font-medium text-gray-700">
                    Saved Clients
                </label>
                <button
                    type="button"
                    onClick={handleSaveClient}
                    className="text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Save Current Client
                </button>
            </div>

            <div className="relative" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="w-full px-3 py-2.5 text-left bg-white border border-gray-300 rounded-lg text-sm text-gray-600 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 flex items-center justify-between"
                >
                    <span className="truncate">
                        {clients.length > 0
                            ? 'Select a saved client...'
                            : 'No saved clients yet'}
                    </span>
                    <svg 
                        className={`w-4 h-4 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {showDropdown && clients.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {clients.map((client) => (
                            <div
                                key={client.id}
                                className="flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                            >
                                <button
                                    type="button"
                                    onClick={() => {
                                        onSelect(client);
                                        setShowDropdown(false);
                                    }}
                                    className="flex-1 text-left min-w-0"
                                >
                                    <div className="text-sm font-medium text-gray-900 truncate">
                                        {client.name}
                                    </div>
                                    {client.email && (
                                        <div className="text-xs text-gray-500 truncate">{client.email}</div>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm('Delete this saved client?')) {
                                            onDelete(client.id);
                                        }
                                    }}
                                    className="ml-2 p-1.5 text-gray-400 hover:text-red-500 rounded hover:bg-red-50 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
