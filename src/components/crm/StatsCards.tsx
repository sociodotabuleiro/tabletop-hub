import { Lead } from "./types";
import { Users, UserPlus, Flame, Trophy, Brain } from "lucide-react";

interface StatsCardsProps {
  leads: Lead[];
}

export function StatsCards({ leads }: StatsCardsProps) {
  const avgScore = leads.filter((l) => l.score_ia !== null && l.score_ia !== undefined);
  const avgScoreVal = avgScore.length > 0 
    ? Math.round(avgScore.reduce((a, l) => a + (l.score_ia || 0), 0) / avgScore.length) 
    : null;

  const stats = [
    { label: "Total Leads", value: leads.length, icon: Users, color: "text-foreground", bg: "bg-secondary" },
    { label: "Novos", value: leads.filter((l) => l.status === "novo").length, icon: UserPlus, color: "text-crm-blue", bg: "bg-crm-blue/10" },
    { label: "Qualificados", value: leads.filter((l) => l.status === "quente").length, icon: Flame, color: "text-crm-green", bg: "bg-crm-green/10" },
    { label: "Convertidos", value: leads.filter((l) => l.status === "convertido").length, icon: Trophy, color: "text-crm-purple", bg: "bg-crm-purple/10" },
    { label: "Score Médio IA", value: avgScoreVal !== null ? avgScoreVal : "—", icon: Brain, color: "text-crm-orange", bg: "bg-crm-orange/10" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div key={s.label} className="glass rounded-xl p-4 border border-border hover:border-crm-purple/20 transition-colors">
            <div className="flex items-center gap-3">
              <div className={`${s.bg} rounded-lg p-2`}>
                <Icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <div>
                <p className={`text-2xl font-bold font-sans tabular-nums ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-muted-foreground font-sans uppercase tracking-wider">{s.label}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
