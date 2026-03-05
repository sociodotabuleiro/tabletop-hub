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
import { CheckCircle, ArrowRight, Loader2 } from "lucide-react";

const MAKE_WEBHOOK_URL = "https://hook.us2.make.com/p7nbf1ceeuf4pdraaltzrncdsr1ujgb1";

const formSchema = z.object({
  nome: z.string().trim().min(2, "Precisamos do seu nome.").max(100),
  email: z.string().trim().email("E-mail inválido.").max(255),
  instagram: z.string().trim().max(100).optional().or(z.literal("")),
  perfil: z.string({ required_error: "Selecione seu perfil." }),
  detalhes: z.string().trim().max(1000).optional().or(z.literal("")),
});

type FormData = z.infer<typeof formSchema>;

const perfilOptions = [
  { value: "psicologo", label: "Psicólogo(a) / Terapeuta" },
  { value: "educador", label: "Educador(a) / Pedagogo(a)" },
  { value: "terapeuta_ocupacional", label: "Terapeuta Ocupacional" },
  { value: "mestre_rpg", label: "Mestre de RPG Terapêutico" },
  { value: "estudante", label: "Estudante da Área" },
];

const perfilToLeadProfile: Record<string, string> = {
  psicologo: "host_mestre",
  educador: "host_mestre",
  terapeuta_ocupacional: "host_mestre",
  mestre_rpg: "host_mestre",
  estudante: "jogador",
};

const LeadCaptureForm = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { nome: "", email: "", instagram: "", perfil: "", detalhes: "" },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const { error } = await supabase.from("leads" as any).insert([
        {
          nome: data.nome,
          email: data.email,
          instagram: data.instagram || null,
          whatsapp: "",
          cidade: "",
          perfil: perfilToLeadProfile[data.perfil] || "outro",
          como_organiza: data.detalhes || null,
          origem: "landing_rpg_terapeutico",
        },
      ]);
      if (error) throw error;

      fetch(MAKE_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: data.nome,
          email: data.email,
          instagram: data.instagram || null,
          perfil: data.perfil,
          detalhes: data.detalhes || null,
          origem: "rpg_terapeutico",
        }),
      }).catch(() => {});

      setSuccess(true);
      form.reset();
      setTimeout(() => setSuccess(false), 5000);
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
            Cadastre-se para acesso antecipado à plataforma que vai profissionalizar o RPG terapêutico.
          </p>
        </div>

        {success ? (
          <div className="glass rounded-2xl p-10 border border-accent/30 text-center space-y-5 animate-fade-up">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full border-2 border-accent/30 mx-auto">
              <CheckCircle className="h-10 w-10 text-accent" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-foreground">Cadastro enviado!</h3>
            <p className="text-muted-foreground font-sans">
              Você está na lista de acesso antecipado. Falaremos em breve com os próximos passos.
            </p>
          </div>
        ) : (
          <div className="glass rounded-2xl p-6 md:p-10 border border-border">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome" className={inputClass} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>E-mail Profissional</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="seu@email.com" className={inputClass} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Instagram (opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="@seu.perfil" className={inputClass} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="perfil"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Qual é a sua área de atuação?</FormLabel>
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
                  )}
                />

                <FormField
                  control={form.control}
                  name="detalhes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Como você usa RPG na sua prática? (opcional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Conte sobre sua experiência com RPG terapêutico, público atendido, frequência das sessões..."
                          className="min-h-[100px] text-base rounded-xl border-border bg-card/50 placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="w-full h-16 bg-primary text-primary-foreground hover:bg-primary/90 glow-orange rounded-xl text-xl font-sans font-bold gap-3 transition-all active:scale-[0.97]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      Garantir Meu Acesso Antecipado
                      <ArrowRight className="h-6 w-6" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center font-sans opacity-60">
                  Seus dados estão seguros. Usaremos apenas para contato sobre a plataforma.
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
