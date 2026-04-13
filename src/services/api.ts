import { apiClient } from "@/services/http";

const DEFAULT_PRESENTATION_THEME = "editorial-light";
const DEFAULT_SCHEMA_VERSION = "2026-04";

type SlideDensity = "compact" | "balanced" | "expanded";
type SlideType =
  | "cover"
  | "agenda"
  | "section"
  | "introduction"
  | "content"
  | "synthesis"
  | "conclusion"
  | "closing"
  | "optional";

type ContentFormat =
  | "paragraph"
  | "bullets"
  | "definition"
  | "comparison"
  | "table"
  | "timeline"
  | "mixed"
  | "quote"
  | "kpi"
  | "process"
  | "workflow";

export interface Slide {
  slide_number: number;
  slide_type: SlideType;
  semantic_type: string;
  layout_variant: string;
  density: SlideDensity;
  title: string;
  purpose: string;
  content_format: ContentFormat;
  main_content: string[];
  speaker_notes: string;
  suggested_visual: string | null;
  transition_to_next: string;
}

export interface Presentation {
  schema_version: string;
  theme: string;
  language: string;
  presentation_title: string;
  presentation_subtitle: string;
  target_audience: string;
  presentation_goal: string;
  tone: string;
  research_used?: boolean;
  sources?: string[];
  slides: Slide[];
}

/**
 * Normalise une slide brute pour stabiliser le rendu frontend.
 * @param slide Donnees brutes d'une slide provenant de l'API.
 * @param index Position de la slide dans le deck.
 * @returns Une slide conforme au contrat attendu par l'UI.
 * Securite:
 * - Filtre les valeurs non typées pour eviter les etats UI invalides.
 */
function normalizeSlide(slide: Partial<Slide>, index: number): Slide {
  const content = Array.isArray(slide.main_content)
    ? slide.main_content
        .map((item) => String(item ?? "").trim())
        .filter(Boolean)
    : [];

  return {
    slide_number:
      Number.isInteger(slide.slide_number) && (slide.slide_number ?? 0) > 0
        ? (slide.slide_number as number)
        : index + 1,
    slide_type: (slide.slide_type as SlideType) ?? "content",
    semantic_type:
      String(slide.semantic_type ?? "").trim() || "content.paragraph",
    layout_variant:
      String(slide.layout_variant ?? "").trim() || "text-left-accent",
    density: (slide.density as SlideDensity) ?? "balanced",
    title: String(slide.title ?? "").trim() || `Slide ${index + 1}`,
    purpose: String(slide.purpose ?? "").trim(),
    content_format: (slide.content_format as ContentFormat) ?? "paragraph",
    main_content:
      content.length > 0
        ? content
        : [String(slide.purpose ?? "").trim() || "Content"],
    speaker_notes: String(slide.speaker_notes ?? "").trim(),
    suggested_visual:
      slide.suggested_visual === null || slide.suggested_visual === undefined
        ? null
        : String(slide.suggested_visual).trim() || null,
    transition_to_next: String(slide.transition_to_next ?? "").trim(),
  };
}

/**
 * Normalise la presentation brute retournee par l'API.
 * @param payload Donnees brutes potentiellement partielles.
 * @returns Une presentation fiable et complete pour le frontend.
 * Securite:
 * - Applique des valeurs de secours pour eviter les erreurs runtime.
 */
function normalizePresentation(payload: Partial<Presentation>): Presentation {
  const rawSlides = Array.isArray(payload.slides) ? payload.slides : [];

  return {
    schema_version:
      String(payload.schema_version ?? "").trim() || DEFAULT_SCHEMA_VERSION,
    theme: String(payload.theme ?? "").trim() || DEFAULT_PRESENTATION_THEME,
    language: String(payload.language ?? "").trim() || "English",
    presentation_title:
      String(payload.presentation_title ?? "").trim() ||
      "Generated presentation",
    presentation_subtitle: String(payload.presentation_subtitle ?? "").trim(),
    target_audience: String(payload.target_audience ?? "").trim() || "General",
    presentation_goal:
      String(payload.presentation_goal ?? "").trim() || "inform",
    tone: String(payload.tone ?? "").trim() || "professional",
    research_used: Boolean(payload.research_used),
    sources: Array.isArray(payload.sources)
      ? payload.sources.map((item) => String(item ?? "").trim()).filter(Boolean)
      : [],
    slides: rawSlides.map((slide, index) => normalizeSlide(slide, index)),
  };
}

/**
 * Genere une presentation a partir du sujet et de la langue cible.
 * @param topic Sujet principal a presenter.
 * @param language Langue cible optionnelle.
 * @returns Une presentation normalisee prete pour le rendu.
 * Securite:
 * - La reponse distante est normalisee avant usage UI.
 */
export async function generatePresentation(
  topic: string,
  language?: string,
): Promise<Presentation> {
  const res = await apiClient.post<Presentation>("/presentations/generate", {
    topic,
    language: language || undefined,
  });
  return normalizePresentation(res.data);
}
