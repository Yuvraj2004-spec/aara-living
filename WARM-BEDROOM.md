# Reference-inspired warm bedroom

Built-in image generation was used to create a new room and two edited size variants. These are AI-generated concept interiors, not actual product photographs or measured size representations. Original images remain available; the showroom now uses:

- `public/showroom/warm-room-king.png`
- `public/showroom/warm-room-queen.png`
- `public/showroom/warm-room-single.png`

`src/components/photoMask.ts` contains new cotton-only contours for each asset, normalized from 1536×1024 coordinates. Existing recolouring, pattern references, camera demo, purchase controls and no-zoom behavior are retained. Original `photographic-room*.png` files remain for historical documents and fixtures.

## Final prompt set

Primary image, built-in tool with the user's attached image as reference:

“Use case: photorealistic-natural. Create the new primary room image for a bedsheet store, using the attached bedroom photograph as STYLE AND COMPOSITION reference. Original concept image, not a screenshot recreation. Landscape 1536x1024. Warm minimalist real interior photography: king bed with rounded sand-beige heavily textured boucle headboard and low upholstered frame, generous sage-olive cotton bedding with natural folds and stitching, TWO plain cotton pillows without extra decorative cushions, oak bedside tables and ceramic lamps, tall black-framed windows to the left, flax curtains, warm plaster walls, a simple abstract framed artwork, pale woven rug. Camera three-quarter frontal view from foot-left, entire mattress and hanging sheet visible with floor margin. Bed occupies lower-middle to right, windows left. No throws covering sheet, no objects on bed. High-end tactile natural materials and believable soft daylight, restrained palette. Unbranded room visual, no website UI, labels, watermarks, bookmarks or logos. Keep the sheet one solid pale sage olive so the website can recolour it, gently lit and well exposed. Do not render a UI.”

Queen edit, using the primary image:

“Precise object edit for website bed size variant. Change only the king bed to a visibly narrower QUEEN bed, around 82% of its original width, with same length and same rounded boucle upholstery and sage cotton bedding. Retain TWO matching pillows. Keep camera framing, image dimensions1536x1024, entire room, windows, curtains, oak tables, lamps, artwork, rug, exposure and light unchanged. Make natural folds consistent with narrower bed. No text or watermark. This must visibly be between the original king width and a one-person single bed.”

Single edit, using the primary image:

“Precise object edit for website size preview. Change ONLY the king bed into a SINGLE one-person bed, 52% of original bed width, same length. ONE centered matching sage cotton pillow, same rounded sand boucle headboard now narrow, low upholstered frame and naturally folded plain sage olive bedding. Keep all windows, curtains, oak tables, lamps, rug, artwork and room completely unchanged. Preserve camera position and full image framing 1536x1024. Bed remains aligned in room, more floor visible at sides. No text, UI or watermark.”

Generated edits can have small differences; the requested percentages are art direction, not verified physical measurements. The original room photo's branding/UI were excluded from the generated scene.

Verification: production build and six targeted browser tests passed, including six colours, environment-pixel isolation, size changes, no scroll zoom, reference prints and shopping selections. Terracotta preview inspected visually. Mask boundaries and screen-space prints are approximate.
