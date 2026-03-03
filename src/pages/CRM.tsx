import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { CRMSidebar, CRMPage } from "@/components/crm/CRMSidebar";
import { CRMLogin } from "@/components/crm/CRMLogin";
import { StatsCards } from "@/components/crm/StatsCards";
import { LeadsTable } from "@/components/crm/LeadsTable";
import { LeadDetailPanel } from "@/components/crm/LeadDetailPanel";
import { Lead, mockLeads } from "@/components/crm/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Search, Download, RefreshCw, Sparkles, Loader2, Copy } from "lucide-react";
import { statusConfig, dorLabels } from "@/components/crm/types";

const CRM = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filtered, setFiltered] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [qualifyingIds, setQualifyingIds] = useState<Set<string>>(new Set());
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [useMock, setUseMock] = useState(false);
  const [activePage, setActivePage] = useState<CRMPage>("leads");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAuth(!!session);
      if (session) fetchLeads();
    });
    supabase.auth.getSession().then(({ data }) => {
      setIsAuth(!!data.session);
      if (data.session) fetchLeads();
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads" as any)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      // Fall back to mock data for visualization
      setLeads(mockLeads);
      setUseMock(true);
    } else {
      const dbLeads = (data as any) || [];
      if (dbLeads.length === 0) {
        setLeads(mockLeads);
        setUseMock(true);
      } else {
        setLeads(dbLeads);
        setUseMock(false);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let result = leads;
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.nome.toLowerCase().includes(s) ||
          l.cidade.toLowerCase().includes(s) ||
          l.whatsapp.includes(s) ||
          (l.instagram && l.instagram.toLowerCase().includes(s))
      );
    }
    if (filterStatus !== "todos") result = result.filter((l) => l.status === filterStatus);
    setFiltered(result);
  }, [leads, search, filterStatus]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuth(false);
    setLeads([]);
  };

  const updateStatus = async (id: string, status: string) => {
    if (useMock) {
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
      if (selectedLead?.id === id) setSelectedLead((prev) => prev ? { ...prev, status } : null);
      return;
    }
    const { error } = await supabase.from("leads" as any).update({ status } as any).eq("id", id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
      if (selectedLead?.id === id) setSelectedLead((prev) => prev ? { ...prev, status } : null);
    }
  };

  const qualifyLeads = async (ids: string[]) => {
    setQualifyingIds((prev) => new Set([...prev, ...ids]));

    if (useMock) {
      // Simulate AI qualification with delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setLeads((prev) =>
        prev.map((l) => {
          if (!ids.includes(l.id)) return l;
          const score = Math.floor(Math.random() * 60) + 30;
          const qualificacao = score > 70
            ? "Lead com alto potencial. Volume e dor alinhados ao produto."
            : score >= 40
            ? "Lead com potencial moderado. Necessita acompanhamento."
            : "Lead com baixo fit atual. Baixo volume ou dor não alinhada.";
          return { ...l, score_ia: score, qualificacao_ia: qualificacao };
        })
      );
      toast({ title: `${ids.length} lead(s) qualificado(s) (mock)!` });
      setQualifyingIds((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.delete(id));
        return next;
      });
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({ title: "Erro", description: "Sessão expirada", variant: "destructive" });
        return;
      }
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/qualify-leads`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({ lead_ids: ids }),
        }
      );
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Erro ao qualificar");
      }
      const { results } = await response.json();
      setLeads((prev) =>
        prev.map((l) => {
          const r = results?.find((r: any) => r.id === l.id);
          return r ? { ...l, score_ia: r.score, qualificacao_ia: r.qualificacao } : l;
        })
      );
      toast({ title: `${results?.length || 0} leads qualificados com IA!` });
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    } finally {
      setQualifyingIds((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.delete(id));
        return next;
      });
    }
  };

  const qualifyAll = () => {
    const unqualified = filtered.filter((l) => l.score_ia === null || l.score_ia === undefined);
    if (unqualified.length === 0) {
      toast({ title: "Todos os leads já foram qualificados." });
      return;
    }
    qualifyLeads(unqualified.map((l) => l.id));
  };

  const exportCSV = () => {
    const headers = ["Nome", "Empresa", "WhatsApp", "Instagram", "Volume/Mês", "Dor Principal", "Score IA", "Qualificação IA", "Status", "Data"];
    const rows = filtered.map((l) => [
      l.nome, l.cidade, l.whatsapp, l.instagram || "",
      l.mesas_por_mes || "",
      dorLabels[l.maior_dor || ""] || l.maior_dor || "",
      l.score_ia?.toString() || "",
      l.qualificacao_ia || "",
      statusConfig[l.status]?.label || l.status,
      new Date(l.created_at).toLocaleString("pt-BR"),
    ]);
    const csv = "\uFEFF" + [headers.join(";"), ...rows.map((r) => r.map((c) => `"${c}"`).join(";"))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: `${filtered.length} leads exportados!` });
  };

  // ─── AUTH GATES ─────────────────────────
  if (isAuth === false) return <CRMLogin />;
  if (isAuth === null) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-crm-purple" />
      </div>
    );
  }

  // ─── MAIN CRM LAYOUT ────────────────────
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <CRMSidebar onLogout={handleLogout} activePage={activePage} onNavigate={setActivePage} />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <header className="h-14 flex items-center justify-between border-b border-border px-4 bg-background/80 backdrop-blur-sm sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-muted-foreground" />
              <h1 className="text-sm font-serif font-bold text-foreground hidden sm:block">
                {activePage === "dashboard" ? "Dashboard" : activePage === "leads" ? "Leads" : activePage === "hosts" ? "Hosts Ativos" : activePage === "lojistas" ? "Lojistas" : "Configurações"}
              </h1>
              {useMock && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-crm-yellow/20 text-crm-yellow font-semibold">
                  MOCK DATA
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={qualifyAll}
                disabled={qualifyingIds.size > 0}
                className="gap-2 text-crm-purple hover:text-crm-purple hover:bg-crm-purple/10"
              >
                {qualifyingIds.size > 0 ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                <span className="hidden sm:inline">Qualificar IA</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={fetchLeads} title="Atualizar">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={exportCSV} title="Exportar CSV">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 p-4 md:p-6 space-y-6 overflow-auto">
            <StatsCards leads={leads} />

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, empresa, WhatsApp ou Instagram..."
                  className="pl-10 h-11 rounded-xl"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-44 h-11 rounded-xl">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  {Object.entries(statusConfig).map(([key, cfg]) => (
                    <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <p className="text-sm text-muted-foreground">
              {filtered.length} lead{filtered.length !== 1 ? "s" : ""}
            </p>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-crm-purple" />
              </div>
            ) : (
              <LeadsTable
                leads={filtered}
                qualifyingIds={qualifyingIds}
                onQualify={qualifyLeads}
                onUpdateStatus={updateStatus}
                onSelectLead={(lead) => setSelectedLead(lead)}
              />
            )}
          </main>
        </div>

        {/* Lead Detail Slide-over */}
        <LeadDetailPanel
          lead={selectedLead}
          open={!!selectedLead}
          onClose={() => setSelectedLead(null)}
          onQualify={(id) => qualifyLeads([id])}
          onUpdateStatus={updateStatus}
          isQualifying={selectedLead ? qualifyingIds.has(selectedLead.id) : false}
        />
      </div>
    </SidebarProvider>
  );
};

export default CRM;
