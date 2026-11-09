import { AlertCircle, AlertTriangle, CheckCircle, HelpCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { EvidenceStatus, OverallStatus } from "@/lib/types";

const OVERALL_STATUS = {
  grounded: {
    label: "Documented (Grounded)",
    icon: CheckCircle,
    className: "border-emerald-500/60 bg-emerald-500/10 text-emerald-400",
  },
  mixed: {
    label: "Mixed (Documented + Interpretation)",
    icon: HelpCircle,
    className: "border-sky-400/60 bg-sky-400/10 text-sky-400",
  },
  speculative: {
    label: "Speculative (Hypothetical)",
    icon: AlertTriangle,
    className: "border-amber-500/60 bg-amber-500/10 text-amber-400",
  },
  insufficient_evidence: {
    label: "Insufficient Evidence",
    icon: AlertCircle,
    className: "border-red-500/60 bg-red-500/10 text-red-400",
  },
} satisfies Record<OverallStatus, { label: string; icon: typeof CheckCircle; className: string }>;

export function OverallStatusBadge({ status }: { status: OverallStatus }) {
  const { label, icon: Icon, className } = OVERALL_STATUS[status];
  return (
    <Badge variant="outline" className={cn("uppercase tracking-wide", className)}>
      <Icon data-icon="inline-start" />
      {label}
    </Badge>
  );
}

/** Underline treatment that marks each claim segment by its evidence status. */
export const SEGMENT_STYLES: Record<EvidenceStatus, string> = {
  documented: "border-b-2 border-emerald-500/45",
  interpretation: "border-b border-dashed border-indigo-400/45",
  speculation: "border-b border-dotted border-amber-500/55 text-amber-200",
  unresolved: "border-b border-dashed border-purple-400/55",
};

export const EVIDENCE_LEGEND: { status: EvidenceStatus; label: string; swatch: string }[] = [
  { status: "documented", label: "Documented", swatch: "bg-emerald-500" },
  { status: "interpretation", label: "Interpretation", swatch: "bg-indigo-400" },
  { status: "speculation", label: "Speculation", swatch: "bg-amber-500" },
  { status: "unresolved", label: "Unresolved", swatch: "bg-purple-400" },
];
