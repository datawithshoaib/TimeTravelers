# TimeTravelers Architecture Specification

## 1. System Topology

TimeTravelers is a source-first educational historical conversation application. It bridges users with historical personas by strictly constraining simulated generation to authentic primary sources, validating claim-level citations deterministically, and preventing anachronistic hallucinations.

```
+-----------------------------------------------------------+
|     Next.js (App Router) + Tailwind CSS + shadcn/ui       |
|  - Split View: Persona Dialogue + Sticky Source Panel     |
|  - Real-time Citation Highlighting & Context Inspector    |
|  - Scope & Limitations Drawer                             |
|  - Citation Export (APA, BibTeX, Chicago, Markdown)       |
+-----------------------------+-----------------------------+
                              | REST JSON (via Next.js rewrites)
                              v
+-----------------------------------------------------------+
|                 FastAPI Orchestration Layer               |
|  - Figure Scope Resolver                                  |
|  - Hybrid Retrieval Engine (BM25 + Semantic + RapidFuzz)  |
|  - LangGraph turn workflow (classify/retrieve/draft)      |
|  - Claude drafter via LangChain (offline fallback)        |
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

## 1a. AI Orchestration (LangChain + LangGraph)

Each chat turn runs a compiled LangGraph `StateGraph` (`services/api/app/ai/graph.py`):

```
load_figure -> classify -> retrieve -> draft -> validate -> END
     \-> not_found -> END   (unknown figure_id)
```

- **retrieve** uses `FigureScopedRetriever`, a LangChain `BaseRetriever` bound to one `figure_id`, wrapping the hybrid lexical engine.
- **draft** calls Claude (`claude-opus-5-5` by default) through `langchain-anthropic` with structured output (`DraftAnswer`, `json_schema` mode) and the last few conversation turns as history. With no `ANTHROPIC_API_KEY`, or `LLM_MODE=offline`, or if the LLM call fails, a deterministic offline drafter builds the answer from the retrieved chunks.
- **validate** passes every drafted segment through the `GroundingValidator`, so LLM output is held to the same citation rules as the offline drafter.

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
