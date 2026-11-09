import { BookOpen, CheckCircle2, ExternalLink, Feather, Flag, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ClaimCitation, HistoricalSource } from "@/lib/types";

interface SourceInspectorProps {
  activeCitation: ClaimCitation | null;
  sources: HistoricalSource[];
  onFlagPassage: (sourceId: string, chunkId: string) => void;
  onOpenCatalog: () => void;
}

export function SourceInspector({ activeCitation, sources, onFlagPassage, onOpenCatalog }: SourceInspectorProps) {
  return (
    <Card className="min-h-[600px] bg-popover">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2 font-heading text-base">
          <BookOpen className="size-4.5 text-gold" />
          Source & Evidence Inspector
        </CardTitle>
        <CardAction>
          <Button variant="link" size="xs" className="text-gold" onClick={onOpenCatalog}>
            Browse all sources
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        {activeCitation ? (
          <CitationDetail citation={activeCitation} onFlag={onFlagPassage} />
        ) : (
          <EmptyInspector sources={sources} />
        )}
      </CardContent>
    </Card>
  );
}

function CitationDetail({
  citation,
  onFlag,
}: {
  citation: ClaimCitation;
  onFlag: (sourceId: string, chunkId: string) => void;
}) {
  const metadata = [
    { label: "Origin date", value: citation.created_date || "Undated", className: "font-mono" },
    { label: "Section / folio", value: citation.page_or_section || "Main Text", className: "text-gold" },
    { label: "Archive / repository", value: citation.archive_name || "Not recorded" },
    { label: "Rights status", value: citation.rights_status || "Unknown", className: "text-emerald-400" },
  ];

  return (
    <div key={citation.chunk_id} className="flex flex-1 animate-in flex-col gap-4 fade-in">
      <div className="flex items-center justify-between gap-2 rounded-lg border border-gold/35 bg-gold/10 px-3 py-1.5 text-xs">
        <span className="font-mono font-semibold text-gold">{citation.chunk_id}</span>
        {citation.is_primary_source && (
          <Badge variant="outline" className="border-emerald-500/50 text-emerald-400">
            <CheckCircle2 data-icon="inline-start" />
            Verified primary
          </Badge>
        )}
      </div>

      <div className="space-y-1">
        <h4 className="font-heading text-base leading-snug">{citation.source_title || "Historical record"}</h4>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Feather className="size-3.5 text-gold" />
          {citation.author || "Unknown author"}
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-2 text-xs">
        {metadata.map((m) => (
          <div key={m.label} className="rounded-lg border bg-card px-3 py-2">
            <dt className="text-[0.65rem] tracking-wide text-muted-foreground uppercase">{m.label}</dt>
            <dd className={m.className ?? "font-medium"}>{m.value}</dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-1 flex-col gap-1.5">
        <span className="text-xs font-semibold tracking-wide text-gold">AUTHENTIC SOURCE PASSAGE</span>
        <ScrollArea className="max-h-64 rounded-lg border border-gold/25 bg-gradient-to-b from-background to-card">
          <blockquote className="p-4 text-sm leading-relaxed italic">&ldquo;{citation.quote_or_excerpt}&rdquo;</blockquote>
        </ScrollArea>
      </div>

      <div className="mt-auto flex gap-2 pt-2">
        {citation.source_url && (
          <Button asChild className="flex-1 bg-gold text-gold-foreground hover:bg-gold/85">
            <a href={citation.source_url} target="_blank" rel="noopener noreferrer">
              Inspect archive
              <ExternalLink data-icon="inline-end" />
            </a>
          </Button>
        )}
        <Button variant="outline" onClick={() => onFlag(citation.source_id, citation.chunk_id)}>
          <Flag className="text-red-400" data-icon="inline-start" />
          Flag passage
        </Button>
      </div>
    </div>
  );
}

function EmptyInspector({ sources }: { sources: HistoricalSource[] }) {
  return (
    <div className="flex flex-1 flex-col justify-center gap-4">
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed bg-card p-6 text-center">
        <ShieldCheck className="size-8 text-gold" />
        <h4 className="font-heading text-sm">No citation selected</h4>
        <p className="text-xs text-muted-foreground">
          Click any citation chip (e.g.{" "}
          <span className="rounded-full border border-gold/45 bg-gold/15 px-1.5 font-mono text-gold">[1]</span>) in the
          conversation to inspect the underlying archival document, dates, and excerpt.
        </p>
      </div>

      <div className="space-y-2">
        <h5 className="text-xs font-semibold text-gold">FIGURE&apos;S PRIMARY SOURCES ({sources.length})</h5>
        {sources.map((src) => (
          <div key={src.source_id} className="rounded-lg border bg-card p-3 text-sm">
            <strong className="block">{src.title}</strong>
            <span className="text-xs text-muted-foreground">
              {src.archive_or_publisher || "Primary archive"} • {src.created_date || "Undated"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
