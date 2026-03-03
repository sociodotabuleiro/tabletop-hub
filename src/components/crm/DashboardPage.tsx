import { Lead, statusConfig } from "./types";
import { StatsCards } from "./StatsCards";
import { Users, TrendingUp, Target, Calendar } from "lucide-react";
import { useMemo } from "react";

interface DashboardPageProps {
  leads: Lead[];
}

export function DashboardPage({ leads }: DashboardPageProps) {
  const stats = useMemo(() => {
    const today = new Date();
    const last7 = new Date(today.getTime() - 7 * 86400000);
    const last30 = new Date(today.getTime() - 30 * 86400000);

    const leadsLast7 = leads.filter((l) => new Date(l.created_at) >= last7).length;
    const leadsLast30 = leads.filter((l) => new Date(l.created_at) >= last30).length;
    const qualified = leads.filter((l) => l.score_ia !== null && l.score_ia !== undefined);
    const hotLeads = leads.filter((l) => (l.score_ia || 0) > 70).length;
    const converted = leads.filter((l) => l.status === "convertido").length;
    const conversionRate = leads.length > 0 ? Math.round((converted / leads.length) * 100) : 0;

    return { leadsLast7, leadsLast30, hotLeads, conversionRate, qualifiedCount: qualified.length };
  }, [leads]);

  const statusBreakdown = useMemo(() => {
    return Object.entries(statusConfig).map(([key, cfg]) => ({
      status: key,
      label: cfg.label,
      count: leads.filter((l) => l.status === key).length,
      color: cfg.color,
    }));
  }, [leads]);

  const recentLeads = useMemo(() => {
    return [...leads].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);
  }, [leads]);

  return (
    <div className="space-y-6">
      <StatsCards leads={leads} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quick metrics */}
        <div className="glass rounded-xl p-5 border border-border space-y-4">
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4" /> Métricas Rápidas
          </h3>
          <div className="space-y-3">
            <MetricRow label="Leads últimos 7 dias" value={stats.leadsLast7} />
            <MetricRow label="Leads últimos 30 dias" value={stats.leadsLast30} />
            <MetricRow label="Hot Leads (score > 70)" value={stats.hotLeads} />
            <MetricRow label="Taxa de conversão" value={`${stats.conversionRate}%`} />
            <MetricRow label="Qualificados pela IA" value={stats.qualifiedCount} />
          </div>
        </div>

        {/* Status breakdown */}
        <div className="glass rounded-xl p-5 border border-border space-y-4">
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-2">
            <Target className="h-4 w-4" /> Por Status
          </h3>
          <div className="space-y-3">
            {statusBreakdown.map((s) => (
              <div key={s.status} className="flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded-md ${s.color} border`}>{s.label}</span>
                <span className="text-lg font-bold tabular-nums text-foreground">{s.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent leads */}
        <div className="glass rounded-xl p-5 border border-border space-y-4">
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Leads Recentes
          </h3>
          <div className="space-y-3">
            {recentLeads.map((l) => (
              <div key={l.id} className="flex items-center justify-between border-b border-border/50 pb-2 last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{l.nome}</p>
                  <p className="text-[10px] text-muted-foreground">{l.cidade}</p>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {new Date(l.created_at).toLocaleDateString("pt-BR")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between border-b border-border/50 pb-2 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-lg font-bold tabular-nums text-foreground">{value}</span>
    </div>
  );
}
