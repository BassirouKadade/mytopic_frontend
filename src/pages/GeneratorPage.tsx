import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePresentationStore } from "../store/presentationStore";
import {
  Layers,
  Sparkles,
  Palette,
  LayoutList,
  FileText,
  FolderHeart,
  Settings2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { UserProfileMenu } from "@/components/auth/UserProfileMenu";
import { motion } from "framer-motion";

const easeCurve: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: easeCurve },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.06 } },
};

export default function GeneratorPage() {
  const [topic, setTopic] = useState("");
  const navigate = useNavigate();
  const {
    loading,
    error,
    presentations,
    generateAndCreate,
    refreshUserPresentations,
  } = usePresentationStore();

  useEffect(() => {
    void refreshUserPresentations();
  }, [refreshUserPresentations]);

  const recentPresentations = useMemo(
    () => [...presentations].slice(0, 6),
    [presentations],
  );

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    const presentationId = await generateAndCreate(topic.trim());
    if (presentationId) {
      navigate(`/presentation/${presentationId}?slide=0`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !loading) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-x-hidden">
      {/* ─── Fixed Header ─── */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-10 h-16 bg-background/90 backdrop-blur-xl border-b border-border/30">
        <div className="flex items-center gap-4">
          <div
            className="flex items-center gap-3 cursor-pointer py-2 pr-4"
            onClick={() => navigate("/")}
          >
            <div className="size-9 rounded-xl bg-primary flex items-center justify-center shadow-sm shadow-primary/20">
              <Layers className="size-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold italic tracking-tight">
              MyTopic
            </span>
          </div>

          <div className="h-5 w-px bg-border/40 mx-2 hidden md:block" />

          <nav className="hidden md:flex items-center gap-8 ml-2">
            <button
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-foreground transition-colors duration-300 tracking-tight font-medium text-sm py-2 px-1"
            >
              Accueil
            </button>
            <button className="text-muted-foreground hover:text-foreground transition-colors duration-300 tracking-tight font-medium text-sm py-2 px-1">
              Templates
            </button>
            <button className="text-muted-foreground hover:text-foreground transition-colors duration-300 tracking-tight font-medium text-sm py-2 px-1">
              Archives
            </button>
          </nav>
        </div>

        <div className="flex items-center">
          <UserProfileMenu />
        </div>
      </header>

      {/* ─── Side Navigation ─── */}
      <aside className="fixed left-0 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-7 p-6 z-40">
        <div className="h-12 w-px bg-border/30" />
        <div className="flex flex-col gap-7">
          {[
            { icon: FileText, label: "Brouillons", path: "/generate" },
            { icon: LayoutList, label: "Templates", path: "/generate" },
            { icon: FolderHeart, label: "Collections", path: "/collections" },
            { icon: Settings2, label: "Paramètres", path: "/generate" },
          ].map((item) => (
            <button
              key={item.label}
              title={item.label}
              onClick={() => navigate(item.path)}
              className="text-muted-foreground/50 hover:text-primary transition-all duration-300 p-2"
            >
              <item.icon className="size-4" />
            </button>
          ))}
        </div>
        <div className="h-12 w-px bg-border/30" />
      </aside>

      {/* ─── Main Content ─── */}
      <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pt-24 pb-10 px-6 md:px-10 w-full">
        <div className="mx-auto w-full max-w-5xl">
          <motion.div
            className="text-center mb-8 relative z-10 px-2 mt-10"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.h1
              variants={fadeUp}
              custom={0}
              className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground mb-4 leading-[1.1]"
            >
              Quel est votre <span className="italic text-primary">sujet</span>{" "}
              ?
            </motion.h1>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-light"
            >
              Confiez votre idée à l'intelligence éditoriale. Nous transformons
              votre concept en une narration visuelle d'exception.
            </motion.p>
          </motion.div>

          <motion.div
            className="w-full max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6, ease: easeCurve }}
          >
            <div className="bg-card rounded-2xl p-6 md:p-7 border border-border/30 shadow-[0_16px_35px_-16px_rgba(0,0,0,0.16)] transition-all duration-500 focus-within:shadow-[0_20px_45px_-18px_rgba(0,0,0,0.22)] focus-within:ring-2 focus-within:ring-primary/15">
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ex : L'intelligence artificielle dans la santé..."
                rows={3}
                disabled={loading}
                className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-lg leading-relaxed resize-none min-h-24 max-h-40 text-foreground placeholder:text-muted-foreground/40 placeholder:italic disabled:opacity-50 p-1"
              />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-5 pt-5 border-t border-border/20">
                <div className="flex flex-wrap gap-2.5">
                  <button className="px-4 py-2 rounded-full bg-muted/50 hover:bg-muted transition-colors text-[10px] font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <LayoutList className="size-3" />
                    Structure Pro
                  </button>
                  <button className="px-4 py-2 rounded-full bg-muted/50 hover:bg-muted transition-colors text-[10px] font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Palette className="size-3" />
                    Atelier Style
                  </button>
                </div>

                <Button
                  size="lg"
                  onClick={handleGenerate}
                  disabled={loading || !topic.trim()}
                  className="px-8 py-5 rounded-xl font-semibold text-sm shadow-lg shadow-primary/15 cursor-pointer transition-all duration-300 hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 gap-2.5"
                >
                  {loading ? (
                    <>
                      <Spinner className="size-4" />
                      <span>Génération en cours...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-4" />
                      <span>Générer la présentation</span>
                    </>
                  )}
                </Button>
              </div>

              {error && (
                <div className="mt-5 px-4 py-3 bg-destructive/10 border border-destructive/20 rounded-xl">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
            </div>

            <motion.div
              className="mt-5 flex flex-col md:flex-row items-center justify-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">
                Inspirations :
              </span>
              <div className="flex flex-wrap justify-center gap-2.5">
                {[
                  "Le changement climatique",
                  "Introduction au Machine Learning",
                  "L'art de la typographie",
                ].map((hint) => (
                  <button
                    key={hint}
                    onClick={() => setTopic(hint)}
                    disabled={loading}
                    className="px-4 py-2 border border-border/40 rounded-full hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 text-xs text-muted-foreground hover:text-primary disabled:opacity-50 cursor-pointer"
                  >
                    {hint}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <section className="mt-10 pb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-semibold tracking-tight">
                Presentations recentes
              </h2>
              <button
                onClick={() => navigate("/collections")}
                className="text-sm text-primary hover:underline"
              >
                Voir tout
              </button>
            </div>

            {recentPresentations.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border/70 bg-card/60 p-6 text-sm text-muted-foreground text-center">
                Aucune presentation recente.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {recentPresentations.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => navigate(`/presentation/${item.id}?slide=0`)}
                    className="rounded-xl border border-border/60 bg-card p-4 text-left hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <p className="font-semibold truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      MAJ: {new Date(item.updated_at).toLocaleString()}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
