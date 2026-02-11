import { LicenseInfo, ProFeatures } from '@/types/invoice';

const LICENSE_STORAGE_KEY = 'invoice_gen_pro_license';
const LICENSE_FEATURES_KEY = 'invoice_gen_pro_features';

const LICENSE_KEY_PATTERN = /^INV-PRO-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

export function validateLicenseKey(key: string): { valid: boolean; error?: string } {
  if (!key || typeof key !== 'string') {
    return { valid: false, error: 'License key is required' };
  }

  const trimmedKey = key.trim().toUpperCase();

  if (!LICENSE_KEY_PATTERN.test(trimmedKey)) {
    return {
      valid: false,
      error: `Invalid format. You entered: "${trimmedKey}"\n\nExpected format: INV-PRO-XXXX-XXXX-XXXX-XXXX\n\nMake sure your key:\n• Starts with "INV-PRO"\n• Has 4 groups of 4 characters after the prefix\n• Only contains letters and numbers`
    };
  }

  return { valid: true };
}

export function activateLicense(key: string): LicenseInfo {
  const validation = validateLicenseKey(key);

  if (!validation.valid) {
    return {
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
    };
  }

  const upperKey = key.trim().toUpperCase();

  try {
    localStorage.setItem(LICENSE_STORAGE_KEY, upperKey);
    localStorage.setItem(LICENSE_FEATURES_KEY, JSON.stringify({
      logo: true,
      customColors: true,
      templates: true,
      importExport: true,
      unlimitedClients: true,
      paymentQRCode: true,
      customWhatsAppMessage: true,
    }));

    return {
      isValid: true,
      features: {
        logo: true,
        customColors: true,
        templates: true,
        importExport: true,
        unlimitedClients: true,
        paymentQRCode: true,
        customWhatsAppMessage: true,
      },
      key: upperKey,
      activatedAt: new Date().toISOString(),
    };
  } catch {
    return {
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
    };
  }
}

export function deactivateLicense(): void {
  localStorage.removeItem(LICENSE_STORAGE_KEY);
  localStorage.removeItem(LICENSE_FEATURES_KEY);
}

export function getLicenseInfo(): LicenseInfo {
  if (typeof window === 'undefined') {
    return {
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
    };
  }

  try {
    const storedKey = localStorage.getItem(LICENSE_STORAGE_KEY);
    const storedFeatures = localStorage.getItem(LICENSE_FEATURES_KEY);

    if (!storedKey) {
      return {
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
      };
    }

    const validation = validateLicenseKey(storedKey);

    if (!validation.valid) {
      localStorage.removeItem(LICENSE_STORAGE_KEY);
      localStorage.removeItem(LICENSE_FEATURES_KEY);
      return {
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
      };
    }

    const features: ProFeatures = storedFeatures
      ? JSON.parse(storedFeatures)
      : {
        logo: true,
        customColors: true,
        templates: true,
        importExport: true,
        unlimitedClients: true,
        paymentQRCode: true,
        customWhatsAppMessage: true,
      };

    return {
      isValid: true,
      features,
      key: storedKey,
      activatedAt: new Date().toISOString(),
    };
  } catch {
    return {
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
    };
  }
}

export function canUseLogo(licenseInfo: LicenseInfo): boolean {
  return licenseInfo.isValid && licenseInfo.features.logo;
}

export function canUseCustomColors(licenseInfo: LicenseInfo): boolean {
  return licenseInfo.isValid && licenseInfo.features.customColors;
}

export function canUseProTemplates(licenseInfo: LicenseInfo): boolean {
  return licenseInfo.isValid && licenseInfo.features.templates;
}

export function canImportExport(licenseInfo: LicenseInfo): boolean {
  return licenseInfo.isValid && licenseInfo.features.importExport;
}

export function hasUnlimitedClients(licenseInfo: LicenseInfo): boolean {
  return licenseInfo.isValid && licenseInfo.features.unlimitedClients;
}

export function canUsePaymentQR(licenseInfo: LicenseInfo): boolean {
  return licenseInfo.isValid && licenseInfo.features.paymentQRCode;
}

export function canCustomizeWhatsApp(licenseInfo: LicenseInfo): boolean {
  return licenseInfo.isValid && licenseInfo.features.customWhatsAppMessage;
}

export function hasProAccess(licenseInfo: LicenseInfo): boolean {
  return licenseInfo.isValid;
}
