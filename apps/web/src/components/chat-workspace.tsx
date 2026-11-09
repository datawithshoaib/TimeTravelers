"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { ChatPane } from "@/components/chat-pane";
import { CitationExportDialog } from "@/components/citation-export-dialog";
import { FeedbackDialog, type FeedbackTarget } from "@/components/feedback-dialog";
import { FigureBanner } from "@/components/figure-banner";
import { ScopeDialog } from "@/components/scope-dialog";
import { SiteHeader } from "@/components/site-header";
import { SourceCatalogDialog } from "@/components/source-catalog-dialog";
import { SourceInspector } from "@/components/source-inspector";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getFigureDetail, getFigureSources, sendChatMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { ChatMessage, ClaimCitation, FigureSummary, HistoricalFigure, HistoricalSource } from "@/lib/types";

type DialogName = "scope" | "catalog" | "export";

const timestamp = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

function welcomeMessage(figure: HistoricalFigure): ChatMessage {
  return {
    id: `msg_welcome_${figure.figure_id}`,
    role: "assistant",
    content:
      `Greetings. I am a simulated conversation partner representing ${figure.display_name}. ` +
      `My responses are constrained to my verified surviving writings (${figure.collection_scope}). ` +
      `Please put your historical question to me.`,
    timestamp: timestamp(),
  };
}

export function ChatWorkspace({ figures }: { figures: FigureSummary[] }) {
  const [selectedFigureId, setSelectedFigureId] = useState(figures[0].figure_id);
  const [figure, setFigure] = useState<HistoricalFigure | null>(null);
  const [sources, setSources] = useState<HistoricalSource[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string>();
  const [activeCitation, setActiveCitation] = useState<ClaimCitation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [openDialog, setOpenDialog] = useState<DialogName | null>(null);
  const [feedbackTarget, setFeedbackTarget] = useState<FeedbackTarget | null>(null);
  const [mobileTab, setMobileTab] = useState<"chat" | "sources">("chat");

  useEffect(() => {
    let cancelled = false;
    Promise.all([getFigureDetail(selectedFigureId), getFigureSources(selectedFigureId)])
      .then(([detail, srcs]) => {
        if (cancelled) return;
        setFigure(detail);
        setSources(srcs);
        setMessages([welcomeMessage(detail)]);
      })
      .catch((err) => {
        if (!cancelled) toast.error("Could not load figure", { description: String(err?.message ?? err) });
      });
    return () => {
      cancelled = true;
    };
  }, [selectedFigureId]);

  const selectFigure = (id: string) => {
    if (id === selectedFigureId) return;
    setSelectedFigureId(id);
    setFigure(null);
    setSources([]);
    setMessages([]);
    setConversationId(undefined);
    setActiveCitation(null);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const figureId = selectedFigureId;

    setMessages((prev) => [...prev, { id: `msg_user_${Date.now()}`, role: "user", content: text, timestamp: timestamp() }]);
    setIsLoading(true);
    try {
      const answer = await sendChatMessage(figureId, text, conversationId);
      setConversationId(answer.conversation_id);
      setMessages((prev) => [
        ...prev,
        {
          id: answer.message_id,
          role: "assistant",
          content: answer.segments.map((s) => s.text).join(" "),
          timestamp: timestamp(),
          answerPayload: answer,
        },
      ]);
      const firstCitation = answer.segments.flatMap((s) => s.citations)[0];
      if (firstCitation) setActiveCitation(firstCitation);
    } catch (err) {
      toast.error("The archive could not answer", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectCitation = (citation: ClaimCitation) => {
    setActiveCitation(citation);
    setMobileTab("sources");
  };

  const figureName = figure?.display_name ?? "Historical Figure";
  const dialogProps = (name: DialogName) => ({
    open: openDialog === name,
    onOpenChange: (open: boolean) => setOpenDialog(open ? name : null),
  });

  return (
    <>
      <SiteHeader
        figures={figures}
        selectedFigureId={selectedFigureId}
        onSelectFigure={selectFigure}
        isBackendConnected
        onOpenScope={() => setOpenDialog("scope")}
        onOpenCatalog={() => setOpenDialog("catalog")}
        onOpenExport={() => setOpenDialog("export")}
      />

      <main className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-5 px-4 pt-5 pb-8 sm:px-6">
        {figure ? (
          <FigureBanner
            figure={figure}
            onSelectPrompt={sendMessage}
            onOpenScope={() => setOpenDialog("scope")}
            disabled={isLoading}
          />
        ) : (
          <Skeleton className="h-52 rounded-xl" />
        )}

        <Tabs value={mobileTab} onValueChange={(v) => setMobileTab(v as "chat" | "sources")} className="lg:hidden">
          <TabsList className="w-full">
            <TabsTrigger value="chat">Dialogue</TabsTrigger>
            <TabsTrigger value="sources">Source Inspector{activeCitation ? " (1 active)" : ""}</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid flex-1 items-start gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(360px,1fr)]">
          <section className={cn(mobileTab !== "chat" && "max-lg:hidden")}>
            <ChatPane
              messages={messages}
              isLoading={isLoading}
              onSendMessage={sendMessage}
              onSelectCitation={selectCitation}
              activeCitationId={activeCitation?.chunk_id ?? null}
              onReportMessage={(messageId) => setFeedbackTarget({ messageId })}
              figureName={figureName}
            />
          </section>
          <aside className={cn("lg:sticky lg:top-36", mobileTab !== "sources" && "max-lg:hidden")}>
            <SourceInspector
              activeCitation={activeCitation}
              sources={sources}
              onFlagPassage={(sourceId, chunkId) => setFeedbackTarget({ sourceId, chunkId })}
              onOpenCatalog={() => setOpenDialog("catalog")}
            />
          </aside>
        </div>
      </main>

      <ScopeDialog figure={figure} {...dialogProps("scope")} />
      <SourceCatalogDialog sources={sources} figureName={figureName} {...dialogProps("catalog")} />
      <CitationExportDialog messages={messages} figureName={figureName} {...dialogProps("export")} />
      <FeedbackDialog
        target={feedbackTarget}
        figureId={selectedFigureId}
        conversationId={conversationId}
        onOpenChange={(open) => !open && setFeedbackTarget(null)}
      />
    </>
  );
}
