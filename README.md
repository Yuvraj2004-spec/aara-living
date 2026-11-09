# Aara Living

## Current storefront

Bedsheet shopping demonstration with a reference-inspired warm bedroom, King/Queen/Single concept previews, interactive colours, budget collections, sample daily offers and a persisted variant-aware cart. Checkout is a sandbox; no order or payment is submitted.

Search includes browser-based MiniLM embeddings, BM25 keyword ranking and Reciprocal Rank Fusion. `/search-evaluation` compares retrieval strategies and exports measured results. First semantic use downloads a model. No vector database or embedding API key is required.

The camera demo captures/uploads local photos and uses manual four-corner masking. Palette/mood suggestions are presets. Automatic bed detection, realistic fabric replacement and AI room recommendations are not implemented. Photos are not uploaded by the demo.

For Vercel, import this repository using the Vite preset, `npm run build` and output `dist`. `vercel.json` supplies deep-link rewrites and camera/model security headers. No environment variables are needed for the demo. Keep secrets out of Git and browser `VITE_` variables.

See [RESUME-ALIGNMENT.md](RESUME-ALIGNMENT.md), [IMPLEMENTED-SKILLS.md](IMPLEMENTED-SKILLS.md), [WARM-BEDROOM.md](WARM-BEDROOM.md) and [CAMERA-PREVIEW.md](CAMERA-PREVIEW.md) for the current implementation. The architecture and production checklist below include historical optional 3D/backend scaffolding; the active showroom is an image-based concept preview with no scroll zoom.

A configurable Indian home-textile storefront built with React, strict TypeScript, Vite, Tailwind, React Three Fiber/Drei, GSAP, Motion, Zustand, React Router, Supabase, Zod and React Hook Form. This is an implementation in progress, not a production-ready store.

## Run

Use Node 22 or later. Run `npm install`, copy `.env.example` to `.env.local`, then `npm run dev`. The storefront works without credentials using an explicitly labelled demonstration catalogue. `npm run build` writes `dist/`; `npm run test` runs store tests. For browser checks, run `npx playwright install chromium` then `npm run test:e2e`.

## Architecture

- `src/main.tsx`: storefront routes, catalogue, detail, bag, sandbox checkout, locked admin and policy drafts.
- `src/lib`: configurable brand, demonstration products, real filter operations, variant-aware persisted cart and optional Supabase client.
- `src/scene/Bedroom.tsx`: replaceable procedural room components, smooth bedding-only colour interpolation, generated image fabric pattern, scrubbed GSAP camera timeline with unmount cleanup.
- `supabase/migrations`: relational schema, RLS, inventory reservation transaction and idempotent payment capture.
- `supabase/functions`: disabled-by-default provider order creation and authenticated payment webhook.

The bedroom has been upgraded with authored draped textile meshes, pillow piping, channel upholstery, pleated curtains, CC0 material maps, an HDR environment and a scanned glTF plant. See SHOWROOM.md for architecture, sources and limitations. It is still a real-time authored scene; photographic realism and exact reference matching are not claimed. The full scene remains opt-in; reduced-motion/WebGL-limited devices use photography. Botanical prints are project-authored canvas textures.

## Supabase setup

1. Create a Supabase project. Use the Supabase CLI to link it and apply `supabase db push`; apply the demonstration seed separately using the SQL editor or local `supabase db reset`.
2. Set `VITE_SUPABASE_URL` and the public anonymous key. Never expose service-role or Razorpay secrets through VITE variables.
3. Enable email OTP, configure the application URL and `/admin` redirect allowlist. Create the owner account, then insert its auth user UUID into `public.admin_roles` using the trusted SQL editor. Users cannot grant themselves roles.
4. Deploy the Edge Functions. Store `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` and `ALLOWED_ORIGIN` using Supabase secrets. Use test-mode keys first. The platform provides `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to functions.
5. Configure webhook JWT verification off for `payment-webhook` only; it verifies the raw-body Razorpay HMAC itself. Enable provider retries and subscribe to payment capture.

## Current limits — required before live commerce

Live checkout is intentionally disabled. Do not set `ENABLE_LIVE_CHECKOUT=verified` until the following are implemented and integration-tested:

- Replace the local sample catalogue adapter with Supabase queries and actual UUID variant mapping. Populate genuine products, images, inventory and tax treatment; every seed product is demonstration-only and rejected by reservation RPC.
- Integrate the browser Razorpay SDK with the authenticated server flow and payment status polling. Add server-side checkout callback signature verification. Browser callbacks must never mark an order paid.
- Add persistent per-customer/IP rate limits, a provider-order creation lease to prevent duplicate provider orders under concurrent retries, provider reconciliation after uncertain failures, reservation expiry/release and terminal failure handling. Failed provider requests currently leave inventory reserved; the flow stays gated for this reason.
- Add payment failed/pending handling and a reconciliation job; validate refunds and partial failures. Captured webhooks already use constant-time HMAC verification, event uniqueness, row locks and amount checks.
- Add a secure guest identity approach if guest checkout is required. Current server scaffold requires authenticated customers.
- Replace the technical JSON admin scaffold with friendly validated product, variant, category, stock, discount and fulfilment forms, order/revenue reporting and sales analytics. Image upload and RLS role checks exist; admin is not ready for family operation.
- Implement discount redemption validation, usage limits and transactional redemption; no discount is currently applied.
- Split route components, wire TanStack Query to backend operations, add server error monitoring, authenticated API tests, database RLS/concurrency tests and full payment lifecycle tests.
- Add verified product structured data, per-route SEO metadata, a real canonical origin and sitemap when the final domain and product catalogue are known. No fabricated business reviews or availability data are emitted.
- Verify dialog focus trapping/restoration, finish keyboard/accessibility review and measure device performance/Core Web Vitals.

## Cloudflare Pages

Create a Pages project connected to this directory's repository. Build command: `npm run build`; output: `dist`; Node version: 22. Set only the two public Supabase build variables. `_redirects` supports React Router deep links, and `_headers` sets baseline security headers. `wrangler.toml` also supports `npx wrangler pages deploy dist` after Cloudflare login. No deployment has been performed.

Update CSP for the exact verified Razorpay script, frame and API origins when real checkout is introduced. Do not broadly disable CSP. Configure custom domain, HTTPS, allowed-origin and auth redirect URLs together.

## Content and image provenance

The temporary brand can be edited in `src/lib/catalogue.ts` (some editorial copy also uses Aara). Product photos are remotely served Unsplash illustrative images, not actual product photography; verify licensing and archive attribution/source details before commercial deployment. They may differ from selected colours; only the 3D preview represents interactive colour selection. The newsletter previews submission without collecting email. Policy pages are editable owner-review drafts. No sandbox order, payment or address is stored.

## Launch checklist

- [ ] Complete the limits listed above; pass RLS, stock race, retry and payment signature tests.
- [ ] Verify Razorpay test and live-mode configuration and webhook delivery.
- [ ] Confirm genuine stock, photography rights, pricing/tax, legal name, support contact and policy drafts.
- [ ] Verify desktop/mobile browsing, deep links, fallback rendering, reduced motion and accessible keyboard controls.
- [ ] Run build, unit, browser and dependency security checks; resolve relevant findings.
- [ ] Measure Lighthouse/Core Web Vitals on real low-powered devices.
- [ ] Enable backups, logging redaction, payment alerts and recovery procedures.
- [ ] Deploy and verify custom domain, security headers and a real end-to-end order before opening sales.


