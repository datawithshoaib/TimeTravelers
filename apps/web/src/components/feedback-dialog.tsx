"use client";

import { Flag } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { sendFeedback } from "@/lib/api";
import type { FeedbackType } from "@/lib/types";

export interface FeedbackTarget {
  messageId?: string;
  sourceId?: string;
  chunkId?: string;
}

const FEEDBACK_TYPES: { value: FeedbackType; label: string }[] = [
  { value: "inaccurate_claim", label: "Inaccurate historical statement" },
  { value: "broken_citation", label: "Broken or unmatched citation" },
  { value: "misattributed_quote", label: "Misattributed quote" },
  { value: "anachronism", label: "Anachronism without a speculation label" },
  { value: "general", label: "General correction or feedback" },
];

interface FeedbackDialogProps {
  target: FeedbackTarget | null;
  figureId: string;
  conversationId?: string;
  onOpenChange: (open: boolean) => void;
}

export function FeedbackDialog({ target, figureId, conversationId, onOpenChange }: FeedbackDialogProps) {
  const [feedbackType, setFeedbackType] = useState<FeedbackType>("inaccurate_claim");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!target || !comment.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await sendFeedback({
        message_id: target.messageId ?? "msg_direct",
        conversation_id: conversationId,
        figure_id: figureId,
        source_id: target.sourceId,
        chunk_id: target.chunkId,
        feedback_type: feedbackType,
        comment: comment.trim(),
      });
      toast.success("Report received", { description: res.message });
      setComment("");
      onOpenChange(false);
    } catch (err) {
      toast.error("Could not submit report", { description: err instanceof Error ? err.message : undefined });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={target !== null} onOpenChange={onOpenChange}>
      <DialogContent className="border-gold/35 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-heading text-lg">
            <Flag className="size-5 text-red-400" />
            Report Accuracy / Citation Issue
          </DialogTitle>
          <DialogDescription>Reports go to the curator review queue.</DialogDescription>
        </DialogHeader>

        <form id="feedback-form" onSubmit={submit} className="flex flex-col gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="feedback-type">Issue category</Label>
            <Select value={feedbackType} onValueChange={(v) => setFeedbackType(v as FeedbackType)}>
              <SelectTrigger id="feedback-type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FEEDBACK_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="feedback-comment">Explanation and scholarly reference</Label>
            <Textarea
              id="feedback-comment"
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Explain the discrepancy or provide the accurate historical reference…"
              className="min-h-32"
            />
          </div>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form="feedback-form" variant="destructive" disabled={isSubmitting || !comment.trim()}>
            {isSubmitting ? "Submitting…" : "Submit report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
