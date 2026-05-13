import { useEffect, useMemo, useRef, useState } from "react";
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
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { UserProfileMenu } from "@/components/auth/UserProfileMenu";
import { motion } from "framer-motion";
import { SlideThumbnail } from "@/presentation/SlideThumbnail";
import {
  getSavedPresentation,
  type PersistedPresentationSummary,
  type Presentation,
} from "@/services/api";

/**
 * Cache module-level: une présentation chargée reste en mémoire
 * pour la durée de la session — évite les re-fetch lors de re-render.
 */
const presentationCache = new Map<string, Presentation>();
const inFlight = new Map<string, Promise<Presentation>>();

function loadPresentation(id: string): Promise<Presentation> {
  const cached = presentationCache.get(id);
  if (cached) return Promise.resolve(cached);
  const existing = inFlight.get(id);
  if (existing) return existing;

  const promise = getSavedPresentation(id)
    .then((res) => {
      presentationCache.set(id, res.presentation);
      inFlight.delete(id);
      return res.presentation;
    })
    .catch((err) => {
      inFlight.delete(id);
      throw err;
    });

  inFlight.set(id, promise);
  return promise;
}

/**
 * Carte "présentation récente" style Canva : vignette + titre + date.
 * Charge la présentation complète en lazy au mount pour rendre la
 * première slide via SlideThumbnail.
 */
function RecentPresentationCard({
  item,
  onOpen,
}: {
  item: PersistedPresentationSummary;
  onOpen: () => void;
}) {
  const [presentation, setPresentation] = useState<Presentation | null>(
    () => presentationCache.get(item.id) ?? null,
  );
  const [errored, setErrored] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (presentation) return;
    let cancelled = false;
    loadPresentation(item.id)
      .then((p) => {
        if (!cancelled) setPresentation(p);
      })
      .catch(() => {
        if (!cancelled) setErrored(true);
      });
    return () => {
      cancelled = true;
    };
  }, [item.id, presentation]);

  // Nettoyage de l'interval au démontage
  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const startRotation = () => {
    if (!presentation || presentation.slides.length <= 1) return;
    if (intervalRef.current !== null) return;
    intervalRef.current = window.setInterval(() => {
      setActiveSlide((prev) =>
        presentation.slides.length === 0
          ? 0
          : (prev + 1) % presentation.slides.length,
      );
    }, 900);
  };

  const stopRotation = () => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setActiveSlide(0);
  };

  const updatedLabel = useMemo(() => {
    const d = new Date(item.updated_at);
    return d.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, [item.updated_at]);

  return (
    <div
      className="cursor-pointer"
      onClick={onOpen}
      onMouseEnter={startRotation}
      onMouseLeave={stopRotation}
    >
      {/* Cadre gris : seule la bordure change au survol, aucun shadow/scale */}
      <div className="relative rounded-2xl bg-muted/50 border border-border/40 hover:border-primary/40 transition-colors duration-150 p-4 sm:p-5">
        <div className="relative rounded-md border border-border/30 bg-white overflow-hidden">
          {presentation ? (
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <SlideThumbnail
                presentation={presentation}
                slideIndex={activeSlide}
              />
            </motion.div>
          ) : errored ? (
            <div className="aspect-[16/9] flex items-center justify-center">
              <FileText className="size-7 text-muted-foreground/30" />
            </div>
          ) : (
            <div className="aspect-[16/9] flex items-center justify-center">
              <Spinner className="size-5 text-muted-foreground/40" />
            </div>
          )}

          {/* Badge index courant / total */}
          {presentation && (
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-foreground/75 backdrop-blur-sm text-background text-[10px] font-mono font-medium tabular-nums">
              {activeSlide + 1} / {presentation.slides.length}
            </div>
          )}
        </div>
      </div>

      {/* Métadonnées sous la carte */}
      <div className="mt-3 px-1">
        <p className="text-sm font-semibold text-foreground truncate">
          {item.title}
        </p>
        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="inline-flex size-4 items-center justify-center rounded-full bg-primary/10">
            <Clock className="size-2.5 text-primary" />
          </span>
          <span>Modifié le {updatedLabel}</span>
        </div>
      </div>
    </div>
  );
}

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

  const [listLoaded, setListLoaded] = useState(false);

  useEffect(() => {
    void refreshUserPresentations().finally(() => setListLoaded(true));
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
              Modèles
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
            { icon: LayoutList, label: "Modèles", path: "/generate" },
            { icon: FolderHeart, label: "Collections", path: "/collections" },
            { icon: Settings2, label: "Paramètres", path: "/settings/ai-providers" },
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

          <section className="mt-12 pb-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg md:text-xl font-semibold tracking-tight">
                Présentations récentes
              </h2>
              <button
                onClick={() => navigate("/collections")}
                className="text-sm text-primary hover:underline"
              >
                Voir tout
              </button>
            </div>

            {!listLoaded ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <div className="rounded-2xl bg-muted/40 p-4 sm:p-5">
                      <div className="aspect-[16/9] rounded-md bg-muted/70 animate-pulse" />
                    </div>
                    <div className="space-y-2 px-1">
                      <div className="h-3.5 w-3/4 rounded bg-muted/70 animate-pulse" />
                      <div className="h-2.5 w-1/2 rounded bg-muted/60 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentPresentations.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/70 bg-card/60 p-10 text-center">
                <FileText className="size-8 mx-auto mb-3 text-muted-foreground/40" />
                <p className="text-sm font-medium text-foreground">
                  Aucune présentation pour le moment.
                </p>
                <p className="text-xs mt-1 text-muted-foreground/70">
                  Saisissez un sujet ci-dessus pour générer votre premier deck.
                </p>
              </div>
            ) : (
              <motion.div
                className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
                initial="hidden"
                animate="visible"
                variants={stagger}
              >
                {recentPresentations.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    variants={fadeUp}
                    custom={idx}
                  >
                    <RecentPresentationCard
                      item={item}
                      onOpen={() =>
                        navigate(`/presentation/${item.id}?slide=0`)
                      }
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
