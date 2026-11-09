# Resume-aligned engineering scope

The owner's existing resume emphasises Python/FastAPI, applied AI, evaluation and full-stack delivery. This project supplies a public frontend/AI retrieval demonstration alongside that professional experience; it does not create additional employment experience or imply that this repository contains a Python service.

## Implemented retrieval architecture

Product facts → searchable document → two retrieval paths:

- Lexical: Unicode tokenization, a small explicit English stop-word list, BM25 term-frequency saturation, inverse document frequency and document-length normalization. Parameters: k1=1.2, b=0.75. No stemming, typo correction or automatic query-constraint extraction.
- Dense: pretrained MiniLM sentence embeddings, mean pooling and normalization, quantized browser inference and cosine similarity over an in-memory product index.

Hybrid mode combines the two rankings using Reciprocal Rank Fusion: each result receives `1 / (60 + rank)` from each list in which it occurs. Duplicate IDs contribute once per list; ties use stable product-ID ordering. RRF scores are ranking values, not probabilities or confidence percentages. The implementation is local TypeScript; it does not call Elasticsearch.

All strategies preserve explicit stock, price, fabric, pattern and size filters. Text mentioning “under 599” is not automatically converted into a price constraint; use the existing budget links or price filter. Ranking occurs before filter exclusion, so filtered products cannot reappear through fusion. BM25 is available immediately, including while model downloads fail. Search by meaning exposes “Meaning + keywords” and “Meaning only”.

## Research/evaluation demonstration

`/search-evaluation` compares the old substring baseline, BM25, dense and hybrid retrieval, and exports rankings, metric values, product facts, model identity, retrieval parameters and measured elapsed times. Metrics: Precision@3, Recall@3, MRR@3 and binary nDCG@3. No-relevant-product queries are excluded from averages and shown separately. The dataset is eight manually authored development cases over eight demo products, not a held-out study or proof of improved relevance. No optimality or performance improvement is claimed without inspecting measured results. Adding products or revising relevance labels can change comparisons.

## How to demonstrate it

1. Open `/collection`; search “400 thread count” without downloading a model. BM25 matches product attributes beyond name substrings.
2. Enable Search by meaning. Compare the two strategies using a paraphrase such as “leaf print sheet”. The first model download can take time.
3. Apply a budget/size filter and verify results respect it regardless of ranking mode.
4. Run the evaluation and download JSON. Explain a failure case and why a small labelled dataset cannot establish production quality.
5. Be able to implement cosine similarity, explain BM25 parameters and derive the RRF rank sum without relying on an AI assistant.

## Honest resume bullet

“Developed a React/TypeScript bedsheet storefront with browser-based MiniLM embeddings, BM25 keyword retrieval and Reciprocal Rank Fusion; built a comparative retrieval-evaluation dashboard with Precision@3, Recall@3, MRR@3 and nDCG@3 exports.”

Keep Python/FastAPI, live AWS operations and production payments attached to work where you actually used them. This project's camera remains manual masking and demo suggestions; it does not implement AI bed detection or exact textile replacement. Further work can add a genuine backend after the owner chooses to expand the frontend-only scope.

Algorithm references: https://www.elastic.co/docs/solutions/search/ranking and https://www.elastic.co/docs/reference/elasticsearch/rest-apis/reciprocal-rank-fusion
