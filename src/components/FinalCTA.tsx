import { Button } from "@/components/ui/button";
import { Heart, ArrowDown } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const FinalCTA = () => (
  <section className="section-padding">
    <div className="max-w-4xl mx-auto text-center">
      <AnimatedSection>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6">
          A próxima sessão pode mudar{" "}
          <span className="text-gradient-warm">a vida de alguém.</span>
          <br />
          <span className="text-muted-foreground text-2xl md:text-3xl font-sans font-normal mt-4 block">
            Mas primeiro, precisa mudar a sua estrutura.
          </span>
        </h2>
        <p className="text-lg text-muted-foreground font-sans mb-10 max-w-xl mx-auto">
          Cadastre-se agora e receba acesso antecipado à plataforma que vai profissionalizar o RPG terapêutico no Brasil.
        </p>
        <a href="#cadastro">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-orange rounded-full px-10 py-6 text-base font-sans font-semibold gap-2">
            <Heart size={20} />
            Garantir Meu Acesso
            <ArrowDown size={16} className="ml-1 animate-bounce" />
          </Button>
        </a>
      </AnimatedSection>
    </div>
  </section>
);

export default FinalCTA;
