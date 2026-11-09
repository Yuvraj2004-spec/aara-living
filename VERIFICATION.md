# Verification record

- Strict TypeScript compilation: passed.
- Vite production build: passed; large bundle warnings remain.
- Vitest: 5 tests passed for combined filtering, sorting, variant merging, stock clamps, removal and shipping thresholds.
- npm audit after upgrading Zod and Vitest: 0 vulnerabilities reported.
- Playwright: 3 tests passed after installing Chromium: selected-variant cart persistence and sandbox checkout navigation; mobile menu and category filtering; homepage rendering and mobile overflow. Desktop/mobile screenshots captured in test-results.
- Supabase migration, RLS concurrency, webhook and real payment tests: not run; require backend configuration.
- No hosting deployment performed.


## Bedroom upgrade verification

- Upgraded showroom: TypeScript and production build passed; 5 store unit tests passed.
- Existing shopping and layout browser checks: 3 passed.
- Dedicated showroom browser check passed on an isolated retry: local asset loading, default sage selection, terracotta selection, close/reopen, mobile overflow and no page errors.
- An earlier combined run failed because a README save triggered Vite's full-page reload during the test. The isolated retry passed with no file changes.
- Visual review: desktop and mobile screenshots inspected. The scene remains recognizably computer-rendered and does not yet meet the requested photographic target. Reference image was not supplied in the received message.
- Final ceiling correction: production build passed. Dedicated showroom test passed again (40.8 seconds), including visible mobile close controls and no horizontal overflow.


## Full brief follow-up verification

- Production build and strict TypeScript: passed, including the final shadow-quality invalidation adjustment. Vite still reports large-bundle warnings. Local preview returned HTTP 200.
- Unit tests: all 5 passed with the extended cart fields.
- Existing catalogue/cart/checkout/mobile-navigation and homepage browser tests: 3 passed.
- New configuration-to-cart test: passed. Cotton Botanical/Single/Terracotta quantity 2 appears in the bag with the correct price, fabric and pattern. Switching to premium cotton restores supported options.
- Reduced-motion test: passed; shopping remains available and no local 3D resources are requested.
- Showroom browser test: passed (24.3 seconds). Compressed model loads, controls do not overlap the desktop room, sage/terracotta selection works, close/reopen works, mobile controls are reachable and there are no page errors or horizontal overflow.
- Corrected two issues found in verification: exact label test locator ambiguity and intentional renderer disposal incorrectly triggering permanent image fallback.
- Dependency install/uninstall audit: zero vulnerabilities after removing the one-time optimizer CLI. Its compressed output remains in the project.
- Photographic realism, final furniture GLBs, licensed reference matching, real-device FPS and deployed Core Web Vitals remain unverified/unmet. Replacement specifications and validation workflow are in public/showroom/REPLACEMENT-SPEC.md.


## Photographic colour preview verification

- Replaced the unrelated static-photo/procedural-room toggle with one concept room image and a masked live bedding compositor.
- Eight unit tests passed, including exact swatch midtone calibration, unchanged unmasked pixels and retained luminance ordering.
- All six browser tests passed, including all six colour choices, pillow/sheet changes, unchanged wall/lamp pixels, mobile overflow, reduced-motion operation and existing cart/checkout navigation.
- Production build passed. Removed the unused lazy Three.js entry afterward to avoid emitting an unused 3D bundle; final rebuild follows.
- Visually inspected generated source and desktop/mobile screenshots. Hand-traced mask contours were refined around top and side bedding edges. The masking is a manual approximation and requires photographic review before commercial product use.
- The room is an AI-generated concept, not a genuine photographed SKU. Actual dyed fabric colour still requires real product photographs and physical colour verification.

## Visible material-detail section

- Added FabricDetail beneath the configured showroom, with full sample / weave / yarn-detail stages, native scrolling, scrubbed image pan/zoom, chapter navigation, pause/resume and reduced-motion layout.
- Source image: Rob Tuytel / Poly Haven Fabric Pattern 07 base-colour map (2K), licensed CC0. See public/fabric/REFERENCE-SOURCE.md. No generated material images or animated cloth were used in this section. Source metadata describes cotton; this is a reference sample and is explicitly not represented as this store's product.
- Build and strict TypeScript passed. All 12 unit tests and 8 browser checks passed, including zoom progression, unchanged source URL, no canvas/video inside the reference inspection, pause/resume and mobile reduced motion.
- Desktop and mobile screenshots visually inspected. The main build still reports a large-bundle warning.
- Actual bedsheet macro photography and construction proof remain required for SKU-specific material claims. Original-video records remain empty and can replace the reference section once reviewed footage is supplied.

## Minimal homepage refinement

- Homepage now has showroom, shared filterable catalogue, concise fabric/brand story, and shared minimal footer. Removed duplicate hero/room photo, benefits/announcement strip, quote, newsletter and separate fabric-story mount.
- Added View Full Room / Inspect Fabric controls targeting the same room. Simplified motion to one forward progression; reduced-motion uses immediate view changes.
- Preserved product/filter implementation, cart/checkout routing, admin/authentication and backend files. Homepage catalogue is the same Collection component with semantic section/headline options.
- Optional supplied GLB remains lazy-loaded with strict model failure handling and photographic fallback. Its visuals cannot be verified because no finished full-room GLB was supplied. Default room is still explicitly an AI-generated photographic-style concept with masked colour compositing, not fully modeled photorealistic 3D.
- Production build, 12 unit tests and all 6 browser tests passed across runs. A heading whitespace matcher was corrected in the new homepage test; its rerun passed. Checks covered four-part structure, actual homepage filters, all bedding colours, same-scene view controls, variant-to-cart flow, checkout persistence, mobile navigation/overflow and reduced motion.
- Desktop/mobile screenshots reviewed. Final navigation ARIA, touch targets and typography refinements verified: production build and all 6 browser checks passed. A further same-room regression confirms scrolling still moves forward/back after using both view controls; its targeted rerun and final build passed.


## Bed-size visual integration

- Existing King/Queen/Single dropdown retained. It now chooses corresponding photographic-style bed assets, with a narrower Queen and a Single bed with one pillow.
- Added per-image bedding masks and neutral colour calibration, preserving selected colour/pattern on size changes. Image loading cancels obsolete requests and clears readiness while a different size loads.
- Product-detail View in Bedroom links carry size and colour; the correct size remains in cart/checkout. Unsupported sizes stay disabled by the existing catalogue rules.
- Queen and Single images were edited with built-in imagegen from the existing King source and copied into public/showroom. Prompt/source paths and limitations are in BED-SIZE-PREVIEWS.md. These are illustrative AI-generated proportions, not measured SKU photographs.
- Visually inspected Queen and Single recoloured previews. Production build, 12 unit tests and all 8 browser checks passed. New checks cover all three image swaps, colour retention, botanical selection/cart size and product-detail size deep links.

## Room zoom removal

Removed the room's GSAP zoom and animated fabric-caption sequence, its extended pinned scroll layout, and pause/enable motion controls. Scrolling now passes naturally through the static preview. The Queen option uses the dedicated photographic-room-queen.png image and its own bedding mask. A regression test checks the Queen asset and unchanged image transform before and after scrolling.
