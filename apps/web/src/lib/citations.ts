import type { ChatMessage, ClaimCitation } from "@/lib/types";

export type CitationFormat = "apa" | "chicago" | "bibtex" | "markdown";

export const CITATION_FORMATS: CitationFormat[] = ["apa", "chicago", "bibtex", "markdown"];

/** Unique citations in a message, de-duplicated by chunk, in order of appearance. */
export function citationsInMessage(message: ChatMessage): ClaimCitation[] {
  const seen = new Map<string, ClaimCitation>();
  for (const seg of message.answerPayload?.segments ?? []) {
    for (const c of seg.citations) {
      if (!seen.has(c.chunk_id)) seen.set(c.chunk_id, c);
    }
  }
  return [...seen.values()];
}

/** Unique sources cited anywhere in the conversation, de-duplicated by source. */
export function citedSources(messages: ChatMessage[]): ClaimCitation[] {
  const seen = new Map<string, ClaimCitation>();
  for (const m of messages) {
    for (const c of citationsInMessage(m)) {
      if (!seen.has(c.source_id)) seen.set(c.source_id, c);
    }
  }
  return [...seen.values()];
}

const yearOf = (c: ClaimCitation) => (c.created_date ? c.created_date.split("-")[0] : "n.d.");

export function formatCitations(
  citations: ClaimCitation[],
  format: CitationFormat,
  figureName: string,
): string {
  if (citations.length === 0) {
    return `No primary citations cited in current dialogue with ${figureName}.`;
  }

  switch (format) {
    case "apa":
      return citations
        .map((c, i) => {
          const pub = c.archive_name ? `${c.archive_name}.` : "";
          const url = c.source_url ? ` ${c.source_url}` : "";
          return `[${i + 1}] ${c.author || figureName} (${yearOf(c)}). ${c.source_title || "Historical Document"}. ${pub}${url}`;
        })
        .join("\n\n");

    case "chicago":
      return citations
        .map((c, i) => {
          const pub = c.archive_name ? `${c.archive_name}, ` : "";
          const url = c.source_url ? ` ${c.source_url}.` : "";
          return `${i + 1}. ${c.author || figureName}, "${c.source_title || "Historical Document"}" (${pub}${yearOf(c)}).${url}`;
        })
        .join("\n\n");

    case "bibtex":
      return citations
        .map((c, i) => {
          const key = (c.author ? c.author.split(" ")[0].toLowerCase() : "hist") + (c.created_date ? yearOf(c) : `${i}`);
          return [
            `@misc{${key},`,
            `  author = {${c.author || figureName}},`,
            `  title = {${c.source_title}},`,
            `  year = {${yearOf(c)}},`,
            `  publisher = {${c.archive_name || "Historical Archive"}},`,
            `  url = {${c.source_url || ""}}`,
            `}`,
          ].join("\n");
        })
        .join("\n\n");

    case "markdown":
      return (
        `### Citations: ${figureName} Dialogue\n\n` +
        citations
          .map(
            (c, i) =>
              `${i + 1}. **${c.source_title}** (${c.created_date || "Undated"})\n` +
              `   - Author: ${c.author || figureName}\n` +
              `   - Archive: ${c.archive_name || "Primary Archive"}\n` +
              `   - URL: [${c.source_url || "Archive"}](${c.source_url || "#"})\n` +
              `   - Verified Excerpt: _"${c.quote_or_excerpt}"_`,
          )
          .join("\n\n")
      );
  }
}
