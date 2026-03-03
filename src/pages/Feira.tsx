import { useState } from "react";
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
import { CheckCircle, ArrowRight } from "lucide-react";
import logo from "@/assets/logo.png";

const leadSchema = z.object({
  nome: z.string().trim().min(2, "Precisamos do seu nome.").max(100),
  empresa: z.string().trim().min(2, "Nome da loja ou comunidade.").max(200),
  whatsapp: z.string().trim().min(10, "WhatsApp com DDD, por favor.").max(20),
  mesas_por_mes: z.string({ required_error: "Selecione o volume de mesas." }),
  maior_dor: z.string({ required_error: "Selecione seu maior gargalo." }),
});

type LeadFormData = z.infer<typeof leadSchema>;

const volumeOptions = [
  { value: "1-5", label: "1 – 5 mesas" },
  { value: "6-15", label: "6 – 15 mesas" },
  { value: "16-30", label: "16 – 30 mesas" },
  { value: "30+", label: "30+ mesas" },
];

const dorOptions = [
  { value: "desistencias", label: "Desistências de última hora" },
  { value: "organizacao_caotica", label: "Organização caótica no WhatsApp" },
  { value: "dificuldade_vendas", label: "Dificuldade em vender expansões nas mesas" },
];

const Feira = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

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

  // ─── SUCCESS SCREEN ─────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-lg text-center space-y-8 animate-fade-up">
          <img src={logo} alt="Logo" className="h-28 mx-auto drop-shadow-lg" />

          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full border-2 border-accent/40 mx-auto">
            <CheckCircle className="h-10 w-10 text-accent" />
          </div>

          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground leading-tight">
            Sua cadeira está{" "}
            <span className="text-gradient-warm">reservada.</span>
          </h1>

          <p className="text-lg text-muted-foreground font-sans max-w-md mx-auto">
            Falaremos em breve. Enquanto isso, prepare os dados — a próxima partida já está sendo organizada.
          </p>

          <Button
            size="lg"
            onClick={() => {
              setSubmitted(false);
              form.reset();
            }}
            className="bg-primary text-primary-foreground hover:bg-primary/90 glow-orange rounded-full px-10 py-6 text-base font-sans font-semibold"
          >
            Cadastrar Próximo Parceiro
          </Button>
        </div>
      </div>
    );
  }

  // ─── FORM SCREEN ─────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center px-6 py-10">
      <div className="max-w-xl mx-auto w-full space-y-8">
        {/* Logo + Header */}
        <div className="text-center space-y-4">
          <img src={logo} alt="Logo" className="h-20 mx-auto drop-shadow-lg" />

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground leading-tight">
            O futuro da sua mesa{" "}
            <span className="text-gradient-warm">começa aqui.</span>
          </h1>

          <p className="text-base md:text-lg text-muted-foreground font-sans max-w-md mx-auto">
            Junte-se ao grupo exclusivo de parceiros do nosso Hub Híbrido.
          </p>
        </div>

        {/* Glass Form Card */}
        <div className="glass rounded-2xl p-6 md:p-10 border border-border">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Nome Completo */}
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-sans font-medium text-foreground">
                      Nome Completo
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Seu nome"
                        className="h-14 text-base rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Nome da Loja */}
              <FormField
                control={form.control}
                name="empresa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-sans font-medium text-foreground">
                      Nome da Loja / Comunidade
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Taverna do Dragão, Guilda SP..."
                        className="h-14 text-base rounded-xl"
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
                    <FormLabel className="text-sm font-sans font-medium text-foreground">
                      WhatsApp
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="(11) 99999-9999"
                        className="h-14 text-base rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Volume de Jogo */}
              <FormField
                control={form.control}
                name="mesas_por_mes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-sans font-medium text-foreground">
                      Quantas mesas presenciais rodam no seu espaço por mês?
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-14 text-base rounded-xl">
                          <SelectValue placeholder="Selecione o volume" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {volumeOptions.map((v) => (
                          <SelectItem key={v.value} value={v.value} className="text-base py-3">
                            {v.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* A Grande Dor — Radio Buttons */}
              <FormField
                control={form.control}
                name="maior_dor"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-sans font-medium text-foreground">
                      Qual seu maior gargalo hoje?
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="space-y-3"
                      >
                        {dorOptions.map((opt) => (
                          <Label
                            key={opt.value}
                            htmlFor={opt.value}
                            className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                              field.value === opt.value
                                ? "border-primary bg-primary/5 glow-orange"
                                : "border-border hover:border-primary/40 bg-card/50"
                            }`}
                          >
                            <RadioGroupItem value={opt.value} id={opt.value} />
                            <span className="text-base font-sans text-foreground">{opt.label}</span>
                          </Label>
                        ))}
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
                className="w-full h-16 bg-primary text-primary-foreground hover:bg-primary/90 glow-orange rounded-xl text-lg font-sans font-bold gap-3 transition-all active:scale-[0.98]"
              >
                {loading ? (
                  "Salvando..."
                ) : (
                  <>
                    Garantir Acesso Antecipado
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center font-sans">
                Seus dados estão seguros. Usaremos apenas para contato sobre o Hub.
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Feira;
