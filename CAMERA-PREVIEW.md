# Camera room preview — demo

Open **Try in your room** in the showroom corner. Camera permission is requested only after pressing Start camera. Capture a still image or upload a JPG/PNG/WebP, then mark four corners of the bedsheet clockwise. Try a colour, explore preset suggestions, and apply the chosen colour back to the showroom.

The camera stops after capture, on Stop camera, on close and on unmount. Late permission responses after close have their tracks stopped. Photos stay in browser memory, are never uploaded by this demo and are discarded on close. No microphone is requested. Production camera use needs HTTPS; localhost also works. Hosting headers permit camera access for the same origin only.

This is a manual polygon mask with luminance-preserving colour compositing. It has no automatic bed detection, segmentation, AI room analysis, realistic textile replacement or live AR tracking. Suggestions are explicit palette/mood presets chosen by the user; they are not model-generated. Four ordered points describe an approximate visible surface; reset if the polygon crosses itself or includes other objects. Existing patterns and occlusions may remain visible.

## Server integration when the owner supplies a provider

1. Choose an image-capable provider supporting the required detection/segmentation or image-editing task. A generic vision description API alone does not produce a reliable bedding mask.
2. Add a server endpoint, with provider keys stored as server secrets, never VITE variables or committed credentials. The client must explicitly disclose and initiate photo upload before using it; update the current local-only privacy statement at that point.
3. Validate image size/type, set retention rules, enforce request limits and timeouts, and handle refusals and missing-bed responses. Do not expose paid unauthenticated unrestricted inference.
4. Define the response contract: detected bed region or segmentation mask aligned to the image, uncertainty, room palette, suggested catalogue colour IDs and concise reasons. Validate all suggested IDs against actual product availability.
5. For a generated preview, use the original user image as reference, preserve surrounding furniture and clearly label the result as an AI preview. A bounding box alone is insufficient for safe, convincing recolouring.
6. Evaluate on varied room lighting, partly hidden beds and non-bedroom images. Test no-bed detection, failed uploads, denied camera permissions and cleanup on navigation before enabling public inference.

No provider request, paid service or API placeholder pretending to return model results has been added. The existing semantic search embeddings remain a separate working AI feature.
