# TimeTravelers ⏳📜
### Production-Grade Historical Figure Conversation App

> Grounded in authentic primary sources, letters, speeches, and scientific memoirs. Preserves recognizable historical voices while strictly citing evidence and clearly labeling speculation.

---

## 🌟 Key Features

- **Evidence First**: All factual claims are retrieved from verified primary and secondary source collections.
- **Strict Per-Figure Scoping**: Server-side collection isolation guarantees figures cannot retrieve or hallucinate another figure's documents.
- **Interactive Source & Evidence Inspector**: Every statement includes claim-level citation badges (`[1]`, `[2]`). Clicking any citation highlights the exact verified excerpt in the sticky evidence inspector beside the chat.
- **Evidence Status Taxonomy**:
  - `DOCUMENTED` (Emerald): Directly supported by primary archival record.
  - `INTERPRETATION` (Indigo): Cautious scholarly inference from cited text.
  - `SPECULATION` (Amber): Modern hypothetical questions (e.g. modern AI, smartphones) clearly labeled with historical context.
  - `UNRESOLVED` (Purple): Conflicting accounts or disputed attributions.
- **Archival Provenance**: Shows source title, creation date, archive/publisher, transcription status, and canonical links.
- **Citation Export**: One-click export to APA, Chicago, BibTeX, and Markdown.
- **Accuracy Feedback**: Community reporting for inaccurate claims or broken citations.

---

## 🏛️ Curated Figures Catalog

1. **Ada Lovelace** (1815–1852): Countess of Lovelace, mathematician. *Notes on the Analytical Engine (Notes A–G)* and letters to Charles Babbage.
2. **Marcus Aurelius** (121–180 CE): Roman Emperor & Stoic Philosopher. *Meditations (Books I–XII)*.
3. **Galileo Galilei** (1564–1642): Astronomer & physicist. *Sidereus Nuncius (1610)*, *Letter to Grand Duchess Christina (1615)*, *Il Saggiatore (1623)*.
4. **Frederick Douglass** (1818–1895): Abolitionist, orator, statesman. *Narrative of the Life of Frederick Douglass (1845)*, *Rochester July 4th Address (1852)*.
5. **Marie Curie** (1867–1934): Physicist and chemist, double Nobel laureate. *Autobiographical Notes (1923)*, *1911 Nobel Lecture*.
6. **Leonardo da Vinci** (1452–1519): Renaissance polymath. *Codex on the Flight of Birds (1505)*, *Treatise on Painting*.

---

## 🚀 Quickstart

### 1. Backend API (FastAPI + LangChain/LangGraph)

```bash
# In project root
python -m pip install -e ".[dev]"
cp .env.example .env          # optionally set ANTHROPIC_API_KEY

# Run the API server
python -m uvicorn services.api.app.main:app --reload --port 8000
```
- API Docs: `http://localhost:8000/docs`
- Health Probe: `http://localhost:8000/health/ready`
- With `ANTHROPIC_API_KEY` set, answers are drafted by Claude (`claude-opus-5-5`) through LangChain.
  Without it (or with `LLM_MODE=offline`) a deterministic offline drafter is used. Either way,
  every citation passes the same grounding validator.

### 2. Frontend Web App (Next.js + Tailwind CSS + shadcn/ui)

```bash
cd apps/web
npm install
npm run dev
```
Open `http://localhost:3000`. Next.js proxies `/api/v1/*` and `/health/*` to the API at
`API_INTERNAL_URL` (default `http://localhost:8000`).

### 3. Run Test Suite & Evaluation Harness

```bash
# Run Pytest unit and integration tests (11 passing tests)
python -m pytest services/api/tests

# Run Evaluation Benchmark (Grounding, Speculation, and Figure Isolation)
python evals/eval_runner.py
```

### 4. Docker Deployment

```bash
docker compose up --build
```

---

## 📁 Repository Structure

```
TimeTravelers/
├── apps/
│   └── web/                   # Next.js (App Router) + Tailwind CSS v4 + shadcn/ui
│       └── src/
│           ├── app/           # Layout, theme tokens, server-rendered page
│           ├── components/    # Chat, Source Inspector, dialogs (ui/ = shadcn primitives)
│           └── lib/           # API clients, types, citation formatting
├── services/
│   └── api/                   # Python FastAPI backend
│       ├── app/
│       │   ├── api/routes/    # REST routes (figures, conversations, sources, feedback)
│       │   ├── figures/       # Historical figures catalog & profiles
│       │   ├── sources/       # Archival source texts & chunk boundaries
│       │   ├── retrieval/     # Per-figure isolated hybrid search
│       │   ├── ai/            # LangGraph turn workflow, LangChain retriever, prompts, Claude model
│       │   ├── persona/       # Composer facade over the LangGraph workflow
│       │   ├── grounding/     # Strict citation & speculation validator
│       │   └── main.py        # App entry point
│       └── tests/             # Pytest test suite
├── evals/                     # Benchmark datasets & eval runner
│   ├── source_questions.jsonl
│   ├── citation_cases.jsonl
│   ├── speculation_cases.jsonl
│   └── eval_runner.py
├── infra/                     # Dockerfiles & SQL migrations
├── docs/                      # Architecture, policy, and runbooks
├── docker-compose.yml
├── pyproject.toml
└── README.md
```
