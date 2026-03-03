import { QRCodeSVG } from "qrcode.react";
import AnimatedSection from "./AnimatedSection";

const QRCodeSection = () => {
  const feiraUrl = typeof window !== "undefined"
    ? `${window.location.origin}/feira`
    : "https://rpg-sync-point.lovable.app/feira";

  return (
    <section className="section-padding">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection>
          <div className="glass rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-12 border border-border">
            {/* QR Code */}
            <div className="flex-shrink-0">
              <div className="bg-foreground rounded-2xl p-4">
                <QRCodeSVG
                  value={feiraUrl}
                  size={180}
                  bgColor="hsl(35, 20%, 90%)"
                  fgColor="hsl(220, 25%, 6%)"
                  level="H"
                  includeMargin={false}
                />
              </div>
            </div>

            {/* Text */}
            <div className="text-center md:text-left space-y-3">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
                Escaneie e{" "}
                <span className="text-gradient-warm">entre na mesa.</span>
              </h2>
              <p className="text-muted-foreground font-sans text-base md:text-lg leading-relaxed">
                Aponte a câmera do seu celular para o QR Code e cadastre-se
                agora mesmo para acesso antecipado ao Hub.
              </p>
              <p className="text-xs text-muted-foreground font-sans opacity-60 font-mono">
                {feiraUrl}
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default QRCodeSection;
