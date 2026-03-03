import { Quote } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const testimonials = [
  {
    quote: "Minhas campanhas de D&D não morrem mais na sessão zero. Quem paga a taxa da mesa, aparece pra jogar.",
    name: "Henrique L.",
    role: "Host Profissional",
  },
  {
    quote: "Comprei a expansão de Zombicide no meio da partida. Foi impossível resistir.",
    name: "Bruno",
    role: "Jogador",
  },
  {
    quote: "Passei de 2 mesas por mês para 12. O 6degrees virou minha principal fonte de renda como Mestre.",
    name: "Camila R.",
    role: "Mestre de RPG",
  },
];

const Testimonials = () => (
  <section id="comunidade" className="section-padding">
    <div className="max-w-6xl mx-auto">
      <AnimatedSection className="text-center mb-16">
        <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-4 font-sans">
          Prova Social
        </p>
        <h2 className="text-3xl md:text-5xl font-serif font-bold">
          A voz da <span className="text-gradient-warm">comunidade</span>
        </h2>
      </AnimatedSection>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <AnimatedSection key={i} delay={i * 0.15}>
            <div className="glass glass-hover rounded-2xl p-8 h-full flex flex-col transition-all duration-300">
              <Quote className="text-primary/40 mb-4" size={32} />
              <p className="text-foreground font-sans leading-relaxed flex-1 italic mb-6">
                "{t.quote}"
              </p>
              <div className="border-t border-border pt-4">
                <p className="font-serif font-bold">{t.name}</p>
                <p className="text-sm text-muted-foreground font-sans">{t.role}</p>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
