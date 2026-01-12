'use client';

import { useState, useEffect } from 'react';
import { MONETIZATION } from '@/lib/config';

/**
 * Hook to manage unlock state for monetization
 * Stores unlock status in localStorage for persistence
 */
export function useUnlockState() {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Load unlock state from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(MONETIZATION.STORAGE_KEY);
        setIsUnlocked(stored === 'true');
        setIsLoading(false);
    }, []);

    // Unlock the features (call after successful payment)
    const unlock = () => {
        localStorage.setItem(MONETIZATION.STORAGE_KEY, 'true');
        setIsUnlocked(true);
    };

    // Reset unlock state (for testing)
    const reset = () => {
        localStorage.removeItem(MONETIZATION.STORAGE_KEY);
        localStorage.removeItem(MONETIZATION.LOGO_STORAGE_KEY);
        setIsUnlocked(false);
    };

    return { isUnlocked, isLoading, unlock, reset };
}

/**
 * Hook to manage logo storage
 * Stores logo as base64 in localStorage
 */
export function useLogoState() {
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load logo from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(MONETIZATION.LOGO_STORAGE_KEY);
        if (stored) {
            setLogoUrl(stored);
        }
        setIsLoading(false);
    }, []);

    // Save logo (base64 string)
    const saveLogo = (base64: string) => {
        localStorage.setItem(MONETIZATION.LOGO_STORAGE_KEY, base64);
        setLogoUrl(base64);
    };

    // Remove logo
    const removeLogo = () => {
        localStorage.removeItem(MONETIZATION.LOGO_STORAGE_KEY);
        setLogoUrl(null);
    };

    return { logoUrl, isLoading, saveLogo, removeLogo };
}
