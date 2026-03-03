import { Badge } from "@/components/ui/badge";
import { getScoreColor, getScoreBg } from "./types";

interface LeadScoreBadgeProps {
  score: number | null;
  size?: "sm" | "lg";
}

export function LeadScoreBadge({ score, size = "sm" }: LeadScoreBadgeProps) {
  if (score === null) return <span className="text-muted-foreground text-xs">—</span>;

  return (
    <Badge
      variant="outline"
      className={`${getScoreBg(score)} ${getScoreColor(score)} border ${
        size === "lg" ? "text-2xl px-4 py-2 font-bold" : "text-xs px-3 py-1"
      }`}
    >
      {score}
    </Badge>
  );
}
