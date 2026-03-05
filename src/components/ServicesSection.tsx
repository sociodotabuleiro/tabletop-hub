import { Swords, Brain, Store } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const services = [
  {
    icon: Swords,
    tag: "Para Mestres & Hosts",
    title: "Sistema de Mestragem",
    desc: "Crie mesas de RPG e Board Games com checkout integrado. Jogadores confirmam com pagamento, acabam os cancelamentos de última hora. Gerencie campanhas, controle presença e construa reputação.",
    features: ["Agenda com Pix integrado", "Sistema de reputação", "Gestão de campanhas", "Integração BoardGameGeek"],
    colorBar: "bg-primary",
    colorTag: "text-primary",
    colorBg: "bg-primary/10",
  },
  {
    icon: Brain,
    tag: "Para Terapeutas & Educadores",
    title: "RPG Terapêutico",
    desc: "Plataforma clínica para profissionais que usam RPG como ferramenta terapêutica. Organize sessões, registre evolução dos pacientes-jogadores e gere relatórios de impacto com dados reais.",
    features: ["Prontuário lúdico", "Métricas de evolução", "Relatórios clínicos", "IA assistente narrativa"],
    colorBar: "bg-accent",
    colorTag: "text-accent",
    colorBg: "bg-accent/10",
  },
  {
    icon: Store,
    tag: "Para Lojas & Espaços",
    title: "Reserva de Mesas",
    desc: "Lojistas e espaços de jogos oferecem mesas para reserva online. Monetize seu espaço físico, atraia novos clientes e transforme partidas em vendas de jogos e expansões.",
    features: ["Reserva online 24h", "Vitrine de jogos integrada", "Dashboard de ocupação", "Vendas no contexto da mesa"],
    colorBar: "bg-crm-blue",
    colorTag: "text-crm-blue",
    colorBg: "bg-crm-blue/10",
  },
];

const ServicesSection = () => (
  <section id="servicos" className="section-padding">
    <div className="max-w-6xl mx-auto">
      <AnimatedSection className="text-center mb-16">
        <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-4 font-sans">
          Três Serviços, Uma Plataforma
        </p>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight max-w-3xl mx-auto">
          Cada mesa tem uma{" "}
          <span className="text-gradient-warm">história diferente.</span>
          <br />
          Todas merecem estrutura profissional.
        </h2>
      </AnimatedSection>

      <div className="grid md:grid-cols-3 gap-6">
        {services.map((s, i) => (
          <AnimatedSection key={i} delay={i * 0.15}>
            <div className="glass glass-hover rounded-2xl overflow-hidden h-full flex flex-col transition-all duration-300 group">
              <div className={`h-2 w-full ${s.colorBar}`} />
              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-10 h-10 rounded-xl ${s.colorBg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <s.icon size={20} className={s.colorTag} />
                  </div>
                  <span className={`text-xs font-sans font-semibold tracking-[0.15em] uppercase ${s.colorTag}`}>
                    {s.tag}
                  </span>
                </div>

                <h3 className="text-2xl font-serif font-bold mb-3">{s.title}</h3>
                <p className="text-muted-foreground font-sans leading-relaxed text-sm mb-6 flex-1">{s.desc}</p>

                <ul className="space-y-2 border-t border-border pt-4">
                  {s.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm font-sans text-foreground/80">
                      <div className={`w-1.5 h-1.5 rounded-full ${s.colorBar}`} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default ServicesSection;
