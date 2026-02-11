# ⚡ Zenvoice — Free Invoice Generator

Create professional invoices and quotations instantly — no signup, no watermarks, no subscriptions. 100% private, works offline, and all data stays in your browser.

🌐 **[Try Zenvoice →](https://zenvoice.netlify.app)**

## Features

### Free Features
- ✅ Create invoices and quotations
- ✅ Multi-currency support (USD, EUR, GBP, ZAR, and more)
- ✅ Configurable tax rate (any percentage)
- ✅ 3 free templates (Minimal, Modern, Compact)
- ✅ PDF download
- ✅ WhatsApp, Email & Link sharing
- ✅ Auto-save drafts
- ✅ Save client profiles
- ✅ Mobile-friendly design
- ✅ No signup required
- ✅ 100% client-side (data stays in your browser)

### PRO Features ($12 lifetime)
- ✅ Upload company logo
- ✅ Full RGB color customization
- ✅ 6 premium templates (Sidebar, Executive, Split, Card, Luxury Minimal, Letterhead)
- ✅ Payment QR codes
- ✅ Custom WhatsApp message templates
- ✅ Data backup (Import/Export)
- ✅ Priority support

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
```

Static output is generated in the `out/` directory.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Static Export)
- **Styling**: Tailwind CSS v4
- **PDF**: @react-pdf/renderer
- **Language**: TypeScript
- **State**: localStorage (no backend)

## Templates

### Free Templates
| Template | Description |
|----------|-------------|
| Minimal | Clean centered layout |
| Modern | Left-aligned with teal accents |
| Compact | Condensed single-page layout |

### PRO Templates
| Template | Description |
|----------|-------------|
| Sidebar | Two-column layout with sidebar |
| Executive | Premium corporate layout |
| Split | Creative two-column design |
| Card | Modern card-based layout |
| Luxury Minimal | Ultra-premium minimalist design |
| Letterhead | Full-width header image support |

## Deployment

### Netlify (Recommended)

1. Push code to GitHub
2. Connect to [Netlify](https://netlify.com)
3. Build command: `npm run build` → Publish directory: `out`
4. Or just push — `netlify.toml` handles the config automatically

## Monetization

PRO features are unlocked via license key purchased from Gumroad.

## License

MIT — Use it however you want!

## Contributing

PRs welcome! This is a simple tool meant to help people create professional invoices quickly.
