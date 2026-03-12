import logo from "@/assets/logo-socio.png";

const Footer = () => (
  <footer className="border-t border-border px-4 py-8">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <img src={logo} alt="Sócio do Tabuleiro" className="h-8 w-auto" />
        <p className="text-lg font-serif font-bold text-gradient-warm">Sócio do Tabuleiro</p>
      </div>
      <p className="text-sm text-muted-foreground font-sans text-center md:text-right">
        © 2026 Sócio do Tabuleiro · Profissionalizando mesas de jogo. Todos os direitos reservados.
      </p>
    </div>
  </footer>
);

export default Footer;
