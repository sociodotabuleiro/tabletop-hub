import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import heroBg from "@/assets/hero-therapeutic.jpg";

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
    {/* Background */}
    <div className="absolute inset-0">
      <img src={heroBg} alt="Sessão de RPG terapêutico iluminada por velas" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/60 to-background" />
    </div>

    {/* Content — Config-style bold editorial */}
    <div className="relative z-10 max-w-5xl mx-auto px-4 py-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mb-8"
      >
        <span className="inline-block px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-primary text-xs font-sans font-semibold tracking-[0.2em] uppercase">
          RPG Terapêutico · Profissionais
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold leading-[0.95] mb-8"
      >
        Você não vende{" "}
        <span className="text-gradient-warm italic">sessões.</span>
        <br />
        <span className="text-muted-foreground text-4xl md:text-5xl lg:text-6xl">
          Você vende a chance de alguém se encontrar.
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="text-lg md:text-xl text-muted-foreground max-w-2xl font-sans leading-relaxed mb-10"
      >
        Psicólogos, educadores e terapeutas que usam RPG como ferramenta clínica merecem uma plataforma à altura do impacto que geram. Organize sessões, gerencie pacientes-jogadores e monetize sua prática — tudo em um só lugar.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <a href="#cadastro">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-orange text-base px-8 py-6 rounded-full font-sans font-semibold gap-2">
            <Heart size={20} />
            Quero Profissionalizar Minha Prática
          </Button>
        </a>
        <a href="#como-funciona">
          <Button size="lg" variant="outline" className="border-muted-foreground/30 text-foreground hover:bg-secondary rounded-full px-8 py-6 text-base font-sans font-semibold">
            Como Funciona
          </Button>
        </a>
      </motion.div>
    </div>

    {/* Scroll indicator */}
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
