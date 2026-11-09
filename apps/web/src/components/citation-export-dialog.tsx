"use client";

import { Check, Copy, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { CITATION_FORMATS, citedSources, formatCitations, type CitationFormat } from "@/lib/citations";
import type { ChatMessage } from "@/lib/types";

interface CitationExportDialogProps {
  messages: ChatMessage[];
  figureName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CitationExportDialog({ messages, figureName, open, onOpenChange }: CitationExportDialogProps) {
  const [format, setFormat] = useState<CitationFormat>("apa");
  const [copied, setCopied] = useState(false);

  const text = formatCitations(citedSources(messages), format, figureName);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not access the clipboard. Select the text and copy it manually.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-gold/35 sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-heading text-lg">
            <Share2 className="size-5 text-gold" />
            Export Scholarly Citations
          </DialogTitle>
          <DialogDescription>Every source cited in this dialogue with {figureName}.</DialogDescription>
        </DialogHeader>

        <Tabs value={format} onValueChange={(v) => setFormat(v as CitationFormat)}>
          <TabsList>
            {CITATION_FORMATS.map((f) => (
              <TabsTrigger key={f} value={f} className="uppercase">
                {f}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Textarea readOnly value={text} className="min-h-64 resize-none font-mono text-xs leading-relaxed" />

        <DialogFooter>
          <Button onClick={copy} className="bg-gold text-gold-foreground hover:bg-gold/85">
            {copied ? <Check data-icon="inline-start" /> : <Copy data-icon="inline-start" />}
            {copied ? "Copied!" : "Copy citations"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
