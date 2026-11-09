# TimeTravelers Web

Next.js (App Router) + Tailwind CSS v4 + shadcn/ui frontend for the TimeTravelers API.

```bash
npm install
npm run dev        # http://localhost:3000
```

The app talks to FastAPI through Next.js rewrites (`/api/v1/*` and `/health/*`), so the
browser only ever sees one origin. Point it at the backend with `API_INTERNAL_URL`
(default `http://localhost:8000`). It is read at build time, so set it before `npm run build`.

- `src/app/page.tsx`: server component that fetches the figure catalog and streams the workspace
- `src/components/chat-workspace.tsx`: client state for chat, citations, and dialogs
- `src/components/ui/`: generated shadcn/ui primitives (`npx shadcn@latest add <component>`)
- `src/lib/api.ts` / `src/lib/server-api.ts`: browser and server API clients
