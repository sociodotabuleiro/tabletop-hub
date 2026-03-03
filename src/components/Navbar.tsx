import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4 md:px-8">
        <a href="#" className="text-2xl font-serif font-bold text-gradient-warm">
          6degrees
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a href="#dor" className="text-sm text-muted-foreground hover:text-foreground transition-colors">A Dor</a>
          <a href="#como-funciona" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Como Funciona</a>
          <a href="#comunidade" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Comunidade</a>
          <Link to="/feira">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-orange">
              Testar Grátis
            </Button>
          </Link>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden glass border-t border-border px-4 py-4 flex flex-col gap-4">
          <a href="#dor" onClick={() => setOpen(false)} className="text-sm text-muted-foreground">A Dor</a>
          <a href="#como-funciona" onClick={() => setOpen(false)} className="text-sm text-muted-foreground">Como Funciona</a>
          <a href="#comunidade" onClick={() => setOpen(false)} className="text-sm text-muted-foreground">Comunidade</a>
          <Link to="/feira" onClick={() => setOpen(false)}>
            <Button size="sm" className="bg-primary text-primary-foreground w-full">Testar Grátis</Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
