/**
 * Format a number as South African Rand (ZAR)
 * @param amount - The amount to format
 * @returns Formatted string like "R 1,234.56"
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

/**
 * Generate a unique ID for line items
 */
export function generateId(): string {
    return Math.random().toString(36).substring(2, 9);
}

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
}

/**
 * Get a date 30 days from now in YYYY-MM-DD format
 */
export function getDueDate(): string {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
}

/**
 * Format a date string to a readable format
 */
export function formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}
