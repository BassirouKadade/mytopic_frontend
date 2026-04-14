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
  fontSize: 66,
  fontFamily: "Geist Variable, sans-serif",
  fontWeight: 800,
  fontStyle: "normal" as const,
  align: "left" as const,
  lineHeight: 1.1,
};

const baseBody = {
  color: "#334155",
  fontSize: 30,
  fontFamily: "Geist Variable, sans-serif",
  fontWeight: 500,
  fontStyle: "normal" as const,
  align: "left" as const,
  lineHeight: 1.3,
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
    fill: "#f8fafc",
    accent: "#e2e8f0",
    pattern: "dots",
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
        x: 120,
        y: 230,
        width: 1180,
        ...baseTitle,
      }),
      text("subtitle", 2, {
        text: "Sous-titre ou promesse de valeur",
        x: 120,
        y: 360,
        width: 960,
      }),
    );
  }

  if (template === "title-content") {
    elements.push(
      text("title", 1, {
        text: "Titre de section",
        x: 120,
        y: 86,
        width: 1120,
        ...baseTitle,
        fontSize: 60,
      }),
      text("content", 2, {
        text: "Ajoutez votre contenu principal ici.",
        x: 120,
        y: 250,
        width: 1200,
      }),
    );
  }

  if (template === "two-columns") {
    elements.push(
      text("title", 1, {
        text: "Titre + deux colonnes",
        x: 120,
        y: 86,
        width: 1120,
        ...baseTitle,
        fontSize: 58,
      }),
      columns("columns-2", 2, 2),
    );
  }

  if (template === "three-columns") {
    elements.push(
      text("title", 1, {
        text: "Comparaison sur trois colonnes",
        x: 120,
        y: 86,
        width: 1240,
        ...baseTitle,
        fontSize: 58,
      }),
      columns("columns-3", 2, 3),
    );
  }

  if (template === "image-text") {
    elements.push(
      text("title", 1, {
        text: "Visuel + texte",
        x: 120,
        y: 86,
        width: 1080,
        ...baseTitle,
        fontSize: 58,
      }),
      media("image", 2, {
        x: 120,
        y: 230,
        width: 680,
        height: 520,
        mediaKind: "image",
        alt: "Illustration",
      }),
      text("caption", 3, {
        text: "Narration, contexte et details cles du visuel.",
        x: 860,
        y: 260,
        width: 620,
        fontSize: 32,
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
        x: 120,
        y: 86,
        width: 1080,
        ...baseTitle,
        fontSize: 56,
      }),
      table("table", 2),
    );
  }

  if (template === "chart-layout") {
    elements.push(
      text("title", 1, {
        text: "Indicateurs et tendances",
        x: 120,
        y: 86,
        width: 1100,
        ...baseTitle,
        fontSize: 56,
      }),
      chart("chart", 2),
    );
  }

  return {
    version: "1.0",
    width: WIDTH,
    height: HEIGHT,
    background: "#f8fafc",
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
