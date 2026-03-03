import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Loader2, MessageSquarePlus, Clock } from "lucide-react";

interface Interaction {
  id: string;
  nota: string;
  created_at: string;
}

interface LeadInteractionsProps {
  leadId: string;
}

export function LeadInteractions({ leadId }: LeadInteractionsProps) {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [currentNote, setCurrentNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInteractions = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("lead_interactions" as any)
      .select("id, nota, created_at")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setInteractions(data as any);
    }
    setIsLoading(false);
  }, [leadId]);

  useEffect(() => {
    fetchInteractions();
  }, [fetchInteractions]);

  const handleSaveInteraction = async () => {
    const trimmed = currentNote.trim();
    if (!trimmed) return;

    setIsSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { data, error } = await supabase
        .from("lead_interactions" as any)
        .insert({ lead_id: leadId, nota: trimmed, created_by: session?.user?.id } as any)
        .select("id, nota, created_at")
        .single();

      if (error) throw error;

      setInteractions((prev) => [data as any, ...prev]);
      setCurrentNote("");
      toast({ title: "Interação salva com sucesso!" });
    } catch (err: any) {
      toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-2">
        <MessageSquarePlus className="h-4 w-4" />
        Histórico de Interações
      </h3>

      {/* Form */}
      <div className="space-y-3">
        <Textarea
          placeholder="Descreva a interação (ex: Reunião feita, enviou proposta, não atendeu...)"
          value={currentNote}
          onChange={(e) => setCurrentNote(e.target.value)}
          className="min-h-[100px] rounded-xl resize-none"
        />
        <Button
          onClick={handleSaveInteraction}
          disabled={isSaving || !currentNote.trim()}
          className="w-full bg-crm-purple text-crm-purple-foreground hover:bg-crm-purple/90 gap-2 h-11 rounded-xl"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquarePlus className="h-4 w-4" />}
          {isSaving ? "Salvando..." : "Salvar Interação"}
        </Button>
      </div>

      {/* Timeline */}
      {isLoading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : interactions.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">
          Nenhuma interação registrada ainda.
        </p>
      ) : (
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
          {interactions.map((item) => (
            <div
              key={item.id}
              className="relative pl-5 border-l-2 border-crm-purple/20 pb-1"
            >
              <div className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-crm-purple/60" />
              <p className="text-[10px] text-muted-foreground flex items-center gap-1 mb-0.5">
                <Clock className="h-3 w-3" />
                {new Date(item.created_at).toLocaleString("pt-BR")}
              </p>
              <p className="text-sm text-foreground leading-relaxed">{item.nota}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
