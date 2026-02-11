'use client';

import { useState, useCallback } from 'react';
import { SavedClient } from '@/types/invoice';

const CLIENTS_STORAGE_KEY = 'invoice_gen_clients';
const MAX_CLIENTS = 20;

const loadClientsFromStorage = (): SavedClient[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CLIENTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading clients:', error);
    return [];
  }
};

export function useClients() {
  // Use lazy initialization to load from localStorage
  const [clients, setClients] = useState<SavedClient[]>(loadClientsFromStorage);
  const [isLoading] = useState(false);

  const saveClient = useCallback((client: Omit<SavedClient, 'id' | 'createdAt'>) => {
    const newClient: SavedClient = {
      id: crypto.randomUUID(),
      ...client,
      createdAt: new Date().toISOString(),
    };

    setClients((prev) => {
      const existingIndex = prev.findIndex(
        (c) => c.name.toLowerCase() === client.name.toLowerCase()
      );

      let updated: SavedClient[];
      if (existingIndex >= 0) {
        updated = [...prev];
        updated[existingIndex] = { ...newClient, id: prev[existingIndex].id };
      } else {
        updated = [newClient, ...prev].slice(0, MAX_CLIENTS);
      }

      localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    return newClient;
  }, []);

  const deleteClient = useCallback((id: string) => {
    setClients((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

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
