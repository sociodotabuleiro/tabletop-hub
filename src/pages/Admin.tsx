import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Search, Download, RefreshCw, LogIn, ExternalLink, Copy } from "lucide-react";
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
};

const statusOptions = [
  { value: "novo", label: "Novo", color: "bg-primary/20 text-primary border-primary/30" },
  { value: "quente", label: "Contatado", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  { value: "convertido", label: "Fechado", color: "bg-accent/20 text-accent border-accent/30" },
];

const volumeColors: Record<string, string> = {
  "1-5": "bg-muted text-muted-foreground",
  "6-15": "bg-primary/15 text-primary",
  "16-30": "bg-primary/25 text-primary",
  "30+": "bg-accent/20 text-accent",
};

const dorLabels: Record<string, string> = {
  desistencias: "Desistências",
  organizacao_caotica: "Organização caótica",
  dificuldade_vendas: "Vendas de expansões",
};

const Admin = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

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
    setFilteredLeads(result);
  }, [leads, search, filterStatus]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    }
    setLoginLoading(false);
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

  const exportCSV = () => {
    const headers = ["Nome", "Empresa", "WhatsApp", "Volume", "Dor Principal", "Status", "Data"];
    const rows = filteredLeads.map((l) => [
      l.nome,
      l.cidade,
      l.whatsapp,
      l.mesas_por_mes || "",
      dorLabels[l.maior_dor || ""] || l.maior_dor || "",
      l.status,
      new Date(l.created_at).toLocaleString("pt-BR"),
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads_abrin_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "CSV exportado!", description: `${filteredLeads.length} leads.` });
  };

  const copyAllData = () => {
    const text = filteredLeads
      .map((l) => `${l.nome} | ${l.cidade} | ${l.whatsapp} | ${l.mesas_por_mes || "-"} | ${dorLabels[l.maior_dor || ""] || "-"} | ${l.status}`)
      .join("\n");
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado!", description: "Dados copiados para a área de transferência." });
  };

  // ─── LOGIN ────────────────────────────────────────
  if (isAuth === false) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="glass rounded-2xl p-8 md:p-10 max-w-sm w-full space-y-6 border border-border">
          <img src={logo} alt="Logo" className="h-16 mx-auto" />
          <div className="text-center">
            <h1 className="text-xl font-serif font-bold text-foreground">Painel Interno</h1>
            <p className="text-sm text-muted-foreground font-sans mt-1">Acesso restrito à equipe</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              placeholder="E-mail"
              className="h-12 rounded-xl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Senha"
              className="h-12 rounded-xl"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              disabled={loginLoading}
              className="w-full h-12 bg-primary text-primary-foreground rounded-xl font-semibold"
            >
              <LogIn className="h-4 w-4 mr-2" />
              {loginLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  if (isAuth === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground font-sans animate-pulse">Carregando...</p>
      </div>
    );
  }

  // ─── STATS ────────────────────────────────────────
  const stats = {
    total: leads.length,
    novos: leads.filter((l) => l.status === "novo").length,
    contatados: leads.filter((l) => l.status === "quente").length,
    fechados: leads.filter((l) => l.status === "convertido").length,
    volume30: leads.filter((l) => l.mesas_por_mes === "30+" || l.mesas_por_mes === "16-30").length,
  };

  // ─── DASHBOARD ────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="glass border-b border-border px-4 py-3 md:px-8 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="h-8" />
            <h1 className="text-base font-serif font-bold text-foreground hidden sm:block">
              CRM — ABRIN 2026
            </h1>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={fetchLeads}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={copyAllData}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              onClick={exportCSV}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Download className="h-4 w-4 mr-1" /> CSV
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 md:px-8 space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "Total", value: stats.total, accent: false },
            { label: "Novos", value: stats.novos, accent: false },
            { label: "Contatados", value: stats.contatados, accent: false },
            { label: "Fechados", value: stats.fechados, accent: true },
            { label: "Alto Volume", value: stats.volume30, accent: true },
          ].map((s) => (
            <div key={s.label} className="glass rounded-xl p-4 text-center border border-border">
              <p className={`text-2xl font-bold font-sans ${s.accent ? "text-accent" : "text-foreground"}`}>
                {s.value}
              </p>
              <p className="text-xs text-muted-foreground font-sans">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar nome, empresa ou WhatsApp..."
              className="pl-10 h-11 rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-40 h-11 rounded-xl">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="novo">Novo</SelectItem>
              <SelectItem value="quente">Contatado</SelectItem>
              <SelectItem value="convertido">Fechado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Count */}
        <p className="text-sm text-muted-foreground font-sans">
          {filteredLeads.length} lead{filteredLeads.length !== 1 ? "s" : ""}
        </p>

        {/* Table */}
        {loading ? (
          <p className="text-center text-muted-foreground py-16 animate-pulse">Carregando leads...</p>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <p className="text-muted-foreground">Nenhum lead encontrado.</p>
            <p className="text-xs text-muted-foreground">Cadastre parceiros em <span className="text-primary">/feira</span></p>
          </div>
        ) : (
          <div className="glass rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="font-sans text-xs text-muted-foreground uppercase tracking-wider">Nome</TableHead>
                    <TableHead className="font-sans text-xs text-muted-foreground uppercase tracking-wider">Empresa</TableHead>
                    <TableHead className="font-sans text-xs text-muted-foreground uppercase tracking-wider">WhatsApp</TableHead>
                    <TableHead className="font-sans text-xs text-muted-foreground uppercase tracking-wider">Volume</TableHead>
                    <TableHead className="font-sans text-xs text-muted-foreground uppercase tracking-wider">Dor Principal</TableHead>
                    <TableHead className="font-sans text-xs text-muted-foreground uppercase tracking-wider">Status</TableHead>
                    <TableHead className="font-sans text-xs text-muted-foreground uppercase tracking-wider">Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => (
                    <TableRow key={lead.id} className="border-border hover:bg-card/50">
                      <TableCell className="font-semibold text-foreground">{lead.nome}</TableCell>
                      <TableCell className="text-muted-foreground">{lead.cidade}</TableCell>
                      <TableCell>
                        <a
                          href={`https://wa.me/55${lead.whatsapp.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:underline inline-flex items-center gap-1"
                        >
                          {lead.whatsapp}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </TableCell>
                      <TableCell>
                        {lead.mesas_por_mes && (
                          <Badge
                            variant="outline"
                            className={`${volumeColors[lead.mesas_por_mes] || ""} border-0 font-mono text-xs`}
                          >
                            {lead.mesas_por_mes}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {dorLabels[lead.maior_dor || ""] || lead.maior_dor || "—"}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={lead.status}
                          onValueChange={(val) => updateStatus(lead.id, val)}
                        >
                          <SelectTrigger className="h-8 w-32 text-xs rounded-lg border-0 bg-transparent p-0">
                            <Badge
                              className={`${statusOptions.find((s) => s.value === lead.status)?.color || ""} border text-xs cursor-pointer`}
                            >
                              {statusOptions.find((s) => s.value === lead.status)?.label || lead.status}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((s) => (
                              <SelectItem key={s.value} value={s.value}>
                                {s.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(lead.created_at).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
