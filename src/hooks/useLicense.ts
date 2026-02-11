'use client';

import { useState, useCallback, useEffect } from 'react';
import { LicenseInfo } from '@/types/invoice';
import { validateLicenseKey, activateLicense, deactivateLicense, getLicenseInfo } from '@/lib/license';

const createInitialLicenseInfo = (): LicenseInfo => ({
  isValid: false,
  features: {
    logo: false,
    customColors: false,
    templates: false,
    importExport: false,
    unlimitedClients: false,
    paymentQRCode: false,
    customWhatsAppMessage: false,
  },
  key: null,
  activatedAt: null,
});

export function useLicense() {
  // Always initialize with default state to prevent hydration mismatch
  const [licenseInfo, setLicenseInfo] = useState<LicenseInfo>(createInitialLicenseInfo);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for saved license after mount
  useEffect(() => {
    const savedInfo = getLicenseInfo();
    if (savedInfo.isValid) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Valid pattern for localStorage sync
      setLicenseInfo(savedInfo);
    }
    setIsLoading(false);
  }, []);

  const activate = useCallback((key: string): boolean => {
    setIsLoading(true);
    const validation = validateLicenseKey(key);

    if (!validation.valid) {
      setError(validation.error || 'Invalid license key');
      setIsLoading(false);
      return false;
    }

    const newInfo = activateLicense(key);

    if (newInfo.isValid) {
      setLicenseInfo(newInfo);
      setError(null);
      setIsLoading(false);
      return true;
    } else {
      setError('Failed to activate license');
      setIsLoading(false);
      return false;
    }
  }, []);

  const deactivate = useCallback(() => {
    deactivateLicense();
    setLicenseInfo(createInitialLicenseInfo());
    setError(null);
  }, []);

  return {
    licenseInfo,
    isLoading,
    error,
    activate,
    deactivate,
    canUseLogo: licenseInfo.isValid && licenseInfo.features.logo,
    canUseCustomColors: licenseInfo.isValid && licenseInfo.features.customColors,
    canUseProTemplates: licenseInfo.isValid && licenseInfo.features.templates,
    canImportExport: licenseInfo.isValid && licenseInfo.features.importExport,
    hasUnlimitedClients: licenseInfo.isValid && licenseInfo.features.unlimitedClients,
    canUsePaymentQR: licenseInfo.isValid && licenseInfo.features.paymentQRCode,
    canCustomizeWhatsApp: licenseInfo.isValid && licenseInfo.features.customWhatsAppMessage,
    hasProAccess: licenseInfo.isValid,
  };
}

export function useProFeatures() {
  // Always initialize with default state to prevent hydration mismatch
  const [features, setFeatures] = useState(() => createInitialLicenseInfo().features);

  useEffect(() => {
    const info = getLicenseInfo();
    if (info.isValid) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Valid pattern for localStorage sync
      setFeatures(info.features);
    }
  }, []);

  return features;
}
