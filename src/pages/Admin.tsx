import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Search, Download, Users, Flame, Snowflake, CheckCircle, RefreshCw, LogIn } from "lucide-react";
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

const statusColors: Record<string, string> = {
  novo: "bg-primary/20 text-primary border-primary/30",
  quente: "bg-red-500/20 text-red-400 border-red-500/30",
  morno: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  frio: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  convertido: "bg-accent/20 text-accent border-accent/30",
};

const statusIcons: Record<string, any> = {
  novo: Users,
  quente: Flame,
  morno: Flame,
  frio: Snowflake,
  convertido: CheckCircle,
};

const Admin = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterPerfil, setFilterPerfil] = useState("todos");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data } = await supabase.auth.getSession();
    setIsAuth(!!data.session);
    if (data.session) fetchLeads();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      setIsAuth(true);
      fetchLeads();
    }
    setLoginLoading(false);
  };

  const fetchLeads = async () => {
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
  };

  useEffect(() => {
    let result = leads;
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.nome.toLowerCase().includes(s) ||
          l.email.toLowerCase().includes(s) ||
          l.cidade.toLowerCase().includes(s) ||
          (l.jogos_favoritos && l.jogos_favoritos.toLowerCase().includes(s))
      );
    }
    if (filterPerfil !== "todos") result = result.filter((l) => l.perfil === filterPerfil);
    if (filterStatus !== "todos") result = result.filter((l) => l.status === filterStatus);
    setFilteredLeads(result);
  }, [leads, search, filterPerfil, filterStatus]);

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
    const headers = ["Nome", "Email", "WhatsApp", "Cidade", "Perfil", "Jogos", "Mesas/Mês", "Cobra?", "Organiza", "Maior Dor", "Beta?", "Status", "Data"];
    const rows = filteredLeads.map((l) => [
      l.nome, l.email, l.whatsapp, l.cidade, l.perfil,
      l.jogos_favoritos || "", l.mesas_por_mes || "", l.ja_cobra_por_mesa ? "Sim" : "Não",
      l.como_organiza || "", l.maior_dor || "", l.interesse_beta ? "Sim" : "Não",
      l.status, new Date(l.created_at).toLocaleString("pt-BR"),
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads_abrinc_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  // Login screen
  if (isAuth === false) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="glass rounded-2xl p-8 max-w-sm w-full space-y-6">
          <img src={logo} alt="Logo" className="h-16 mx-auto" />
          <h1 className="text-xl font-serif font-bold text-foreground text-center">CRM — Acesso Restrito</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Button type="submit" disabled={loginLoading} className="w-full bg-primary text-primary-foreground">
              <LogIn className="h-4 w-4 mr-2" />
              {loginLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  if (isAuth === null) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Carregando...</div>;
  }

  const stats = {
    total: leads.length,
    novos: leads.filter((l) => l.status === "novo").length,
    hosts: leads.filter((l) => l.perfil === "host_mestre").length,
    lojistas: leads.filter((l) => l.perfil === "lojista").length,
    beta: leads.filter((l) => l.interesse_beta).length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="glass border-b border-border px-4 py-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="h-10" />
            <h1 className="text-lg font-serif font-bold text-foreground">CRM — ABRINC 2026</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchLeads} className="border-border">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={exportCSV} className="border-accent text-accent">
              <Download className="h-4 w-4 mr-1" /> CSV
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 md:px-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "Total", value: stats.total, color: "text-foreground" },
            { label: "Novos", value: stats.novos, color: "text-primary" },
            { label: "Hosts/Mestres", value: stats.hosts, color: "text-accent" },
            { label: "Lojistas", value: stats.lojistas, color: "text-primary" },
            { label: "Querem Beta", value: stats.beta, color: "text-accent" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-xl p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, e-mail, cidade ou jogo..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={filterPerfil} onValueChange={setFilterPerfil}>
            <SelectTrigger className="w-full md:w-44">
              <SelectValue placeholder="Perfil" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os perfis</SelectItem>
              <SelectItem value="jogador">Jogador</SelectItem>
              <SelectItem value="host_mestre">Host/Mestre</SelectItem>
              <SelectItem value="lojista">Lojista</SelectItem>
              <SelectItem value="editora">Editora</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-44">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              <SelectItem value="novo">Novo</SelectItem>
              <SelectItem value="quente">Quente</SelectItem>
              <SelectItem value="morno">Morno</SelectItem>
              <SelectItem value="frio">Frio</SelectItem>
              <SelectItem value="convertido">Convertido</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground">
          {filteredLeads.length} lead{filteredLeads.length !== 1 ? "s" : ""} encontrado{filteredLeads.length !== 1 ? "s" : ""}
        </p>

        {/* Lead cards */}
        {loading ? (
          <p className="text-center text-muted-foreground py-10">Carregando leads...</p>
        ) : filteredLeads.length === 0 ? (
          <p className="text-center text-muted-foreground py-10">Nenhum lead encontrado.</p>
        ) : (
          <div className="space-y-3">
            {filteredLeads.map((lead) => {
              const StatusIcon = statusIcons[lead.status] || Users;
              return (
                <div key={lead.id} className="glass rounded-xl p-4 md:p-6 space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">{lead.nome}</h3>
                      <p className="text-sm text-muted-foreground">
                        {lead.email} · {lead.whatsapp} · {lead.cidade}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">{lead.perfil.replace("_", "/")}</Badge>
                      <Badge className={`${statusColors[lead.status]} border capitalize`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {lead.status}
                      </Badge>
                      {lead.interesse_beta && <Badge className="bg-accent/20 text-accent border border-accent/30">Beta</Badge>}
                      {lead.ja_cobra_por_mesa && <Badge className="bg-primary/20 text-primary border border-primary/30">Cobra $</Badge>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                    {lead.jogos_favoritos && (
                      <p><span className="text-muted-foreground">Jogos:</span> {lead.jogos_favoritos}</p>
                    )}
                    {lead.mesas_por_mes && (
                      <p><span className="text-muted-foreground">Mesas/mês:</span> {lead.mesas_por_mes}</p>
                    )}
                    {lead.como_organiza && (
                      <p><span className="text-muted-foreground">Organiza via:</span> {lead.como_organiza}</p>
                    )}
                  </div>

                  {lead.maior_dor && (
                    <p className="text-sm italic text-muted-foreground">"{lead.maior_dor}"</p>
                  )}

                  <div className="flex gap-2 pt-1">
                    {["novo", "quente", "morno", "frio", "convertido"].map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(lead.id, s)}
                        className={`text-xs px-3 py-1 rounded-full border transition-all capitalize ${
                          lead.status === s
                            ? statusColors[s]
                            : "border-border text-muted-foreground hover:border-primary/40"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {new Date(lead.created_at).toLocaleString("pt-BR")}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
