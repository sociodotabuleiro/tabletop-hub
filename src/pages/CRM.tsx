import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Search, Download, RefreshCw, LogIn, ExternalLink, Copy, LogOut, Sparkles, Loader2 } from "lucide-react";
import logo from "@/assets/logo.png";

type Lead = {
  id: string;
  nome: string;
  email: string;
  whatsapp: string;
  cidade: string;
  perfil: string;
  jogos_favoritos: string | null;
  mesas_por_mes: string | null;
  ja_cobra_por_mesa: boolean;
  como_organiza: string | null;
  maior_dor: string | null;
  interesse_beta: boolean;
  notas_internas: string | null;
  status: string;
  origem: string;
  created_at: string;
  score_ia: number | null;
  qualificacao_ia: string | null;
};

const statusOptions = [
  { value: "novo", label: "Novo", color: "bg-primary/20 text-primary border-primary/30" },
  { value: "quente", label: "Contatado", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  { value: "convertido", label: "Fechado", color: "bg-accent/20 text-accent border-accent/30" },
];

const volumeConfig: Record<string, { label: string; color: string }> = {
  "1-5": { label: "1–5", color: "bg-muted text-muted-foreground" },
  "6-15": { label: "6–15", color: "bg-blue-500/15 text-blue-400" },
  "16-30": { label: "16–30", color: "bg-primary/20 text-primary" },
  "30+": { label: "30+", color: "bg-accent/20 text-accent font-bold" },
};

const dorLabels: Record<string, string> = {
  desistencias: "Desistências",
  gestao_caotica: "Gestão caótica (WhatsApp)",
  conversao_vendas: "Conversão de vendas",
  organizacao_caotica: "Organização caótica",
  dificuldade_vendas: "Vendas de expansões",
};

function getScoreColor(score: number | null) {
  if (score === null) return "";
  if (score >= 75) return "text-accent font-bold";
  if (score >= 50) return "text-yellow-400";
  return "text-muted-foreground";
}

function getScoreBg(score: number | null) {
  if (score === null) return "";
  if (score >= 75) return "bg-accent/15 border-accent/30";
  if (score >= 50) return "bg-yellow-500/15 border-yellow-500/30";
  return "bg-muted/50 border-border";
}

const CRM = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filtered, setFiltered] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [qualifyingIds, setQualifyingIds] = useState<Set<string>>(new Set());

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
    } else {
      setLeads((data as any) || []);
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
          l.whatsapp.includes(s)
      );
    }
    if (filterStatus !== "todos") result = result.filter((l) => l.status === filterStatus);
    setFiltered(result);
  }, [leads, search, filterStatus]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    setLoginLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuth(false);
    setLeads([]);
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("leads" as any)
      .update({ status } as any)
      .eq("id", id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    }
  };

  const qualifyLeads = async (ids: string[]) => {
    setQualifyingIds((prev) => new Set([...prev, ...ids]));
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
    const headers = ["Nome", "Empresa", "WhatsApp", "Volume/Mês", "Dor Principal", "Score IA", "Qualificação IA", "Status", "Data"];
    const rows = filtered.map((l) => [
      l.nome,
      l.cidade,
      l.whatsapp,
      l.mesas_por_mes || "",
      dorLabels[l.maior_dor || ""] || l.maior_dor || "",
      l.score_ia?.toString() || "",
      l.qualificacao_ia || "",
      statusOptions.find((s) => s.value === l.status)?.label || l.status,
      new Date(l.created_at).toLocaleString("pt-BR"),
    ]);
    const csv = "\uFEFF" + [headers.join(";"), ...rows.map((r) => r.map((c) => `"${c}"`).join(";"))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads_abrin_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: `${filtered.length} leads exportados!` });
  };

  const copyAll = () => {
    const text = filtered
      .map((l) => `${l.nome}\t${l.cidade}\t${l.whatsapp}\t${l.mesas_por_mes || "-"}\t${dorLabels[l.maior_dor || ""] || "-"}\t${l.score_ia ?? "-"}\t${l.status}`)
      .join("\n");
    navigator.clipboard.writeText(text);
    toast({ title: "Dados copiados!" });
  };

  // ─── LOGIN ────────────────────────────────
  if (isAuth === false) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center px-6">
        <div className="glass rounded-2xl p-10 max-w-sm w-full space-y-6 border border-border">
          <img src={logo} alt="Logo" className="h-14 mx-auto" />
          <div className="text-center">
            <h1 className="text-xl font-serif font-bold text-foreground">CRM Interno</h1>
            <p className="text-sm text-muted-foreground font-sans mt-1">Acesso restrito</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input type="email" placeholder="E-mail" className="h-12 rounded-xl" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input type="password" placeholder="Senha" className="h-12 rounded-xl" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Button type="submit" disabled={loginLoading} className="w-full h-12 bg-primary text-primary-foreground rounded-xl font-semibold">
              <LogIn className="h-4 w-4 mr-2" />
              {loginLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  if (isAuth === null) {
    return <div className="fixed inset-0 bg-background flex items-center justify-center"><p className="text-muted-foreground animate-pulse">Carregando...</p></div>;
  }

  // ─── STATS ────────────────────────────────
  const avgScore = leads.filter((l) => l.score_ia !== null && l.score_ia !== undefined);
  const avgScoreVal = avgScore.length > 0 ? Math.round(avgScore.reduce((a, l) => a + (l.score_ia || 0), 0) / avgScore.length) : null;

  const stats = [
    { label: "Total", value: leads.length, accent: false },
    { label: "Novos", value: leads.filter((l) => l.status === "novo").length, accent: false },
    { label: "Contatados", value: leads.filter((l) => l.status === "quente").length, accent: false },
    { label: "Fechados", value: leads.filter((l) => l.status === "convertido").length, accent: true },
    { label: "Score Médio IA", value: avgScoreVal !== null ? avgScoreVal : "—", accent: true },
  ];

  // ─── DASHBOARD ────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <header className="glass border-b border-border px-4 py-3 md:px-8 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="h-8" />
            <h1 className="text-sm font-serif font-bold text-foreground hidden sm:block">CRM — ABRIN 2026</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={qualifyAll}
              disabled={qualifyingIds.size > 0}
              className="gap-2 text-accent hover:text-accent"
              title="Qualificar leads sem score com IA"
            >
              {qualifyingIds.size > 0 ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              <span className="hidden sm:inline">Qualificar IA</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={fetchLeads} title="Atualizar">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={copyAll} title="Copiar dados">
              <Copy className="h-4 w-4" />
            </Button>
            <Button size="sm" onClick={exportCSV} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-semibold gap-2">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Exportar Leads (CSV)</span>
              <span className="sm:hidden">CSV</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Sair">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 md:px-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="glass rounded-xl p-4 text-center border border-border">
              <p className={`text-3xl font-bold font-sans tabular-nums ${s.accent ? "text-accent" : "text-foreground"}`}>
                {s.value}
              </p>
              <p className="text-xs text-muted-foreground font-sans mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar nome, empresa ou WhatsApp..." className="pl-10 h-11 rounded-xl" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-40 h-11 rounded-xl">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              {statusOptions.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <p className="text-sm text-muted-foreground">{filtered.length} lead{filtered.length !== 1 ? "s" : ""}</p>

        {/* Table */}
        {loading ? (
          <p className="text-center text-muted-foreground py-20 animate-pulse">Carregando...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 space-y-2">
            <p className="text-lg text-muted-foreground">Nenhum lead ainda.</p>
            <p className="text-sm text-muted-foreground">Cadastre parceiros em <span className="text-primary font-semibold">/feira</span></p>
          </div>
        ) : (
          <div className="glass rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="font-sans text-[11px] text-muted-foreground uppercase tracking-widest">Nome</TableHead>
                    <TableHead className="font-sans text-[11px] text-muted-foreground uppercase tracking-widest">Empresa</TableHead>
                    <TableHead className="font-sans text-[11px] text-muted-foreground uppercase tracking-widest">WhatsApp</TableHead>
                    <TableHead className="font-sans text-[11px] text-muted-foreground uppercase tracking-widest text-center">Volume</TableHead>
                    <TableHead className="font-sans text-[11px] text-muted-foreground uppercase tracking-widest">Dor Principal</TableHead>
                    <TableHead className="font-sans text-[11px] text-muted-foreground uppercase tracking-widest text-center">Score IA</TableHead>
                    <TableHead className="font-sans text-[11px] text-muted-foreground uppercase tracking-widest">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((lead) => {
                    const vol = volumeConfig[lead.mesas_por_mes || ""] || null;
                    const statusCfg = statusOptions.find((s) => s.value === lead.status);
                    const isQualifying = qualifyingIds.has(lead.id);
                    return (
                      <TableRow key={lead.id} className="border-border hover:bg-card/40 transition-colors">
                        <TableCell>
                          <span className="font-semibold text-foreground">{lead.nome}</span>
                          <span className="block text-[11px] text-muted-foreground">
                            {new Date(lead.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{lead.cidade}</TableCell>
                        <TableCell>
                          <a
                            href={`https://wa.me/55${lead.whatsapp.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent hover:underline inline-flex items-center gap-1 font-mono text-sm"
                          >
                            {lead.whatsapp}
                            <ExternalLink className="h-3 w-3 opacity-50" />
                          </a>
                        </TableCell>
                        <TableCell className="text-center">
                          {vol ? (
                            <Badge variant="outline" className={`${vol.color} border-0 text-xs px-3 py-1`}>
                              {vol.label}/mês
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-xs">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-[180px] truncate">
                          {dorLabels[lead.maior_dor || ""] || lead.maior_dor || "—"}
                        </TableCell>
                        <TableCell className="text-center">
                          {isQualifying ? (
                            <Loader2 className="h-4 w-4 animate-spin mx-auto text-accent" />
                          ) : lead.score_ia !== null && lead.score_ia !== undefined ? (
                            <div className="flex flex-col items-center gap-1">
                              <Badge variant="outline" className={`${getScoreBg(lead.score_ia)} text-xs px-3 py-1 ${getScoreColor(lead.score_ia)}`}>
                                {lead.score_ia}
                              </Badge>
                              {lead.qualificacao_ia && (
                                <span className="text-[10px] text-muted-foreground max-w-[140px] truncate block" title={lead.qualificacao_ia}>
                                  {lead.qualificacao_ia}
                                </span>
                              )}
                            </div>
                          ) : (
                            <button
                              onClick={() => qualifyLeads([lead.id])}
                              className="text-accent/60 hover:text-accent transition-colors"
                              title="Qualificar com IA"
                            >
                              <Sparkles className="h-4 w-4 mx-auto" />
                            </button>
                          )}
                        </TableCell>
                        <TableCell>
                          <Select value={lead.status} onValueChange={(val) => updateStatus(lead.id, val)}>
                            <SelectTrigger className="h-7 w-28 text-xs rounded-lg border-0 bg-transparent p-0 shadow-none focus:ring-0">
                              <Badge className={`${statusCfg?.color || ""} border text-xs cursor-pointer`}>
                                {statusCfg?.label || lead.status}
                              </Badge>
                            </SelectTrigger>
                            <SelectContent>
                              {statusOptions.map((s) => (
                                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
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
        )}
      </main>
    </div>
  );
};

export default CRM;
