export interface CurrencyConfig {
  code: string;
  symbol: string;
  locale: string;
  name: string;
}

export const DEFAULT_CURRENCY: CurrencyConfig = {
  code: 'USD',
  symbol: '$',
  locale: 'en-US',
  name: 'US Dollar',
};

export const CURRENCIES: CurrencyConfig[] = [
  { code: 'USD', symbol: '$', locale: 'en-US', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', locale: 'de-DE', name: 'Euro' },
  { code: 'GBP', symbol: '£', locale: 'en-GB', name: 'British Pound' },
  { code: 'ZAR', symbol: 'R', locale: 'en-ZA', name: 'South African Rand' },
  { code: 'AUD', symbol: 'A$', locale: 'en-AU', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', locale: 'en-CA', name: 'Canadian Dollar' },
  { code: 'JPY', symbol: '¥', locale: 'ja-JP', name: 'Japanese Yen' },
  { code: 'INR', symbol: '₹', locale: 'en-IN', name: 'Indian Rupee' },
  { code: 'BRL', symbol: 'R$', locale: 'pt-BR', name: 'Brazilian Real' },
  { code: 'MXN', symbol: '$', locale: 'es-MX', name: 'Mexican Peso' },
  { code: 'CHF', symbol: 'CHF', locale: 'de-CH', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', locale: 'zh-CN', name: 'Chinese Yuan' },
  { code: 'NZD', symbol: 'NZ$', locale: 'en-NZ', name: 'New Zealand Dollar' },
  { code: 'SEK', symbol: 'kr', locale: 'sv-SE', name: 'Swedish Krona' },
  { code: 'NOK', symbol: 'kr', locale: 'nb-NO', name: 'Norwegian Krone' },
  { code: 'DKK', symbol: 'kr', locale: 'da-DK', name: 'Danish Krone' },
  { code: 'SGD', symbol: 'S$', locale: 'en-SG', name: 'Singapore Dollar' },
  { code: 'HKD', symbol: 'HK$', locale: 'en-HK', name: 'Hong Kong Dollar' },
  { code: 'KRW', symbol: '₩', locale: 'ko-KR', name: 'South Korean Won' },
  { code: 'THB', symbol: '฿', locale: 'th-TH', name: 'Thai Baht' },
  { code: 'AED', symbol: 'د.إ', locale: 'ar-AE', name: 'UAE Dirham' },
  { code: 'PLN', symbol: 'zł', locale: 'pl-PL', name: 'Polish Zloty' },
  { code: 'PHP', symbol: '₱', locale: 'en-PH', name: 'Philippine Peso' },
  { code: 'IDR', symbol: 'Rp', locale: 'id-ID', name: 'Indonesian Rupiah' },
];

export function getCurrencyByCode(code: string): CurrencyConfig {
  return CURRENCIES.find(c => c.code === code) || DEFAULT_CURRENCY;
}

export function getCurrencyByLocale(): CurrencyConfig {
  try {
    const locale = navigator.language;
    const formatter = new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' });
    const parts = formatter.formatToParts(1000.99);
    const currencyPart = parts.find(p => p.type === 'currency');
    const symbol = currencyPart?.value || '$';
    
    const found = CURRENCIES.find(c => c.symbol === symbol || c.locale.startsWith(locale.split('-')[0]));
    return found || DEFAULT_CURRENCY;
  } catch {
    return DEFAULT_CURRENCY;
  }
}

export function formatCurrency(amount: number, currency: CurrencyConfig): string {
  try {
    return new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency.symbol}${amount.toFixed(2)}`;
  }
}

export function formatDate(dateString: string, locale: string = 'en-US'): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatDateLong(dateString: string, locale: string = 'en-US'): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

export function getDueDate(daysFromNow: number = 30): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function isValidHexColor(hex: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

export const DEFAULT_TAX_RATE = 0;
export const DEFAULT_TAX_NAME = 'Tax';

export const PAYMENT_TERMS_OPTIONS = [
  { value: 7, label: 'Net 7 days' },
  { value: 14, label: 'Net 14 days' },
  { value: 21, label: 'Net 21 days' },
  { value: 30, label: 'Net 30 days' },
  { value: 45, label: 'Net 45 days' },
  { value: 60, label: 'Net 60 days' },
  { value: 90, label: 'Net 90 days' },
];

export const DEFAULT_PAYMENT_TERMS = 30;
