import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Download,
  Layers,
  ChevronLeft,
  ChevronRight,
  StickyNote,
} from "lucide-react";

import { SLIDE_ASPECT_RATIO } from "@/presentation/primitives";
import { SlideRenderer } from "@/presentation/SlideRenderer";
import { Button } from "@/components/ui/button";
import { UserProfileMenu } from "@/components/auth/UserProfileMenu";
import { cn } from "@/lib/utils";
import { usePresentationStore } from "@/store/presentationStore";

/**
 * Affiche le lecteur de presentation avec navigation, miniatures et notes.
 * @returns L'interface complete de navigation des slides.
 * Securite:
 * - Aucune donnee sensible n'est exposee; la vue ne manipule que l'etat client.
 */
export default function PresentationPage() {
  const navigate = useNavigate();
  const { presentation } = usePresentationStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showNotes, setShowNotes] = useState(false);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (!presentation) return;
      if (event.key === "Home") {
        setCurrentSlide(0);
      }
      if (event.key === "End") {
        setCurrentSlide(Math.max(0, presentation.slides.length - 1));
      }
      if (event.key === "ArrowRight") {
        setCurrentSlide((v) => Math.min(presentation.slides.length - 1, v + 1));
      }
      if (event.key === "ArrowLeft") {
        setCurrentSlide((v) => Math.max(0, v - 1));
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [presentation]);

  if (!presentation) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-6">
          <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <Layers className="size-7 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              Aucune presentation
            </h2>
            <p className="text-sm text-muted-foreground max-w-xs">
              Generez une presentation pour la visualiser ici.
            </p>
          </div>
          <Button
            onClick={() => navigate("/generate")}
            className="px-6 py-5 rounded-xl font-semibold text-sm shadow-lg shadow-primary/15 cursor-pointer"
          >
            Generer une presentation
          </Button>
        </div>
      </div>
    );
  }

  const slides = presentation.slides;
  const safeCurrentSlide = Math.min(
    Math.max(currentSlide, 0),
    Math.max(slides.length - 1, 0),
  );
  const slide = slides[safeCurrentSlide];
  const canPrev = safeCurrentSlide > 0;
  const canNext = safeCurrentSlide < slides.length - 1;

  return (
    <div className="h-screen bg-muted/30 flex flex-col overflow-hidden">
      {/* ─── Header ─── */}
      <header className="shrink-0 flex items-center justify-between px-5 md:px-8 h-14 border-b border-border/40 bg-background z-10">
        <div className="flex items-center gap-6">
          <div
            className="flex items-center gap-2.5 cursor-pointer px-1 py-1"
            onClick={() => navigate("/")}
          >
            <div className="size-9 rounded-lg bg-primary flex items-center justify-center">
              <Layers className="size-3.5 text-primary-foreground" />
            </div>
            <span className="text-base font-semibold italic tracking-tight">
              MyTopic
            </span>
          </div>

          <div className="h-5 w-px bg-border/50 hidden md:block" />

          <div className="hidden md:block">
            <h1 className="text-sm font-medium text-foreground truncate max-w-[300px]">
              {presentation.presentation_title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNotes((v) => !v)}
            className={cn(
              "hidden md:flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
              showNotes
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <StickyNote className="size-4" />
            Notes
          </button>
          <Button
            variant="default"
            size="sm"
            className="gap-2 rounded-lg cursor-pointer font-semibold text-sm px-4 py-2 h-auto bg-primary text-primary-foreground hover:bg-primary/90 border border-primary/20"
          >
            <Download className="size-4" />
            <span className="inline">Exporter</span>
          </Button>
          <UserProfileMenu avatarOnly />
        </div>
      </header>

      {/* ─── Main ─── */}
      <div className="flex-1 min-h-0 flex">
        {/* ─── Slide Area ─── */}
        <main className="flex-1 min-w-0 flex flex-col">
          {/* Slide viewer */}
          <div className="flex-1 min-h-0 flex items-center justify-center px-6 md:px-12 lg:px-16 py-5">
            <div className="relative mb-0 w-full max-w-[760px]">
              {/* Navigation arrows */}
              <button
                onClick={() => canPrev && setCurrentSlide((v) => v - 1)}
                disabled={!canPrev}
                className={cn(
                  "absolute -left-12 top-1/2 -translate-y-1/2 z-10 size-9 rounded-full flex items-center justify-center transition-all duration-200 hidden lg:flex",
                  canPrev
                    ? "bg-background border border-border/60 shadow-sm text-foreground hover:bg-muted cursor-pointer"
                    : "text-muted-foreground/20 cursor-default",
                )}
              >
                <ChevronLeft className="size-4" />
              </button>

              <div
                className="w-full rounded-xl overflow-hidden shadow-[0_8px_32px_-8px_rgba(0,0,0,0.12)] ring-1 ring-black/[0.04] bg-white"
                style={{ aspectRatio: SLIDE_ASPECT_RATIO }}
              >
                <div className="h-full w-full">
                  <SlideRenderer
                    presentation={presentation}
                    slide={slide}
                    currentSlide={safeCurrentSlide}
                    totalSlides={slides.length}
                  />
                </div>
              </div>

              <button
                onClick={() => canNext && setCurrentSlide((v) => v + 1)}
                disabled={!canNext}
                className={cn(
                  "absolute -right-12 top-1/2 -translate-y-1/2 z-10 size-9 rounded-full flex items-center justify-center transition-all duration-200 hidden lg:flex",
                  canNext
                    ? "bg-background border border-border/60 shadow-sm text-foreground hover:bg-muted cursor-pointer"
                    : "text-muted-foreground/20 cursor-default",
                )}
              >
                <ChevronRight className="size-4" />
              </button>

              {/* Slide counter + mobile nav */}
              <div className="mt-2 flex items-center justify-between px-1 gap-2 lg:hidden">
                <button
                  onClick={() => canPrev && setCurrentSlide((v) => v - 1)}
                  disabled={!canPrev}
                  className="lg:hidden size-8 rounded-full flex items-center justify-center bg-background border border-border/60 shadow-sm disabled:opacity-30 cursor-pointer"
                  aria-label="Slide precedente"
                >
                  <ChevronLeft className="size-4" />
                </button>

                <div className="mx-auto h-px w-6 bg-border/70" />

                <button
                  onClick={() => canNext && setCurrentSlide((v) => v + 1)}
                  disabled={!canNext}
                  className="lg:hidden size-8 rounded-full flex items-center justify-center bg-background border border-border/60 shadow-sm disabled:opacity-30 cursor-pointer"
                  aria-label="Slide suivante"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          </div>

          {/* ─── Thumbnails bar ─── */}
          <div className="shrink-0 border-t border-border/40 bg-background px-4 pt-3 pb-5">
            <div className="mx-auto w-full max-w-[920px]">
              <div
                className="mx-auto flex w-fit items-center justify-start gap-1.5 overflow-x-auto overflow-y-visible px-1 pt-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                style={{ scrollbarWidth: "none" }}
              >
                {slides.map((item, index) => (
                  <button
                    key={`${item.slide_number}-${item.title}`}
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Aller a la slide ${index + 1}`}
                    className={cn(
                      "relative shrink-0 rounded-lg p-[2px] transition-all duration-150 cursor-pointer text-left outline-none",
                      index === safeCurrentSlide
                        ? "ring-2 ring-primary ring-offset-1 ring-offset-background"
                        : "opacity-80 hover:opacity-100 hover:ring-1 hover:ring-border/70 hover:ring-offset-1 hover:ring-offset-background",
                    )}
                  >
                    <div
                      className="w-[98px] rounded-md border border-border/40 bg-white overflow-hidden"
                      style={{ aspectRatio: SLIDE_ASPECT_RATIO }}
                    >
                      <div className="h-full flex flex-col justify-between p-2">
                        <div className="space-y-0.5">
                          <div className="h-[3px] w-8 rounded-full bg-slate-800/70" />
                          <div className="h-[2px] w-12 rounded-full bg-slate-300/80" />
                          <div className="h-[2px] w-6 rounded-full bg-slate-200/80" />
                        </div>
                        <div className="space-y-1">
                          <span className="block text-[7px] font-semibold text-muted-foreground leading-none">
                            {index + 1}
                          </span>
                          <span className="block text-[7px] leading-none text-slate-500 truncate max-w-[78px]">
                            {item.title}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* ─── Notes panel ─── */}
        {showNotes && (
          <aside className="hidden md:flex w-[320px] shrink-0 border-l border-border/40 bg-background flex-col">
            <div className="px-4 py-3 border-b border-border/30">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Notes du presentateur
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {slide.speaker_notes ? (
                <p className="text-sm leading-relaxed text-foreground/80">
                  {slide.speaker_notes}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground/50 italic">
                  Aucune note pour cette slide.
                </p>
              )}
            </div>
            <div className="px-4 py-3 border-t border-border/30 space-y-1">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium">
                Slide {safeCurrentSlide + 1}
              </p>
              <p className="text-xs font-medium text-foreground truncate">
                {slide.title}
              </p>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
