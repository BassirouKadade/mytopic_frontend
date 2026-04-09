import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePresentationStore } from "../store/presentationStore";
import type { Presentation, Slide } from "../services/api";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  Layers,
  MessageSquareText,
  RotateCcw,
} from "lucide-react";
import {
  getAgendaItems,
  getSlideLabel,
  getTakeawayCards,
  parseDefinitionItem,
  parseMixedContent,
  parseTableContent,
} from "@/lib/presentation";

export default function PresentationPage() {
  const navigate = useNavigate();
  const { presentation, reset } = usePresentationStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showNotes, setShowNotes] = useState(false);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        setCurrentSlide((value) =>
          presentation ? Math.min(presentation.slides.length - 1, value + 1) : value
        );
      }
      if (event.key === "ArrowLeft") {
        setCurrentSlide((value) => Math.max(0, value - 1));
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [presentation]);

  if (!presentation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground text-sm">Aucune presentation generee.</p>
          <Button onClick={() => navigate("/generate")}>
            Generer une presentation
          </Button>
        </div>
      </div>
    );
  }

  const slides = presentation.slides;
  const slide = slides[currentSlide];
  const total = slides.length;
  const isDark =
    slide.slide_type === "cover" ||
    slide.slide_type === "synthesis" ||
    slide.slide_type === "conclusion";

  const prev = () => setCurrentSlide((value) => Math.max(0, value - 1));
  const next = () => setCurrentSlide((value) => Math.min(total - 1, value + 1));

  const handleNew = () => {
    reset();
    navigate("/generate");
  };

  return (
    <div className="min-h-screen bg-muted/30 text-foreground flex flex-col">
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={handleNew}>
            <ChevronLeft className="size-4" />
            Nouvelle
          </Button>
          <div className="flex items-center gap-2">
            <div className="size-6 rounded-md bg-primary flex items-center justify-center">
              <Layers className="size-3 text-primary-foreground" />
            </div>
            <h1 className="text-sm font-semibold truncate max-w-xs sm:max-w-sm">
              {presentation.presentation_title}
            </h1>
          </div>
          <Button variant="ghost" size="sm" onClick={handleNew}>
            <RotateCcw className="size-3.5" />
            Recommencer
          </Button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-5xl">
          <div
            className={`rounded-2xl border shadow-xl overflow-hidden transition-colors ${
              isDark
                ? "bg-foreground text-background border-foreground"
                : "bg-card text-card-foreground border-border"
            }`}
            style={{ aspectRatio: "16 / 9" }}
          >
            <div className="relative h-full flex flex-col p-8 sm:p-12">
              <div
                className={`absolute top-0 left-0 right-0 h-1 ${
                  isDark ? "bg-background/10" : "bg-muted"
                }`}
              >
                <div
                  className="h-full bg-primary transition-all duration-500 ease-out"
                  style={{ width: `${((currentSlide + 1) / total) * 100}%` }}
                />
              </div>

              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/60" />

              <SlideFrame
                presentation={presentation}
                slide={slide}
                isDark={isDark}
                currentSlide={currentSlide}
                total={total}
              />
            </div>
          </div>
        </div>

        {showNotes && (
          <SpeakerNotesCard slide={slide} className="w-full max-w-5xl mt-4" />
        )}

        <div className="mt-6 flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={prev}
            disabled={currentSlide === 0}
          >
            <ArrowLeft className="size-4" />
          </Button>

          <Button
            variant={showNotes ? "default" : "outline"}
            size="icon"
            onClick={() => setShowNotes((value) => !value)}
          >
            <MessageSquareText className="size-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={next}
            disabled={currentSlide === total - 1}
          >
            <ArrowRight className="size-4" />
          </Button>
        </div>

        <div className="mt-5 flex gap-1.5 overflow-x-auto pb-2 max-w-5xl w-full px-1">
          {slides.map((item, index) => (
            <button
              key={`${item.slide_number}-${item.title}`}
              onClick={() => setCurrentSlide(index)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                index === currentSlide
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-card border border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}

function SlideFrame({
  presentation,
  slide,
  isDark,
  currentSlide,
  total,
}: {
  presentation: Presentation;
  slide: Slide;
  isDark: boolean;
  currentSlide: number;
  total: number;
}) {
  const badgeClass = isDark
    ? "bg-background/10 text-background/70"
    : "bg-accent text-accent-foreground";
  const mutedText = isDark ? "text-background/60" : "text-muted-foreground";
  const footerBorder = isDark ? "border-background/10" : "border-border";
  const footerText = isDark ? "text-background/40" : "text-muted-foreground";

  return (
    <>
      {slide.slide_type === "cover" ? (
        <CoverSlide presentation={presentation} slide={slide} isDark={isDark} />
      ) : (
        <>
          <div className="mb-6 flex items-start justify-between gap-6">
            <div className="max-w-3xl space-y-3">
              <span
                className={`inline-flex px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest rounded-full ${badgeClass}`}
              >
                {getSlideLabel(slide.slide_type)}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {slide.title}
              </h2>
              {slide.purpose && (
                <p className={`text-sm sm:text-base leading-relaxed ${mutedText}`}>
                  {slide.purpose}
                </p>
              )}
            </div>
            <div
              className={`hidden md:flex flex-col gap-2 rounded-xl border px-3 py-3 min-w-44 ${
                isDark
                  ? "border-background/10 bg-background/5"
                  : "border-border bg-muted/40"
              }`}
            >
              <span className={`text-[10px] uppercase tracking-widest ${footerText}`}>
                Structure
              </span>
              <span className="text-sm font-medium">{slide.content_format}</span>
              <span className={`text-xs leading-relaxed ${mutedText}`}>
                Une idee forte, un rendu lisible, une transition claire.
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2">
            <StructuredSlideContent slide={slide} isDark={isDark} />
          </div>
        </>
      )}

      <div
        className={`mt-4 pt-3 flex items-center justify-between text-xs border-t ${footerBorder} ${footerText}`}
      >
        <span>
          {currentSlide + 1} / {total}
        </span>
        <div className="flex items-center gap-2">
          {slide.suggested_visual && (
            <span
              className={`hidden sm:inline-flex rounded-full px-2.5 py-1 ${
                isDark ? "bg-background/8 text-background/55" : "bg-muted text-muted-foreground"
              }`}
            >
              Visuel suggere: {slide.suggested_visual}
            </span>
          )}
          {slide.transition_to_next && <span className="hidden lg:inline">{slide.transition_to_next}</span>}
        </div>
      </div>
    </>
  );
}

function CoverSlide({
  presentation,
  slide,
  isDark,
}: {
  presentation: Presentation;
  slide: Slide;
  isDark: boolean;
}) {
  const items = slide.main_content.slice(0, 3);
  const mutedText = isDark ? "text-background/60" : "text-muted-foreground";

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div className="space-y-6">
        <span
          className={`inline-flex px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest rounded-full ${
            isDark ? "bg-background/10 text-background/70" : "bg-accent text-accent-foreground"
          }`}
        >
          {getSlideLabel(slide.slide_type)}
        </span>

        <div className="max-w-4xl space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
            {slide.title || presentation.presentation_title}
          </h2>

          {presentation.presentation_subtitle && (
            <p className={`text-lg sm:text-xl max-w-3xl leading-relaxed ${mutedText}`}>
              {presentation.presentation_subtitle}
            </p>
          )}

          {slide.purpose && (
            <p className={`text-sm sm:text-base max-w-2xl leading-relaxed ${mutedText}`}>
              {slide.purpose}
            </p>
          )}
        </div>

        {items.length > 0 && (
          <div className="grid gap-3 md:grid-cols-3">
            {items.map((item, index) => (
              <div
                key={`${item}-${index}`}
                className={`rounded-2xl border px-4 py-4 ${
                  isDark
                    ? "border-background/10 bg-background/5"
                    : "border-border bg-muted/30"
                }`}
              >
                <div className="text-[10px] uppercase tracking-widest text-primary mb-2">
                  Point {index + 1}
                </div>
                <p className={`text-sm leading-relaxed ${mutedText}`}>{item}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 pt-8">
        <MetaPill label="Langue" value={presentation.language} isDark={isDark} />
        <MetaPill
          label="Audience"
          value={presentation.target_audience}
          isDark={isDark}
        />
        <MetaPill label="Objectif" value={presentation.presentation_goal} isDark={isDark} />
        <MetaPill label="Ton" value={presentation.tone} isDark={isDark} />
      </div>
    </div>
  );
}

function MetaPill({
  label,
  value,
  isDark,
}: {
  label: string;
  value: string;
  isDark: boolean;
}) {
  return (
    <div
      className={`rounded-full border px-3 py-1.5 text-xs ${
        isDark ? "border-background/10 bg-background/5" : "border-border bg-muted/30"
      }`}
    >
      <span className={isDark ? "text-background/45" : "text-muted-foreground"}>{label}</span>
      <span className="mx-1">.</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function SpeakerNotesCard({
  slide,
  className,
}: {
  slide: Slide;
  className?: string;
}) {
  return (
    <div
      className={`${className ?? ""} p-5 bg-card border border-border rounded-xl shadow-sm`}
    >
      <div className="grid gap-4 md:grid-cols-[1.8fr_1fr]">
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">
            Notes du presentateur
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {slide.speaker_notes || "Aucune note additionnelle pour cette slide."}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-muted/30 px-4 py-3">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">
            Transition
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {slide.transition_to_next || "Pas de transition specifique fournie."}
          </p>
        </div>
      </div>
    </div>
  );
}

function StructuredSlideContent({
  slide,
  isDark,
}: {
  slide: Slide;
  isDark: boolean;
}) {
  if (slide.slide_type === "agenda") {
    return <AgendaSlide slide={slide} isDark={isDark} />;
  }

  if (slide.slide_type === "synthesis" || slide.slide_type === "conclusion") {
    return <TakeawaySlide slide={slide} isDark={isDark} />;
  }

  const text = isDark ? "text-background/70" : "text-muted-foreground";
  const strong = isDark ? "text-background" : "text-foreground";
  const divider = isDark ? "border-background/15" : "border-border";
  const softCard = isDark ? "border-background/10 bg-background/5" : "border-border bg-muted/25";
  const bullet = isDark ? "bg-background/35" : "bg-primary/45";

  switch (slide.content_format) {
    case "bullets":
      return (
        <div className="grid gap-3 md:grid-cols-2">
          {slide.main_content.map((item, index) => (
            <div
              key={`${item}-${index}`}
              className={`rounded-2xl border p-4 flex gap-3 ${softCard}`}
            >
              <span className={`mt-1.5 size-2 rounded-full flex-shrink-0 ${bullet}`} />
              <p className={`text-sm leading-relaxed ${text}`}>{item}</p>
            </div>
          ))}
        </div>
      );

    case "definition":
      return (
        <div className="grid gap-4 md:grid-cols-2">
          {slide.main_content.map((item, index) => {
            const definition = parseDefinitionItem(item);
            const title = definition?.term ?? item;
            const description = definition?.explanation ?? "";

            return (
              <div key={`${item}-${index}`} className={`rounded-2xl border p-5 ${softCard}`}>
                <p className={`text-sm font-semibold ${strong}`}>{title}</p>
                {description && (
                  <p className={`text-sm leading-relaxed mt-2 ${text}`}>{description}</p>
                )}
              </div>
            );
          })}
        </div>
      );

    case "comparison":
      return (
        <div className="grid gap-4 md:grid-cols-2">
          {slide.main_content.map((item, index) => {
            const definition = parseDefinitionItem(item);
            return (
              <div key={`${item}-${index}`} className={`rounded-2xl border p-5 ${softCard}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className={`inline-flex size-7 items-center justify-center rounded-full text-xs font-semibold ${
                      isDark
                        ? "bg-background/10 text-background/70"
                        : "bg-accent text-accent-foreground"
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>
                  <p className={`text-sm font-semibold ${strong}`}>
                    {definition?.term ?? `Option ${index + 1}`}
                  </p>
                </div>
                <p className={`text-sm leading-relaxed ${text}`}>
                  {definition?.explanation ?? item}
                </p>
              </div>
            );
          })}
        </div>
      );

    case "table": {
      const rows = parseTableContent(slide.main_content);
      if (!rows) {
        return <FallbackParagraphs items={slide.main_content} textClass={text} />;
      }

      const [header, ...body] = rows;
      return (
        <div className={`rounded-2xl border overflow-hidden ${softCard}`}>
          <table className="w-full text-sm">
            <thead>
              <tr className={isDark ? "bg-background/7" : "bg-muted/50"}>
                {header.map((cell, index) => (
                  <th
                    key={`${cell}-${index}`}
                    className={`text-left px-4 py-3 font-semibold border-b ${divider} ${strong}`}
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td
                      key={`${cell}-${cellIndex}`}
                      className={`px-4 py-3 align-top border-b last:border-b-0 ${divider} ${text}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    case "timeline":
      return (
        <div className="space-y-4">
          {slide.main_content.map((item, index) => {
            const definition = parseDefinitionItem(item);
            return (
              <div key={`${item}-${index}`} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`size-3 rounded-full mt-1 ${bullet}`} />
                  {index < slide.main_content.length - 1 && (
                    <div
                      className={`w-px flex-1 mt-2 ${isDark ? "bg-background/10" : "bg-border"}`}
                    />
                  )}
                </div>
                <div className={`pb-4 rounded-2xl border px-4 py-3 flex-1 ${softCard}`}>
                  <p className={`text-sm font-semibold ${strong}`}>
                    {definition?.term ?? `Etape ${index + 1}`}
                  </p>
                  <p className={`text-sm leading-relaxed mt-1 ${text}`}>
                    {definition?.explanation ?? item}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      );

    case "mixed": {
      const blocks = parseMixedContent(slide.main_content);
      return (
        <div className="space-y-3">
          {blocks.map((block, index) => {
            if (block.type === "bullet") {
              return (
                <div
                  key={index}
                  className={`rounded-2xl border px-4 py-3 flex gap-3 ${softCard}`}
                >
                  <span className={`mt-1.5 size-2 rounded-full flex-shrink-0 ${bullet}`} />
                  <p className={`text-sm leading-relaxed ${text}`}>{block.value}</p>
                </div>
              );
            }

            if (block.type === "definition") {
              return (
                <div key={index} className={`rounded-2xl border p-4 ${softCard}`}>
                  <p className={`text-sm font-semibold ${strong}`}>{block.term}</p>
                  <p className={`text-sm leading-relaxed mt-1 ${text}`}>
                    {block.explanation}
                  </p>
                </div>
              );
            }

            return (
              <p key={index} className={`text-sm leading-relaxed ${text}`}>
                {block.value}
              </p>
            );
          })}
        </div>
      );
    }

    default:
      return <FallbackParagraphs items={slide.main_content} textClass={text} />;
  }
}

function AgendaSlide({
  slide,
  isDark,
}: {
  slide: Slide;
  isDark: boolean;
}) {
  const items = getAgendaItems(slide);
  const cardClass = isDark ? "border-background/10 bg-background/5" : "border-border bg-muted/25";
  const textClass = isDark ? "text-background/70" : "text-muted-foreground";

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item, index) => (
        <div key={`${item}-${index}`} className={`rounded-2xl border p-5 ${cardClass}`}>
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
              {index + 1}
            </span>
            <p className="text-sm font-semibold">{item}</p>
          </div>
          <p className={`text-sm leading-relaxed ${textClass}`}>
            Cette partie structure la progression de la presentation et prepare la slide suivante.
          </p>
        </div>
      ))}
    </div>
  );
}

function TakeawaySlide({
  slide,
  isDark,
}: {
  slide: Slide;
  isDark: boolean;
}) {
  const cards = getTakeawayCards(slide);
  const cardClass = isDark ? "border-background/10 bg-background/5" : "border-border bg-muted/25";
  const textClass = isDark ? "text-background/70" : "text-muted-foreground";

  return (
    <div className="space-y-5">
      <div className={`rounded-2xl border px-5 py-4 ${cardClass}`}>
        <p className="text-sm font-semibold mb-2">Message a retenir</p>
        <p className={`text-sm leading-relaxed ${textClass}`}>
          {slide.purpose || slide.main_content[0]}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((item, index) => (
          <div key={`${item}-${index}`} className={`rounded-2xl border p-5 ${cardClass}`}>
            <p className="text-[10px] uppercase tracking-widest text-primary mb-2">
              Point cle {index + 1}
            </p>
            <p className={`text-sm leading-relaxed ${textClass}`}>{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FallbackParagraphs({
  items,
  textClass,
}: {
  items: string[];
  textClass: string;
}) {
  const [lead, ...rest] = items;

  return (
    <div className="space-y-4">
      {lead && <p className={`text-base leading-relaxed ${textClass}`}>{lead}</p>}
      {rest.length > 0 && (
        <div className="grid gap-3 md:grid-cols-2">
          {rest.map((item, index) => (
            <p key={`${item}-${index}`} className={`text-sm leading-relaxed ${textClass}`}>
              {item}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
