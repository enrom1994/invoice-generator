import {
  formatCurrency,
  generateId,
  getTodayDate,
  getDueDate,
  formatDate,
  formatDateShort,
  isValidEmail,
  sanitizeFileName,
  debounce,
  calculateLineItemTotal,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
  formatPercentage,
  truncateText,
  capitalizeFirst,
  titleCase,
  generatePaymentReference,
  lightenColor,
  darkenColor,
  adjustAlpha,
} from '../lib/utils';
import { DEFAULT_CURRENCY, CURRENCIES, getCurrencyByCode, isValidHexColor, hexToRgb, rgbToHex } from '../lib/i18n';
import { validateLicenseKey, activateLicense, deactivateLicense, getLicenseInfo } from '../lib/license';

describe('Business Logic - Calculations', () => {
  describe('calculateLineItemTotal', () => {
    it('should calculate correct total for positive numbers', () => {
      expect(calculateLineItemTotal(5, 10)).toBe(50);
      expect(calculateLineItemTotal(2.5, 40)).toBe(100);
      expect(calculateLineItemTotal(1, 99.99)).toBe(99.99);
    });

    it('should handle zero quantity', () => {
      expect(calculateLineItemTotal(0, 100)).toBe(0);
    });

    it('should handle zero unit price', () => {
      expect(calculateLineItemTotal(5, 0)).toBe(0);
    });

    it('should handle decimal values', () => {
      expect(calculateLineItemTotal(2, 19.99)).toBe(39.98);
    });
  });

  describe('calculateSubtotal', () => {
    it('should sum all line item totals', () => {
      const lineItems = [
        { quantity: 2, unitPrice: 50 },
        { quantity: 1, unitPrice: 100 },
        { quantity: 3, unitPrice: 25 },
      ];
      expect(calculateSubtotal(lineItems)).toBe(275);
    });

    it('should return 0 for empty array', () => {
      expect(calculateSubtotal([])).toBe(0);
    });

    it('should handle single item', () => {
      expect(calculateSubtotal([{ quantity: 10, unitPrice: 5 }])).toBe(50);
    });

    it('should handle decimal prices', () => {
      const lineItems = [
        { quantity: 2, unitPrice: 19.99 },
        { quantity: 1, unitPrice: 0.01 },
      ];
      // Account for floating point precision
      expect(calculateSubtotal(lineItems)).toBeCloseTo(39.99, 5);
    });
  });

  describe('calculateTax', () => {
    it('should calculate tax at specified rate', () => {
      expect(calculateTax(100, 10)).toBe(10);
      expect(calculateTax(200, 5)).toBe(10);
      expect(calculateTax(1000, 20)).toBe(200);
    });

    it('should return 0 for 0% tax rate', () => {
      expect(calculateTax(100, 0)).toBe(0);
    });

    it('should return 0 for subtotal of 0', () => {
      expect(calculateTax(0, 20)).toBe(0);
    });

    it('should handle decimal rates', () => {
      expect(calculateTax(100, 7.5)).toBe(7.5);
      expect(calculateTax(100, 0.5)).toBe(0.5);
    });

    it('should handle large subtotals', () => {
      expect(calculateTax(100000, 15)).toBe(15000);
    });
  });

  describe('calculateTotal', () => {
    it('should add subtotal and tax', () => {
      expect(calculateTotal(100, 10)).toBe(110);
      expect(calculateTotal(200, 20)).toBe(220);
    });

    it('should handle zero tax', () => {
      expect(calculateTotal(100, 0)).toBe(100);
    });

    it('should handle large numbers', () => {
      expect(calculateTotal(10000, 1500)).toBe(11500);
    });
  });
});

describe('Business Logic - Formatting', () => {
  describe('formatCurrency', () => {
    it('should format USD correctly', () => {
      const result = formatCurrency(100.50, DEFAULT_CURRENCY);
      expect(result).toMatch(/\$100\.50/);
    });

    it('should handle zero amount', () => {
      const result = formatCurrency(0, DEFAULT_CURRENCY);
      expect(result).toMatch(/\$0\.00/);
    });

    it('should handle large amounts', () => {
      const result = formatCurrency(1000000, DEFAULT_CURRENCY);
      expect(result).toContain('1,000,000');
    });

    it('should handle decimal amounts correctly', () => {
      const result = formatCurrency(99.99, DEFAULT_CURRENCY);
      expect(result).toContain('99.99');
    });
  });

  describe('formatDate', () => {
    it('should format valid date string', () => {
      const result = formatDate('2024-01-15', 'en-US');
      expect(result).toContain('2024');
      expect(result).toContain('January');
      expect(result).toContain('15');
    });

    it('should return empty string for empty input', () => {
      expect(formatDate('')).toBe('');
    });

    it('should handle different locales', () => {
      const result = formatDate('2024-01-15', 'de-DE');
      expect(result).toContain('15.');
      expect(result).toContain('Januar');
    });
  });

  describe('formatDateShort', () => {
    it('should format date in short format', () => {
      const result = formatDateShort('2024-01-15', 'en-US');
      expect(result).toContain('Jan');
      expect(result).toContain('15');
      expect(result).toContain('2024');
    });

    it('should return empty string for empty input', () => {
      expect(formatDateShort('')).toBe('');
    });
  });

  describe('formatPercentage', () => {
    it('should format whole numbers without decimals', () => {
      expect(formatPercentage(10)).toBe('10%');
      expect(formatPercentage(100)).toBe('100%');
    });

    it('should format decimal percentages with 2 decimal places', () => {
      expect(formatPercentage(7.5)).toBe('7.50%');
      expect(formatPercentage(0.5)).toBe('0.50%');
    });

    it('should handle 0%', () => {
      expect(formatPercentage(0)).toBe('0%');
    });
  });

  describe('truncateText', () => {
    it('should return original text if shorter than max length', () => {
      expect(truncateText('Hi', 10)).toBe('Hi');
    });

    it('should truncate and add ellipsis if longer', () => {
      expect(truncateText('Hello World', 8)).toBe('Hello...');
    });

    it('should handle exact max length', () => {
      expect(truncateText('Hello', 5)).toBe('Hello');
    });
  });

  describe('capitalizeFirst', () => {
    it('should capitalize first letter and lowercase rest', () => {
      expect(capitalizeFirst('hello')).toBe('Hello');
      expect(capitalizeFirst('HELLO')).toBe('Hello');
      expect(capitalizeFirst('hELLO')).toBe('Hello');
    });

    it('should handle single character', () => {
      expect(capitalizeFirst('h')).toBe('H');
    });

    it('should handle empty string', () => {
      expect(capitalizeFirst('')).toBe('');
    });
  });

  describe('titleCase', () => {
    it('should convert to title case', () => {
      expect(titleCase('hello world')).toBe('Hello World');
      expect(titleCase('HELLO WORLD')).toBe('Hello World');
    });

    it('should handle single word', () => {
      expect(titleCase('hello')).toBe('Hello');
    });
  });
});

describe('Business Logic - Validation', () => {
  describe('isValidEmail', () => {
    it('should validate correct emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.org')).toBe(true);
      expect(isValidEmail('user+tag@example.co.uk')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('no@domain')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
    });
  });

  describe('isValidHexColor', () => {
    it('should validate 6-digit hex colors', () => {
      expect(isValidHexColor('#ffffff')).toBe(true);
      expect(isValidHexColor('#000000')).toBe(true);
      expect(isValidHexColor('#ff5500')).toBe(true);
    });

    it('should validate 3-digit hex colors', () => {
      expect(isValidHexColor('#fff')).toBe(true);
      expect(isValidHexColor('#f00')).toBe(true);
      expect(isValidHexColor('#123')).toBe(true);
    });

    it('should reject invalid hex colors', () => {
      expect(isValidHexColor('')).toBe(false);
      expect(isValidHexColor('#gggggg')).toBe(false);
      expect(isValidHexColor('#ffff')).toBe(false);
      expect(isValidHexColor('ffffff')).toBe(false);
    });
  });

  describe('sanitizeFileName', () => {
    it('should replace special characters with underscore', () => {
      expect(sanitizeFileName('my file pdf')).toBe('my_file_pdf');
      expect(sanitizeFileName('test/name')).toBe('test_name');
    });

    it('should keep alphanumeric characters and hyphens', () => {
      expect(sanitizeFileName('my-file_123')).toBe('my-file_123');
    });

    it('should handle empty string', () => {
      expect(sanitizeFileName('')).toBe('');
    });
  });
});

describe('Business Logic - Generators', () => {
  describe('generateId', () => {
    it('should generate alphanumeric string', () => {
      const id = generateId();
      expect(id.length).toBeGreaterThan(0);
      expect(id).toMatch(/^[a-z0-9]+$/);
    });

    it('should generate unique ids', () => {
      const ids = new Set();
      for (let i = 0; i < 100; i++) {
        ids.add(generateId());
      }
      expect(ids.size).toBe(100);
    });
  });

  describe('getTodayDate', () => {
    it('should return date in YYYY-MM-DD format', () => {
      const date = getTodayDate();
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should return valid date', () => {
      const date = getTodayDate();
      const parsed = new Date(date);
      expect(parsed).toBeInstanceOf(Date);
      expect(isNaN(parsed.getTime())).toBe(false);
    });
  });

  describe('getDueDate', () => {
    it('should return date in YYYY-MM-DD format', () => {
      const date = getDueDate(30);
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should add specified number of days', () => {
      const today = new Date();
      const dueDate = getDueDate(7);
      const expected = new Date(today);
      expected.setDate(expected.getDate() + 7);
      expect(dueDate).toBe(expected.toISOString().split('T')[0]);
    });

    it('should default to 30 days', () => {
      const today = new Date();
      const dueDate = getDueDate();
      const expected = new Date(today);
      expected.setDate(expected.getDate() + 30);
      expect(dueDate).toBe(expected.toISOString().split('T')[0]);
    });
  });

  describe('generatePaymentReference', () => {
    it('should generate reference from invoice number and client name', () => {
      expect(generatePaymentReference('INV-001', 'Acme Corp')).toBe('INV001-ACME');
    });

    it('should handle special characters', () => {
      expect(generatePaymentReference('INV-123', 'John & Jane')).toBe('INV123-JOHN');
    });

    it('should truncate client name to 4 characters', () => {
      expect(generatePaymentReference('INV-001', 'VeryLongClientName')).toBe('INV001-VERY');
    });

    it('should handle empty client name', () => {
      expect(generatePaymentReference('INV-001', '')).toBe('INV001-');
    });
  });
});

describe('Business Logic - Color Manipulation', () => {
  describe('lightenColor', () => {
    it('should lighten hex color', () => {
      const result = lightenColor('#000000', 50);
      expect(result).toMatch(/^#[0-9a-f]{6}$/i);
    });

    it('should lighten white stays white', () => {
      const result = lightenColor('#ffffff', 50);
      expect(result).toBe('#ffffff');
    });
  });

  describe('darkenColor', () => {
    it('should darken hex color', () => {
      const result = darkenColor('#ffffff', 50);
      expect(result).toMatch(/^#[0-9a-f]{6}$/i);
    });

    it('should darken black stays black', () => {
      const result = darkenColor('#000000', 50);
      expect(result).toBe('#000000');
    });
  });

  describe('adjustAlpha', () => {
    it('should convert hex to rgba', () => {
      const result = adjustAlpha('#ff0000', 0.5);
      expect(result).toBe('rgba(255, 0, 0, 0.5)');
    });

    it('should handle full opacity', () => {
      const result = adjustAlpha('#000000', 1);
      expect(result).toBe('rgba(0, 0, 0, 1)');
    });
  });

  describe('hexToRgb', () => {
    it('should convert hex to RGB object', () => {
      const result = hexToRgb('#ff0000');
      expect(result).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('should return null for invalid hex', () => {
      expect(hexToRgb('invalid')).toBeNull();
    });
  });

  describe('rgbToHex', () => {
    it('should convert RGB to hex', () => {
      expect(rgbToHex(255, 0, 0)).toBe('#ff0000');
      expect(rgbToHex(0, 0, 0)).toBe('#000000');
      expect(rgbToHex(255, 255, 255)).toBe('#ffffff');
    });
  });
});

describe('Business Logic - License Validation', () => {
  let storage: Record<string, string> = {};

  beforeEach(() => {
    storage = {};
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key: string) => storage[key] || null),
        setItem: jest.fn((key: string, value: string) => { storage[key] = value; }),
        removeItem: jest.fn((key: string) => { delete storage[key]; }),
        clear: jest.fn(() => { storage = {}; }),
      },
    });
  });

  afterEach(() => {
    // Clean up
    storage = {};
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
    });
  });

  describe('validateLicenseKey', () => {
    it('should validate correct license key format', () => {
      const result = validateLicenseKey('INV-PRO-ABCD-EFGH-IJKL-MNOP');
      expect(result.valid).toBe(true);
    });

    it('should reject invalid format', () => {
      const result = validateLicenseKey('invalid-key');
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject empty key', () => {
      const result = validateLicenseKey('');
      expect(result.valid).toBe(false);
    });

    it('should reject too short key', () => {
      const result = validateLicenseKey('INV-PRO-ABCD');
      expect(result.valid).toBe(false);
    });

    it('should be case insensitive', () => {
      const result = validateLicenseKey('inv-pro-abcd-efgh-ijkl-mnop');
      expect(result.valid).toBe(true);
    });
  });

  describe('activateLicense', () => {
    it('should activate valid license', () => {
      const result = activateLicense('INV-PRO-ABCD-EFGH-IJKL-MNOP');
      expect(result.isValid).toBe(true);
      expect(result.features.logo).toBe(true);
      expect(result.key).toBe('INV-PRO-ABCD-EFGH-IJKL-MNOP');
    });

    it('should not activate invalid license', () => {
      const result = activateLicense('invalid-key');
      expect(result.isValid).toBe(false);
      expect(result.features.logo).toBe(false);
    });

    it('should store license in localStorage', () => {
      activateLicense('INV-PRO-ABCD-EFGH-IJKL-MNOP');
      const info = getLicenseInfo();
      expect(info.isValid).toBe(true);
    });
  });

  describe('getLicenseInfo', () => {
    it('should return invalid for no license', () => {
      const info = getLicenseInfo();
      expect(info.isValid).toBe(false);
      expect(info.key).toBeNull();
    });

    it('should return valid license info when activated', () => {
      activateLicense('INV-PRO-ABCD-EFGH-IJKL-MNOP');
      const info = getLicenseInfo();
      expect(info.isValid).toBe(true);
      expect(info.features.templates).toBe(true);
    });
  });
});

describe('Business Logic - Currency', () => {
  describe('getCurrencyByCode', () => {
    it('should return currency for valid code', () => {
      const usd = getCurrencyByCode('USD');
      expect(usd.code).toBe('USD');
      expect(usd.symbol).toBe('$');
    });

    it('should return default currency for invalid code', () => {
      const currency = getCurrencyByCode('INVALID');
      expect(currency.code).toBe('USD');
    });

    it('should return correct currency for all defined currencies', () => {
      CURRENCIES.forEach(c => {
        const result = getCurrencyByCode(c.code);
        expect(result.code).toBe(c.code);
      });
    });
  });
});

describe('Business Logic - Debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should delay function execution', () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func, 100);

    debouncedFunc();
    expect(func).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(1);
  });

  it('should only call function once for multiple rapid calls', () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func, 100);

    debouncedFunc();
    debouncedFunc();
    debouncedFunc();

    jest.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(1);
  });
});
