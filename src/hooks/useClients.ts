'use client';

import { useState, useEffect, useCallback } from 'react';
import { SavedClient } from '@/types/invoice';

const CLIENTS_STORAGE_KEY = 'invoice-saved-clients';

export function useClients() {
    const [clients, setClients] = useState<SavedClient[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load clients from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(CLIENTS_STORAGE_KEY);
            if (stored) {
                setClients(JSON.parse(stored));
            }
        } catch (error) {
            console.error('Error loading clients:', error);
        }
        setIsLoading(false);
    }, []);

    // Save a new client
    const saveClient = useCallback((client: Omit<SavedClient, 'id' | 'createdAt'>) => {
        const newClient: SavedClient = {
            id: crypto.randomUUID(),
            ...client,
            createdAt: new Date().toISOString(),
        };

        setClients((prev) => {
            // Check if client with same name exists and update, otherwise add
            const existingIndex = prev.findIndex(
                (c) => c.name.toLowerCase() === client.name.toLowerCase()
            );

            let updated: SavedClient[];
            if (existingIndex >= 0) {
                updated = [...prev];
                updated[existingIndex] = { ...newClient, id: prev[existingIndex].id };
            } else {
                updated = [newClient, ...prev].slice(0, 20); // Keep max 20 clients
            }

            localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });

        return newClient;
    }, []);

    // Delete a client
    const deleteClient = useCallback((id: string) => {
        setClients((prev) => {
            const updated = prev.filter((c) => c.id !== id);
            localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    }, []);

    // Get a client by ID
    const getClient = useCallback((id: string): SavedClient | undefined => {
        return clients.find((c) => c.id === id);
    }, [clients]);

    return {
        clients,
        isLoading,
        saveClient,
        deleteClient,
        getClient,
    };
}
