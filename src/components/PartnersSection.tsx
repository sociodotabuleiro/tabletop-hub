import AnimatedSection from "./AnimatedSection";
import imatecLogo from "@/assets/partners/imatec.png";
import googleLogo from "@/assets/partners/google-cloud.png";
import mongodbLogo from "@/assets/partners/mongodb.png";
import sebraeLogo from "@/assets/partners/sebrae.png";
import foundersLogo from "@/assets/partners/founders-institute.png";
import awsLogo from "@/assets/partners/aws.png";

const partners = [
  {
    name: "IMATEC",
    logo: imatecLogo,
    desc: "Incubadora de Tecnologia",
  },
  {
    name: "Google for Startups",
    logo: googleLogo,
    desc: "Cloud Program — 1ª turma Google Campus",
  },
  {
    name: "MongoDB for Startups",
    logo: mongodbLogo,
    desc: "Startup Program",
  },
  {
    name: "Sebrae Start",
    logo: sebraeLogo,
    desc: "Programa Primeiras Vendas",
  },
  {
    name: "Founders Institute",
    logo: foundersLogo,
    desc: "Programa de Aceleração",
  },
  {
    name: "AWS for Startups",
    logo: awsLogo,
    desc: "Startup Program",
  },
];

const PartnersSection = () => (
  <section className="section-padding border-t border-border">
    <div className="max-w-6xl mx-auto">
      <AnimatedSection className="text-center mb-12">
        <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-4 font-sans">
          Quem Acredita na Gente
        </p>
        <h2 className="text-2xl md:text-4xl font-serif font-bold">
          Parceiros & Programas
        </h2>
      </AnimatedSection>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {partners.map((p, i) => (
          <AnimatedSection key={i} delay={i * 0.08}>
            <div className="glass rounded-xl p-6 flex flex-col items-center justify-center gap-3 h-full hover:border-primary/30 transition-colors group">
              <div className="h-16 flex items-center justify-center">
                <img
                  src={p.logo}
                  alt={`Logo ${p.name}`}
                  className="max-h-14 max-w-full object-contain brightness-0 invert opacity-60 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold font-sans text-foreground/80">{p.name}</p>
                <p className="text-[10px] text-muted-foreground font-sans leading-tight mt-0.5">{p.desc}</p>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default PartnersSection;
