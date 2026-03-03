import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, ArrowRight, MessageSquareWarning, MessagesSquare, ShoppingCart } from "lucide-react";
import logo from "@/assets/logo.png";

const leadSchema = z.object({
  nome: z.string().trim().min(2, "Precisamos do seu nome.").max(100),
  empresa: z.string().trim().min(2, "Nome da loja ou espaço.").max(200),
  whatsapp: z.string().trim().min(10, "WhatsApp com DDD.").max(20),
  mesas_por_mes: z.string({ required_error: "Selecione o volume." }),
  maior_dor: z.string({ required_error: "Selecione seu maior gargalo." }),
});

type LeadFormData = z.infer<typeof leadSchema>;

const volumeOptions = [
  { value: "1-5", label: "1 a 5" },
  { value: "6-15", label: "6 a 15" },
  { value: "16-30", label: "16 a 30" },
  { value: "30+", label: "Mais de 30" },
];

const dorOptions = [
  {
    value: "desistencias",
    label: "Desistências de última hora",
    icon: MessageSquareWarning,
  },
  {
    value: "gestao_caotica",
    label: "Gestão caótica via WhatsApp",
    icon: MessagesSquare,
  },
  {
    value: "conversao_vendas",
    label: "Dificuldade em converter jogadores em compradores",
    icon: ShoppingCart,
  },
];

const AUTO_RETURN_SECONDS = 4;

const Feira = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(AUTO_RETURN_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      nome: "",
      empresa: "",
      whatsapp: "",
      mesas_por_mes: "",
      maior_dor: "",
    },
  });

  // Auto-return countdown
  useEffect(() => {
    if (!submitted) return;
    setCountdown(AUTO_RETURN_SECONDS);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setSubmitted(false);
          form.reset();
          return AUTO_RETURN_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [submitted, form]);

  const onSubmit = async (data: LeadFormData) => {
    setLoading(true);
    try {
      const { error } = await supabase.from("leads" as any).insert([
        {
          nome: data.nome,
          email: `${data.whatsapp.replace(/\D/g, "")}@feira.local`,
          whatsapp: data.whatsapp,
          cidade: data.empresa,
          perfil: "lojista",
          mesas_por_mes: data.mesas_por_mes,
          maior_dor: data.maior_dor,
          origem: "abrin_2026",
        },
      ]);
      if (error) throw error;
      setSubmitted(true);
    } catch (err: any) {
      toast({
        title: "Erro ao salvar",
        description: err.message || "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ─── SUCCESS SCREEN ─────────────────────────────────
  if (submitted) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center px-8 z-50">
        <div className="max-w-lg text-center space-y-8 animate-fade-up">
          <img src={logo} alt="Logo" className="h-24 mx-auto drop-shadow-lg" />

          <div className="inline-flex items-center justify-center h-24 w-24 rounded-full border-2 border-accent/30 mx-auto">
            <CheckCircle className="h-12 w-12 text-accent" />
          </div>

          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground leading-tight">
            Sua cadeira está{" "}
            <span className="text-gradient-warm">reservada.</span>
          </h1>

          <p className="text-lg text-muted-foreground font-sans">
            Falaremos em breve.
          </p>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground font-sans">
            <div className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-foreground font-bold">
              {countdown}
            </div>
            <span>Próximo cadastro</span>
          </div>

          <Button
            variant="ghost"
            onClick={() => {
              if (timerRef.current) clearInterval(timerRef.current);
              setSubmitted(false);
              form.reset();
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            Cadastrar agora →
          </Button>
        </div>
      </div>
    );
  }

  // ─── FULLSCREEN FORM ─────────────────────────────────
  return (
    <div className="fixed inset-0 bg-background overflow-y-auto">
      <div className="min-h-full flex flex-col justify-center px-6 py-8 md:px-12 lg:px-0">
        <div className="max-w-2xl mx-auto w-full space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <img src={logo} alt="Logo" className="h-16 md:h-20 mx-auto drop-shadow-lg" />

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground leading-tight">
              O futuro das suas mesas de jogo{" "}
              <span className="text-gradient-warm">começa aqui.</span>
            </h1>

            <p className="text-base md:text-lg text-muted-foreground font-sans max-w-lg mx-auto">
              Cadastre-se para ter acesso prioritário à nossa plataforma de gestão e monetização.
            </p>
          </div>

          {/* Form Card */}
          <div className="glass rounded-2xl p-6 md:p-10 border border-border">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
                {/* Nome */}
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-sans font-medium text-muted-foreground uppercase tracking-wider">
                        Nome Completo
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Seu nome"
                          className="h-16 text-lg rounded-xl border-border bg-card/50 placeholder:text-muted-foreground/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Empresa */}
                <FormField
                  control={form.control}
                  name="empresa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-sans font-medium text-muted-foreground uppercase tracking-wider">
                        Empresa / Nome da Loja
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Taverna do Dragão"
                          className="h-16 text-lg rounded-xl border-border bg-card/50 placeholder:text-muted-foreground/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* WhatsApp */}
                <FormField
                  control={form.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-sans font-medium text-muted-foreground uppercase tracking-wider">
                        WhatsApp
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="(11) 99999-9999"
                          className="h-16 text-lg rounded-xl border-border bg-card/50 placeholder:text-muted-foreground/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Volume — Botões */}
                <FormField
                  control={form.control}
                  name="mesas_por_mes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-sans font-medium text-muted-foreground uppercase tracking-wider">
                        Mesas / eventos por mês no seu espaço
                      </FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                        {volumeOptions.map((opt) => {
                          const selected = field.value === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => field.onChange(opt.value)}
                              className={`h-16 rounded-xl text-lg font-sans font-semibold transition-all border-2 active:scale-95 ${
                                selected
                                  ? "border-primary bg-primary/10 text-primary glow-orange"
                                  : "border-border bg-card/30 text-muted-foreground hover:border-primary/40"
                              }`}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Dor — Card Radio */}
                <FormField
                  control={form.control}
                  name="maior_dor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-sans font-medium text-muted-foreground uppercase tracking-wider">
                        Qual é o seu maior gargalo hoje?
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="space-y-3 mt-2"
                        >
                          {dorOptions.map((opt) => {
                            const Icon = opt.icon;
                            const selected = field.value === opt.value;
                            return (
                              <Label
                                key={opt.value}
                                htmlFor={`dor-${opt.value}`}
                                className={`flex items-center gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all active:scale-[0.98] ${
                                  selected
                                    ? "border-primary bg-primary/5 glow-orange"
                                    : "border-border bg-card/30 hover:border-primary/40"
                                }`}
                              >
                                <RadioGroupItem value={opt.value} id={`dor-${opt.value}`} className="sr-only" />
                                <div
                                  className={`flex-shrink-0 h-12 w-12 rounded-xl flex items-center justify-center ${
                                    selected ? "bg-primary/20" : "bg-muted"
                                  }`}
                                >
                                  <Icon className={`h-6 w-6 ${selected ? "text-primary" : "text-muted-foreground"}`} />
                                </div>
                                <span className={`text-base md:text-lg font-sans ${selected ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
                                  {opt.label}
                                </span>
                                {/* Visual check */}
                                <div className={`ml-auto flex-shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                  selected ? "border-primary bg-primary" : "border-border"
                                }`}>
                                  {selected && <CheckCircle className="h-4 w-4 text-primary-foreground" />}
                                </div>
                              </Label>
                            );
                          })}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="w-full h-18 bg-primary text-primary-foreground hover:bg-primary/90 glow-orange rounded-xl text-xl font-sans font-bold gap-3 transition-all active:scale-[0.97] py-6"
                >
                  {loading ? (
                    "Salvando..."
                  ) : (
                    <>
                      Garantir Acesso Antecipado
                      <ArrowRight className="h-6 w-6" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center font-sans opacity-60">
                  Seus dados estão seguros. Usaremos apenas para contato sobre o Hub.
                </p>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feira;
