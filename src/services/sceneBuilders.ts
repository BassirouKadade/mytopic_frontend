import type { Slide, EditorScene, SlideElement } from "@/services/api";
import {
  DEFAULT_SCENE_WIDTH,
  DEFAULT_SCENE_HEIGHT,
  createTextElement,
  createShapeElement,
  createListElement,
  createTableElement,
  createMediaElement,
  createBackgroundElement,
} from "@/services/api";

import { resolveSemanticType } from "@/presentation/content";
import {
  getAgendaItems,
  getParagraphs,
  getDefinitionItems,
  getComparisonItems,
  getCardItems,
  getMetricItems,
  stripBulletPrefix,
  parseTableContent,
  splitLeadAndSupporting,
} from "@/presentation/content";

import type { SlideSemanticType } from "@/presentation/types";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function cleanText(text: string): string {
  return text.replace(/\*{1,2}([^*]+)\*{1,2}/g, "$1").trim();
}

function scene(elements: SlideElement[], background = "#ffffff"): EditorScene {
  return {
    version: "1.2",
    width: DEFAULT_SCENE_WIDTH,
    height: DEFAULT_SCENE_HEIGHT,
    background,
    elements,
  };
}

function ct(slide: Slide): Slide {
  return {
    ...slide,
    title: cleanText(slide.title),
    purpose: cleanText(slide.purpose),
    main_content: slide.main_content.map(cleanText),
  };
}

type BuilderFn = (slide: Slide, index: number) => EditorScene;

const SCENE_W = 1600;
const SCENE_H = 900;
const TITLE_COLOR = "#111827";
const PRESENTATION_FONT = "Geist Variable, sans-serif";
const NAVY = TITLE_COLOR;
const GREEN = "#078354";
const INK = "#111827";
const BODY = "#374151";
const MUTED = "#f4f4f5";
const BLUE_DOT = "#174b83";
const CARD_BORDER = "#dbe3ec";
const SLIDE_PAD_X = 120;
const IMAGE_FRAME = "#eef3f7";

function estimateLineCount(text: string, width: number, fontSize: number) {
  const charsPerLine = Math.max(12, Math.floor(width / (fontSize * 0.52)));
  return Math.max(1, Math.ceil(text.trim().length / charsPerLine));
}

function shouldKeepImage(semantic: string): boolean {
  return (
    semantic === "cover.title" ||
    semantic.startsWith("visual.") ||
    semantic === "business.product_feature"
  );
}

function hasUsableVisualPrompt(slide: Slide): boolean {
  const prompt = (slide.suggested_visual ?? "").trim().toLowerCase();
  return (
    prompt.length >= 24 &&
    prompt !== "null" &&
    prompt !== "none" &&
    prompt !== "n/a" &&
    !prompt.includes("no visual") &&
    !prompt.includes("aucun visuel")
  );
}

function shouldUseImageForSlide(slide: Slide, semantic: string): boolean {
  if (slide.slide_type === "agenda" || semantic === "section.agenda") {
    return false;
  }

  if (shouldKeepImage(semantic)) {
    return true;
  }

  if (!hasUsableVisualPrompt(slide)) {
    return false;
  }

  if (
    semantic.startsWith("data.") ||
    semantic.startsWith("diagram.") ||
    semantic.startsWith("list.") ||
    semantic === "section.transition" ||
    semantic === "content.quote" ||
    semantic === "academic.qa" ||
    semantic === "closure.conclusion" ||
    semantic === "closure.thank_you"
  ) {
    return false;
  }

  return (
    semantic === "content.paragraph" ||
    semantic === "content.multi_paragraph" ||
    semantic === "content.info_box" ||
    semantic === "academic.explanation" ||
    semantic === "academic.case_study" ||
    semantic === "business.use_case"
  );
}

function addFooter(els: SlideElement[], index: number): void {
  els.push(
    createTextElement(`page-${index}`, `${index + 1}`, 80, {
      x: 1440,
      y: 805,
      width: 50,
      height: 26,
      fontSize: 18,
      fontWeight: 500,
      align: "center",
      color: "#111827",
    }),
  );

  [0, 1, 2].forEach((dot) => {
    els.push(
      createShapeElement(`dot-${index}-${dot}`, 81 + dot, {
        x: 1410 + dot * 32,
        y: 842,
        width: 18,
        height: 18,
        shape: "ellipse",
        fill: BLUE_DOT,
        stroke: "transparent",
        strokeWidth: 0,
      }),
    );
  });
}

function addSoftRings(els: SlideElement[], index: number): void {
  els.push(
    createShapeElement(`ring-top-${index}`, 1, {
      x: 1030,
      y: -210,
      width: 520,
      height: 520,
      shape: "ellipse",
      fill: "transparent",
      stroke: "#d7e6f2",
      strokeWidth: 70,
      opacity: 0.75,
    }),
    createShapeElement(`ring-bottom-${index}`, 2, {
      x: 520,
      y: 810,
      width: 420,
      height: 420,
      shape: "ellipse",
      fill: "transparent",
      stroke: "#d7e6f2",
      strokeWidth: 62,
      opacity: 0.75,
    }),
  );
}

function compactText(items: string[], max = 4): string {
  return items
    .slice(0, max)
    .map(stripBulletPrefix)
    .join("\n");
}

function splitCoverMeta(items: string[]): string[] {
  return items
    .flatMap((item) => item.split(/\s+\|\s+|[•·]/g))
    .map((item) => cleanText(item).replace(/^(author|auteur|date|cours|course|institution)\s*:\s*/i, ""))
    .filter((item) => item.length > 0)
    .slice(0, 4);
}

function getTextHeight(text: string, width: number, fontSize: number, max = 190) {
  return Math.min(
    max,
    Math.ceil(estimateLineCount(text, width, fontSize) * fontSize * 1.18 + 18),
  );
}

function getImageSide(index: number): "left" | "right" {
  return index % 2 === 0 ? "right" : "left";
}

function addEditorialImageBlock(
  els: SlideElement[],
  index: number,
  side: "left" | "right",
  options?: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    fit?: "cover" | "contain";
    alt?: string;
  },
): void {
  const x = options?.x ?? (side === "left" ? 112 : 928);
  const y = options?.y ?? 92;
  const width = options?.width ?? 552;
  const height = options?.height ?? 704;
  const framePad = 18;

  els.push(
    createShapeElement(`image-frame-${index}`, 3, {
      x: x - framePad,
      y: y - framePad,
      width: width + framePad * 2,
      height: height + framePad * 2,
      shape: "rect",
      fill: IMAGE_FRAME,
      stroke: "#d9e3ec",
      strokeWidth: 1,
      cornerRadius: 24,
    }),
    createShapeElement(`image-accent-${index}`, 4, {
      x: side === "left" ? x + width + 34 : x - 50,
      y: y + 34,
      width: 8,
      height: 156,
      shape: "rect",
      fill: GREEN,
      stroke: "transparent",
      strokeWidth: 0,
      cornerRadius: 8,
    }),
    createMediaElement(`media-${index}`, 5, {
      x,
      y,
      width,
      height,
      mediaKind: "image",
      fit: options?.fit ?? "cover",
      borderRadius: 18,
      src: "",
      alt: options?.alt || "Visual",
      background: "#e5e7eb",
    }),
  );
}

function finalizeScene(
  draft: EditorScene,
  index: number,
  semantic: string,
  slide: Slide,
): EditorScene {
  const keepImage = shouldUseImageForSlide(slide, semantic);
  let elements = draft.elements
    .filter((element) => keepImage || element.type !== "media")
    .map((element) => {
      if (element.type === "background") {
        return {
          ...element,
          fill: "#ffffff",
          accent: "#ffffff",
          pattern: "none" as const,
        };
      }
      if (element.type === "media") {
        return {
          ...element,
          alt: element.alt || slide.suggested_visual || slide.title,
        };
      }
      if (element.type === "text") {
        const isMainTitle = element.id.startsWith("title-");
        const keepSmall =
          element.id.startsWith("page-") ||
          element.id.startsWith("eyebrow-") ||
          element.id.startsWith("attr-");
        const fontSize = keepSmall
          ? element.fontSize
          : Math.max(element.fontSize, isMainTitle ? 48 : 18);
        const lineHeight = element.lineHeight || 1.2;
        const lineCount = estimateLineCount(element.text, element.width, fontSize);
        const minHeight = Math.ceil(lineCount * fontSize * lineHeight + 14);
        return {
          ...element,
          fontFamily: PRESENTATION_FONT,
          color: isMainTitle ? TITLE_COLOR : element.color,
          fontSize,
          height: Math.max(element.height, minHeight),
        };
      }
      if (element.type === "list") {
        return {
          ...element,
          fontFamily: PRESENTATION_FONT,
          fontSize: Math.max(element.fontSize, 22),
          height: Math.max(element.height, 220),
        };
      }
      if (element.type === "table") {
        return {
          ...element,
          textColor: element.textColor || BODY,
          fontSize: Math.max(element.fontSize, 26),
        };
      }
      if (element.type === "shape" && element.label) {
        return {
          ...element,
          fontSize: Math.max(element.fontSize, 16),
        };
      }
      return element;
    });

  const titleElement = elements.find(
    (element) => element.type === "text" && element.id.startsWith("title-"),
  );
  if (titleElement) {
    const minContentY = titleElement.y + titleElement.height + 38;
    elements = elements.map((element) => {
      if (
        element.id === titleElement.id ||
        element.type === "media" ||
        element.id.startsWith("image-frame-") ||
        element.id.startsWith("image-accent-") ||
        element.id.startsWith("page-") ||
        element.id.startsWith("dot-") ||
        element.y <= titleElement.y ||
        element.y >= minContentY
      ) {
        return element;
      }
      return { ...element, y: minContentY };
    });
  }

  if (!elements.some((element) => element.id === `page-${index}`)) {
    addFooter(elements, index);
  }

  return {
    ...draft,
    background: "#ffffff",
    elements: elements.map((element, elementIndex) => ({
      ...element,
      zIndex: elementIndex,
    })),
  };
}

/* ------------------------------------------------------------------ */
/*  Builder: Cover                                                     */
/* ------------------------------------------------------------------ */

function buildCoverScene(slide: Slide, index: number): EditorScene {
  const els: SlideElement[] = [];
  const hasImage = shouldKeepImage(slide.semantic_type);
  const titleX = hasImage ? 770 : 220;
  const titleWidth = hasImage ? 650 : 1160;
  const titleFont =
    slide.title.length > 96 ? 46 : slide.title.length > 68 ? 54 : 64;
  const titleLines = estimateLineCount(slide.title, titleWidth, titleFont);
  const titleHeight = Math.min(300, Math.ceil(titleLines * titleFont * 1.12));
  const titleY = hasImage ? 270 : 250;
  const subtitleY = titleY + titleHeight + 28;
  const metaItems = splitCoverMeta(slide.main_content);
  const metaTop = 642;
  const metaCardWidth = hasImage ? 300 : 270;
  const metaCardGap = 18;

  els.push(
    createBackgroundElement(`bg-${index}`, 0, {
      x: 0,
      y: 0,
      width: 1600,
      height: 900,
      fill: "#ffffff",
      accent: "#ffffff",
      pattern: "none",
    }),
  );

  if (hasImage) {
    addEditorialImageBlock(els, index, "left", {
      x: 96,
      y: 78,
      width: 568,
      height: 744,
      fit: "cover",
      alt: slide.suggested_visual ?? slide.title,
    });
  }

  els.push(
    createShapeElement(`cover-kicker-rule-${index}`, 2, {
      x: titleX,
      y: 150,
      width: 110,
      height: 6,
      shape: "rect",
      fill: GREEN,
      stroke: "transparent",
      strokeWidth: 0,
      cornerRadius: 6,
    }),
    createShapeElement(`tag-${index}`, 3, {
      x: titleX,
      y: 174,
      width: 148,
      height: 34,
      shape: "rect",
      fill: "#ffffff",
      stroke: GREEN,
      strokeWidth: 1.2,
      cornerRadius: 4,
      label: "PRESENTATION",
      textColor: GREEN,
      fontSize: 14,
      fontWeight: 700,
    }),
  );

  els.push(
    createTextElement(`title-${index}`, slide.title, 2, {
      x: titleX,
      y: titleY,
      width: titleWidth,
      height: titleHeight,
      fontSize: titleFont,
      fontWeight: 800,
      align: "left",
      color: INK,
      lineHeight: 1.08,
    }),
  );

  const subtitle = slide.purpose || "";
  if (subtitle) {
    els.push(
      createTextElement(`subtitle-${index}`, subtitle, 3, {
        x: titleX,
        y: subtitleY,
        width: titleWidth,
        height: 88,
        fontSize: 25,
        fontWeight: 400,
        align: "left",
        color: "#4b5563",
        lineHeight: 1.25,
      }),
    );
  }

  const metaLabels = ["Sujet", "Auteur", "Date", "Contexte"];
  const fallbackDate = new Date().toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const normalizedMeta =
    metaItems.length > 0
      ? metaItems
      : [slide.title, "Nom Prenom", fallbackDate, "Presentation academique"];

  normalizedMeta.slice(0, hasImage ? 2 : 4).forEach((item, i) => {
    const x = hasImage
      ? titleX + i * (metaCardWidth + metaCardGap)
      : titleX + i * (metaCardWidth + metaCardGap);
    const y = hasImage ? metaTop : 650;
    els.push(
      createShapeElement(`meta-card-${index}-${i}`, 10 + i * 3, {
        x,
        y,
        width: metaCardWidth,
        height: 92,
        shape: "rect",
        fill: "#f8fafc",
        stroke: CARD_BORDER,
        strokeWidth: 1,
        cornerRadius: 14,
      }),
      createTextElement(`meta-label-${index}-${i}`, metaLabels[i] ?? "Info", 11 + i * 3, {
        x: x + 22,
        y: y + 18,
        width: metaCardWidth - 44,
        height: 20,
        fontSize: 13,
        fontWeight: 800,
        color: GREEN,
        lineHeight: 1,
      }),
      createTextElement(`meta-value-${index}-${i}`, item, 12 + i * 3, {
        x: x + 22,
        y: y + 43,
        width: metaCardWidth - 44,
        height: 34,
        fontSize: 18,
        fontWeight: 600,
        color: "#111827",
        lineHeight: 1.15,
      }),
    );
  });

  return scene(els);
}

/* ------------------------------------------------------------------ */
/*  Builder: Agenda                                                    */
/* ------------------------------------------------------------------ */

function buildAgendaScene(slide: Slide, index: number): EditorScene {
  const els: SlideElement[] = [];

  els.push(
    createBackgroundElement(`bg-${index}`, 0, {
      x: 0,
      y: 0,
      width: SCENE_W,
      height: SCENE_H,
      fill: "#ffffff",
      accent: "#ffffff",
      pattern: "none",
    }),
  );

  addSoftRings(els, index);

  els.push(
    createTextElement(`title-${index}`, "Sommaire", 5, {
      x: 520,
      y: 86,
      width: 560,
      height: 90,
      fontSize: 74,
      fontWeight: 400,
      align: "center",
      color: "#000000",
      lineHeight: 1.05,
    }),
  );

  els.push(
    createShapeElement(`accent-a-${index}`, 6, {
      x: 1260,
      y: 96,
      width: 90,
      height: 5,
      shape: "rect",
      fill: GREEN,
      stroke: "transparent",
      strokeWidth: 0,
      cornerRadius: 2,
      rotation: -15,
    }),
    createShapeElement(`accent-b-${index}`, 7, {
      x: 1256,
      y: 116,
      width: 90,
      height: 5,
      shape: "rect",
      fill: GREEN,
      stroke: "transparent",
      strokeWidth: 0,
      cornerRadius: 2,
      rotation: 8,
    }),
    createShapeElement(`accent-c-${index}`, 8, {
      x: 1254,
      y: 138,
      width: 82,
      height: 5,
      shape: "rect",
      fill: GREEN,
      stroke: "transparent",
      strokeWidth: 0,
      cornerRadius: 2,
      rotation: 24,
    }),
  );

  const items = getAgendaItems(slide).slice(0, 8);
  const left = items.slice(0, 5);
  const right = items.slice(5, 8);
  const rowH = 76;
  const gap = 16;
  const startY = 220;

  [...left.map((item, i) => ({ item, i, col: 0 })), ...right.map((item, i) => ({ item, i: i + 5, col: 1 }))].forEach(
    ({ item, i, col }) => {
      const baseX = col === 0 ? 170 : 850;
      const y = startY + (col === 0 ? i : i - 5) * (rowH + gap);
      els.push(
        createShapeElement(`agenda-num-${index}-${i}`, 10 + i * 3, {
          x: baseX,
          y,
          width: 110,
          height: rowH,
          shape: "rect",
          fill: MUTED,
          stroke: "transparent",
          strokeWidth: 0,
          cornerRadius: 0,
          label: String(i + 1).padStart(2, "0"),
          textColor: "#111827",
          fontSize: 27,
          fontWeight: 400,
        }),
        createShapeElement(`agenda-label-bg-${index}-${i}`, 11 + i * 3, {
          x: baseX + 126,
          y,
          width: 500,
          height: rowH,
          shape: "rect",
          fill: MUTED,
          stroke: "transparent",
          strokeWidth: 0,
          cornerRadius: 0,
        }),
        createTextElement(`agenda-label-${index}-${i}`, item, 12 + i * 3, {
          x: baseX + 144,
          y: y + 20,
          width: 456,
          height: 42,
          fontSize: 27,
          fontWeight: 400,
          color: "#111827",
          lineHeight: 1.15,
        }),
      );
    },
  );

  addFooter(els, index);

  return scene(els);
}

/* ------------------------------------------------------------------ */
/*  Builder: Section Transition                                        */
/* ------------------------------------------------------------------ */

function buildSectionScene(slide: Slide, index: number): EditorScene {
  const els: SlideElement[] = [];
  const titleFont =
    slide.title.length > 70 ? 52 : slide.title.length > 46 ? 60 : 68;
  const titleLines = estimateLineCount(slide.title, 1080, titleFont);
  const titleHeight = Math.ceil(titleLines * titleFont * 1.12);

  els.push(
    createBackgroundElement(`bg-${index}`, 0, {
      x: 0,
      y: 0,
      width: 1600,
      height: 900,
      fill: "#ffffff",
      accent: "#ffffff",
      pattern: "none",
    }),
  );

  els.push(
    createTextElement(`title-${index}`, slide.title, 2, {
      x: 260,
      y: 300,
      width: 1080,
      height: titleHeight,
      fontSize: titleFont,
      fontWeight: 800,
      align: "center",
      color: "#111827",
      lineHeight: 1.12,
    }),
  );

  if (slide.purpose) {
    els.push(
      createTextElement(`purpose-${index}`, slide.purpose, 3, {
        x: 240,
        y: 300 + titleHeight + 42,
        width: 1120,
        height: 92,
        fontSize: 28,
        fontWeight: 400,
        align: "center",
        color: "#475569",
      }),
    );
  }

  return scene(els, "#ffffff");
}

/* ------------------------------------------------------------------ */
/*  Builder: Paragraph (default fallback)                              */
/* ------------------------------------------------------------------ */

function buildParagraphScene(slide: Slide, index: number): EditorScene {
  const els: SlideElement[] = [];

  els.push(
    createBackgroundElement(`bg-${index}`, 0, {
      x: 0,
      y: 0,
      width: SCENE_W,
      height: SCENE_H,
      fill: "#ffffff",
      accent: "#ffffff",
      pattern: "none",
    }),
  );

  addSoftRings(els, index);

  els.push(
    createTextElement(`title-${index}`, slide.title, 4, {
      x: 170,
      y: 210,
      width: 980,
      height: 130,
      fontSize: 68,
      fontWeight: 800,
      color: NAVY,
      lineHeight: 1.05,
    }),
  );

  const paragraphs = getParagraphs(slide).slice(0, 3);
  paragraphs.forEach((p, i) => {
    els.push(
      createTextElement(`para-${index}-${i}`, p, 5 + i, {
        x: 175,
        y: 365 + i * 122,
        width: 820,
        height: 105,
        fontSize: 31,
        fontWeight: 400,
        color: "#111111",
        lineHeight: 1.18,
      }),
    );
  });

  addFooter(els, index);

  return scene(els);
}

/* ------------------------------------------------------------------ */
/*  Builder: Definition                                                */
/* ------------------------------------------------------------------ */

function buildDefinitionScene(slide: Slide, index: number): EditorScene {
  const defs = getDefinitionItems(slide);
  if (defs.length === 0) return buildParagraphScene(slide, index);

  const els: SlideElement[] = [];
  els.push(
    createBackgroundElement(`bg-${index}`, 0, {
      x: 0,
      y: 0,
      width: SCENE_W,
      height: SCENE_H,
      fill: "#ffffff",
      accent: "#ffffff",
      pattern: "none",
    }),
  );

  els.push(
    createTextElement(`title-${index}`, slide.title, 4, {
      x: 170,
      y: 82,
      width: 1160,
      height: 96,
      fontSize: 54,
      fontWeight: 800,
      color: "#111827",
      lineHeight: 1.12,
    }),
  );

  const items = defs.slice(0, 4);
  if (items.length === 1) {
    const def = items[0];
    els.push(
      createShapeElement(`def-hero-${index}`, 5, {
        x: 170,
        y: 255,
        width: 1180,
        height: 330,
        shape: "rect",
        fill: "#f8fafc",
        cornerRadius: 24,
        stroke: CARD_BORDER,
        strokeWidth: 1,
      }),
      createShapeElement(`def-hero-accent-${index}`, 6, {
        x: 170,
        y: 255,
        width: 14,
        height: 330,
        shape: "rect",
        fill: "#f59e0b",
        cornerRadius: 14,
        stroke: "transparent",
        strokeWidth: 0,
      }),
      createTextElement(`term-${index}-0`, def.term, 7, {
        x: 235,
        y: 310,
        width: 430,
        height: 120,
        fontSize: 38,
        fontWeight: 850,
        color: "#111827",
        lineHeight: 1.1,
      }),
      createShapeElement(`def-divider-${index}`, 8, {
        x: 700,
        y: 310,
        width: 2,
        height: 220,
        shape: "rect",
        fill: "#dbe3ec",
        stroke: "transparent",
        strokeWidth: 0,
      }),
      createTextElement(`expl-${index}-0`, def.explanation, 9, {
        x: 750,
        y: 300,
        width: 520,
        height: 250,
        fontSize: 34,
        fontWeight: 500,
        color: "#263241",
        lineHeight: 1.22,
      }),
    );

    addFooter(els, index);
    return scene(els);
  }

  items.forEach((def, i) => {
    const cols = items.length <= 2 ? items.length : 2;
    const cardW = cols === 1 ? 1180 : 570;
    const cardH = items.length <= 2 ? 230 : 210;
    const gapX = 40;
    const gapY = 34;
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = 170 + col * (cardW + gapX);
    const y = (items.length <= 2 ? 285 : 235) + row * (cardH + gapY);
    els.push(
      createShapeElement(`def-card-${index}-${i}`, 5 + i * 4, {
        x,
        y,
        width: cardW,
        height: cardH,
        shape: "rect",
        fill: "#f8fafc",
        cornerRadius: 18,
        stroke: CARD_BORDER,
        strokeWidth: 1,
      }),
      createShapeElement(`def-accent-${index}-${i}`, 6 + i * 4, {
        x,
        y,
        width: 12,
        height: cardH,
        shape: "rect",
        fill: i === items.length - 1 ? "#f59e0b" : BLUE_DOT,
        cornerRadius: 12,
        stroke: "transparent",
        strokeWidth: 0,
      }),
      createTextElement(`term-${index}-${i}`, def.term, 7 + i * 4, {
        x: x + 42,
        y: y + 34,
        width: cardW - 84,
        height: 58,
        fontSize: items.length <= 2 ? 32 : 27,
        fontWeight: 850,
        color: "#111827",
        lineHeight: 1.12,
      }),
      createTextElement(`expl-${index}-${i}`, def.explanation, 8 + i * 4, {
        x: x + 42,
        y: y + 104,
        width: cardW - 84,
        height: cardH - 128,
        fontSize: items.length <= 2 ? 29 : 24,
        fontWeight: 450,
        color: "#263241",
        lineHeight: 1.22,
      }),
    );
  });

  addFooter(els, index);

  return scene(els);
}

/* ------------------------------------------------------------------ */
/*  Builder: Quote                                                     */
/* ------------------------------------------------------------------ */

function buildQuoteScene(slide: Slide, index: number): EditorScene {
  const els: SlideElement[] = [];
  const { lead, supporting } = splitLeadAndSupporting(slide);

  els.push(
    createBackgroundElement(`bg-${index}`, 0, {
      x: 0,
      y: 0,
      width: 1600,
      height: 900,
      fill: "#ffffff",
      accent: "#e7e5e4",
      pattern: "none",
    }),
  );

  els.push(
    createShapeElement(`deco-${index}`, 1, {
      x: 120,
      y: 160,
      width: 100,
      height: 100,
      shape: "ellipse",
      fill: "rgba(15,118,110,0.08)",
      stroke: "transparent",
      strokeWidth: 0,
    }),
  );

  els.push(
    createTextElement(`quote-${index}`, lead, 2, {
      x: 160,
      y: 260,
      width: 1280,
      height: 220,
      fontSize: 36,
      fontWeight: 700,
      fontStyle: "italic",
      align: "center",
      color: "#0f172a",
      lineHeight: 1.4,
    }),
  );

  const attribution = supporting[0] || slide.purpose || "";
  if (attribution) {
    els.push(
      createTextElement(`attr-${index}`, attribution, 3, {
        x: 400,
        y: 520,
        width: 800,
        height: 60,
        fontSize: 20,
        fontWeight: 500,
        align: "center",
        color: "#64748b",
      }),
    );
  }

  if (supporting.length > 1) {
    els.push(
      createTextElement(`support-${index}`, supporting.slice(1).join(" "), 4, {
        x: 200,
        y: 610,
        width: 1200,
        height: 80,
        fontSize: 20,
        fontWeight: 400,
        align: "center",
        color: "#94a3b8",
      }),
    );
  }

  return scene(els, "#ffffff");
}

/* ------------------------------------------------------------------ */
/*  Builder: Bullet / Numbered List                                    */
/* ------------------------------------------------------------------ */

function buildBulletListScene(slide: Slide, index: number): EditorScene {
  const els: SlideElement[] = [];
  const semantic = resolveSemanticType(slide);
  const ordered = semantic === "list.numbered";

  els.push(
    createBackgroundElement(`bg-${index}`, 0, {
      x: 0,
      y: 0,
      width: SCENE_W,
      height: SCENE_H,
      fill: "#ffffff",
      accent: "#ffffff",
      pattern: "none",
    }),
  );
  addSoftRings(els, index);

  els.push(
    createTextElement(`title-${index}`, slide.title, 4, {
      x: 170,
      y: 90,
      width: 1160,
      height: 104,
      fontSize: 56,
      fontWeight: 800,
      color: NAVY,
      lineHeight: 1.08,
    }),
  );

  const items = slide.main_content.slice(0, 7).map(stripBulletPrefix);
  els.push(
    createListElement(`list-${index}`, 5, {
      x: 210,
      y: 245,
      width: 1120,
      height: 560,
      ordered,
      items,
      fontSize: 34,
      fontWeight: 500,
      color: "#111827",
      lineHeight: 1.42,
    }),
  );

  addFooter(els, index);

  return scene(els);
}

/* ------------------------------------------------------------------ */
/*  Builder: Comparison / Pros-Cons                                    */
/* ------------------------------------------------------------------ */

function buildComparisonScene(slide: Slide, index: number): EditorScene {
  const els: SlideElement[] = [];

  els.push(
    createBackgroundElement(`bg-${index}`, 0, {
      x: 0,
      y: 0,
      width: SCENE_W,
      height: SCENE_H,
      fill: "#ffffff",
      accent: "#ffffff",
      pattern: "none",
    }),
  );

  els.push(
    createTextElement(`title-${index}`, slide.title, 1, {
      x: 170,
      y: 82,
      width: 1160,
      height: 120,
      fontSize: 54,
      fontWeight: 800,
      color: "#111827",
      lineHeight: 1.15,
    }),
  );

  const items = getComparisonItems(slide).slice(0, 4);
  const left = items.slice(0, Math.ceil(items.length / 2));
  const right = items.slice(Math.ceil(items.length / 2));

  [
    { label: "Arguments POUR", items: left, x: 170, color: BLUE_DOT },
    { label: "Arguments CONTRE", items: right, x: 810, color: "#f59e0b" },
  ].forEach((col, colIndex) => {
    els.push(
      createShapeElement(`compare-card-${index}-${colIndex}`, 2 + colIndex * 4, {
        x: col.x,
        y: 275,
        width: 560,
        height: 390,
        shape: "rect",
        fill: "#ffffff",
        stroke: CARD_BORDER,
        strokeWidth: 1,
        cornerRadius: 12,
      }),
      createShapeElement(`compare-accent-${index}-${colIndex}`, 3 + colIndex * 4, {
        x: col.x + 28,
        y: 310,
        width: 6,
        height: 300,
        shape: "rect",
        fill: col.color,
        stroke: "transparent",
        strokeWidth: 0,
        cornerRadius: 6,
      }),
      createTextElement(`compare-label-${index}-${colIndex}`, col.label, 4 + colIndex * 4, {
        x: col.x + 56,
        y: 308,
        width: 440,
        height: 34,
        fontSize: 18,
        fontWeight: 800,
        align: "left",
        color: col.color,
        lineHeight: 1.1,
      }),
      createListElement(`compare-list-${index}-${colIndex}`, 5 + colIndex * 4, {
        x: col.x + 68,
        y: 370,
        width: 420,
        height: 230,
        ordered: false,
        items: col.items.map((item) =>
          [item.title, item.description].filter(Boolean).join(" - "),
        ),
        fontSize: 22,
        fontWeight: 500,
        color: "#334155",
        lineHeight: 1.38,
      }),
    );
  });

  addFooter(els, index);

  return scene(els);
}

/* ------------------------------------------------------------------ */
/*  Builder: Table                                                     */
/* ------------------------------------------------------------------ */

function buildTableScene(slide: Slide, index: number): EditorScene {
  const rows = parseTableContent(slide.main_content);
  if (!rows || rows.length < 2) return buildCardsScene(slide, index);

  const els: SlideElement[] = [];

  els.push(
    createBackgroundElement(`bg-${index}`, 0, {
      x: 0,
      y: 0,
      width: SCENE_W,
      height: SCENE_H,
      fill: "#ffffff",
      accent: "#ffffff",
      pattern: "none",
    }),
  );

  els.push(
    createTextElement(`title-${index}`, slide.title, 0, {
      x: 170,
      y: 82,
      width: 1160,
      height: 100,
      fontSize: 56,
      fontWeight: 800,
      color: NAVY,
      lineHeight: 1.08,
    }),
  );

  els.push(
    createTableElement(`table-${index}`, 1, {
      x: 170,
      y: 230,
      width: 1260,
      height: 560,
      headers: rows[0],
      rows: rows.slice(1),
      headerFill: "#e2e8f0",
      borderColor: "#cbd5e1",
      textColor: "#1e293b",
      fontSize: 28,
    }),
  );

  return scene(els);
}

/* ------------------------------------------------------------------ */
/*  Builder: KPI / Metrics                                             */
/* ------------------------------------------------------------------ */

function buildKpiScene(slide: Slide, index: number): EditorScene {
  const els: SlideElement[] = [];

  els.push(
    createBackgroundElement(`bg-${index}`, 0, {
      x: 0,
      y: 0,
      width: SCENE_W,
      height: SCENE_H,
      fill: "#ffffff",
      accent: "#ffffff",
      pattern: "none",
    }),
  );

  els.push(
    createTextElement(`title-${index}`, slide.title, 1, {
      x: 170,
      y: 82,
      width: 1160,
      height: 130,
      fontSize: 54,
      fontWeight: 800,
      color: "#111827",
      lineHeight: 1.16,
    }),
  );

  const metrics = getMetricItems(slide).slice(0, 4);
  metrics.forEach((m, i) => {
    const positions = [
      { x: 170, y: 245 },
      { x: 810, y: 245 },
      { x: 170, y: 495 },
      { x: 810, y: 495 },
    ];
    const pos = positions[i] ?? positions[0];
    els.push(
      createShapeElement(`metric-card-${index}-${i}`, 2 + i * 5, {
        x: pos.x,
        y: pos.y,
        width: 560,
        height: 190,
        shape: "rect",
        fill: "#ffffff",
        stroke: CARD_BORDER,
        strokeWidth: 1,
        cornerRadius: 10,
      }),
      createShapeElement(`metric-accent-${index}-${i}`, 3 + i * 5, {
        x: pos.x,
        y: pos.y,
        width: 8,
        height: 190,
        shape: "rect",
        fill: i % 2 === 0 ? BLUE_DOT : "#f59e0b",
        stroke: "transparent",
        strokeWidth: 0,
        cornerRadius: 8,
      }),
      createTextElement(`metric-value-${index}-${i}`, m.value || "--", 4 + i * 5, {
        x: pos.x + 40,
        y: pos.y + 28,
        width: 480,
        height: 62,
        fontSize: 48,
        fontWeight: 800,
        align: "left",
        color: "#111827",
        lineHeight: 1.05,
      }),
      createTextElement(`metric-label-${index}-${i}`, m.label, 5 + i * 5, {
        x: pos.x + 42,
        y: pos.y + 98,
        width: 470,
        height: 34,
        fontSize: 21,
        fontWeight: 800,
        align: "left",
        color: "#334155",
        lineHeight: 1.15,
      }),
    );

    if (m.note) {
      els.push(
        createTextElement(`metric-note-${index}-${i}`, m.note, 6 + i * 5, {
          x: pos.x + 42,
          y: pos.y + 136,
          width: 470,
          height: 44,
          fontSize: 18,
          fontWeight: 400,
          align: "left",
          color: "#64748b",
          lineHeight: 1.2,
        }),
      );
    }
  });

  addFooter(els, index);

  return scene(els);
}

/* ------------------------------------------------------------------ */
/*  Builder: Cards                                                     */
/* ------------------------------------------------------------------ */

function buildCardsScene(slide: Slide, index: number): EditorScene {
  const els: SlideElement[] = [];

  els.push(
    createBackgroundElement(`bg-${index}`, 0, {
      x: 0,
      y: 0,
      width: SCENE_W,
      height: SCENE_H,
      fill: "#ffffff",
      accent: "#ffffff",
      pattern: "none",
    }),
  );

  els.push(
    createTextElement(`title-${index}`, slide.title, 4, {
      x: 170,
      y: 82,
      width: 1160,
      height: 100,
      fontSize: 56,
      fontWeight: 800,
      color: NAVY,
      lineHeight: 1.08,
    }),
  );

  const cards = getCardItems(slide).slice(0, 4);
  const cols = cards.length <= 2 ? cards.length || 1 : 2;
  const cardW = cols === 1 ? 1180 : 570;
  const cardH = cards.length <= 2 ? 260 : 205;
  const gapX = cols > 1 ? 40 : 0;
  const gapY = 34;
  const startX = 170;
  const startY = cards.length <= 2 ? 270 : 230;

  cards.forEach((card, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const cx = startX + col * (cardW + gapX);
    const cy = startY + row * (cardH + gapY);

    els.push(
      createShapeElement(`card-${index}-${i}`, 5 + i * 3, {
        x: cx,
        y: cy,
        width: cardW,
        height: cardH,
        shape: "rect",
        fill: "#ffffff",
        stroke: CARD_BORDER,
        strokeWidth: 1,
        cornerRadius: 10,
      }),
      createShapeElement(`card-accent-${index}-${i}`, 6 + i * 3, {
        x: cx,
        y: cy,
        width: 8,
        height: cardH,
        shape: "rect",
        fill: i % 2 === 0 ? BLUE_DOT : "#f59e0b",
        stroke: "transparent",
        strokeWidth: 0,
        cornerRadius: 8,
      }),
      createTextElement(`card-title-${index}-${i}`, card.title, 7 + i * 3, {
        x: cx + 36,
        y: cy + 30,
        width: cardW - 72,
        height: 42,
        fontSize: 25,
        fontWeight: 800,
        color: "#111827",
        lineHeight: 1.12,
      }),
      createTextElement(`card-desc-${index}-${i}`, card.description, 8 + i * 3, {
        x: cx + 36,
        y: cy + 88,
        width: cardW - 72,
        height: cardH - 112,
        fontSize: 21,
        fontWeight: 400,
        color: "#475569",
        lineHeight: 1.22,
      }),
    );
  });

  addFooter(els, index);

  return scene(els);
}

/* ------------------------------------------------------------------ */
/*  Builder: Visual Split (text + image)                               */
/* ------------------------------------------------------------------ */

function buildImageTextScene(slide: Slide, index: number): EditorScene {
  const els: SlideElement[] = [];
  const imageSide = getImageSide(index);
  const textX = imageSide === "left" ? 820 : SLIDE_PAD_X + 28;
  const textWidth = 620;
  const titleFont =
    slide.title.length > 74 ? 46 : slide.title.length > 48 ? 52 : 58;
  const titleHeight = getTextHeight(slide.title, textWidth, titleFont, 190);

  els.push(
    createBackgroundElement(`bg-${index}`, 0, {
      x: 0,
      y: 0,
      width: SCENE_W,
      height: SCENE_H,
      fill: "#ffffff",
      accent: "#ffffff",
      pattern: "none",
    }),
  );

  addEditorialImageBlock(els, index, imageSide, {
    alt: slide.suggested_visual || slide.title,
  });

  els.push(
    createTextElement(`title-${index}`, slide.title, 4, {
      x: textX,
      y: 128,
      width: textWidth,
      height: titleHeight,
      fontSize: titleFont,
      fontWeight: 800,
      color: NAVY,
      lineHeight: 1.08,
    }),
  );

  const paragraphs = getParagraphs(slide).slice(0, 3);
  const contentY = 128 + titleHeight + 48;

  paragraphs.forEach((paragraph, i) => {
    const y = contentY + i * 118;
    els.push(
      createShapeElement(`insight-dot-${index}-${i}`, 6 + i * 3, {
        x: textX,
        y: y + 8,
        width: 12,
        height: 12,
        shape: "ellipse",
        fill: i === 0 ? GREEN : BLUE_DOT,
        stroke: "transparent",
        strokeWidth: 0,
      }),
      createTextElement(`para-${index}-${i}`, paragraph, 7 + i * 3, {
        x: textX + 34,
        y,
        width: textWidth - 38,
        height: 92,
        fontSize: 25,
        fontWeight: 400,
        color: BODY,
        lineHeight: 1.22,
      }),
    );
  });

  addFooter(els, index);

  return scene(els);
}

function buildVisualSplitScene(slide: Slide, index: number): EditorScene {
  const els: SlideElement[] = [];
  const imageSide = getImageSide(index);
  const textX = imageSide === "left" ? 830 : 150;
  const titleFont =
    slide.title.length > 74 ? 46 : slide.title.length > 48 ? 52 : 58;
  const titleHeight = getTextHeight(slide.title, 590, titleFont, 180);

  els.push(
    createBackgroundElement(`bg-${index}`, 0, {
      x: 0,
      y: 0,
      width: SCENE_W,
      height: SCENE_H,
      fill: "#ffffff",
      accent: "#ffffff",
      pattern: "none",
    }),
  );

  addEditorialImageBlock(els, index, imageSide, {
    alt: slide.suggested_visual || slide.title,
  });

  els.push(
    createTextElement(`title-${index}`, slide.title, 6, {
      x: textX,
      y: 145,
      width: 590,
      height: titleHeight,
      fontSize: titleFont,
      fontWeight: 800,
      color: NAVY,
      lineHeight: 1.06,
    }),
  );

  const lead = compactText(getParagraphs(slide), 3);
  if (lead) {
    els.push(
      createTextElement(`para-${index}`, lead, 7, {
        x: textX,
        y: 145 + titleHeight + 46,
        width: 590,
        height: 250,
        fontSize: 26,
        fontWeight: 400,
        color: BODY,
        lineHeight: 1.22,
      }),
    );
  }

  els.push(
    createShapeElement(`visual-rule-${index}`, 8, {
      x: textX,
      y: 730,
      width: 160,
      height: 7,
      shape: "rect",
      fill: GREEN,
      stroke: "transparent",
      strokeWidth: 0,
      cornerRadius: 8,
    }),
  );

  addFooter(els, index);

  return scene(els);
}

/* ------------------------------------------------------------------ */
/*  Builder: Timeline                                                  */
/* ------------------------------------------------------------------ */

function buildTimelineScene(slide: Slide, index: number): EditorScene {
  const els: SlideElement[] = [];

  els.push(
    createTextElement(`title-${index}`, slide.title, 0, {
      x: 170,
      y: 82,
      width: 1160,
      height: 100,
      fontSize: 56,
      fontWeight: 800,
      color: NAVY,
      lineHeight: 1.08,
    }),
  );

  const steps = slide.main_content.slice(0, 5).map(stripBulletPrefix);

  els.push(
    createShapeElement(`line-${index}`, 1, {
      x: 215,
      y: 220,
      width: 12,
      height: Math.min(steps.length * 118, 600),
      shape: "rect",
      fill: "#cbd5e1",
      cornerRadius: 2,
      stroke: "transparent",
      strokeWidth: 0,
    }),
  );

  steps.forEach((step, i) => {
    els.push(
      createShapeElement(`dot-${index}-${i}`, 2 + i * 2, {
        x: 190,
        y: 205 + i * 118,
        width: 60,
        height: 60,
        shape: "ellipse",
        fill: "#0f766e",
        stroke: "transparent",
        strokeWidth: 0,
        label: `${i + 1}`,
        textColor: "#ffffff",
        fontSize: 23,
        fontWeight: 700,
      }),
    );
    els.push(
      createTextElement(`step-${index}-${i}`, step, 3 + i * 2, {
        x: 285,
        y: 214 + i * 118,
        width: 1050,
        height: 78,
        fontSize: 30,
        fontWeight: 500,
        color: "#1e293b",
        lineHeight: 1.18,
      }),
    );
  });

  return scene(els);
}

/* ------------------------------------------------------------------ */
/*  Builder: Process / Workflow                                        */
/* ------------------------------------------------------------------ */

function buildProcessScene(slide: Slide, index: number): EditorScene {
  const els: SlideElement[] = [];

  els.push(
    createTextElement(`title-${index}`, slide.title, 0, {
      x: 170,
      y: 82,
      width: 1160,
      height: 100,
      fontSize: 56,
      fontWeight: 800,
      color: NAVY,
      lineHeight: 1.08,
    }),
  );

  const steps = slide.main_content.slice(0, 4).map(stripBulletPrefix);
  const count = steps.length || 1;
  const totalW = 1220;
  const gap = 34;
  const stepW = (totalW - gap * (count - 1)) / count;
  const cardY = 275;
  const cardH = 285;

  steps.forEach((step, i) => {
    const sx = 190 + i * (stepW + gap);
    const accent = i % 2 === 0 ? BLUE_DOT : "#f59e0b";

    els.push(
      createShapeElement(`step-card-${index}-${i}`, 1 + i * 6, {
        x: sx,
        y: cardY,
        width: stepW,
        height: cardH,
        shape: "rect",
        fill: "#ffffff",
        stroke: CARD_BORDER,
        strokeWidth: 1,
        cornerRadius: 12,
      }),
      createShapeElement(`step-accent-${index}-${i}`, 2 + i * 6, {
        x: sx + 26,
        y: cardY + 34,
        width: 42,
        height: 42,
        shape: "rect",
        fill: accent,
        stroke: "transparent",
        strokeWidth: 0,
        cornerRadius: 10,
      }),
      createTextElement(`step-num-${index}-${i}`, String(i + 1).padStart(2, "0"), 3 + i * 6, {
        x: sx + 26,
        y: cardY + 44,
        width: 42,
        height: 24,
        fontSize: 14,
        fontWeight: 800,
        align: "center",
        color: "#ffffff",
        lineHeight: 1,
      }),
      createTextElement(`step-label-${index}-${i}`, "Etape", 4 + i * 6, {
        x: sx + 84,
        y: cardY + 45,
        width: stepW - 116,
        height: 22,
        fontSize: 14,
        fontWeight: 800,
        color: "#64748b",
        lineHeight: 1,
      }),
      createTextElement(`step-text-${index}-${i}`, step, 5 + i * 6, {
        x: sx + 30,
        y: cardY + 118,
        width: stepW - 60,
        height: 116,
        fontSize: 21,
        fontWeight: 700,
        color: "#1e293b",
        lineHeight: 1.2,
      }),
    );

    if (i < steps.length - 1) {
      els.push(
        createTextElement(`arrow-${index}-${i}`, "\u203A", 6 + i * 6, {
          x: sx + stepW + 7,
          y: cardY + 126,
          width: gap - 14,
          height: 34,
          fontSize: 28,
          fontWeight: 700,
          align: "center",
          color: "#cbd5e1",
        }),
      );
    }
  });

  addFooter(els, index);

  return scene(els);
}
/* ------------------------------------------------------------------ */
/*  Builder: Problem / Solution                                        */
/* ------------------------------------------------------------------ */

function buildProblemSolutionScene(slide: Slide, index: number): EditorScene {
  const els: SlideElement[] = [];

  els.push(
    createTextElement(`title-${index}`, slide.title, 0, {
      x: 170,
      y: 82,
      width: 1160,
      height: 100,
      fontSize: 54,
      fontWeight: 800,
      color: NAVY,
      lineHeight: 1.08,
    }),
  );

  const items = slide.main_content.map(cleanText);
  const mid = Math.ceil(items.length / 2);
  const problemText = items.slice(0, mid).join("\n");
  const solutionText = items.slice(mid).join("\n");

  els.push(
    createShapeElement(`prob-bg-${index}`, 1, {
      x: 60,
      y: 230,
      width: 720,
      height: 500,
      shape: "rect",
      fill: "#fef2f2",
      stroke: "#fca5a5",
      strokeWidth: 1,
      cornerRadius: 20,
    }),
  );

  els.push(
    createTextElement(`prob-label-${index}`, "Probleme", 2, {
      x: 90,
      y: 255,
      width: 300,
      height: 40,
      fontSize: 28,
      fontWeight: 700,
      color: "#dc2626",
    }),
  );

  els.push(
    createTextElement(`prob-text-${index}`, problemText, 3, {
      x: 90,
      y: 315,
      width: 660,
      height: 350,
      fontSize: 28,
      fontWeight: 400,
      color: "#7f1d1d",
      lineHeight: 1.5,
    }),
  );

  els.push(
    createShapeElement(`sol-bg-${index}`, 4, {
      x: 820,
      y: 230,
      width: 720,
      height: 500,
      shape: "rect",
      fill: "#f0fdf4",
      stroke: "#86efac",
      strokeWidth: 1,
      cornerRadius: 20,
    }),
  );

  els.push(
    createTextElement(`sol-label-${index}`, "Solution", 5, {
      x: 850,
      y: 255,
      width: 300,
      height: 40,
      fontSize: 28,
      fontWeight: 700,
      color: "#16a34a",
    }),
  );

  els.push(
    createTextElement(`sol-text-${index}`, solutionText, 6, {
      x: 850,
      y: 315,
      width: 660,
      height: 350,
      fontSize: 28,
      fontWeight: 400,
      color: "#14532d",
      lineHeight: 1.5,
    }),
  );

  return scene(els);
}

/* ------------------------------------------------------------------ */
/*  Builder: Q&A                                                       */
/* ------------------------------------------------------------------ */

function buildQAScene(slide: Slide, index: number): EditorScene {
  const defs = getDefinitionItems(slide);
  if (defs.length === 0) return buildParagraphScene(slide, index);

  const els: SlideElement[] = [];

  els.push(
    createTextElement(`title-${index}`, slide.title, 0, {
      x: 170,
      y: 82,
      width: 1160,
      height: 100,
      fontSize: 56,
      fontWeight: 800,
      color: NAVY,
      lineHeight: 1.08,
    }),
  );

  const pairs = defs.slice(0, 4);
  pairs.forEach((pair, i) => {
    els.push(
      createTextElement(`q-${index}-${i}`, `Q: ${pair.term}`, 1 + i * 2, {
        x: 170,
        y: 220 + i * 130,
        width: 1260,
        height: 45,
        fontSize: 28,
        fontWeight: 700,
        color: "#0f766e",
      }),
    );
    els.push(
      createTextElement(`a-${index}-${i}`, pair.explanation, 2 + i * 2, {
        x: 170,
        y: 265 + i * 130,
        width: 1260,
        height: 80,
        fontSize: 25,
        fontWeight: 400,
        color: "#475569",
        lineHeight: 1.4,
      }),
    );
  });

  return scene(els);
}

/* ------------------------------------------------------------------ */
/*  Builder: Closing                                                   */
/* ------------------------------------------------------------------ */

function buildClosingScene(slide: Slide, index: number): EditorScene {
  const els: SlideElement[] = [];
  const semantic = resolveSemanticType(slide);

  els.push(
    createBackgroundElement(`bg-${index}`, 0, {
      x: 0,
      y: 0,
      width: 1600,
      height: 900,
      fill: "#ffffff",
      accent: "#ffffff",
      pattern: "none",
    }),
  );

  if (semantic === "closure.thank_you") {
    els.push(
      createTextElement(`eyebrow-${index}`, "MERCI", 1, {
        x: 500,
        y: 185,
        width: 600,
        height: 30,
        fontSize: 18,
        fontWeight: 600,
        align: "center",
        color: "#94a3b8",
      }),
    );
  }

  els.push(
    createTextElement(`title-${index}`, slide.title, 2, {
      x: 200,
      y: 280,
      width: 1200,
      height: 130,
      fontSize: 58,
      fontWeight: 800,
      align: "center",
      color: "#0f172a",
    }),
  );

  const paragraphs = getParagraphs(slide).slice(0, 3);
  paragraphs.forEach((p, i) => {
    els.push(
      createTextElement(`content-${index}-${i}`, p, 3 + i, {
        x: 200,
        y: 440 + i * 92,
        width: 1200,
        height: 80,
        fontSize: 28,
        fontWeight: 400,
        align: "center",
        color: "#475569",
      }),
    );
  });

  return scene(els);
}

/* ------------------------------------------------------------------ */
/*  Dispatcher: semantic_type -> builder                               */
/* ------------------------------------------------------------------ */

const BUILDER_MAP: Record<string, BuilderFn> = {
  "cover.title": buildCoverScene,

  "section.agenda": buildAgendaScene,
  "section.transition": buildSectionScene,

  "content.paragraph": buildParagraphScene,
  "content.multi_paragraph": buildParagraphScene,
  "content.info_box": buildParagraphScene,
  "content.definition": buildDefinitionScene,
  "content.definition_list": buildDefinitionScene,
  "content.quote": buildQuoteScene,

  "list.bullets": buildBulletListScene,
  "list.numbered": buildBulletListScene,
  "list.takeaways": buildBulletListScene,
  "list.pros_cons": buildComparisonScene,

  "comparison.two_column": buildComparisonScene,
  "comparison.before_after": buildComparisonScene,
  "comparison.concepts": buildComparisonScene,
  "comparison.solutions": buildComparisonScene,

  "data.table": buildTableScene,
  "data.comparative_table": buildTableScene,
  "data.matrix": buildTableScene,
  "data.kpi": buildKpiScene,
  "data.cards": buildCardsScene,

  "visual.image_text": buildVisualSplitScene,
  "visual.overlay": buildVisualSplitScene,
  "visual.illustration": buildVisualSplitScene,
  "visual.gallery": buildVisualSplitScene,

  "diagram.timeline": buildTimelineScene,
  "diagram.process": buildProcessScene,
  "diagram.workflow": buildProcessScene,
  "diagram.orgchart": buildProcessScene,
  "diagram.cause_effect": buildProcessScene,

  "business.problem_solution": buildProblemSolutionScene,
  "business.objectives_results": buildComparisonScene,
  "business.use_case": buildCardsScene,
  "business.roadmap": buildTimelineScene,
  "business.architecture": buildProcessScene,
  "business.product_feature": buildVisualSplitScene,

  "academic.definition": buildDefinitionScene,
  "academic.explanation": buildParagraphScene,
  "academic.case_study": buildCardsScene,
  "academic.summary": buildBulletListScene,
  "academic.qa": buildQAScene,

  "closure.conclusion": buildClosingScene,
  "closure.thank_you": buildClosingScene,
};

export function buildEditorSceneForSlide(
  slide: Slide,
  index: number,
): EditorScene {
  const cleaned = ct(slide);
  const semantic: SlideSemanticType = resolveSemanticType(cleaned);
  const builder =
    semantic !== "cover.title" &&
    shouldUseImageForSlide(cleaned, semantic) &&
    !semantic.startsWith("visual.") &&
    semantic !== "business.product_feature"
      ? buildImageTextScene
      : semantic !== "cover.title" && shouldUseImageForSlide(cleaned, semantic)
      ? buildVisualSplitScene
      : (BUILDER_MAP[semantic] ?? buildParagraphScene);
  return finalizeScene(builder(cleaned, index), index, semantic, cleaned);
}
