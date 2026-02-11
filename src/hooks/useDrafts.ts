'use client';

import { useState, useEffect, useCallback } from 'react';
import { InvoiceData, InvoiceDraft } from '@/types/invoice';

const DRAFTS_STORAGE_KEY = 'invoice_gen_drafts';
const AUTO_SAVE_KEY = 'invoice_gen_autosave';
const MAX_DRAFTS = 10;
const AUTO_SAVE_DEBOUNCE_MS = 1000;

const loadDraftsFromStorage = (): InvoiceDraft[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(DRAFTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading drafts:', error);
    return [];
  }
};

export function useDrafts() {
  // Use lazy initialization
  const [drafts, setDrafts] = useState<InvoiceDraft[]>(loadDraftsFromStorage);
  const [isLoading] = useState(false);

  const saveDraft = useCallback((name: string, data: InvoiceData) => {
    const newDraft: InvoiceDraft = {
      id: crypto.randomUUID(),
      name,
      data,
      savedAt: new Date().toISOString(),
    };

    setDrafts((prev) => {
      const updated = [newDraft, ...prev].slice(0, MAX_DRAFTS);
      localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    return newDraft;
  }, []);

  const deleteDraft = useCallback((id: string) => {
    setDrafts((prev) => {
      const updated = prev.filter((d) => d.id !== id);
      localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

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
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify({
          data,
          savedAt: new Date().toISOString(),
        }));
      } catch (error) {
        console.error('Error auto-saving:', error);
      }
    }, AUTO_SAVE_DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [data, enabled]);

  const loadAutoSave = useCallback((): InvoiceData | null => {
    if (typeof window === 'undefined') return null;
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

  const clearAutoSave = useCallback(() => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(AUTO_SAVE_KEY);
  }, []);

  const hasAutoSave = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(AUTO_SAVE_KEY) !== null;
  }, []);

  return {
    loadAutoSave,
    clearAutoSave,
    hasAutoSave,
  };
}
