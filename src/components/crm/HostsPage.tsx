import { Lead, statusConfig, getScoreColor } from "./types";
import { LeadScoreBadge } from "./LeadScoreBadge";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

interface HostsPageProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
}

export function HostsPage({ leads, onSelectLead }: HostsPageProps) {
  const hosts = leads.filter((l) => l.perfil === "host_mestre");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5 text-crm-purple" />
        <h2 className="text-lg font-serif font-bold text-foreground">Hosts Ativos</h2>
        <Badge variant="outline" className="text-xs">{hosts.length}</Badge>
      </div>

      {hosts.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">Nenhum host encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {hosts.map((lead) => {
            const cfg = statusConfig[lead.status];
            return (
              <div
                key={lead.id}
                onClick={() => onSelectLead(lead)}
                className="glass rounded-xl p-4 border border-border hover:border-crm-purple/30 cursor-pointer transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{lead.nome}</p>
                    <p className="text-xs text-muted-foreground">{lead.cidade}</p>
                  </div>
                  <LeadScoreBadge score={lead.score_ia} size="sm" />
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`${cfg?.color} border text-[10px]`}>{cfg?.label}</Badge>
                  {lead.mesas_por_mes && (
                    <span className="text-[10px] text-muted-foreground">{lead.mesas_por_mes} mesas/mês</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
