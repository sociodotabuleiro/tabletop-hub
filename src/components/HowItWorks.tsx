import { MousePointerClick, QrCode, Star } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const steps = [
  {
    icon: MousePointerClick,
    step: "01",
    title: "Crie a mesa em 2 cliques.",
    desc: "Integração com o BoardGameGeek. Escolha o jogo, defina data, local e preço. Pronto.",
    align: "left" as const,
  },
  {
    icon: QrCode,
    step: "02",
    title: "Envie o link. Receba o Pix.",
    desc: "Checkout rápido integrado. O jogador paga e confirma a presença em segundos.",
    align: "right" as const,
  },
  {
    icon: Star,
    step: "03",
    title: "Jogue. Avalie. Repita.",
    desc: "Sistema de reputação e badges. Bons jogadores e hosts são reconhecidos pela comunidade.",
    align: "left" as const,
  },
];

const HowItWorks = () => (
  <section id="como-funciona" className="section-padding">
    <div className="max-w-6xl mx-auto">
      <AnimatedSection className="text-center mb-20">
        <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-4 font-sans">
          Como Funciona
        </p>
        <h2 className="text-3xl md:text-5xl font-serif font-bold">
          Magia na mesa.{" "}
          <span className="text-gradient-warm">Tecnologia nos bastidores.</span>
        </h2>
      </AnimatedSection>

      <div className="space-y-20">
        {steps.map((s, i) => (
          <AnimatedSection key={i} delay={0.1}>
            <div className={`flex flex-col ${s.align === "right" ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-10 md:gap-16`}>
              {/* Text side */}
              <div className="flex-1 text-center md:text-left">
                <span className="text-6xl md:text-8xl font-serif font-bold text-primary/10">{s.step}</span>
                <h3 className="text-2xl md:text-3xl font-serif font-bold -mt-4 mb-4">{s.title}</h3>
                <p className="text-muted-foreground font-sans text-lg leading-relaxed max-w-md">{s.desc}</p>
              </div>
              {/* Mockup side */}
              <div className="flex-1 w-full max-w-md">
                <div className="glass rounded-2xl p-6 aspect-[4/3] flex items-center justify-center">
                  <div className="text-center">
                    <s.icon className="text-primary mx-auto mb-4" size={48} strokeWidth={1.5} />
                    <p className="text-muted-foreground text-sm font-sans">Tela do {s.title.replace(".", "")}</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
