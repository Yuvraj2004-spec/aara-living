# Minimal storefront refinement

The homepage has exactly three content sections plus the shared footer:
1. One bedroom showroom and product configuration.
2. The filterable catalogue, reusing the same product/filter implementation as /collection.
3. Concise fabric-quality and family-brand copy.
4. Minimal footer with policy and admin links.

Removed the extra photographic hero, announcement/benefits strip, secondary interior story image, quote section, newsletter form, decorative outro and optional separate fabric-story mount. The cart drawer is retained as a user-requested shopping interaction; no automatic promotional popups were added.

Full Room / Inspect Fabric controls address the same scene. Default photo scroll is a single gentle forward zoom with no return sweep, no separate animated captions, and native scrolling. Reduced motion keeps direct view and colour controls usable without animated transitions. The full-room frame uses contain rather than cropping the photograph. Size/fabric/pattern combinations and variant persistence use existing catalogue/cart data.

## Honest asset status

The default scene remains the AI-generated photographic-style concept plus a bedding colour compositor. This preserves the existing visually detailed room and avoids reverting to the visibly procedural fallback. It is **not** a fully modeled photorealistic 3D room or actual product photography.

The optional 3D route is preserved via VITE_SHOWROOM_MODEL_URL. When a compatible full-room GLB is configured and WebGL/motion are available, the existing R3F renderer loads a single model and moves gently from the full-room position toward the bed. The new strict-model mode falls back to the photographic view on model failure instead of showing primitive furniture. Both direct view controls address that camera. No replacement GLB has been supplied, so this route's visual quality cannot be certified; source contract remains in public/showroom/REPLACEMENT-SPEC.md.

Backend schema, authentication, admin, checkout and route behavior have not been replaced. Existing demo checkout and admin limitations still apply. No new production-readiness or verified fabric claims are made.
