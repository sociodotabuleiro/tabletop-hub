import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lead, statusConfig, volumeConfig, dorLabels } from "./types";
import { LeadScoreBadge } from "./LeadScoreBadge";
import { ExternalLink, Sparkles, Loader2, Instagram } from "lucide-react";

interface LeadsTableProps {
  leads: Lead[];
  qualifyingIds: Set<string>;
  onQualify: (ids: string[]) => void;
  onUpdateStatus: (id: string, status: string) => void;
  onSelectLead: (lead: Lead) => void;
}

export function LeadsTable({ leads, qualifyingIds, onQualify, onUpdateStatus, onSelectLead }: LeadsTableProps) {
  if (leads.length === 0) {
    return (
      <div className="text-center py-20 space-y-2">
        <p className="text-lg text-muted-foreground">Nenhum lead encontrado.</p>
        <p className="text-sm text-muted-foreground">Cadastre parceiros em <span className="text-primary font-semibold">/feira</span></p>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-sans text-[10px] text-muted-foreground uppercase tracking-widest">Lead</TableHead>
              <TableHead className="font-sans text-[10px] text-muted-foreground uppercase tracking-widest">Empresa</TableHead>
              <TableHead className="font-sans text-[10px] text-muted-foreground uppercase tracking-widest">Contato</TableHead>
              <TableHead className="font-sans text-[10px] text-muted-foreground uppercase tracking-widest text-center">Volume</TableHead>
              <TableHead className="font-sans text-[10px] text-muted-foreground uppercase tracking-widest">Dor</TableHead>
              <TableHead className="font-sans text-[10px] text-muted-foreground uppercase tracking-widest text-center">AI Score</TableHead>
              <TableHead className="font-sans text-[10px] text-muted-foreground uppercase tracking-widest">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => {
              const vol = volumeConfig[lead.mesas_por_mes || ""] || null;
              const statusCfg = statusConfig[lead.status];
              const isQualifying = qualifyingIds.has(lead.id);
              const isHost = lead.perfil === "host_mestre" || lead.perfil === "jogador";

              return (
                <TableRow
                  key={lead.id}
                  className="border-border hover:bg-card/40 transition-colors cursor-pointer"
                  onClick={() => onSelectLead(lead)}
                >
                  <TableCell>
                    <div>
                      <span className="font-semibold text-foreground">{lead.nome}</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${isHost ? "border-crm-orange/30 text-crm-orange" : "border-crm-purple/30 text-crm-purple"}`}>
                          {isHost ? "Host" : "Lojista"}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(lead.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{lead.cidade}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <a
                        href={`https://wa.me/55${lead.whatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-crm-green hover:underline inline-flex items-center gap-1 font-mono text-xs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {lead.whatsapp} <ExternalLink className="h-3 w-3 opacity-50" />
                      </a>
                      {lead.instagram && (
                        <a
                          href={`https://instagram.com/${lead.instagram.replace(/^@/, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-crm-purple/70 hover:text-crm-purple hover:underline inline-flex items-center gap-1 text-[11px]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Instagram className="h-3 w-3" /> {lead.instagram}
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {vol ? (
                      <Badge variant="outline" className={`${vol.color} border-0 text-xs px-3 py-1`}>
                        {vol.label}/mês
                      </Badge>
                    ) : <span className="text-muted-foreground text-xs">—</span>}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[160px] truncate">
                    {dorLabels[lead.maior_dor || ""]?.split(" ").slice(0, 3).join(" ") || "—"}
                  </TableCell>
                  <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                    {isQualifying ? (
                      <Loader2 className="h-4 w-4 animate-spin mx-auto text-crm-purple" />
                    ) : lead.score_ia !== null && lead.score_ia !== undefined ? (
                      <div className="flex flex-col items-center gap-1">
                        <LeadScoreBadge score={lead.score_ia} />
                        {lead.qualificacao_ia && (
                          <span className="text-[10px] text-muted-foreground max-w-[130px] truncate block" title={lead.qualificacao_ia}>
                            {lead.qualificacao_ia}
                          </span>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => onQualify([lead.id])}
                        className="text-crm-purple/60 hover:text-crm-purple transition-colors"
                        title="Qualificar com IA"
                      >
                        <Sparkles className="h-4 w-4 mx-auto" />
                      </button>
                    )}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Select value={lead.status} onValueChange={(val) => onUpdateStatus(lead.id, val)}>
                      <SelectTrigger className="h-7 w-28 text-xs rounded-lg border-0 bg-transparent p-0 shadow-none focus:ring-0">
                        <Badge className={`${statusCfg?.color || ""} border text-xs cursor-pointer`}>
                          {statusCfg?.label || lead.status}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(statusConfig).map(([key, cfg]) => (
                          <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
