import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo-socio.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:px-8">
        <a href="#" className="flex items-center gap-2">
          <img src={logo} alt="Sócio do Tabuleiro" className="h-10 w-auto" />
          <span className="text-lg font-serif font-bold text-gradient-warm hidden sm:inline">
            Sócio do Tabuleiro
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a href="#dor" className="text-sm text-muted-foreground hover:text-foreground transition-colors">O Problema</a>
          <a href="#servicos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Serviços</a>
          <a href="#como-funciona" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Como Funciona</a>
          <a href="#cadastro">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-purple">
              Quero Acesso
            </Button>
          </a>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden glass border-t border-border px-4 py-4 flex flex-col gap-4">
          <a href="#dor" onClick={() => setOpen(false)} className="text-sm text-muted-foreground">O Problema</a>
          <a href="#servicos" onClick={() => setOpen(false)} className="text-sm text-muted-foreground">Serviços</a>
          <a href="#como-funciona" onClick={() => setOpen(false)} className="text-sm text-muted-foreground">Como Funciona</a>
          <a href="#cadastro" onClick={() => setOpen(false)}>
            <Button size="sm" className="bg-primary text-primary-foreground w-full">Quero Acesso</Button>
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
