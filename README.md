# 🇿🇦 SA Invoice Generator

A free, client-side invoice generator built for South African freelancers. No signup, no backend, no tracking - your data stays in your browser.

## Features

### Free Tier
- ✅ Generate professional invoices
- ✅ ZAR currency formatting (R 1,234.56)
- ✅ Optional 15% VAT toggle
- ✅ PDF download (with small watermark)
- ✅ Mobile-friendly design

### Pro Tier (R49 once-off)
- ✅ No watermark on PDFs
- ✅ Upload your company logo
- ✅ Logo appears on all invoices
- ✅ Unlock remains forever (stored in browser)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **PDF**: @react-pdf/renderer (native PDF generation)
- **Language**: TypeScript
- **State**: localStorage (no backend)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run start
```

## Monetization Setup

### Configuration

Edit `src/lib/config.ts` to customize:

```typescript
export const MONETIZATION = {
  PRICE_ZAR: 49,           // Price in ZAR
  PRICE_DISPLAY: 'R49',    // Display string
  WATERMARK_TEXT: 'Generated with SA Invoice Generator',
  // localStorage keys
  STORAGE_KEY: 'sa-invoice-unlocked',
  LOGO_STORAGE_KEY: 'sa-invoice-logo',
};
```

### How It Works

1. **Free users** can generate invoices and download PDFs
2. When downloading, a small watermark appears at the bottom of the PDF
3. Clicking "Unlock Professional Invoice" simulates payment (TODO: integrate PayFast/Stripe)
4. After unlock, user can upload a logo and download watermark-free PDFs
5. Unlock state and logo are stored in `localStorage`

### Adding Real Payments

To integrate PayFast or Stripe, edit `src/components/UpgradeModal.tsx`:

```typescript
const handleUnlock = async () => {
  // TODO: Replace with real payment integration
  // Example: await processPayment()
  // On success:
  onUnlock();
};
```

**PayFast Integration:**
- Use PayFast's onsite payments or redirect flow
- On successful payment callback, call `onUnlock()`

**Stripe Integration:**
- Use Stripe Checkout or Payment Links
- On successful payment callback, call `onUnlock()`

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository on [Vercel](https://vercel.com)
3. Deploy with default settings

### Netlify

1. Push your code to GitHub
2. Connect to [Netlify](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `.next`

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # SEO metadata
│   ├── page.tsx            # Main invoice page
│   └── globals.css         # Global styles
├── components/
│   ├── InvoiceForm.tsx     # Form inputs
│   ├── InvoicePreview.tsx  # Live preview + logo support
│   ├── LineItems.tsx       # Dynamic line items
│   ├── DownloadPDFButton.tsx  # PDF + watermark logic
│   ├── UpgradeModal.tsx    # Payment modal
│   └── LogoUpload.tsx      # Logo file input
├── hooks/
│   └── useUnlockState.ts   # Unlock + logo localStorage hooks
├── lib/
│   ├── config.ts           # Monetization constants
│   └── utils.ts            # Currency & date helpers
└── types/
    └── invoice.ts          # TypeScript interfaces
```

## License

MIT - Use it however you want!

## Contributing

PRs welcome! This is a simple tool meant to help SA freelancers get paid faster.
