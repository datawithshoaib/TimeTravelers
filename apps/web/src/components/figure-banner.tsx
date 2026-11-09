import { AlertTriangle, BookCheck, Compass, Library, Sparkles } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { HistoricalFigure } from "@/lib/types";

interface FigureBannerProps {
  figure: HistoricalFigure;
  onSelectPrompt: (prompt: string) => void;
  onOpenScope: () => void;
  disabled?: boolean;
}

export function FigureBanner({ figure, onSelectPrompt, onOpenScope, disabled }: FigureBannerProps) {
  const lifespan = figure.birth_year
    ? `${figure.birth_year} – ${figure.death_year ?? "CE"}`
    : "Classical Antiquity";

  return (
    <Card className="relative overflow-hidden border-gold/35 bg-gradient-to-b from-card to-popover">
      <Library className="pointer-events-none absolute -right-5 -bottom-5 size-56 text-gold opacity-5" />
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start gap-5">
          <div className="relative">
            <Avatar className="size-20 border-2 border-gold shadow-[0_0_16px] shadow-gold/30">
              {figure.avatar_url && <AvatarImage src={figure.avatar_url} alt={figure.display_name} className="object-cover" />}
              <AvatarFallback className="font-heading text-xl">{figure.display_name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <span
              className="absolute right-0 bottom-0 size-4 rounded-full border-2 border-popover bg-emerald-500"
              title="Primary archive active"
            />
          </div>

          <div className="min-w-[260px] flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-heading text-2xl font-bold">{figure.display_name}</h2>
              <Badge variant="outline" className="border-gold/30 bg-gold/10 font-mono text-gold">
                {lifespan}
              </Badge>
            </div>
            <p className="text-sm leading-relaxed text-foreground/80">{figure.short_biography}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Compass className="size-3.5 text-gold" />
                {figure.region_or_context}
              </span>
              <span className="flex items-center gap-1">
                <BookCheck className="size-3.5 text-emerald-400" />
                Grounded in: {figure.collection_scope}
              </span>
              <Button variant="link" size="xs" className="h-auto px-0 text-gold" onClick={onOpenScope}>
                <AlertTriangle data-icon="inline-start" />
                View known gaps & limitations
              </Button>
            </div>
          </div>
        </div>

        {figure.starter_prompts.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-gold">
                <Sparkles className="size-3.5" />
                STARTER PROMPTS
              </div>
              <div className="flex flex-wrap gap-2">
                {figure.starter_prompts.map((prompt) => (
                  <Button
                    key={prompt}
                    variant="outline"
                    size="sm"
                    disabled={disabled}
                    className="h-auto max-w-full rounded-full py-1.5 text-left whitespace-normal hover:border-gold"
                    onClick={() => onSelectPrompt(prompt)}
                  >
                    &ldquo;{prompt}&rdquo;
                  </Button>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
