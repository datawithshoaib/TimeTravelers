import { Activity, BookOpen, Scroll, Share2, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import type { FigureSummary } from "@/lib/types";

export function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-gold to-amber-700 shadow-[0_0_15px] shadow-gold/35">
        <Scroll className="size-5 text-gold-foreground" />
      </div>
      <div>
        <h1 className="flex items-center gap-2 font-heading text-xl font-bold tracking-wide">
          TimeTravelers
          <Badge variant="outline" className="border-gold/40 bg-gold/10 font-sans text-[0.65rem] text-gold">
            GROUNDED v1.0
          </Badge>
        </h1>
        <p className="text-xs text-muted-foreground">Primary-Source Authenticated Historical Conversations</p>
      </div>
    </div>
  );
}

export function HeaderShell({ children }: { children?: ReactNode }) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-4 py-3 sm:px-6">{children}</div>
    </header>
  );
}

interface SiteHeaderProps {
  figures: FigureSummary[];
  selectedFigureId: string;
  onSelectFigure: (id: string) => void;
  isBackendConnected: boolean;
  onOpenScope: () => void;
  onOpenCatalog: () => void;
  onOpenExport: () => void;
}

export function SiteHeader({
  figures,
  selectedFigureId,
  onSelectFigure,
  isBackendConnected,
  onOpenScope,
  onOpenCatalog,
  onOpenExport,
}: SiteHeaderProps) {
  return (
    <HeaderShell>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Brand />
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className={cn(
              isBackendConnected
                ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-400"
                : "border-amber-500/60 bg-amber-500/10 text-amber-400",
            )}
          >
            <Activity data-icon="inline-start" />
            {isBackendConnected ? "API Connected" : "API Offline"}
          </Badge>
          <Button variant="outline" size="sm" onClick={onOpenScope}>
            <ShieldCheck className="text-gold" data-icon="inline-start" />
            <span className="hidden sm:inline">Scope & Limitations</span>
          </Button>
          <Button variant="outline" size="sm" onClick={onOpenCatalog}>
            <BookOpen className="text-indigo-400" data-icon="inline-start" />
            <span className="hidden sm:inline">Source Catalog</span>
          </Button>
          <Button variant="outline" size="sm" onClick={onOpenExport}>
            <Share2 className="text-sky-400" data-icon="inline-start" />
            <span className="hidden sm:inline">Export Citations</span>
          </Button>
        </div>
      </div>

      {figures.length > 0 && (
        <ToggleGroup
          type="single"
          variant="outline"
          value={selectedFigureId}
          onValueChange={(id) => id && onSelectFigure(id)}
          className="w-full justify-start overflow-x-auto pb-1"
          aria-label="Choose a historical figure"
        >
          {figures.map((fig) => (
            <ToggleGroupItem
              key={fig.figure_id}
              value={fig.figure_id}
              className="h-9 shrink-0 gap-2 rounded-full px-3 data-[state=on]:border-gold/50 data-[state=on]:bg-card data-[state=on]:text-foreground"
            >
              <Avatar className="size-6">
                {fig.avatar_url && <AvatarImage src={fig.avatar_url} alt="" className="object-cover" />}
                <AvatarFallback className="text-[0.6rem]">{fig.display_name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              {fig.display_name.split(" ")[0]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      )}
    </HeaderShell>
  );
}
