import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lead, statusConfig, volumeConfig, dorLabels, getScoreColor, getLeadClassification } from "./types";
import { LeadScoreBadge } from "./LeadScoreBadge";
import { Sparkles, CheckCircle, Archive, ExternalLink, Instagram, Loader2 } from "lucide-react";

interface LeadDetailPanelProps {
  lead: Lead | null;
  open: boolean;
  onClose: () => void;
  onQualify: (id: string) => void;
  onUpdateStatus: (id: string, status: string) => void;
  isQualifying: boolean;
}

export function LeadDetailPanel({ lead, open, onClose, onQualify, onUpdateStatus, isQualifying }: LeadDetailPanelProps) {
  if (!lead) return null;

  const statusCfg = statusConfig[lead.status];
  const classification = getLeadClassification(lead);

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-lg bg-background border-border overflow-y-auto">
        <SheetHeader className="pb-4 border-b border-border">
          <div className="flex items-start justify-between">
            <div>
              <SheetTitle className="text-xl font-serif text-foreground">{lead.nome}</SheetTitle>
              <p className="text-sm text-muted-foreground mt-1">{lead.cidade}</p>
              <div className="flex gap-2 mt-2">
                <Badge className={`${statusCfg?.color} border text-xs`}>
                  {statusCfg?.label || lead.status}
                </Badge>
                <Badge variant="outline" className="text-xs border-crm-purple/30 text-crm-purple">
                  {classification}
                </Badge>
              </div>
            </div>
            <LeadScoreBadge score={lead.score_ia} size="lg" />
          </div>
        </SheetHeader>

        <Tabs defaultValue="dados" className="mt-6">
          <TabsList className="grid w-full grid-cols-3 bg-secondary">
            <TabsTrigger value="dados" className="text-xs">Dados Brutos</TabsTrigger>
            <TabsTrigger value="ia" className="text-xs">Análise IA</TabsTrigger>
            <TabsTrigger value="acoes" className="text-xs">Ações</TabsTrigger>
          </TabsList>

          {/* ─── DADOS BRUTOS ─── */}
          <TabsContent value="dados" className="space-y-4 mt-4">
            <DataRow label="Email" value={lead.email} />
            <DataRow label="WhatsApp">
              <a
                href={`https://wa.me/55${lead.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-crm-green hover:underline inline-flex items-center gap-1"
              >
                {lead.whatsapp} <ExternalLink className="h-3 w-3" />
              </a>
            </DataRow>
            <DataRow label="Instagram">
              {lead.instagram ? (
                <a
                  href={`https://instagram.com/${lead.instagram.replace(/^@/, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-crm-purple hover:underline inline-flex items-center gap-1"
                >
                  <Instagram className="h-3 w-3" /> {lead.instagram}
                </a>
              ) : (
                <span className="text-muted-foreground">Não informado</span>
              )}
            </DataRow>
            <DataRow label="Perfil">
              <Badge variant="outline" className="text-xs">{lead.perfil}</Badge>
            </DataRow>
            <DataRow label="Mesas/mês">
              {lead.mesas_por_mes ? (
                <Badge variant="outline" className={`${volumeConfig[lead.mesas_por_mes]?.color} border-0 text-xs`}>
                  {volumeConfig[lead.mesas_por_mes]?.label || lead.mesas_por_mes}
                </Badge>
              ) : "—"}
            </DataRow>
            <DataRow label="Cobra ingresso?" value={lead.ja_cobra_por_mesa ? "Sim" : "Não"} />
            <DataRow label="Como organiza" value={lead.como_organiza || "—"} />
            <DataRow label="Maior dor" value={dorLabels[lead.maior_dor || ""] || lead.maior_dor || "—"} />
            <DataRow label="Jogos favoritos" value={lead.jogos_favoritos || "—"} />
            <DataRow label="Interesse beta" value={lead.interesse_beta ? "Sim" : "Não"} />
            <DataRow label="Origem" value={lead.origem || "—"} />
            <DataRow label="Cadastrado em" value={new Date(lead.created_at).toLocaleString("pt-BR")} />
            {lead.notas_internas && (
              <div className="mt-4 p-3 rounded-lg bg-crm-yellow/5 border border-crm-yellow/20">
                <p className="text-[10px] uppercase tracking-wider text-crm-yellow mb-1">Notas Internas</p>
                <p className="text-sm text-foreground">{lead.notas_internas}</p>
              </div>
            )}
          </TabsContent>

          {/* ─── ANÁLISE IA ─── */}
          <TabsContent value="ia" className="space-y-6 mt-4">
            {lead.score_ia !== null && lead.score_ia !== undefined ? (
              <>
                <div className="glass rounded-xl p-6 border border-border text-center space-y-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">AI Score</p>
                  <p className={`text-5xl font-bold font-sans ${getScoreColor(lead.score_ia)}`}>
                    {lead.score_ia}
                  </p>
                  <Badge variant="outline" className="border-crm-purple/30 text-crm-purple">
                    {classification}
                  </Badge>
                </div>

                {lead.qualificacao_ia && (
                  <div className="glass rounded-xl p-5 border border-border space-y-2">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Justificativa da IA</p>
                    <p className="text-sm text-foreground leading-relaxed">{lead.qualificacao_ia}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="glass rounded-lg p-3 border border-border text-center">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Volume</p>
                    <p className="text-sm font-semibold text-foreground">{lead.mesas_por_mes || "—"}</p>
                  </div>
                  <div className="glass rounded-lg p-3 border border-border text-center">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Dor Principal</p>
                    <p className="text-sm font-semibold text-foreground truncate" title={dorLabels[lead.maior_dor || ""]}>
                      {dorLabels[lead.maior_dor || ""]?.split(" ").slice(0, 2).join(" ") || "—"}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 space-y-4">
                <Sparkles className="h-12 w-12 text-crm-purple/30 mx-auto" />
                <p className="text-muted-foreground">Este lead ainda não foi qualificado pela IA.</p>
                <Button
                  onClick={() => onQualify(lead.id)}
                  disabled={isQualifying}
                  className="bg-crm-purple text-crm-purple-foreground hover:bg-crm-purple/90 gap-2"
                >
                  {isQualifying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  Rodar Qualificação com IA
                </Button>
              </div>
            )}
          </TabsContent>

          {/* ─── AÇÕES ─── */}
          <TabsContent value="acoes" className="space-y-4 mt-4">
            <Button
              onClick={() => onQualify(lead.id)}
              disabled={isQualifying}
              className="w-full bg-crm-purple text-crm-purple-foreground hover:bg-crm-purple/90 gap-2 h-12"
            >
              {isQualifying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {isQualifying ? "Qualificando..." : "Rodar Qualificação com IA"}
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => onUpdateStatus(lead.id, "quente")}
                className="border-crm-green/30 text-crm-green hover:bg-crm-green/10 gap-2 h-11"
              >
                <CheckCircle className="h-4 w-4" />
                Aprovar Lead
              </Button>
              <Button
                variant="outline"
                onClick={() => onUpdateStatus(lead.id, "frio")}
                className="border-crm-red/30 text-crm-red hover:bg-crm-red/10 gap-2 h-11"
              >
                <Archive className="h-4 w-4" />
                Arquivar
              </Button>
            </div>

            <div className="pt-4 border-t border-border space-y-2">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Alterar Status</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(statusConfig).map(([key, cfg]) => (
                  <Button
                    key={key}
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateStatus(lead.id, key)}
                    className={`text-xs ${lead.status === key ? cfg.color + " border" : "border-border text-muted-foreground"}`}
                  >
                    {cfg.label}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

function DataRow({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div className="flex justify-between items-start py-2 border-b border-border/50 last:border-0">
      <span className="text-xs text-muted-foreground uppercase tracking-wider flex-shrink-0">{label}</span>
      <span className="text-sm text-foreground text-right ml-4">{children || value}</span>
    </div>
  );
}
