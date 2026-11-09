"use client";

import { BookOpen, ExternalLink, Search } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { HistoricalSource } from "@/lib/types";

interface SourceCatalogDialogProps {
  sources: HistoricalSource[];
  figureName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SourceCatalogDialog({ sources, figureName, open, onOpenChange }: SourceCatalogDialogProps) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");

  const term = search.toLowerCase();
  const filtered = sources.filter(
    (src) =>
      (type === "all" || src.source_type === type) &&
      [src.title, src.summary, src.archive_or_publisher].some((field) => field?.toLowerCase().includes(term)),
  );
  const sourceTypes = [...new Set(sources.map((s) => s.source_type))];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[88dvh] flex-col border-gold/35 sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-heading text-lg">
            <BookOpen className="size-5 text-gold" />
            Source Catalog: {figureName}
          </DialogTitle>
          <DialogDescription>Approved primary documents, editions, and canonical archive references.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-2">
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, archive, or summary…"
              className="pl-8"
            />
          </div>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types ({sources.length})</SelectItem>
              {sourceTypes.map((t) => (
                <SelectItem key={t} value={t} className="capitalize">
                  {t.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="min-h-0 flex-1">
          <div className="flex flex-col gap-3 pr-3">
            {filtered.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">No sources matched your query.</p>
            ) : (
              filtered.map((src) => (
                <article key={src.source_id} className="flex flex-col gap-2 rounded-xl border bg-card p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-heading text-base leading-snug">{src.title}</h4>
                    <Badge variant="outline" className="shrink-0 border-emerald-500/50 text-emerald-400 uppercase">
                      {src.source_type.replace("_", " ")}
                    </Badge>
                  </div>
                  {src.summary && <p className="text-sm leading-relaxed text-foreground/80">{src.summary}</p>}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-2 text-xs text-muted-foreground">
                    <span>
                      <strong>Archive:</strong> {src.archive_or_publisher || "Primary collection"} •{" "}
                      <strong>Date:</strong> {src.created_date || "Undated"} •{" "}
                      <span className="text-emerald-400">{src.rights_status}</span>
                    </span>
                    {src.canonical_url && (
                      <Button asChild variant="link" size="xs" className="text-gold">
                        <a href={src.canonical_url} target="_blank" rel="noopener noreferrer">
                          Open archive document
                          <ExternalLink data-icon="inline-end" />
                        </a>
                      </Button>
                    )}
                  </div>
                </article>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
