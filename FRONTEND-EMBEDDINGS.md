# Browser embeddings: implementation walkthrough

This feature uses real text embeddings, not keyword rules presented as AI. It has no vector database, API key or search server. The catalogue contains eight demonstration bedsheets. No comfort, organic certification or other unverified product claims are added.

1. `src/lib/semantic.ts` builds a short document from each product's actual attributes. Sage is described as sage green to make the colour understandable outside the store's naming scheme.
2. When a shopper enables **Search by meaning** and enters text, `useSemanticSearch.ts` starts a module Web Worker after a 400 ms debounce. Ordinary browsing never loads the embedding runtime.
3. `semantic.worker.ts` loads Transformers.js and the quantized `Xenova/all-MiniLM-L6-v2` model. Mean pooling and normalization produce sentence vectors. Model files download from Hugging Face on first use, potentially tens of MB, and the runtime uses browser caching where supported. Inference runs locally; the query is not sent to an embedding API. Network access is needed for the initial model/runtime downloads.
4. Product vectors are computed once per worker session and stored in memory. Query vectors use the same model. Cosine similarity ranks the small in-memory index. There is no approximate vector index and no database.
5. The UI applies the existing explicit price, fabric, size, colour, pattern, thread-count and stock filters. It ranks the remaining results by similarity. In meaning mode, all matching-filter products are ranked; there is deliberately no unvalidated relevance cutoff or percentage-confidence badge. Unrelated queries may therefore still return products.
6. Request IDs discard stale responses. Model loading and failures are announced accessibly. Keyword search remains available and is used while loading or on failure. Switching meaning search off and on retries. A worker keeps model inference off the main UI thread; inference itself is serialized.
7. Test cosine ranking separately from model quality. Run `npm run test`, `npm run test:e2e` and `npm run build`. Browser tests with a stub worker validate UI behavior only; manually test the real model on a cold cache and on mobile. Try “green cotton bedding”, “botanical print” and an unrelated query. Record actual results and latency before making CV performance claims. Eight demo products are insufficient to demonstrate large-scale retrieval quality.

## Running locally

Run `npm ci`, then `npm run dev`; open `/collection`, enable meaning search and enter a query. No `.env` or backend setup is required for demo shopping/search. If downloads are blocked by a firewall, browser policy or offline state, normal keyword search continues working.

## GitHub and Vercel

Before publishing, review the files staged for commit: never commit `.env` files, tokens, local revision backups or generated test artifacts. This folder may need Git initialization and a remote once the owner supplies their repository URL. No remote has been configured or deployed by this change.

Vercel: import the GitHub repository, choose Vite, build with `npm run build`, output `dist`. `vercel.json` supplies SPA routes and security headers, including narrowly permitted model/runtime download hosts and WebAssembly execution. No database environment variables are needed for this demo. After deployment, verify a direct `/product/sage-cotton` link, mobile filters, model download and the sandbox cart/checkout. Live checkout remains disabled.

## Explaining it in an interview

“I added client-side semantic product search using Transformers.js sentence embeddings, a Web Worker and cosine similarity over an in-memory vector index. I preserved structured shopping filters and provided a keyword fallback.”

Do not describe this version as a vector database, RAG chatbot, trained model or production-scale recommendation system. A later backend can reuse the same document construction and model contract when persisting vectors.

References: https://huggingface.co/docs/transformers.js/pipelines and https://vercel.com/docs/frameworks/frontend/vite


Current retrieval upgrade: catalogue keyword search now uses BM25 over product facts. Meaning mode offers dense-only and hybrid BM25 + embeddings via Reciprocal Rank Fusion. The evaluation also retains the original name-substring baseline. See RESUME-ALIGNMENT.md for current algorithm details and limitations.
