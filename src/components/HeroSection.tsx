import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dices } from "lucide-react";
import heroBg from "@/assets/hero-therapeutic.jpg";
import logo from "@/assets/logo-socio.png";

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
    <div className="absolute inset-0">
      <img src={heroBg} alt="Sessão de RPG à luz de velas" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/60 to-background" />
    </div>

    <div className="relative z-10 max-w-5xl mx-auto px-4 py-32 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="mb-8 flex justify-center"
      >
        <img src={logo} alt="Sócio do Tabuleiro" className="h-28 md:h-36 w-auto drop-shadow-2xl" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mb-6"
      >
        <span className="inline-block px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-primary text-xs font-sans font-semibold tracking-[0.2em] uppercase">
          Mestres · Jogadores · Lojistas
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold leading-[0.95] mb-8"
      >
        A mesa está{" "}
        <span className="text-gradient-warm italic">pronta.</span>
        <br />
        <span className="text-muted-foreground text-2xl md:text-3xl lg:text-4xl">
          Falta só a ferramenta certa pra ela nunca ficar vazia.
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-sans leading-relaxed mb-10"
      >
        Sistema de mestragem para RPG e Board Games. Plataforma clínica para RPG terapêutico. Reserva de mesas para lojas. Três serviços, uma missão: profissionalizar quem vive de jogos de mesa.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <a href="#cadastro">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-purple text-base px-8 py-6 rounded-full font-sans font-semibold gap-2">
            <Dices size={20} />
            Quero Profissionalizar Minha Mesa
          </Button>
        </a>
        <a href="#servicos">
          <Button size="lg" variant="outline" className="border-secondary/50 text-secondary hover:bg-secondary/10 rounded-full px-8 py-6 text-base font-sans font-semibold">
            Ver Serviços
          </Button>
        </a>
      </motion.div>
    </div>

    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2"
      animate={{ y: [0, 10, 0] }}
      transition={{ repeat: Infinity, duration: 2 }}
    >
      <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1.5">
        <div className="w-1.5 h-2.5 bg-primary rounded-full" />
      </div>
    </motion.div>
  </section>
);

export default HeroSection;
