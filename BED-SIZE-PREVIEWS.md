# Bed-size image previews

The existing size dropdown is unchanged. Selecting King, Queen or Single now selects a matching room image. Source assets are mapped in src/components/photoMask.ts, with separate sheet/pillow masks for each image. The compositor uses the current colour and pattern with the chosen source and calibrates its neutral cloth midtone independently. Only the selected image is loaded; a loading state protects against stale recolouring, and effect cancellation prevents a slow older request replacing a more recent size selection.

Files:
- public/showroom/photographic-room.png — existing King concept.
- public/showroom/photographic-room-queen.png — edited Queen concept.
- public/showroom/photographic-room-single.png — edited Single concept, one pillow.

The Queen and Single assets were produced by the built-in imagegen tool in edit mode using the original room image as the target. Prompts instructed it to change only the bed: Queen about 15% narrower; Single about half-width with one pillow; keep length, room, camera, furnishings and lighting; retain plain neutral cotton bedding for recolouring; no text, UI or watermark. These are art-directed proportions, not actual product measurements. The generator can introduce small surrounding-image differences, so exact room pixel identity is not guaranteed between sizes. Within a given size, colour changes are confined to the bedding mask.

These previews are AI-generated concepts, not product photographs or dimensional fit verification. No actual size measurements or size-specific prices have been invented. Product availability, valid sizes, variant keys and cart/checkout selection continue using catalogue data.

The room preview is now static: no scroll zoom, fabric zoom caption or motion toggle. Queen continues to use its own two-pillow bed image, distinct from King and Single. Existing size options and colour/pattern compositing are unchanged.
