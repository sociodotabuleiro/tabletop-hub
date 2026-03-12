import { Button } from "@/components/ui/button";
import { Dices, ArrowDown } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import logo from "@/assets/logo-socio.png";

const FinalCTA = () => (
  <section className="section-padding">
    <div className="max-w-4xl mx-auto text-center">
      <AnimatedSection>
        <img src={logo} alt="Sócio do Tabuleiro" className="h-20 w-auto mx-auto mb-8 opacity-80" />
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6">
          Sexta-feira à noite.{" "}
          <span className="text-gradient-warm">A mesa está pronta.</span>
          <br />
          Você vem?
        </h2>
        <p className="text-lg text-muted-foreground font-sans mb-10 max-w-xl mx-auto">
          Seja mestre, terapeuta ou lojista — cadastre-se agora e seja um dos primeiros a profissionalizar sua mesa.
        </p>
        <a href="#cadastro">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-purple rounded-full px-10 py-6 text-base font-sans font-semibold gap-2">
            <Dices size={20} />
            Garantir Meu Acesso
            <ArrowDown size={16} className="ml-1 animate-bounce" />
          </Button>
        </a>
      </AnimatedSection>
    </div>
  </section>
);

export default FinalCTA;
