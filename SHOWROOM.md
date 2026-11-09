# Current experience

The active storefront uses the photographic colour compositor described in [PHOTOGRAPHIC-ROOM.md](PHOTOGRAPHIC-ROOM.md). The Three.js implementation below is retained as legacy source and is no longer mounted by the storefront.

# Luxury bedroom showroom

The showroom UI lives in `src/components/Showroom.tsx`, with rendering in `src/scene/`. Catalogue, authentication, admin and checkout routes remain in place; the showroom now uses the same cart and checkout.

- `Bedroom.tsx`: local HDR environment, warm practical lights, cached static shadows, visibility observer and on-demand rendering.
- `geometry.ts`: authored cloth surfaces, pillow shells, edge piping and pleated curtain geometry. These are fixed mesh shapes, not runtime cloth simulation.
- `Textiles.tsx`: bedding-only material transitions; print map; draped knitted throw with instanced fringe.
- `Room.tsx`: architectural mouldings, balcony glazing, upholstered channel headboard, bedside furniture, lamps, framed botanical art and scanned plant.
- `materials.ts`: locally served CC0 normal/roughness/colour maps, cotton sheen and natural wood colour treatment.
- `Fringe.tsx`: instanced textile threads to reduce draw calls.

The original reference image was not present in the received message. The scene follows the written description; exact reference matching and photographic realism are not claimed. Bedding and upholstery use authored geometry rather than a Blender cloth simulation. Real fabric scans, professionally modelled cloth and baked indirect light remain the next quality improvements.

The showroom defaults to sage, unless a product-preview colour is supplied. Users explicitly load the room. Scrolling retains native browser behavior; GSAP moves the camera from a room view toward the fabric and back to a three-quarter angle. Colour transitions affect the sheet and pillowcases only. The throw, headboard and rest of the room retain their materials. No React state is updated per animation frame. Reduced-motion or WebGL-limited devices retain the existing photograph fallback.

All downloaded resources are stored under `public/showroom`; attribution, source links and CC0 licensing are in `public/showroom/ASSETS.md`. The asset downloader can reproduce the files but is not required to run the site. Maps are 1K. The runtime assets total about 6.2 MB after plant compression and load only with the opt-in scene. DPR is capped at 1.5 (1 in Lightweight mode), shadows are cached, rendering pauses offscreen and idle frames are not rendered. Representative real-device frame-rate profiling remains necessary.

Run `npm run dev` and enter the showroom from the home page. `npm run test:e2e -- tests/showroom.spec.ts` checks loading, selection, close/reopen and mobile overflow, and captures desktop/mobile screenshots. It does not prove photorealism, all material pixel values, or target-device performance.

## Full-brief implementation

The showroom now has a separate desktop room/product-panel split (75/25 at wide sizes, a minimum readable panel at narrower sizes) and vertical mobile layout. Controls do not overlay the bed. The panel uses actual catalogue products for fabric/pattern combinations, disables unavailable sizes, validates quantity and passes colour/size/fabric/pattern into the existing persisted cart. Buy Now continues to the existing explicitly labelled sandbox checkout.

The showroom precedes the catalogue. The camera holds a wide reveal, approaches, shows fabric detail, returns to a three-quarter view and continues into shopping. Scroll text transitions use GSAP; camera animation stays outside React's render cycle. Mobile starts with lower render quality; customers can select Balanced or Lightweight. WebGL context loss switches to the photograph without disabling shopping.

`ReplacementRoom.tsx` supports an optional complete GLB with isolated bedding material clones. Read `public/showroom/REPLACEMENT-SPEC.md` for exact material tags, geometry specifications, source/license requirements, compression commands and activation steps. Run the structural validator before activating a model. No finished luxury bed/nightstand/lamp GLBs have been supplied, so those objects remain clearly documented temporary authored fallbacks. The photographic acceptance criterion remains unmet.


