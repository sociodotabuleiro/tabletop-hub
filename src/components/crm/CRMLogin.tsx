import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { LogIn } from "lucide-react";
import logo from "@/assets/logo.png";

export function CRMLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center px-6">
      <div className="glass rounded-2xl p-10 max-w-sm w-full space-y-6 border border-border">
        <img src={logo} alt="Logo" className="h-14 mx-auto" />
        <div className="text-center">
          <h1 className="text-xl font-serif font-bold text-foreground">CRM Interno</h1>
          <p className="text-sm text-muted-foreground font-sans mt-1">Sócio do Tabuleiro</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input type="email" placeholder="E-mail" className="h-12 rounded-xl" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input type="password" placeholder="Senha" className="h-12 rounded-xl" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" disabled={loading} className="w-full h-12 bg-crm-purple text-crm-purple-foreground rounded-xl font-semibold">
            <LogIn className="h-4 w-4 mr-2" />
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
