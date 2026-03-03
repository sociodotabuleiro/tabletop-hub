import { MessageSquareOff, ShieldCheck, TrendingUp } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const cards = [
  {
    icon: MessageSquareOff,
    title: "O Fim do 'Copia e Cola'",
    desc: "Chega de listas infinitas no WhatsApp que se perdem em 10 minutos.",
  },
  {
    icon: ShieldCheck,
    title: "A Cura para o No-Show",
    desc: "Jogadores confirmam com pagamento. O compromisso volta a ter valor.",
  },
  {
    icon: TrendingUp,
    title: "Seu Acervo Trabalhando por Você",
    desc: "Lojistas e Hosts premium faturam organizando mesas e vendendo expansões no contexto da partida.",
  },
];

const PainSection = () => (
  <section id="dor" className="section-padding">
    <div className="max-w-6xl mx-auto">
      <AnimatedSection className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">
          Você lembra quando jogar era apenas...{" "}
          <span className="text-gradient-warm">jogar?</span>
        </h2>
      </AnimatedSection>

      <div className="grid md:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <AnimatedSection key={i} delay={i * 0.15}>
            <div className="glass glass-hover rounded-2xl p-8 h-full transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <card.icon className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-serif font-bold mb-3">{card.title}</h3>
              <p className="text-muted-foreground font-sans leading-relaxed">{card.desc}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default PainSection;
