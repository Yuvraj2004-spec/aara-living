# Photographic room preview

The main showroom now uses a single image-based room. The earlier unrelated Unsplash image/Three.js room switch has been removed from the storefront. Legacy 3D components remain available in source but are not downloaded by the main showroom.

`public/showroom/photographic-room.png` is an AI-generated concept interior, created with the built-in imagegen tool. It is not a photograph of actual products, stock, or a customer's room. The UI labels it accordingly. It is not a reconstructed navigable 3D scene.

`src/components/photoMask.ts` traces the sheet and two pillowcases. `PhotographicRoom.tsx` reads original pixels once and composites masked colour into the same room. `photoColour.ts` performs sRGB/linear conversion and uses masked median luminance as the swatch reference. Neutral midtone maps to the actual swatch hex; original luminance retains folds, highlights and shadows. Mask-excluded pixels remain identical. Real dyed fabric still requires genuine product photography and colour-managed review; screen displays are not a colour guarantee.

The cart, catalogue variant combinations, quantity, sizing, fabric/pattern options and checkout routing are preserved. Botanical is a demonstration print inside the bedding mask; product-specific photographed prints still need real source material.

Scrolling provides restrained photographic zoom and text transitions with native scrolling and cleanup. It does not simulate a free-moving camera. Motion can be paused. Reduced-motion keeps recolouring active without zoom. Mobile shows the complete 3:2 room above the panel.

## Asset prompt

Built-in imagegen, no CLI/API key used. Prompt: photorealistic editorial luxury bedroom; cream paneled walls, oak flooring, oatmeal rug, beige channel headboard, walnut nightstands, warm ceramic lamps, left balcony window, linen curtains, plant and paired botanical artwork; full bed in a three-quarter photographic view; plain neutral ivory/light grey cotton sheet and exactly two matching pillows; natural folds; no throw, print, text, UI or watermark. Neutral bedding is intended for isolated interactive recolouring.

For real stock photography, replace the concept image with a commissioned room/product photograph and retrace the normalized bedding contours. Keep pixels and masking in the same coordinate system. Do not swap unrelated imagery when a colour is selected.
