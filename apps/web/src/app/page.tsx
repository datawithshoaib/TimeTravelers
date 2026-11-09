import { ServerCrash } from "lucide-react";
import { Suspense } from "react";

import { ChatWorkspace } from "@/components/chat-workspace";
import { Brand, HeaderShell } from "@/components/site-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getFigures } from "@/lib/server-api";

export default function Home() {
  return (
    <Suspense fallback={<WorkspaceSkeleton />}>
      <Workspace />
    </Suspense>
  );
}

async function Workspace() {
  const figures = await getFigures();
  if (figures.length === 0) return <ApiOffline />;
  return <ChatWorkspace figures={figures} />;
}

function WorkspaceSkeleton() {
  return (
    <>
      <HeaderShell>
        <Brand />
        <Skeleton className="h-9 w-full max-w-xl rounded-full" />
      </HeaderShell>
      <main className="mx-auto flex w-full max-w-[1600px] flex-col gap-5 px-4 pt-5 sm:px-6">
        <Skeleton className="h-52 rounded-xl" />
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(360px,1fr)]">
          <Skeleton className="h-[600px] rounded-xl" />
          <Skeleton className="h-[600px] rounded-xl max-lg:hidden" />
        </div>
      </main>
    </>
  );
}

function ApiOffline() {
  return (
    <>
      <HeaderShell>
        <Brand />
      </HeaderShell>
      <main className="mx-auto flex w-full max-w-2xl flex-1 items-center px-4 py-12">
        <Card className="w-full border-amber-500/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading">
              <ServerCrash className="size-5 text-amber-400" />
              The archive API is unreachable
            </CardTitle>
            <CardDescription>
              TimeTravelers only answers from verified sources served by the FastAPI backend, so there is no offline mode.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>Start the API from the repository root, then reload this page:</p>
            <pre className="overflow-x-auto rounded-lg border bg-background p-3 font-mono text-xs">
              python -m uvicorn services.api.app.main:app --reload --port 8000
            </pre>
            <p className="text-muted-foreground">
              The frontend looks for it at <code className="font-mono">API_INTERNAL_URL</code> (default{" "}
              <code className="font-mono">http://localhost:8000</code>).
            </p>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
