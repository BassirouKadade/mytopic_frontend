import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Layers,
  Sparkles,
  Zap,
  MousePointerClick,
  Presentation,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-x-hidden">
      {/* ─── Navbar ─── */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/25">
              <Layers className="size-4.5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">MyTopic</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => {
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Fonctionnalites
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => {
                document
                  .getElementById("how-it-works")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Comment ca marche
            </Button>
            <Button
              size="sm"
              onClick={() => navigate("/auth")}
              className="rounded-lg px-4 shadow-sm shadow-primary/20 cursor-pointer"
            >
              Se connecter
              <ArrowRight className="size-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-24 pb-20 md:pt-32 md:pb-28">
        {/* Ambient blurs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/8 blur-[120px]" />
          <div className="absolute bottom-0 right-[10%] w-[500px] h-[500px] rounded-full bg-accent/20 blur-[100px]" />
          <div className="absolute top-[20%] left-[5%] w-[300px] h-[300px] rounded-full bg-primary/5 blur-[80px]" />
        </div>

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 -z-10 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        <motion.div
          className="max-w-3xl text-center space-y-8"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          {/* Badge */}
          <motion.div
            variants={fadeUp}
            custom={0}
            className="flex justify-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/60 text-accent-foreground border border-accent-foreground/10 rounded-full text-xs font-semibold tracking-wide">
              <Sparkles className="size-3.5" />
              Propulse par l'IA
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={fadeUp}
            custom={1}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08]"
          >
            Creez des presentations
            <br />
            <span className="bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">
              en quelques secondes.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-lg sm:text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed"
          >
            Entrez un sujet, notre IA genere une presentation structuree et
            professionnelle, prete a etre presentee.
          </motion.p>

          {/* CTA */}
          <motion.div
            variants={fadeUp}
            custom={3}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="relative text-sm px-10 py-7 rounded-2xl font-semibold shadow-xl shadow-primary/25 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              Se connecter
              <ArrowRight className="size-4 ml-2" />
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="size-4 text-primary" />
              Inscription rapide: email + mot de passe
            </div>
          </motion.div>
        </motion.div>

        {/* Preview mockup */}
        <motion.div
          className="mt-20 md:mt-24 w-full max-w-4xl px-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.5,
            duration: 0.7,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <div className="relative">
            {/* Glow behind mockup */}
            <div className="absolute -inset-4 bg-gradient-to-b from-primary/10 to-transparent rounded-3xl blur-2xl" />

            <div className="relative rounded-2xl border border-border/80 bg-card shadow-2xl overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-5 py-3 bg-muted/40 border-b border-border/60">
                <div className="flex gap-2">
                  <div className="size-3 rounded-full bg-destructive/40" />
                  <div className="size-3 rounded-full bg-primary/30" />
                  <div className="size-3 rounded-full bg-muted-foreground/20" />
                </div>
                <div className="flex-1 mx-12">
                  <div className="h-6 bg-background/80 rounded-lg max-w-sm mx-auto border border-border/40" />
                </div>
              </div>

              {/* Slide content */}
              <div className="aspect-[16/9] bg-foreground flex flex-col items-center justify-center p-16 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-chart-2 to-primary/50" />
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/40" />

                <div className="w-2/3 space-y-5 text-center">
                  <div className="h-7 bg-background/20 rounded-lg w-3/4 mx-auto" />
                  <div className="space-y-3">
                    <div className="h-3.5 bg-background/10 rounded w-full" />
                    <div className="h-3.5 bg-background/10 rounded w-5/6 mx-auto" />
                    <div className="h-3.5 bg-background/10 rounded w-2/3 mx-auto" />
                  </div>
                </div>

                <div className="absolute bottom-5 right-8 text-background/20 text-xs font-mono">
                  1 / 12
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── Features ─── */}
      <section id="features" className="px-6 py-24 md:py-32 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center space-y-4 mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            <motion.p
              variants={fadeUp}
              custom={0}
              className="text-sm font-semibold text-primary tracking-wide uppercase"
            >
              Fonctionnalites
            </motion.p>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-3xl sm:text-4xl font-bold tracking-tight"
            >
              Tout ce qu'il faut pour vos presentations
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-muted-foreground max-w-md mx-auto"
            >
              Une suite d'outils intelligents pour creer des presentations
              percutantes en un temps record.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            {[
              {
                icon: Zap,
                title: "Ultra rapide",
                desc: "Generation complete en quelques secondes grace a notre moteur d'intelligence artificielle optimise.",
              },
              {
                icon: Layers,
                title: "Bien structure",
                desc: "Des slides organises logiquement avec titres, contenus riches et notes du presentateur integrees.",
              },
              {
                icon: Sparkles,
                title: "Contenu intelligent",
                desc: "Formats varies et adaptes automatiquement : paragraphes, listes, tableaux et comparaisons.",
              },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                custom={i}
                className="group relative rounded-2xl border border-border/60 bg-card p-8 space-y-4 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-1"
              >
                <div className="inline-flex items-center justify-center size-12 rounded-xl bg-accent/80 text-accent-foreground transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-md group-hover:shadow-primary/20">
                  <f.icon className="size-5" />
                </div>
                <h3 className="text-base font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section id="how-it-works" className="px-6 py-24 md:py-32">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center space-y-4 mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            <motion.p
              variants={fadeUp}
              custom={0}
              className="text-sm font-semibold text-primary tracking-wide uppercase"
            >
              Comment ca marche
            </motion.p>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-3xl sm:text-4xl font-bold tracking-tight"
            >
              Trois etapes, c'est tout.
            </motion.h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            {[
              {
                step: "01",
                icon: MousePointerClick,
                title: "Entrez votre sujet",
                desc: "Decrivez simplement le theme de votre presentation en quelques mots ou phrases.",
              },
              {
                step: "02",
                icon: Sparkles,
                title: "L'IA genere vos slides",
                desc: "Notre algorithme analyse votre sujet et cree une presentation structuree et pertinente.",
              },
              {
                step: "03",
                icon: Presentation,
                title: "Presentez ou exportez",
                desc: "Visualisez directement votre presentation ou exportez-la dans le format de votre choix.",
              },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                variants={fadeUp}
                custom={i}
                className="relative text-center space-y-4"
              >
                <div className="text-5xl font-black text-primary/10 mb-2">
                  {s.step}
                </div>
                <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-primary/10 text-primary mx-auto">
                  <s.icon className="size-6" />
                </div>
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="px-6 py-24 md:py-32">
        <motion.div
          className="max-w-4xl mx-auto relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
        >
          <div className="relative rounded-3xl bg-gradient-to-br from-primary/8 via-accent/20 to-primary/5 border border-primary/10 px-8 py-16 md:px-16 md:py-20 text-center overflow-hidden">
            {/* Decorative blur */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-accent/20 rounded-full blur-[60px]" />

            <div className="relative space-y-6">
              <motion.h2
                variants={fadeUp}
                custom={0}
                className="text-3xl sm:text-4xl font-bold tracking-tight"
              >
                Pret a creer votre prochaine presentation ?
              </motion.h2>
              <motion.p
                variants={fadeUp}
                custom={1}
                className="text-muted-foreground max-w-md mx-auto"
              >
                Rejoignez les utilisateurs qui creent des presentations
                professionnelles en quelques secondes.
              </motion.p>
              <motion.div variants={fadeUp} custom={2} className="pt-2">
                <Button
                  size="lg"
                  onClick={() => navigate("/auth")}
                  className="text-sm px-10 py-7 rounded-2xl font-semibold shadow-xl shadow-primary/25 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Se connecter
                  <ArrowRight className="size-4 ml-2" />
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border/50 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-primary flex items-center justify-center">
              <Layers className="size-3.5 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold">MyTopic</span>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} MyTopic &mdash; AI Presentation
            Generator
          </p>
        </div>
      </footer>
    </div>
  );
}
