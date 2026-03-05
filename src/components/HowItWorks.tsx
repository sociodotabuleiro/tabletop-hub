import { CalendarCheck, Shield, BarChart3, Sparkles } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const features = [
  {
    icon: CalendarCheck,
    label: "Agenda Inteligente",
    title: "Crie sessões com checkout integrado.",
    desc: "Defina datas, vagas, duração e preço. O paciente-jogador reserva e paga em segundos. Fim dos 'vou confirmar amanhã'.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Shield,
    label: "Prontuário Lúdico",
    title: "Fichas de personagem que são fichas de evolução.",
    desc: "Registre o progresso terapêutico dentro da narrativa do RPG. Cada sessão vira um capítulo documentado.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: BarChart3,
    label: "Métricas de Impacto",
    title: "Prove o valor do seu trabalho com dados.",
    desc: "Dashboards com frequência, engajamento narrativo e evolução dos pacientes. Ideal para relatórios clínicos e institucionais.",
    color: "bg-crm-blue/10 text-crm-blue",
  },
  {
    icon: Sparkles,
    label: "IA Assistente",
    title: "Narrativas geradas. Relatórios automatizados.",
    desc: "Nossa IA sugere ganchos narrativos baseados nos objetivos terapêuticos e gera resumos de sessão para o prontuário.",
    color: "bg-crm-purple/10 text-crm-purple",
  },
];

const HowItWorks = () => (
  <section id="como-funciona" className="section-padding">
    <div className="max-w-6xl mx-auto">
      <AnimatedSection className="text-center mb-20">
        <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-4 font-sans">
          Como Funciona
        </p>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight max-w-3xl mx-auto">
          Peggy Olson montaria{" "}
          <span className="text-gradient-warm">a campanha perfeita.</span>
          <br />
          Nós montamos a plataforma.
        </h2>
      </AnimatedSection>

      {/* Config-style grid: 2x2 with large cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {features.map((f, i) => (
          <AnimatedSection key={i} delay={i * 0.1}>
            <div className="glass glass-hover rounded-2xl p-8 md:p-10 h-full transition-all duration-300 group flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl ${f.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <f.icon size={20} />
                </div>
                <span className="text-xs font-sans font-semibold tracking-[0.15em] uppercase text-muted-foreground">
                  {f.label}
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-serif font-bold mb-3 leading-snug">{f.title}</h3>
              <p className="text-muted-foreground font-sans leading-relaxed flex-1">{f.desc}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
