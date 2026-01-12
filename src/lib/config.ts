/**
 * Monetization Configuration
 * All pricing and feature constants for the one-time unlock
 */
export const MONETIZATION = {
    // Price in ZAR (South African Rand)
    PRICE_ZAR: 49,
    PRICE_DISPLAY: 'R49',

    // Watermark shown on free PDFs
    WATERMARK_TEXT: 'Generated with SA Invoice Generator',

    // localStorage keys
    STORAGE_KEY: 'sa-invoice-unlocked',
    LOGO_STORAGE_KEY: 'sa-invoice-logo',

    // Logo constraints
    MAX_LOGO_HEIGHT: 80, // pixels
    MAX_LOGO_WIDTH: 200, // pixels
};
