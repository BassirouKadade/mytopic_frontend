import type {
  BackgroundSlideElement,
  ChartSlideElement,
  ColumnsSlideElement,
  EditorScene,
  MediaSlideElement,
  SlideElement,
  TableSlideElement,
  TextSlideElement,
} from "@/services/api";

export type EditorTemplateType =
  | "title-slide"
  | "title-content"
  | "two-columns"
  | "three-columns"
  | "image-text"
  | "full-image"
  | "table-layout"
  | "chart-layout";

const WIDTH = 1600;
const HEIGHT = 900;

const baseTitle = {
  color: "#0f172a",
  fontSize: 72,
  fontFamily: "Geist Variable, sans-serif",
  fontWeight: 700,
  fontStyle: "normal" as const,
  align: "left" as const,
  lineHeight: 1.08,
};

const baseBody = {
  color: "#111827",
  fontSize: 34,
  fontFamily: "Geist Variable, sans-serif",
  fontWeight: 400,
  fontStyle: "normal" as const,
  align: "left" as const,
  lineHeight: 1.18,
};

function text(
  id: string,
  zIndex: number,
  patch: Partial<TextSlideElement>,
): TextSlideElement {
  return {
    id,
    type: "text",
    x: patch.x ?? 0,
    y: patch.y ?? 0,
    width: patch.width ?? 300,
    height: patch.height ?? 100,
    rotation: patch.rotation ?? 0,
    zIndex,
    locked: patch.locked ?? false,
    visible: patch.visible ?? true,
    opacity: patch.opacity ?? 1,
    text: patch.text ?? "Texte",
    ...baseBody,
    ...patch,
  };
}

function background(): BackgroundSlideElement {
  return {
    id: "background-base",
    type: "background",
    x: 0,
    y: 0,
    width: WIDTH,
    height: HEIGHT,
    rotation: 0,
    zIndex: 0,
    locked: true,
    visible: true,
    opacity: 1,
    fill: "#ffffff",
    accent: "#ffffff",
    pattern: "none",
  };
}

function media(
  id: string,
  zIndex: number,
  patch: Partial<MediaSlideElement>,
): MediaSlideElement {
  return {
    id,
    type: "media",
    x: patch.x ?? 0,
    y: patch.y ?? 0,
    width: patch.width ?? 600,
    height: patch.height ?? 320,
    rotation: 0,
    zIndex,
    locked: false,
    visible: true,
    opacity: 1,
    mediaKind: patch.mediaKind ?? "image",
    src: patch.src ?? "",
    alt: patch.alt ?? "Visuel",
    fit: patch.fit ?? "cover",
    borderRadius: patch.borderRadius ?? 28,
    background: patch.background ?? "#cbd5e1",
  };
}

function columns(
  id: string,
  zIndex: number,
  count: number,
): ColumnsSlideElement {
  const items = Array.from({ length: count }, (_, index) => [
    `Colonne ${index + 1}`,
    "Premier point",
    "Deuxieme point",
  ]);

  return {
    id,
    type: "columns",
    x: 120,
    y: 260,
    width: 1360,
    height: 520,
    rotation: 0,
    zIndex,
    locked: false,
    visible: true,
    opacity: 1,
    columns: items,
    gap: 26,
    titleColor: "#0f172a",
    textColor: "#334155",
  };
}

function table(id: string, zIndex: number): TableSlideElement {
  return {
    id,
    type: "table",
    x: 120,
    y: 240,
    width: 1360,
    height: 560,
    rotation: 0,
    zIndex,
    locked: false,
    visible: true,
    opacity: 1,
    headers: ["Metrice", "Valeur", "Evolution"],
    rows: [
      ["Conversion", "23%", "+4.2%"],
      ["Engagement", "61%", "+2.9%"],
      ["Retention", "74%", "+1.4%"],
    ],
    headerFill: "#e2e8f0",
    borderColor: "#94a3b8",
    textColor: "#0f172a",
    fontSize: 24,
  };
}

function chart(id: string, zIndex: number): ChartSlideElement {
  return {
    id,
    type: "chart",
    x: 140,
    y: 250,
    width: 1320,
    height: 540,
    rotation: 0,
    zIndex,
    locked: false,
    visible: true,
    opacity: 1,
    chartKind: "bar",
    labels: ["Q1", "Q2", "Q3", "Q4"],
    values: [42, 56, 64, 81],
    palette: ["#0f766e", "#0ea5e9", "#f59e0b", "#f97316"],
    strokeColor: "#0f172a",
  };
}

export function createSceneFromTemplate(
  template: EditorTemplateType,
): EditorScene {
  const elements: SlideElement[] = [background()];

  if (template === "title-slide") {
    elements.push(
      text("title", 1, {
        text: "Titre de presentation",
        x: 180,
        y: 250,
        width: 1120,
        ...baseTitle,
      }),
      text("subtitle", 2, {
        text: "Sous-titre ou promesse de valeur",
        x: 180,
        y: 440,
        width: 960,
        fontSize: 32,
      }),
    );
  }

  if (template === "title-content") {
    elements.push(
      text("title", 1, {
        text: "Titre de section",
        x: 170,
        y: 92,
        width: 1160,
        ...baseTitle,
        fontSize: 64,
      }),
      text("content", 2, {
        text: "Ajoutez votre contenu principal ici.",
        x: 170,
        y: 255,
        width: 1120,
        fontSize: 36,
      }),
    );
  }

  if (template === "two-columns") {
    elements.push(
      text("title", 1, {
        text: "Titre + deux colonnes",
        x: 170,
        y: 92,
        width: 1120,
        ...baseTitle,
        fontSize: 62,
      }),
      columns("columns-2", 2, 2),
    );
  }

  if (template === "three-columns") {
    elements.push(
      text("title", 1, {
        text: "Comparaison sur trois colonnes",
        x: 170,
        y: 92,
        width: 1240,
        ...baseTitle,
        fontSize: 62,
      }),
      columns("columns-3", 2, 3),
    );
  }

  if (template === "image-text") {
    elements.push(
      text("title", 1, {
        text: "Visuel + texte",
        x: 170,
        y: 92,
        width: 1080,
        ...baseTitle,
        fontSize: 62,
      }),
      media("image", 2, {
        x: 105,
        y: 70,
        width: 560,
        height: 760,
        mediaKind: "image",
        alt: "Illustration",
      }),
      text("caption", 3, {
        text: "Narration, contexte et details cles du visuel.",
        x: 760,
        y: 260,
        width: 650,
        fontSize: 36,
      }),
    );
  }

  if (template === "full-image") {
    elements.push(
      media("hero-image", 1, {
        x: 0,
        y: 0,
        width: WIDTH,
        height: HEIGHT,
        mediaKind: "image",
        borderRadius: 0,
        background: "#94a3b8",
      }),
      text("title", 2, {
        text: "Titre sur image",
        x: 110,
        y: 680,
        width: 1100,
        ...baseTitle,
        color: "#ffffff",
        fontSize: 64,
      }),
    );
  }

  if (template === "table-layout") {
    elements.push(
      text("title", 1, {
        text: "Synthese tabulaire",
        x: 170,
        y: 92,
        width: 1080,
        ...baseTitle,
        fontSize: 60,
      }),
      table("table", 2),
    );
  }

  if (template === "chart-layout") {
    elements.push(
      text("title", 1, {
        text: "Indicateurs et tendances",
        x: 170,
        y: 92,
        width: 1100,
        ...baseTitle,
        fontSize: 60,
      }),
      chart("chart", 2),
    );
  }

  return {
    version: "1.0",
    width: WIDTH,
    height: HEIGHT,
    background: "#ffffff",
    elements: elements.map((item, index) => ({ ...item, zIndex: index })),
  };
}

export const TEMPLATE_OPTIONS: Array<{
  value: EditorTemplateType;
  label: string;
}> = [
  { value: "title-slide", label: "Title Slide" },
  { value: "title-content", label: "Title + Content" },
  { value: "two-columns", label: "Two Columns" },
  { value: "three-columns", label: "Three Columns" },
  { value: "image-text", label: "Image + Text" },
  { value: "full-image", label: "Full Image" },
  { value: "table-layout", label: "Table Layout" },
  { value: "chart-layout", label: "Chart Layout" },
];
