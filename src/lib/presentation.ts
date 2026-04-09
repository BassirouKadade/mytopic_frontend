import type { Slide } from "@/services/api";

type ContentBlock =
  | { type: "bullet"; value: string }
  | { type: "definition"; term: string; explanation: string }
  | { type: "paragraph"; value: string };

const SEPARATOR_PATTERN = /\s*(?:\u2014|\u2013|:|-)\s*/u;

function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function getSlideLabel(slideType: Slide["slide_type"]): string {
  const labels: Record<string, string> = {
    cover: "Ouverture",
    agenda: "Plan",
    introduction: "Contexte",
    content: "Developpement",
    synthesis: "Synthese",
    conclusion: "Conclusion",
    optional: "Complement",
  };

  return labels[slideType] ?? "Slide";
}

export function parseDefinitionItem(item: string): {
  term: string;
  explanation: string;
} | null {
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
    .map((item) => item.split("|").map((cell) => normalizeText(cell)))
    .filter((row) => row.length > 1 && row.some(Boolean));

  if (rows.length < 2) {
    return null;
  }

  const width = Math.max(...rows.map((row) => row.length));
  return rows.map((row) =>
    Array.from({ length: width }, (_, index) => row[index] ?? "")
  );
}

export function parseMixedContent(items: string[]): ContentBlock[] {
  return items
    .map((item) => normalizeText(item))
    .filter(Boolean)
    .map((item) => {
      if (item.startsWith("- ") || item.startsWith("* ")) {
        return { type: "bullet", value: item.slice(2).trim() } satisfies ContentBlock;
      }

      const definition = parseDefinitionItem(item);
      if (definition) {
        return { type: "definition", ...definition } satisfies ContentBlock;
      }

      return { type: "paragraph", value: item } satisfies ContentBlock;
    });
}

export function getAgendaItems(slide: Slide): string[] {
  return slide.main_content
    .map((item) => {
      const definition = parseDefinitionItem(item);
      return definition ? definition.term : normalizeText(item.replace(/^[-*]\s*/, ""));
    })
    .filter(Boolean)
    .slice(0, 6);
}

export function getTakeawayCards(slide: Slide): string[] {
  const preferred = slide.main_content
    .map((item) => {
      const definition = parseDefinitionItem(item);
      return definition ? `${definition.term}: ${definition.explanation}` : normalizeText(item);
    })
    .filter(Boolean);

  return preferred.slice(0, 4);
}
