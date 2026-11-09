# Showroom asset replacement specification

The current procedural furniture is a temporary fallback. It does **not** satisfy the photographic target. No reference image was attached to the received brief. The only downloaded detailed model is the licensed Poly Haven plant.

## Assets still required

1. Upholstered king bed: stitched beige channel headboard, upholstered rails and footboard, physically plausible compressed mattress, joinery and feet. Avoid identical pill-shaped channels; vary upholstery tension.
2. Blender-authored cotton sheet and two pillowcases: settle cloth offline on the mattress, apply modifiers, preserve asymmetric folds, thin doubled hems, piping and tucked corners. No runtime cloth solver. Sheet must cover all exposed mattress faces. Add a separate draped knitted throw with actual edge thickness and restrained fibre detail.
3. Two coordinated oak nightstands with detailed drawers, edge bevels, joinery, handles and believable end-grain UVs. Lamps need translucent woven shades and glazed ceramic or stone bodies.
4. Full architectural shell with paneled walls, balcony/window reveals, framed botanical art, pleated linen curtains, textured rug, seating/decor and consistent real-world scale.
5. Neutral photographed cotton base colour, OpenGL normal, roughness and optional height/AO maps. Keep dye information out of normal/roughness. Bake indirect light and contact occlusion carefully without painting directional highlights into base colour.

## Export contract

- Deliver a complete `public/showroom/room.glb`; GLB 2.0, Y-up, meters. Origin at bed center on the floor; bed head toward -Z, foot toward +Z.
- Match current dimensions: bed ~3.4 wide by 4.1 long in scene units; sheet top ~Y=1.03; bed center Z=0.18, back wall Z=-2.75, window at X=-4.6. These are scene units for compatibility, not a claim of real furniture measurements. Alternatively uniformly scale all assets to this envelope before export.
- Use **exact material names** `bedding_sheet` and `bedding_pillowcase`. Only these are cloned and recoloured. Use neutral/almost-white base textures so the dye tint is accurate. Keep the throw and upholstery on separate material names.
- UV0: tiled cloth pattern coordinates; UV1: baked light/AO if used. PBR base colour sRGB; roughness/normal/AO linear. Use glTF-compatible baked materials; no Blender procedural shader dependencies.
- Embed all textures; no external CDN dependencies. 1K mobile/2K hero maps, 4K only if a measured close-up needs it. Supply neutral base fabric and optional product-specific print files.
- Target <200k triangles/<10 MB desktop; hard structural validator limits 450k triangles/18 MB. Mobile should use lightweight fallback or a future separate <70k-triangle asset. Keep draw calls under 100 where feasible; share materials and instance repeated details.
- Provide source `.blend`, export settings, a render of wide/detail views, triangle/material counts, asset provenance, licence text and explicit redistribution rights. A download link alone is insufficient.

## Prepare and activate

1. Export the GLB with applied transforms. Remove hidden geometry, cameras, lights and unused resources. Bake cloth simulation before export.
2. Optimize using the optional CLI: `npx --package @gltf-transform/cli gltf-transform optimize input.glb public/showroom/room.glb --compress meshopt --texture-compress webp`. Review output visually; compression must preserve cloth folds and seams. The loader enables Meshopt decoding. Avoid Draco unless a local decoder is configured.
3. Validate: `node scripts/validate-showroom-model.mjs public/showroom/room.glb`. This inspects structure/material tags and budgets; it does not certify licensing, normals, scale or appearance.
4. Set `VITE_SHOWROOM_MODEL_URL=/showroom/room.glb` in `.env.local` and restart Vite (or rebuild for deployment). Empty means the temporary fallback. A loading or contract failure falls back to the current authored room.
5. Check every colour at wide/detail views, both lamps and tables in the initial frame, all camera paths, normal-map orientation, UV scale, shadow contact, no clipping and mobile behavior. Run tests and inspect real-device performance.
6. Product-specific textures use the optional `bedroomTexture` property on product records. Changing a product retains geometric folds and swaps only the bedding base-colour map. Compatible variants are real catalogue products; the cart includes fabric and pattern.

The existing `public/showroom/ASSETS.md` records the downloaded CC0 sources. Any new purchased asset requires separate licence verification before distribution.

