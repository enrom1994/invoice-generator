import { CurrencyConfig } from '@/types/invoice';

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

export function generateId(): string {
    return Math.random().toString(36).substring(2, 9);
}

export function getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
}

export function getDueDate(daysFromNow: number = 30): string {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split('T')[0];
}

export function formatDate(dateString: string, locale: string = 'en-US'): string {
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

export function formatDateShort(dateString: string, locale: string = 'en-US'): string {
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

export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function sanitizeFileName(name: string): string {
    return name.replace(/[^a-zA-Z0-9-_]/g, '_');
}

export function debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            func(...args);
        };

        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);
    };
}

export function calculateLineItemTotal(quantity: number, unitPrice: number): number {
    return quantity * unitPrice;
}

export function calculateSubtotal(lineItems: { quantity: number; unitPrice: number }[]): number {
    return lineItems.reduce((sum, item) => sum + calculateLineItemTotal(item.quantity, item.unitPrice), 0);
}

export function calculateTax(subtotal: number, taxRate: number): number {
    return subtotal * (taxRate / 100);
}

export function calculateTotal(subtotal: number, taxAmount: number): number {
    return subtotal + taxAmount;
}

export function formatPercentage(value: number): string {
    return `${value.toFixed(value % 1 === 0 ? 0 : 2)}%`;
}

export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + '...';
}

export function capitalizeFirst(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function titleCase(text: string): string {
    return text
        .split(' ')
        .map(word => capitalizeFirst(word))
        .join(' ');
}

export function generatePaymentReference(invoiceNumber: string, clientName: string): string {
    const cleanInvoice = invoiceNumber.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const cleanClient = clientName.slice(0, 4).replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    return `${cleanInvoice}-${cleanClient}`;
}

export function downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 100);
}

// Color manipulation helpers for Pro templates
export function lightenColor(hex: string, percent: number): string {
    // Remove # if present
    hex = hex.replace(/^#/, '');
    
    // Parse hex to RGB
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    
    // Lighten by percent
    r = Math.round(r + (255 - r) * (percent / 100));
    g = Math.round(g + (255 - g) * (percent / 100));
    b = Math.round(b + (255 - b) * (percent / 100));
    
    // Convert back to hex
    const toHex = (c: number) => c.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function darkenColor(hex: string, percent: number): string {
    // Remove # if present
    hex = hex.replace(/^#/, '');
    
    // Parse hex to RGB
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    
    // Darken by percent
    r = Math.round(r * (1 - percent / 100));
    g = Math.round(g * (1 - percent / 100));
    b = Math.round(b * (1 - percent / 100));
    
    // Convert back to hex
    const toHex = (c: number) => c.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function adjustAlpha(hex: string, alpha: number): string {
    // Remove # if present
    hex = hex.replace(/^#/, '');
    
    // Parse hex to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Return rgba format
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
