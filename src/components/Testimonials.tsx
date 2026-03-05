import { Quote } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const speakers = [
  {
    quote: "Minhas campanhas de D&D não morrem mais na sessão zero. Quem paga a taxa da mesa, aparece pra jogar. Passei de 2 para 12 mesas por mês.",
    name: "Henrique L.",
    role: "Host Profissional · Mestre de RPG",
    tag: "Mestragem",
    color: "bg-primary",
  },
  {
    quote: "Meus pacientes com TDAH melhoraram a atenção sustentada em 40% após 8 sessões de RPG estruturado. A plataforma me deu os dados para provar isso.",
    name: "Dra. Mariana Alves",
    role: "Psicóloga Clínica · CRP 06/12345",
    tag: "RPG Terapêutico",
    color: "bg-accent",
  },
  {
    quote: "Transformei o espaço ocioso da loja em 15 mesas reserváveis por semana. O faturamento com eventos superou o de vendas de jogos.",
    name: "Carlos Mendes",
    role: "Proprietário · Loja Dado & Carta",
    tag: "Loja & Espaço",
    color: "bg-crm-blue",
  },
];

const Testimonials = () => (
  <section id="comunidade" className="section-padding">
    <div className="max-w-6xl mx-auto">
      <AnimatedSection className="text-center mb-16">
        <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-4 font-sans">
          Quem já está na mesa
        </p>
        <h2 className="text-3xl md:text-5xl font-serif font-bold">
          Três perfis, uma{" "}
          <span className="text-gradient-warm">revolução</span>
        </h2>
      </AnimatedSection>

      <div className="grid md:grid-cols-3 gap-6">
        {speakers.map((s, i) => (
          <AnimatedSection key={i} delay={i * 0.15}>
            <div className="glass glass-hover rounded-2xl overflow-hidden h-full flex flex-col transition-all duration-300">
              <div className={`h-2 w-full ${s.color}`} />
              <div className="p-8 flex flex-col flex-1">
                <span className={`text-xs font-sans font-semibold tracking-[0.15em] uppercase mb-4 inline-block ${
                  i === 0 ? "text-primary" : i === 1 ? "text-accent" : "text-crm-blue"
                }`}>
                  {s.tag}
                </span>
                <Quote className="text-primary/30 mb-3" size={28} />
                <p className="text-foreground font-sans leading-relaxed flex-1 italic text-sm mb-6">
                  "{s.quote}"
                </p>
                <div className="border-t border-border pt-4">
                  <p className="font-serif font-bold text-base">{s.name}</p>
                  <p className="text-xs text-muted-foreground font-sans mt-0.5">{s.role}</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
