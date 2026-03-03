import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Loader2, UserPlus, Settings } from "lucide-react";

export function SettingsPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "moderator" | "user">("user");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateUser = async () => {
    if (!email || !password) {
      toast({ title: "Preencha email e senha", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Senha deve ter no mínimo 6 caracteres", variant: "destructive" });
      return;
    }

    setIsCreating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Sessão expirada");

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({ email, password, role }),
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Erro ao criar usuário");
      }

      toast({ title: `Usuário ${email} criado com sucesso!` });
      setEmail("");
      setPassword("");
      setRole("user");
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-lg">
      <div className="flex items-center gap-2">
        <Settings className="h-5 w-5 text-crm-purple" />
        <h2 className="text-lg font-serif font-bold text-foreground">Configurações</h2>
      </div>

      <div className="glass rounded-xl p-6 border border-border space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-border">
          <UserPlus className="h-4 w-4 text-crm-purple" />
          <h3 className="text-sm font-semibold text-foreground">Criar Novo Usuário</h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-email" className="text-xs">Email</Label>
            <Input
              id="new-email"
              type="email"
              placeholder="usuario@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-xs">Senha</Label>
            <Input
              id="new-password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl h-11"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Papel (Role)</Label>
            <Select value={role} onValueChange={(v) => setRole(v as any)}>
              <SelectTrigger className="rounded-xl h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="moderator">Moderador</SelectItem>
                <SelectItem value="user">Usuário</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleCreateUser}
            disabled={isCreating}
            className="w-full bg-crm-purple text-crm-purple-foreground hover:bg-crm-purple/90 gap-2 h-11 rounded-xl"
          >
            {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
            {isCreating ? "Criando..." : "Criar Usuário"}
          </Button>
        </div>
      </div>
    </div>
  );
}
