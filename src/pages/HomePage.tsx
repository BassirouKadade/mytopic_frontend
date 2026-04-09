import { useNavigate } from "react-router-dom";
import { ArrowRight, Layers, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
              <Layers className="size-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold tracking-tight">MyTopic</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/generate")}>
            Commencer
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/30 blur-3xl" />
        </div>

        <div className="max-w-2xl text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent text-accent-foreground rounded-full text-xs font-semibold tracking-wide">
            <Sparkles className="size-3.5" />
            Propulse par l'IA
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.1]">
            Creez vos presentations
            <br />
            <span className="text-primary">en quelques secondes.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
            Entrez un sujet, notre IA genere une presentation structuree
            et professionnelle, prete a etre presentee.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              size="lg"
              onClick={() => navigate("/generate")}
              className="text-sm px-8 py-6 rounded-xl shadow-lg shadow-primary/20 cursor-pointer"
            >
              Commencer gratuitement
              <ArrowRight className="size-4 ml-1" />
            </Button>
            <span className="text-xs text-muted-foreground">
              Aucune inscription requise
            </span>
          </div>
        </div>

        {/* Preview mockup */}
        <div className="mt-20 mb-8 w-full max-w-3xl">
          <div className="relative rounded-2xl border border-border bg-card p-1.5 shadow-xl">
            {/* Browser bar */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
              <div className="flex gap-1.5">
                <div className="size-2.5 rounded-full bg-destructive/50" />
                <div className="size-2.5 rounded-full bg-primary/30" />
                <div className="size-2.5 rounded-full bg-muted-foreground/20" />
              </div>
              <div className="flex-1 mx-8">
                <div className="h-5 bg-muted rounded-md max-w-xs mx-auto" />
              </div>
            </div>
            {/* Slide mockup */}
            <div className="aspect-[16/9] bg-foreground rounded-b-xl flex flex-col items-center justify-center p-12 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/50" />
              <div className="w-2/3 space-y-4 text-center">
                <div className="h-6 bg-background/20 rounded-md w-3/4 mx-auto" />
                <div className="h-3 bg-background/10 rounded w-full" />
                <div className="h-3 bg-background/10 rounded w-5/6 mx-auto" />
                <div className="h-3 bg-background/10 rounded w-2/3 mx-auto" />
              </div>
              <div className="absolute bottom-4 right-6 text-background/20 text-xs font-mono">
                1 / 12
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 mb-20 max-w-4xl w-full grid grid-cols-1 sm:grid-cols-3 gap-6 px-4">
          {[
            {
              icon: Zap,
              title: "Rapide",
              desc: "Generation complete en quelques secondes grace a l'intelligence artificielle.",
            },
            {
              icon: Layers,
              title: "Structure",
              desc: "Des slides bien organises avec titres, contenus et notes du presentateur.",
            },
            {
              icon: Sparkles,
              title: "Intelligent",
              desc: "Formats varies et adaptes : paragraphes, listes, tableaux, comparaisons.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="group rounded-xl border border-border bg-card p-6 text-center space-y-3 transition-all hover:shadow-md hover:border-primary/30"
            >
              <div className="inline-flex items-center justify-center size-10 rounded-lg bg-accent text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <f.icon className="size-4" />
              </div>
              <h3 className="text-sm font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-5">
        <p className="text-center text-xs text-muted-foreground">
          MyTopic &mdash; AI Presentation Generator
        </p>
      </footer>
    </div>
  );
}
