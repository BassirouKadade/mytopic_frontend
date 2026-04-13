import type { Slide } from "@/services/api";
import type { SlideSemanticType } from "@/presentation/types";

export interface DefinitionItem {
  term: string;
  explanation: string;
}

export interface ComparisonItem {
  title: string;
  description: string;
}

export interface MetricItem {
  value: string;
  label: string;
  note: string;
}

export interface CardItem {
  title: string;
  description: string;
}

const SEMANTIC_TYPES = new Set<SlideSemanticType>([
  "cover.title",
  "section.agenda",
  "section.transition",
  "content.paragraph",
  "content.definition",
  "content.definition_list",
  "content.multi_paragraph",
  "content.quote",
  "content.info_box",
  "list.bullets",
  "list.numbered",
  "list.takeaways",
  "list.pros_cons",
  "comparison.two_column",
  "comparison.before_after",
  "comparison.concepts",
  "comparison.solutions",
  "data.table",
  "data.comparative_table",
  "data.matrix",
  "data.kpi",
  "data.cards",
  "visual.image_text",
  "visual.overlay",
  "visual.illustration",
  "visual.gallery",
  "diagram.timeline",
  "diagram.process",
  "diagram.workflow",
  "diagram.orgchart",
  "diagram.cause_effect",
  "business.problem_solution",
  "business.objectives_results",
  "business.use_case",
  "business.roadmap",
  "business.architecture",
  "business.product_feature",
  "academic.definition",
  "academic.explanation",
  "academic.case_study",
  "academic.summary",
  "academic.qa",
  "closure.conclusion",
  "closure.thank_you",
]);

const SEMANTIC_BY_SLIDE_TYPE: Record<string, SlideSemanticType> = {
  cover: "cover.title",
  agenda: "section.agenda",
  section: "section.transition",
  introduction: "content.paragraph",
  synthesis: "academic.summary",
  conclusion: "closure.conclusion",
  closing: "closure.thank_you",
  optional: "data.cards",
};

const SEMANTIC_BY_FORMAT: Record<string, SlideSemanticType> = {
  paragraph: "content.paragraph",
  bullets: "list.bullets",
  definition: "content.definition_list",
  comparison: "comparison.two_column",
  table: "data.table",
  timeline: "diagram.timeline",
  mixed: "content.info_box",
  quote: "content.quote",
  kpi: "data.kpi",
  process: "diagram.process",
  workflow: "diagram.workflow",
};

const KEYWORD_RULES: Array<[string[], SlideSemanticType]> = [
  [["plan", "agenda"], "section.agenda"],
  [["citation", "quote"], "content.quote"],
  [["definition", "concept"], "content.definition"],
  [["avantages", "advantages"], "list.pros_cons"],
  [["takeaway", "points cles"], "list.takeaways"],
  [["avant", "apres", "before", "after"], "comparison.before_after"],
  [["comparaison", "comparison"], "comparison.two_column"],
  [["tableau", "table"], "data.table"],
  [["matrice", "matrix"], "data.matrix"],
  [["kpi", "stat", "metric"], "data.kpi"],
  [["timeline", "chronologie"], "diagram.timeline"],
  [["process", "processus", "etapes"], "diagram.process"],
  [["workflow", "flux"], "diagram.workflow"],
  [["architecture", "system"], "business.architecture"],
  [["roadmap"], "business.roadmap"],
  [["probleme", "solution", "problem"], "business.problem_solution"],
  [["cas d'usage", "use case", "case study"], "business.use_case"],
  [["questions", "q&a", "faq"], "academic.qa"],
  [["conclusion", "synthese", "summary"], "closure.conclusion"],
  [["merci", "thank"], "closure.thank_you"],
];

const SEPARATOR_PATTERN = /\s*(?:\u2014|\u2013|:|-)\s*/u;
const MARKDOWN_LINK_PATTERN = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/gi;
const RAW_URL_PATTERN = /\b(?:https?:\/\/|www\.)\S+/gi;
const DOMAIN_REFERENCE_PATTERN = /\[(?:[a-z0-9-]+\.)+[a-z]{2,}\]/gi;
const URL_PAREN_PATTERN = /\((?:https?:\/\/|www\.)[^)]+\)/gi;
const SOURCE_TAIL_PATTERN =
  /\s*(?:\(|\[)?(?:source|sources?|reference|references?|selon)\s*[:\-][^)\]]*(?:\)|\])?/gi;

export function sanitizeDisplayText(value: string): string {
  return value
    .replace(MARKDOWN_LINK_PATTERN, "$1")
    .replace(DOMAIN_REFERENCE_PATTERN, "")
    .replace(URL_PAREN_PATTERN, "")
    .replace(RAW_URL_PATTERN, "")
    .replace(SOURCE_TAIL_PATTERN, "")
    .replace(/\butm_[^\s)]+/gi, "")
    .replace(/\(\s*\)/g, "")
    .replace(/\[\s*\]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeText(value: string): string {
  return sanitizeDisplayText(value).replace(/\s+/g, " ").trim();
}

export function getSlideLabel(slideType: Slide["slide_type"]): string {
  const labels: Record<string, string> = {
    cover: "Cover",
    agenda: "Agenda",
    section: "Section",
    introduction: "Intro",
    content: "Content",
    synthesis: "Summary",
    conclusion: "Conclusion",
    closing: "Closing",
    optional: "Optional",
  };

  return labels[slideType] ?? "Slide";
}

export function resolveSemanticType(slide: Slide): SlideSemanticType {
  const explicit = slide.semantic_type
    ?.trim()
    .toLowerCase() as SlideSemanticType;
  if (SEMANTIC_TYPES.has(explicit)) {
    return explicit;
  }

  const haystack = [
    slide.title,
    slide.purpose,
    ...slide.main_content.slice(0, 3),
  ]
    .map((value) => normalizeText(value).toLowerCase())
    .join(" ");

  for (const [keywords, semanticType] of KEYWORD_RULES) {
    if (keywords.some((keyword) => haystack.includes(keyword))) {
      return semanticType;
    }
  }

  return (
    SEMANTIC_BY_SLIDE_TYPE[slide.slide_type] ??
    SEMANTIC_BY_FORMAT[slide.content_format] ??
    "content.paragraph"
  );
}

export function resolveLayoutVariant(
  slide: Slide,
  semanticType: SlideSemanticType,
): string {
  if (slide.layout_variant?.trim()) {
    return slide.layout_variant;
  }

  const defaults: Partial<Record<SlideSemanticType, string>> = {
    "cover.title": "hero-center",
    "section.agenda": "agenda-grid",
    "section.transition": "section-band",
    "content.paragraph": "text-left-accent",
    "content.definition": "text-two-column",
    "content.definition_list": "cards-grid",
    "content.multi_paragraph": "text-two-column",
    "content.quote": "quote-focus",
    "content.info_box": "info-highlight",
    "list.bullets": "list-grid",
    "list.numbered": "list-numbered",
    "list.takeaways": "cards-grid",
    "list.pros_cons": "comparison-dual",
    "comparison.two_column": "comparison-dual",
    "comparison.before_after": "comparison-before-after",
    "comparison.concepts": "comparison-dual",
    "comparison.solutions": "comparison-dual",
    "data.table": "table-clean",
    "data.comparative_table": "table-clean",
    "data.matrix": "matrix-grid",
    "data.kpi": "stats-strip",
    "data.cards": "cards-grid",
    "visual.image_text": "visual-split",
    "visual.overlay": "visual-overlay",
    "visual.illustration": "visual-split",
    "visual.gallery": "visual-mosaic",
    "diagram.timeline": "timeline-horizontal",
    "diagram.process": "process-steps",
    "diagram.workflow": "workflow-flow",
    "diagram.orgchart": "workflow-flow",
    "diagram.cause_effect": "workflow-flow",
    "business.problem_solution": "problem-solution",
    "business.objectives_results": "objective-results",
    "business.use_case": "cards-grid",
    "business.roadmap": "roadmap-track",
    "business.architecture": "architecture-map",
    "business.product_feature": "visual-split",
    "academic.definition": "text-two-column",
    "academic.explanation": "text-left-accent",
    "academic.case_study": "cards-grid",
    "academic.summary": "cards-grid",
    "academic.qa": "qa-focus",
    "closure.conclusion": "closing-minimal",
    "closure.thank_you": "closing-minimal",
  };

  return defaults[semanticType] ?? "text-left-accent";
}

export function parseDefinitionItem(item: string): DefinitionItem | null {
  const cleaned = normalizeText(item).replace(/\*\*/g, "");
  const parts = cleaned.split(SEPARATOR_PATTERN);

  if (parts.length < 2) {
    return null;
  }

  const [term, ...rest] = parts;
  const explanation = rest.join(" - ").trim();

  if (!term.trim() || !explanation) {
    return null;
  }

  return {
    term: term.trim(),
    explanation,
  };
}

export function parseTableContent(items: string[]): string[][] | null {
  const rows = items
    .map((item) =>
      sanitizeDisplayText(item)
        .split("|")
        .map((cell) => normalizeText(cell)),
    )
    .filter((row) => row.length > 1 && row.some(Boolean));

  if (rows.length < 2) {
    return null;
  }

  const width = Math.max(...rows.map((row) => row.length));
  return rows.map((row) =>
    Array.from({ length: width }, (_, index) => row[index] ?? ""),
  );
}

export function stripBulletPrefix(item: string): string {
  return normalizeText(item.replace(/^\s*(?:[-*]|\d+[).:-]?)\s*/, ""));
}

export function getAgendaItems(slide: Slide): string[] {
  return slide.main_content.map(stripBulletPrefix).filter(Boolean).slice(0, 12);
}

export function getParagraphs(slide: Slide): string[] {
  return slide.main_content.map((item) => normalizeText(item)).filter(Boolean);
}

export function getDefinitionItems(slide: Slide): DefinitionItem[] {
  return slide.main_content
    .map(parseDefinitionItem)
    .filter((item): item is DefinitionItem => Boolean(item));
}

export function getComparisonItems(slide: Slide): ComparisonItem[] {
  return slide.main_content.map((item, index) => {
    const definition = parseDefinitionItem(item);
    return {
      title: definition?.term ?? `Axis ${index + 1}`,
      description: definition?.explanation ?? stripBulletPrefix(item),
    };
  });
}

export function getCardItems(slide: Slide): CardItem[] {
  return slide.main_content.map((item, index) => {
    const definition = parseDefinitionItem(item);
    return {
      title: definition?.term ?? `Point ${index + 1}`,
      description: definition?.explanation ?? stripBulletPrefix(item),
    };
  });
}

export function getMetricItems(slide: Slide): MetricItem[] {
  return slide.main_content.map((item, index) => {
    const cleaned = stripBulletPrefix(item);
    const parts = cleaned.split(SEPARATOR_PATTERN).filter(Boolean);
    const valueMatch = cleaned.match(
      /(\d+(?:[.,]\d+)?\s?(?:%|x|k|K|m|M|md|Md|million(?:s)?|milliard(?:s)?|trillion(?:s)?|ms|s|ans|jours|€|\$))/i,
    );
    const label = parts[0] ?? `Metric ${index + 1}`;
    const note = parts.slice(1).join(" - ") || cleaned;

    return {
      value: valueMatch?.[1] ?? `${index + 1}`,
      label: label.length > 72 ? `${label.slice(0, 69)}...` : label,
      note: note.length > 180 ? `${note.slice(0, 177)}...` : note,
    };
  });
}

export function splitLeadAndSupporting(slide: Slide) {
  const paragraphs = getParagraphs(slide);
  const [lead = slide.purpose || slide.title, ...supporting] = paragraphs;
  return { lead, supporting };
}
