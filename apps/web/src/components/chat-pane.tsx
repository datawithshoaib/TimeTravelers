"use client";

import { AlertTriangle, Bot, Flag, Loader2, Send, Sparkles, User } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";

import { EVIDENCE_LEGEND, OverallStatusBadge, SEGMENT_STYLES } from "@/components/evidence-status";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { citationsInMessage } from "@/lib/citations";
import { cn } from "@/lib/utils";
import type { ChatMessage, ClaimCitation } from "@/lib/types";

interface ChatPaneProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  onSelectCitation: (citation: ClaimCitation) => void;
  activeCitationId: string | null;
  onReportMessage: (messageId: string) => void;
  figureName: string;
}

export function ChatPane({
  messages,
  isLoading,
  onSendMessage,
  onSelectCitation,
  activeCitationId,
  onReportMessage,
  figureName,
}: ChatPaneProps) {
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading]);

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) submit(e);
  };

  return (
    <div className="flex h-full min-h-[600px] flex-col gap-4">
      <ScrollArea className="h-[min(70dvh,820px)] pr-3">
        <div className="flex flex-col gap-5">
          {messages.length === 0 && (
            <Card className="items-center border-dashed px-8 py-16 text-center text-muted-foreground">
              <Sparkles className="size-9 text-gold opacity-80" />
              <h3 className="font-heading text-lg text-foreground">Commence Historical Inquiry</h3>
              <p className="max-w-md text-sm">
                Select a starter prompt above or write your question below. All responses are verified against
                authentic primary texts.
              </p>
            </Card>
          )}

          {messages.map((msg) =>
            msg.role === "user" ? (
              <UserBubble key={msg.id} message={msg} />
            ) : (
              <AssistantMessage
                key={msg.id}
                message={msg}
                figureName={figureName}
                activeCitationId={activeCitationId}
                onSelectCitation={onSelectCitation}
                onReport={() => onReportMessage(msg.id)}
              />
            ),
          )}

          {isLoading && (
            <div className="flex animate-in items-center gap-3 rounded-xl border border-gold/35 bg-card p-4 text-sm text-gold fade-in">
              <Loader2 className="size-5 animate-spin" />
              Retrieving approved source passages and composing persona response…
            </div>
          )}
          <div ref={endRef} />
        </div>
      </ScrollArea>

      <form
        onSubmit={submit}
        className="flex items-end gap-2 rounded-2xl border border-gold/35 bg-popover p-2 shadow-lg focus-within:border-gold"
      >
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={`Ask ${figureName} about their writings, work, or views…`}
          disabled={isLoading}
          rows={1}
          className="max-h-40 min-h-10 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent"
        />
        <Button type="submit" disabled={isLoading || !input.trim()} className="h-10 bg-gold text-gold-foreground hover:bg-gold/85">
          Ask
          <Send data-icon="inline-end" />
        </Button>
      </form>
    </div>
  );
}

function UserBubble({ message }: { message: ChatMessage }) {
  return (
    <div className="flex justify-end gap-2.5">
      <div className="max-w-[78%] rounded-2xl rounded-br-sm border bg-secondary px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-md">
        {message.content}
      </div>
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
        <User className="size-4 text-muted-foreground" />
      </div>
    </div>
  );
}

interface AssistantMessageProps {
  message: ChatMessage;
  figureName: string;
  activeCitationId: string | null;
  onSelectCitation: (citation: ClaimCitation) => void;
  onReport: () => void;
}

function AssistantMessage({ message, figureName, activeCitationId, onSelectCitation, onReport }: AssistantMessageProps) {
  const answer = message.answerPayload;
  const citations = citationsInMessage(message);
  const chipNumber = (chunkId: string) => citations.findIndex((c) => c.chunk_id === chunkId) + 1;

  return (
    <div className="flex animate-in items-start gap-3 fade-in slide-in-from-bottom-1">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-700 to-gold shadow-[0_0_12px] shadow-gold/35">
        <Bot className="size-4.5 text-gold-foreground" />
      </div>

      <Card className="flex-1 gap-4 rounded-tl-sm px-5 py-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-heading text-sm font-bold">{figureName}</span>
            <span className="text-xs text-muted-foreground">[Simulated Persona]</span>
          </div>
          {answer && <OverallStatusBadge status={answer.overall_status} />}
        </div>

        {answer?.limitation_note && (
          <div className="flex gap-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3.5 py-2.5 text-xs text-amber-100">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-500" />
            <p>
              <strong className="text-amber-400">Collection limitation: </strong>
              {answer.limitation_note}
            </p>
          </div>
        )}

        <div className="text-[0.95rem] leading-7">
          {answer ? (
            answer.segments.map((segment, i) => (
              <span key={i} className="mr-1">
                <span className={SEGMENT_STYLES[segment.evidence_status]}>{segment.text}</span>
                {segment.citations.map((cit) => (
                  <button
                    key={cit.chunk_id}
                    type="button"
                    onClick={() => onSelectCitation(cit)}
                    title={`Inspect evidence: ${cit.source_title} (${cit.page_or_section || "Section"})`}
                    className={cn(
                      "mx-0.5 inline-flex rounded-full border border-gold/45 bg-gold/15 px-1.5 align-baseline font-mono text-xs font-semibold text-gold transition hover:-translate-y-px hover:bg-gold hover:text-gold-foreground",
                      activeCitationId === cit.chunk_id && "bg-gold text-gold-foreground shadow-[0_0_14px] shadow-gold/60",
                    )}
                  >
                    [{chipNumber(cit.chunk_id)}]
                  </button>
                ))}{" "}
              </span>
            ))
          ) : (
            <span>{message.content}</span>
          )}
        </div>

        {answer && (
          <div className="flex flex-wrap gap-3 text-[0.7rem] text-muted-foreground">
            {EVIDENCE_LEGEND.filter((l) => answer.segments.some((s) => s.evidence_status === l.status)).map((l) => (
              <span key={l.status} className="flex items-center gap-1">
                <span className={cn("size-2 rounded-full", l.swatch)} />
                {l.label}
              </span>
            ))}
          </div>
        )}

        {answer && (
          <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-xs text-muted-foreground">
            <div className="flex flex-wrap items-center gap-1.5">
              {citations.length > 0 ? (
                <>
                  <span className="font-semibold text-gold">CITED SOURCES:</span>
                  {citations.map((c, i) => (
                    <Button key={c.chunk_id} variant="outline" size="xs" onClick={() => onSelectCitation(c)}>
                      [{i + 1}] {truncate(c.source_title ?? "Source", 28)}
                    </Button>
                  ))}
                </>
              ) : (
                <span>No primary citations for this answer.</span>
              )}
            </div>
            <Button variant="ghost" size="xs" className="text-muted-foreground hover:text-red-400" onClick={onReport}>
              <Flag data-icon="inline-start" />
              Report inaccuracy
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}

function truncate(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}
