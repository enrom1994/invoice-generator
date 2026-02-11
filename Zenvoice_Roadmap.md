# 🚀 Zenvoice Launch Roadmap

> The plan to rebrand, SEO-optimize, deploy, and monetize.

---

## Phase 1: Rebrand — "Invoice Generator" → "Zenvoice" 🎨

**Goal:** Apply the Zenvoice brand identity across the entire app.

### Brand System (from Brand_change.md)
| Element | Value |
|---------|-------|
| **Name** | Zenvoice |
| **Tagline** | Simple invoices. No signup. No subscriptions. |
| **Primary Color** | Deep Calm Indigo `#2B2F77` |
| **Accent Color** | Zen Teal `#2EC4B6` |
| **Background** | Soft Off White `#F7F8FB` |
| **Dark Text** | `#1C1C1C` |
| **Muted Text** | `#6B7280` |
| **Success** | `#4CAF50` |
| **Heading Font** | Sora |
| **Body Font** | Inter (already in use) |
| **Logo** | `/public/Zenvoice_Logo.png` |
| **Wordmark** | `/public/Zenvoice_wordmark.png` |
| **Favicon** | `/public/favicon.ico` |

### Files to Change
| File | What Changes |
|------|-------------|
| `layout.tsx` | Title, meta, fonts, favicon |
| `page.tsx` | Header (logo + wordmark), footer, tab colors, default accent |
| `globals.css` | Focus ring colors, background gradient |
| `InvoiceForm.tsx` | All emerald → brand colors |
| `LineItems.tsx` | Button/focus colors |
| `LicenseKeyInput.tsx` | All emerald → brand colors |
| `TemplateSelector.tsx` | Selection/badge colors |
| `PROFeaturesModal.tsx` | Button/badge colors |
| `ProSettingsPanel.tsx` | Icon/badge colors |
| `PaymentQRSettings.tsx` | Toggle/input colors |
| `PaymentMethodToggle.tsx` | Active state color |
| `PaymentTermsSelector.tsx` | Button colors |
| `WhatsAppSettings.tsx` | Focus colors |
| `LogoUpload.tsx` | Hover/border colors |
| `QRCodeDisplay.tsx` | Spinner color |
| `watermark.ts` | Watermark text |
| `package.json` | Package name |

---

## Phase 2: SEO 🔍

**Goal:** Rank for "free invoice generator no watermark" and related searches.

### What to Add
1. **JSON-LD Schema** — `SoftwareApplication` structured data in `layout.tsx`
2. **OG Image** — 1200×630 branded preview image → `public/og-image.png`
3. **SEO Content Section** — ~300 words below the app in `page.tsx` targeting keywords
4. **Updated README.md** — Zenvoice branding for GitHub SEO
5. **Updated FEATURES.md** — Zenvoice branding

### Target Keywords
- "free invoice generator no watermark"
- "invoice generator no signup"
- "offline invoice maker"
- "private invoice generator"
- "WhatsApp invoice generator"
- "freelance invoice creator"

---

## Phase 3: Netlify Deployment 🌐

**Goal:** Get Zenvoice live at `zenvoice.netlify.app`

### Steps
1. Remove `basePath` and `assetPrefix` from `next.config.ts`
2. Create `netlify.toml` build config
3. Verify local build: `npm run build`
4. Create GitHub repo + push
5. Connect to Netlify → auto-deploy from `main`
6. Custom subdomain: `zenvoice.netlify.app`

---

## Phase 4: Gumroad Listing 💰

**Goal:** Start selling Pro licenses.

### Steps (you do this)
1. Create product on Gumroad: "Zenvoice PRO — Lifetime License"
2. Price: $12 one-time
3. Enable license key generation
4. Add product URL to the app's "Purchase PRO" button
5. Later: integrate Gumroad API for license verification (parked in `Licensing_update.md`)

---

## Execution Order

```
Phase 1 (Rebrand) → Phase 2 (SEO) → Phase 3 (Deploy) → Phase 4 (Gumroad)
        ↑ We start here
```

> **Phase 1 + 2 + 3** = Antigravity does the code
> **Phase 4** = You set up on Gumroad
