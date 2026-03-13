import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import { CheckCircle, ArrowRight, Loader2, Copy, Sparkles, Gift } from "lucide-react";

const formSchema = z.object({
  nome: z.string().trim().min(2, "Precisamos do seu nome.").max(100),
  email: z.string().trim().email("E-mail inválido.").max(255),
  instagram: z.string().trim().max(100).optional().or(z.literal("")),
  perfil: z.string({ required_error: "Selecione seu perfil." }),
  detalhes: z.string().trim().max(1000).optional().or(z.literal("")),
});

type FormData = z.infer<typeof formSchema>;

const perfilOptions = [
  { value: "mestre_rpg", label: "Mestre de RPG / Host de Board Games" },
  { value: "psicologo", label: "Psicólogo(a) / Terapeuta" },
  { value: "educador", label: "Educador(a) / Pedagogo(a)" },
  { value: "lojista", label: "Lojista / Espaço de Jogos" },
  { value: "jogador", label: "Jogador" },
];

const perfilToLeadProfile: Record<string, string> = {
  mestre_rpg: "host_mestre",
  psicologo: "host_mestre",
  educador: "host_mestre",
  lojista: "lojista",
  jogador: "jogador",
};

const MAKE_WEBHOOK_URL = "https://hook.us2.make.com/p7nbf1ceeuf4pdraaltzrncdsr1ujgb1";

const LeadCaptureForm = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { nome: "", email: "", instagram: "", perfil: "", detalhes: "" },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const { data: inserted, error } = await supabase.from("leads" as any).insert([
        {
          nome: data.nome,
          email: data.email,
          instagram: data.instagram || null,
          whatsapp: "",
          cidade: "",
          perfil: perfilToLeadProfile[data.perfil] || "outro",
          como_organiza: data.detalhes || null,
          origem: "landing_page",
        },
      ]).select("cupom").maybeSingle();
      if (error) throw error;

      setCouponCode((inserted as any)?.cupom || "");

      fetch(MAKE_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: data.nome,
          email: data.email,
          instagram: data.instagram || null,
          perfil: data.perfil,
          detalhes: data.detalhes || null,
        }),
      }).catch(() => {});

      setSuccess(true);
      form.reset();
    } catch (err: any) {
      toast({
        title: "Erro ao enviar",
        description: err.message || "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyCoupon = () => {
    navigator.clipboard.writeText(couponCode).then(() => {
      sonnerToast.success("Cupom copiado!");
    }).catch(() => {
      sonnerToast.info(`Seu cupom: ${couponCode}`);
    });
  };

  const inputClass =
    "h-14 text-base rounded-xl border-border bg-card/50 placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all";
  const labelClass =
    "text-sm font-sans font-medium text-muted-foreground uppercase tracking-wider";

  return (
    <section id="cadastro" className="section-padding">
      <div className="max-w-2xl mx-auto w-full space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground leading-tight">
            Sua mesa está{" "}
            <span className="text-gradient-warm">reservada.</span>
          </h2>
          <p className="text-base text-muted-foreground font-sans max-w-lg mx-auto">
            Cadastre-se para acesso antecipado. Nossa IA vai analisar seu perfil e te mostrar o melhor caminho.
          </p>
        </div>

        {success ? (
          <div className="glass rounded-2xl p-10 border border-accent/30 text-center space-y-5 animate-fade-up">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full border-2 border-accent/30 mx-auto">
              <CheckCircle className="h-10 w-10 text-accent" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-foreground">Cadastro enviado!</h3>
            <p className="text-muted-foreground font-sans">
              Você está na lista de acesso antecipado. Falaremos em breve.
            </p>

            {couponCode && (
              <div className="glass rounded-xl p-6 border border-primary/30 space-y-3 glow-orange">
                <div className="flex items-center justify-center gap-2 text-primary">
                  <Gift className="h-5 w-5" />
                  <span className="text-xs font-sans font-bold uppercase tracking-wider">
                    Seu cupom exclusivo
                  </span>
                </div>
                <button
                  onClick={copyCoupon}
                  className="group flex items-center justify-center gap-3 mx-auto px-6 py-3 rounded-xl border-2 border-dashed border-primary/50 bg-primary/5 hover:bg-primary/10 transition-all active:scale-95"
                >
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-xl md:text-2xl font-mono font-bold tracking-[0.2em] text-foreground select-all">
                    {couponCode}
                  </span>
                  <Copy className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
                <p className="text-xs text-muted-foreground font-sans opacity-70">
                  Toque para copiar
                </p>
              </div>
            )}

            <Button
              variant="ghost"
              onClick={() => setSuccess(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              Fazer novo cadastro →
            </Button>
          </div>
        ) : (
          <div className="glass rounded-2xl p-6 md:p-10 border border-border">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField control={form.control} name="nome" render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClass}>Nome Completo</FormLabel>
                    <FormControl><Input placeholder="Seu nome" className={inputClass} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClass}>E-mail</FormLabel>
                    <FormControl><Input type="email" placeholder="seu@email.com" className={inputClass} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="instagram" render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClass}>Instagram (opcional)</FormLabel>
                    <FormControl><Input placeholder="@seu.perfil" className={inputClass} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="perfil" render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClass}>Qual é o seu perfil?</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className={`${inputClass} text-left`}>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {perfilOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="detalhes" render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClass}>Conte mais sobre você (opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Quantas mesas organiza por mês? Já cobra por sessão? Usa RPG de forma terapêutica?"
                        className="min-h-[100px] text-base rounded-xl border-border bg-card/50 placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="w-full h-16 bg-primary text-primary-foreground hover:bg-primary/90 glow-orange rounded-xl text-xl font-sans font-bold gap-3 transition-all active:scale-[0.97]"
                >
                  {loading ? (
                    <><Loader2 className="h-5 w-5 animate-spin" /> Enviando...</>
                  ) : (
                    <>Quero Participar <ArrowRight className="h-6 w-6" /></>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center font-sans opacity-60">
                  Seus dados estão seguros. Usaremos apenas para contato.
                </p>
              </form>
            </Form>
          </div>
        )}
      </div>
    </section>
  );
};

export default LeadCaptureForm;
