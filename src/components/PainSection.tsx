import { Brain, CalendarOff, DollarSign } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const cards = [
  {
    icon: CalendarOff,
    title: "Cancelamentos que Custam Caro",
    desc: "Cada mesa vazia é receita perdida — e, no caso terapêutico, um paciente que interrompeu o processo. Sem compromisso financeiro, o 'depois eu remarco' vira rotina.",
  },
  {
    icon: Brain,
    title: "Método Poderoso, Logística Cruel",
    desc: "Você domina a arte de narrar, ensinar ou curar através do jogo. Mas gerenciar agendas, cobranças e fichas em planilhas soltas consome o tempo que deveria ser da mesa.",
  },
  {
    icon: DollarSign,
    title: "Você Cobra Menos do que Vale",
    desc: "Mestres, terapeutas e lojistas que vivem de jogos de mesa são profissionais raros. Sem estrutura, é difícil justificar o preço de um serviço que transforma vidas.",
  },
];

const PainSection = () => (
  <section id="dor" className="section-padding">
    <div className="max-w-6xl mx-auto">
      <AnimatedSection className="mb-16">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-2/5">
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-8">
              <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase font-sans mb-2">
                O Problema
              </p>
              <h2 className="text-3xl md:text-4xl font-serif font-bold leading-tight">
                Você não tem um problema de{" "}
                <span className="text-gradient-warm italic">demanda.</span>{" "}
                Tem um problema de{" "}
                <span className="text-gradient-warm italic">estrutura.</span>
              </h2>
            </div>
          </div>
          <div className="w-full md:w-3/5 grid gap-6">
            {cards.map((card, i) => (
              <div key={i} className="glass glass-hover rounded-2xl p-6 flex gap-5 items-start transition-all duration-300 group">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <card.icon className="text-primary" size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold mb-1.5">{card.title}</h3>
                  <p className="text-muted-foreground font-sans leading-relaxed text-sm">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </div>
  </section>
);

export default PainSection;
