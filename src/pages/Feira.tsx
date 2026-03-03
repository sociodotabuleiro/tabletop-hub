import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, Dice5, Users, Store, BookOpen } from "lucide-react";
import logo from "@/assets/logo.png";

const leadSchema = z.object({
  nome: z.string().trim().min(2, "Seu nome, aventureiro.").max(100),
  email: z.string().trim().email("Esse pergaminho precisa de um e-mail válido.").max(255),
  whatsapp: z.string().trim().min(10, "Número de WhatsApp com DDD.").max(20),
  cidade: z.string().trim().min(2, "De que cidade você joga?").max(100),
  perfil: z.enum(["jogador", "host_mestre", "lojista", "editora", "outro"], {
    required_error: "Escolha seu papel na mesa.",
  }),
  jogos_favoritos: z.string().max(500).optional(),
  mesas_por_mes: z.string().max(50).optional(),
  ja_cobra_por_mesa: z.boolean().default(false),
  como_organiza: z.string().max(500).optional(),
  maior_dor: z.string().max(1000).optional(),
  interesse_beta: z.boolean().default(true),
});

type LeadForm = z.infer<typeof leadSchema>;

const perfilOptions = [
  { value: "jogador", label: "Jogador", icon: Dice5, desc: "Busco mesas para jogar" },
  { value: "host_mestre", label: "Host / Mestre", icon: Users, desc: "Organizo e mestro partidas" },
  { value: "lojista", label: "Lojista", icon: Store, desc: "Tenho uma loja ou espaço" },
  { value: "editora", label: "Editora / Publisher", icon: BookOpen, desc: "Publico jogos" },
  { value: "outro", label: "Outro", icon: CheckCircle, desc: "Curioso, imprensa, etc." },
];

const mesasOptions = ["1-2", "3-5", "6-10", "10+"];

const Feira = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<LeadForm>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      nome: "",
      email: "",
      whatsapp: "",
      cidade: "",
      jogos_favoritos: "",
      mesas_por_mes: "",
      ja_cobra_por_mesa: false,
      como_organiza: "",
      maior_dor: "",
      interesse_beta: true,
    },
  });

  const onSubmit = async (data: LeadForm) => {
    setLoading(true);
    try {
      const { error } = await supabase.from("leads" as any).insert([
        {
          nome: data.nome,
          email: data.email,
          whatsapp: data.whatsapp,
          cidade: data.cidade,
          perfil: data.perfil,
          jogos_favoritos: data.jogos_favoritos || null,
          mesas_por_mes: data.mesas_por_mes || null,
          ja_cobra_por_mesa: data.ja_cobra_por_mesa,
          como_organiza: data.como_organiza || null,
          maior_dor: data.maior_dor || null,
          interesse_beta: data.interesse_beta,
          origem: "abrinc_2026",
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

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-6">
          <img src={logo} alt="Sócio do Tabuleiro" className="h-24 mx-auto" />
          <CheckCircle className="h-16 w-16 text-accent mx-auto" />
          <h1 className="text-3xl font-serif font-bold text-foreground">
            A mesa está reservada.
          </h1>
          <p className="text-muted-foreground font-sans">
            Você está na lista de acesso antecipado. Quando a taverna abrir as portas, 
            você será o primeiro a saber. Prepare os dados.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSubmitted(false);
              form.reset();
            }}
            className="border-accent text-accent hover:bg-accent/10"
          >
            Cadastrar outro aventureiro
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="text-center pt-10 pb-6 px-4">
        <img src={logo} alt="Sócio do Tabuleiro" className="h-20 mx-auto mb-4" />
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground leading-tight">
          A cadeira é sua.{" "}
          <span className="text-gradient-warm">Só precisa sentar.</span>
        </h1>
        <p className="text-muted-foreground font-sans mt-3 max-w-lg mx-auto">
          Exclusivo ABRINC 2026 — Cadastre-se para acesso antecipado ao hub que 
          vai transformar como você joga, organiza e monetiza mesas de RPG e Board Games.
        </p>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 pb-16">
        <div className="glass rounded-2xl p-6 md:p-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Dados básicos */}
              <div className="space-y-4">
                <h2 className="text-lg font-serif font-semibold text-foreground border-b border-border pb-2">
                  🎲 Quem é você na mesa?
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Seu nome ou nickname" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cidade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                          <Input placeholder="São Paulo, SP" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="voce@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="whatsapp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>WhatsApp</FormLabel>
                        <FormControl>
                          <Input placeholder="(11) 99999-9999" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Perfil */}
              <div className="space-y-4">
                <h2 className="text-lg font-serif font-semibold text-foreground border-b border-border pb-2">
                  🏰 Seu papel na aventura
                </h2>

                <FormField
                  control={form.control}
                  name="perfil"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Como você se define?</FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                        {perfilOptions.map((opt) => {
                          const Icon = opt.icon;
                          const selected = field.value === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => field.onChange(opt.value)}
                              className={`glass rounded-xl p-4 text-left transition-all border ${
                                selected
                                  ? "border-primary bg-primary/10 glow-orange"
                                  : "border-border hover:border-primary/40"
                              }`}
                            >
                              <Icon className={`h-5 w-5 mb-1 ${selected ? "text-primary" : "text-muted-foreground"}`} />
                              <p className="text-sm font-semibold text-foreground">{opt.label}</p>
                              <p className="text-xs text-muted-foreground">{opt.desc}</p>
                            </button>
                          );
                        })}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Qualificação */}
              <div className="space-y-4">
                <h2 className="text-lg font-serif font-semibold text-foreground border-b border-border pb-2">
                  ⚔️ Detalhes da campanha
                </h2>

                <FormField
                  control={form.control}
                  name="jogos_favoritos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jogos favoritos</FormLabel>
                      <FormControl>
                        <Input placeholder="D&D, Catan, Zombicide, War..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mesas_por_mes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantas mesas por mês?</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mesasOptions.map((v) => (
                            <SelectItem key={v} value={v}>{v} mesas</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="como_organiza"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Como organiza hoje?</FormLabel>
                      <FormControl>
                        <Input placeholder="WhatsApp, Discord, planilha, na raça..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ja_cobra_por_mesa"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-3">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="!mt-0 cursor-pointer">
                        Já cobro pelas mesas que organizo
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maior_dor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Qual sua maior dor ao organizar/participar de mesas?</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Cancelamentos, falta de jogadores, dificuldade de cobrar..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Beta */}
              <FormField
                control={form.control}
                name="interesse_beta"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3 glass rounded-xl p-4 border border-accent/30">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0 cursor-pointer text-accent font-semibold">
                      🗡️ Quero acesso antecipado ao Beta
                    </FormLabel>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-orange rounded-full py-6 text-base font-sans font-semibold"
              >
                {loading ? "Salvando..." : "Reservar Minha Cadeira 🎲"}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Seus dados estão seguros. Usaremos apenas para contato sobre o 6degrees.
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Feira;
