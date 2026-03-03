import { Lead, statusConfig } from "./types";
import { LeadScoreBadge } from "./LeadScoreBadge";
import { Badge } from "@/components/ui/badge";
import { Store } from "lucide-react";

interface LojistasPageProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
}

export function LojistasPage({ leads, onSelectLead }: LojistasPageProps) {
  const lojistas = leads.filter((l) => l.perfil === "lojista");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Store className="h-5 w-5 text-crm-purple" />
        <h2 className="text-lg font-serif font-bold text-foreground">Lojistas</h2>
        <Badge variant="outline" className="text-xs">{lojistas.length}</Badge>
      </div>

      {lojistas.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">Nenhum lojista encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {lojistas.map((lead) => {
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
                  {lead.instagram && (
                    <span className="text-[10px] text-muted-foreground">{lead.instagram}</span>
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
