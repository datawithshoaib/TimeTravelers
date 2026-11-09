import { AlertCircle, BookOpen, Mic, ShieldAlert } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { HistoricalFigure } from "@/lib/types";

interface ScopeDialogProps {
  figure: HistoricalFigure | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScopeDialog({ figure, open, onOpenChange }: ScopeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85dvh] overflow-y-auto border-gold/35 sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-heading text-lg">
            <ShieldAlert className="size-5 text-gold" />
            Collection Scope & Limitations
          </DialogTitle>
          <DialogDescription>{figure?.display_name}</DialogDescription>
        </DialogHeader>

        {figure && (
          <div className="flex flex-col gap-4 text-sm">
            <section className="rounded-xl border bg-card p-4">
              <h4 className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <BookOpen className="size-4" />
                APPROVED SOURCE COLLECTION
              </h4>
              <p className="leading-relaxed text-foreground/85">{figure.collection_scope}</p>
            </section>

            <section className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
              <h4 className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                <AlertCircle className="size-4" />
                DOCUMENTED GAPS & HISTORICAL BOUNDS
              </h4>
              <ul className="list-disc space-y-1 pl-5 text-amber-100">
                {figure.known_gaps.map((gap) => (
                  <li key={gap}>{gap}</li>
                ))}
              </ul>
            </section>

            <section className="rounded-xl border bg-card p-4">
              <h4 className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-indigo-400">
                <Mic className="size-4" />
                DOCUMENTED COMMUNICATION & RHETORICAL TRAITS
              </h4>
              <ul className="list-disc space-y-1 pl-5 text-foreground/85">
                {figure.known_voice_traits.map((trait) => (
                  <li key={trait}>{trait}</li>
                ))}
              </ul>
            </section>

            <p className="text-xs leading-relaxed text-muted-foreground">
              <strong>Source integrity policy:</strong> TimeTravelers rejects fabricated quotations and cross-figure
              contamination. Answers about events or inventions after the figure&apos;s lifetime are labelled as
              speculative simulations.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
