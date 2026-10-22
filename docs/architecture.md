# TimeTravelers Architecture Specification

## 1. System Topology

TimeTravelers is a source-first educational historical conversation application. It bridges users with historical personas by strictly constraining simulated generation to authentic primary sources, validating claim-level citations deterministically, and preventing anachronistic hallucinations.

```
+-----------------------------------------------------------+
|                    Next.js / React Web                    |
|  - Split View: Persona Dialogue + Sticky Source Panel     |
|  - Real-time Citation Highlighting & Context Inspector    |
|  - Scope & Limitations Drawer                             |
|  - Citation Export (APA, BibTeX, Chicago, Markdown)       |
+-----------------------------+-----------------------------+
                              | REST JSON
                              v
+-----------------------------------------------------------+
|                 FastAPI Orchestration Layer               |
|  - Figure Scope Resolver                                  |
|  - Hybrid Retrieval Engine (BM25 + Semantic + RapidFuzz)  |
|  - Persona Composer & Anachronism Filter                  |
|  - Grounding & Citation Validator                         |
|  - Ingestion & Provenance Verifier                        |
+--------------+------------------------------+-------------+
               |                              |
               v                              v
+-----------------------------+ +---------------------------+
|   SQL Database (Postgres)   | | Per-Figure Chunk Catalog  |
| - Figures & Profiles        | | - Exact Excerpts          |
| - Sources & Metadata        | | - Page & Section Offsets  |
| - Conversations & Feedback  | | - Rights & Quality Scores |
+-----------------------------+ +---------------------------+
```

## 2. Per-Figure Retrieval Isolation
The system enforces strict server-side collection scoping:
1. `figure_id` is validated server-side.
2. The retrieval engine never searches outside the target figure's primary collection.
3. Cross-figure contaminated chunks are rejected at the boundary.

## 3. Grounding & Citation Validation Pipeline
1. Candidate response is segmented into distinct claim units.
2. Each claim is verified:
   - Valid citations must belong to the retrieved chunk IDs for the current request.
   - Quoted snippets are fuzzy-verified against verified archival text.
   - Unsupported factual assertions are flagged or downgraded.
3. Status assignment:
   - `documented`: verified primary/secondary source citation.
   - `interpretation`: reasonable historical inference.
   - `speculation`: modern hypotheticals or out-of-scope inquiries.
   - `unresolved`: conflicting records or disputed attribution.
