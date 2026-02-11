# 🔐 Licensing Update — Parking Lot

> **Status:** Parked — tackle after SEO + Netlify deployment is live.

---

## Current Problem

The license system is **client-side regex only** — any key matching `INV-PRO-XXXX-XXXX-XXXX-XXXX` unlocks Pro.
No server verification, no Gumroad API integration, easily bypassed via DevTools.

## Planned Solution: Gumroad API Verification

1. **Replace** regex validation with a `fetch()` call to Gumroad's `POST /v2/licenses/verify`
2. **Use Gumroad's native license keys** (auto-generated per purchase)
3. **Store** verified key + timestamp in localStorage
4. **Re-verify** periodically (every 7 days) — works offline between checks
5. **Track activations** — optional limit (e.g., 3 devices per key)

## Files to Modify

| File | Change |
|------|--------|
| `src/lib/license.ts` | Replace regex with Gumroad API call |
| `src/hooks/useLicense.ts` | Make `activate` async, add re-verification |
| `src/components/LicenseKeyInput.tsx` | Update key format, add loading states |
| `src/types/invoice.ts` | Add `verifiedAt` field to `LicenseInfo` |

## Prerequisites (Do First)

- [ ] Deploy app to Netlify (need live URL)
- [ ] Create Gumroad product listing ($12 one-time)
- [ ] Get Gumroad Product ID for API integration

## Open Questions

1. Activation limit per key? (unlimited vs 3 devices)
2. Re-verification frequency? (7 days suggested)
3. Gumroad Product ID (need after listing is created)

---

*Full analysis: see the conversation history or ask Antigravity to regenerate the licensing strategy.*
