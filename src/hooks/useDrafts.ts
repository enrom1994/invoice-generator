'use client';

import { useState, useEffect, useCallback } from 'react';
import { InvoiceData, InvoiceDraft } from '@/types/invoice';

const DRAFTS_STORAGE_KEY = 'invoice-drafts';
const AUTO_SAVE_KEY = 'invoice-autosave';

export function useDrafts() {
    const [drafts, setDrafts] = useState<InvoiceDraft[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load drafts from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(DRAFTS_STORAGE_KEY);
            if (stored) {
                setDrafts(JSON.parse(stored));
            }
        } catch (error) {
            console.error('Error loading drafts:', error);
        }
        setIsLoading(false);
    }, []);

    // Save a new draft
    const saveDraft = useCallback((name: string, data: InvoiceData) => {
        const newDraft: InvoiceDraft = {
            id: crypto.randomUUID(),
            name,
            data,
            savedAt: new Date().toISOString(),
        };

        setDrafts((prev) => {
            const updated = [newDraft, ...prev].slice(0, 10); // Keep max 10 drafts
            localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });

        return newDraft;
    }, []);

    // Delete a draft
    const deleteDraft = useCallback((id: string) => {
        setDrafts((prev) => {
            const updated = prev.filter((d) => d.id !== id);
            localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    }, []);

    // Load a draft by ID
    const loadDraft = useCallback((id: string): InvoiceDraft | undefined => {
        return drafts.find((d) => d.id === id);
    }, [drafts]);

    return {
        drafts,
        isLoading,
        saveDraft,
        deleteDraft,
        loadDraft,
    };
}

// Auto-save hook for current invoice
export function useAutoSave(data: InvoiceData, enabled: boolean = true) {
    // Auto-save to localStorage on changes (debounced)
    useEffect(() => {
        if (!enabled) return;

        const timeoutId = setTimeout(() => {
            try {
                localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify({
                    data,
                    savedAt: new Date().toISOString(),
                }));
            } catch (error) {
                console.error('Error auto-saving:', error);
            }
        }, 1000); // 1 second debounce

        return () => clearTimeout(timeoutId);
    }, [data, enabled]);

    // Load auto-saved data
    const loadAutoSave = useCallback((): InvoiceData | null => {
        try {
            const stored = localStorage.getItem(AUTO_SAVE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                return parsed.data;
            }
        } catch (error) {
            console.error('Error loading auto-save:', error);
        }
        return null;
    }, []);

    // Clear auto-save
    const clearAutoSave = useCallback(() => {
        localStorage.removeItem(AUTO_SAVE_KEY);
    }, []);

    // Check if auto-save exists
    const hasAutoSave = useCallback((): boolean => {
        return localStorage.getItem(AUTO_SAVE_KEY) !== null;
    }, []);

    return {
        loadAutoSave,
        clearAutoSave,
        hasAutoSave,
    };
}
