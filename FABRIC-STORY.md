# Real fabric scroll sequence — source material required

## Current status

The component is implemented but intentionally not shown: `fabricStories` is empty because no genuine product footage or verified construction details have been supplied. Existing demo catalogue descriptions and AI-generated room images are not evidence of construction. No invented layer count, filling, composition, thickness or certification is published.

The implementation scrubs an original video; it does not fabricate an exploded view. Publication is a manual owner decision. Schema validation checks completeness and timing only; it cannot establish that an asset or claim is truthful.

## Supply these inputs

- Identify the exact product/SKU to feature. Explain whether the desired detail is woven structure, multiple sewn layers, filling, a backing, or a finish. Do not assume that a bedsheet has multiple layers.
- Provide original continuous macro/cross-section footage of that actual product, together with a real still frame for the poster. If the product has several actual layers, show the physical cut edge or actual disassembly in the recording. If it is one woven fabric, show that structure instead of adding layers.
- Supply manufacturer construction specifications or an owner-reviewed product construction record supporting each caption. Do not infer composition, thread count, GSM, layer thickness or performance from an image. Use measured values only when the measuring method and source are documented.
- Confirm rights to publish the recording and source information. Redact confidential supplier information before including publicly visible evidence references.

Suggested capture: a stable, well-lit continuous 8–15 second video, true-to-life colour, macro detail and a neutral background. Include a ruler only if discussing dimensions. Do not use generated/interpolated material frames. Export H.264 MP4 or compatible WebM, seek-friendly keyframes every ~0.25–0.5 seconds, MP4 fast-start metadata and no audio dependency. Keep source originals and an export log. Compression must not erase the construction detail being discussed.

## Configure when verified

Place assets under `public/fabric/`. Populate `src/lib/fabricStories.ts` with the exact matching product ID, title, original video path, real poster path, measured recording duration, reviewer/date, publication-rights confirmation and construction confirmation. Set sourceKind to original-product-footage. Each observation has atSeconds, title, description and a nonempty evidenceReference.

The schema requires ordered observation times within the recording. The player also checks actual media duration against the configured duration; a mismatch disables scrubbing. Explain only what the recording and sources demonstrate. One observation is supported; multiple layers are never forced.

`FabricStory` appears beneath the photographic showroom only for the currently configured product with an accepted record. There is no fallback generated video. Missing/unaccepted records render no section. Loading failures retain the poster and disclose that footage is unavailable. Native controls are available instead of scroll scrubbing. Reduced-motion and Save-Data modes use manual playback. The recording is muted, inline and never autoplays.

## Verification still required

With the genuine assets, verify frame-accurate seeks, timestamps, caption truth, legibility, video duration, product matching, rights, mobile performance and reduced-motion/native-control behavior. Test in Chrome, Safari/iOS and representative Android devices. No claim of factual authenticity or end-to-end footage playback has been made without that source material.

## Visible scroll reference section

Following the user's reference-image clarification, FabricStory now falls back to a visible FabricDetail photo/scan inspection section rather than rendering nothing. The original verified-footage route is still preferred when a matching reviewed record is supplied. No fabricated product construction record has been added.

FabricDetail uses the original downloaded base-colour scan of Fabric Pattern 07 from Rob Tuytel / Poly Haven. Its CC0 source and metadata are recorded in public/fabric/REFERENCE-SOURCE.md. Scrolling pans/magnifies that same image through surface, weave and detail stages. No cloth is simulated; no generated fibres, extra layers or assumed mattress construction are shown. This is a reference material, not the selected SKU, and the UI says so. The scan cannot verify our product's fibre content, thread count, finish or physical quality.

The animation uses native scrolling, a CSS sticky section and scrubbed GSAP transforms without frame-by-frame React updates. It has a pause toggle, chapter navigation, a full-resolution image link, resizing/unmount cleanup and a static reduced-motion layout. No generative image tool was used for this section.
