# Implemented skills and algorithms

## Working frontend

- React/TypeScript components, routing, state and responsive CSS; keyboard labels, status announcements, cart focus handling and reduced-motion support.
- Product filtering by category, fabric, colour, size, pattern, price, stock and thread count; price/date/featured sorting.
- Zustand persisted variant-aware cart, quantity validation, stock clamping and shipping/subtotal calculations. Demo purchases only.
- Canvas ImageData compositing: hand-authored bedding masks, linear-light colour conversion and median-luminance calibration preserve the surrounding room while recolouring bedding. Size-specific concept images are selected for King/Queen/Single.
- Illustrative procedural print masks (botanical, stripes, gingham, dots, floral). These are not physical fabric scans or accurate UV-mapped folds. Reference-only prints disable purchase controls.

## Working AI retrieval

- Pretrained all-MiniLM-L6-v2 sentence embeddings using Transformers.js, quantized q8 inference through WebAssembly in a Web Worker.
- Mean pooling, normalized embeddings, cosine similarity and exhaustive similarity ranking over an in-memory product index. No vector database and no model training.
- Product vectors cached per worker session; 400 ms query debounce, sequential query processing, stale-response suppression and keyword fallback.
- BM25 keyword retrieval over product facts (Unicode tokenization, stop-word removal, term-frequency saturation, IDF and length normalization). Hybrid retrieval combines lexical and dense rankings using Reciprocal Rank Fusion. The original name-substring search is retained as an evaluation baseline.

## Search evaluation

Open `/search-evaluation`, run the model and download JSON. Eight manually labelled development cases compare the original substring baseline, BM25, dense and hybrid rankings. Binary-relevance metrics: Precision@3, Recall@3, truncated reciprocal rank averaged as MRR@3, and nDCG@3 with logarithmic rank discount. No-relevant-result cases are reported separately, not assigned misleading scores. Full catalogue/model metadata, retrieval parameters and timings are exported.

The first query includes initialization and indexing; later timings include query embedding/ranking, lexical scoring, fusion and worker round trip. These are browser measurements, not isolated model inference benchmarks. Eight demo products and development labels cannot establish generalisation or scalable performance. Network download byte size is not measured by this dashboard. No semantic rejection threshold is implemented.

## Verification and deployment preparation

Vitest tests cover store logic, colour math, similarity and metric calculations. Playwright covers shopping, showroom, mobile layout, fallback, evaluation export and an optional real-model smoke test. Stub-worker tests establish UI behavior only. `vercel.json` configures SPA navigation and security headers; no GitHub/Vercel publication is claimed.

## Scaffolding / not live

Supabase SQL/RLS, inventory/payment function scaffolding and optional client configuration exist, but the store still uses demo products and sandbox checkout. Do not claim live payment processing, production authentication/admin, transactional shopping integration, AWS deployment, live monitoring, a vector database, RAG, reranking or fine-tuning as completed features.

Actual physical bedsheet designs require the owner's photographs/design files. GitHub/Vercel/AWS deployments require the owner's destinations and account access. These are separate milestones; no external accounts or paid resources were created.

## CV wording after reviewing and understanding the implementation

“Built a React/TypeScript bedsheet storefront with client-side sentence embeddings, Web Worker inference and cosine-similarity search; implemented a keyword baseline, retrieval evaluation metrics and downloadable experiment results.”

Add measured quality or latency numbers only after running and inspecting the benchmark, and disclose dataset size and device where relevant. AI-assisted implementation does not replace being able to explain, modify and debug the code independently.
