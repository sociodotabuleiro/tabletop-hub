import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dices } from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
    {/* Background */}
    <div className="absolute inset-0">
      <img src={heroBg} alt="Mesa de RPG iluminada por velas" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
    </div>

    {/* Content */}
    <div className="relative z-10 max-w-4xl mx-auto text-center px-4 py-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <p className="text-primary font-sans text-sm font-semibold tracking-[0.2em] uppercase mb-6">
          RPG & Board Games
        </p>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight mb-6"
      >
        Não é sobre o jogo.{" "}
        <span className="text-gradient-warm">É sobre a cadeira que não ficou vazia.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-sans leading-relaxed"
      >
        A organização de mesas de RPG e Board Games evoluiu. Acabe com os cancelamentos de última hora, monetize seu tempo como Mestre/Host e volte a focar no que importa: a aventura.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <Link to="/feira">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-orange text-base px-8 py-6 rounded-full font-sans font-semibold gap-2">
            <Dices size={20} />
            Reúna sua Party (Testar Grátis)
          </Button>
        </Link>
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
