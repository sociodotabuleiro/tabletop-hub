import { Button } from "@/components/ui/button";
import { Search, PlusCircle } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const FinalCTA = () => (
  <section className="section-padding">
    <div className="max-w-4xl mx-auto text-center">
      <AnimatedSection>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6">
          Sexta-feira à noite.{" "}
          <span className="text-gradient-warm">A mesa está pronta.</span>
          <br />
          Você vem?
        </h2>
        <p className="text-lg text-muted-foreground font-sans mb-10 max-w-xl mx-auto">
          Junte-se à maior comunidade presencial de Board Games e RPG do Brasil.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-orange rounded-full px-8 py-6 text-base font-sans font-semibold gap-2">
            <Search size={20} />
            Sou Jogador — Buscar Mesas
          </Button>
          <Button size="lg" variant="outline" className="border-accent text-accent hover:bg-accent/10 glow-green rounded-full px-8 py-6 text-base font-sans font-semibold gap-2">
            <PlusCircle size={20} />
            Sou Host — Criar Minha Mesa
          </Button>
        </div>
      </AnimatedSection>
    </div>
  </section>
);

export default FinalCTA;
