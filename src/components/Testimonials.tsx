import { Quote } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const speakers = [
  {
    quote: "Meus pacientes com TDAH melhoraram a atenção sustentada em 40% após 8 sessões de RPG estruturado. A plataforma me deu os dados para provar isso.",
    name: "Dra. Mariana Alves",
    role: "Psicóloga Clínica · CRP 06/12345",
    tag: "Neuropsicologia",
  },
  {
    quote: "Eu conduzia grupos terapêuticos com RPG há 5 anos, mas cobrava menos que uma sessão de terapia convencional. A 6degrees me mostrou que eu estava vendendo aspirina quando tinha a cura.",
    name: "Rafael Moreira",
    role: "Terapeuta Ocupacional · Mestre de RPG",
    tag: "Grupos Terapêuticos",
  },
  {
    quote: "Na escola, o RPG terapêutico reduziu episódios de bullying em 60%. Com a plataforma, consigo documentar cada sessão e apresentar resultados à diretoria.",
    name: "Profa. Camila Rêgo",
    role: "Pedagoga · Especialista em Inclusão",
    tag: "Educação",
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
          Profissionais que transformam{" "}
          <span className="text-gradient-warm">dados em cura</span>
        </h2>
      </AnimatedSection>

      {/* Config-speaker-style cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {speakers.map((s, i) => (
          <AnimatedSection key={i} delay={i * 0.15}>
            <div className="glass glass-hover rounded-2xl overflow-hidden h-full flex flex-col transition-all duration-300">
              {/* Colored header bar — Config style */}
              <div className={`h-2 w-full ${
                i === 0 ? "bg-primary" : i === 1 ? "bg-accent" : "bg-crm-purple"
              }`} />
              <div className="p-8 flex flex-col flex-1">
                <span className="text-xs font-sans font-semibold tracking-[0.15em] uppercase text-primary mb-4 inline-block">
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
