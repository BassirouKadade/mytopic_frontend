import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import PptxGenJS from "pptxgenjs";
import { createElement } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";

import { StaticSceneRenderer } from "@/presentation/StaticSceneRenderer";
import type { Presentation, EditorScene, SlideElement } from "@/services/api";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function sanitizeFilename(name: string): string {
  return (
    (name || "presentation")
      .replace(/[\\/:*?"<>|]+/g, " ")
      .trim()
      .replace(/\s+/g, "_") || "presentation"
  );
}

/* ------------------------------------------------------------------ */
/*  oklch → rgb resolution                                             */
/*  html2canvas 1.4.x cannot parse oklch() (Tailwind CSS 4).          */
/*  We bake every computed colour into the inline style so the clone   */
/*  is self-contained, then render it inside a blank <iframe> that     */
/*  has NO stylesheets → html2canvas never sees oklch.                 */
/* ------------------------------------------------------------------ */

const COLOR_PROPS = [
  "color",
  "backgroundColor",
  "borderTopColor",
  "borderRightColor",
  "borderBottomColor",
  "borderLeftColor",
  "outlineColor",
] as const;

// Text layout properties that must be baked so the iframe renders identically
// even without the page's stylesheets.
const TEXT_PROPS = [
  "fontFamily",
  "fontSize",
  "fontWeight",
  "fontStyle",
  "letterSpacing",
  "wordSpacing",
  "lineHeight",
  "textAlign",
  "textTransform",
  "textDecoration",
  "whiteSpace",
  "wordBreak",
] as const;

// Cache shared across all slides in one export run.
const _colorCache = new Map<string, string>();

/**
 * Convert any CSS color string to rgb/rgba using the Canvas 2D API.
 * Canvas is the only browser primitive guaranteed to return sRGB values
 * even when the input is oklch/lab/lch – so html2canvas never sees them.
 */
function resolveColorToRgb(raw: string): string {
  if (!raw) return raw;
  const lower = raw.toLowerCase().trim();
  if (
    lower === "none" ||
    lower === "transparent" ||
    lower === "currentcolor" ||
    lower === "inherit" ||
    lower === "initial"
  )
    return raw;
  // Already plain rgb/rgba/hex – no conversion needed.
  if (lower.startsWith("rgb(") || lower.startsWith("rgba(") || lower.startsWith("#"))
    return raw;

  const cached = _colorCache.get(raw);
  if (cached !== undefined) return cached;

  try {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = raw;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    const resolved =
      a < 255
        ? `rgba(${r},${g},${b},${(a / 255).toFixed(3)})`
        : `rgb(${r},${g},${b})`;
    _colorCache.set(raw, resolved);
    return resolved;
  } catch {
    _colorCache.set(raw, raw);
    return raw;
  }
}

/**
 * Scan a CSS value string for oklch(...) tokens and replace each one
 * with its canvas-resolved rgb() equivalent.  Used for gradients and shadows.
 */
function resolveOklchInString(value: string): string {
  if (!value.includes("oklch")) return value;
  return value.replace(/oklch\([^)]+\)/gi, (match) => resolveColorToRgb(match));
}

/**
 * Bake all computed colours AND text layout properties into inline styles.
 * The clone will then render identically inside the font-less iframe.
 */
function bakeComputedStyles(root: HTMLElement): void {
  const all = [root, ...root.querySelectorAll<HTMLElement>("*")];
  for (const el of all) {
    const cs = window.getComputedStyle(el);

    // Colours → force sRGB via canvas
    for (const p of COLOR_PROPS) {
      const raw = cs[p];
      if (raw) el.style[p] = resolveColorToRgb(raw);
    }

    // background-image gradients may carry oklch tokens
    const bgi = cs.backgroundImage;
    if (bgi && bgi !== "none") {
      el.style.backgroundImage = resolveOklchInString(bgi);
    }

    // box-shadow colour stops may carry oklch tokens
    const bs = cs.boxShadow;
    if (bs && bs !== "none") {
      el.style.boxShadow = resolveOklchInString(bs);
    }

    // Text layout properties – baked as absolute computed values so the
    // iframe renders spacing/sizing identically regardless of which font loads.
    for (const p of TEXT_PROPS) {
      const raw = cs[p];
      if (raw) el.style[p as keyof CSSStyleDeclaration] = raw as never;
    }
  }
}

/**
 * Collect every @font-face rule from the main document's stylesheets.
 * These are injected verbatim into the iframe so the browser can load
 * the same font files from the same origin.
 */
function collectFontFaceRules(): string {
  const rules: string[] = [];
  try {
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        for (const rule of Array.from(sheet.cssRules)) {
          if (rule instanceof CSSFontFaceRule) {
            rules.push(rule.cssText);
          }
        }
      } catch {
        // CORS-blocked stylesheet – skip
      }
    }
  } catch {
    // ignore
  }
  return rules.join("\n");
}

/**
 * Render an element via html2canvas inside a clean <iframe>.
 * The iframe has no Tailwind/oklch stylesheets but does have all @font-face
 * declarations and the already-loaded FontFace objects transferred from the
 * main document, so fonts render identically to the editor.
 */
async function renderInIframe(
  source: HTMLElement,
  width: number,
  height: number,
  bgColor: string,
): Promise<HTMLCanvasElement> {
  const fontFaceCss = collectFontFaceRules();

  // 1. Create a hidden iframe with only the font declarations – no Tailwind
  const iframe = document.createElement("iframe");
  iframe.style.cssText =
    "position:fixed;left:-30000px;top:0;border:none;opacity:0;pointer-events:none;";
  iframe.width = String(width);
  iframe.height = String(height);
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentDocument!;
  iframeDoc.open();
  iframeDoc.write(
    `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box;}${fontFaceCss}</style></head><body></body></html>`,
  );
  iframeDoc.close();

  // 2. Transfer already-loaded FontFace objects so the iframe doesn't need
  //    to re-download the font files (they are already in memory).
  for (const fontFace of document.fonts) {
    try {
      iframeDoc.fonts.add(fontFace);
    } catch {
      // Some browsers reject cross-document font transfer – @font-face CSS is
      // the fallback for those cases.
    }
  }

  // 3. Clone the source into the iframe body
  const clone = source.cloneNode(true) as HTMLElement;
  clone.style.position = "relative";
  clone.style.left = "0";
  clone.style.top = "0";
  clone.style.width = `${width}px`;
  clone.style.height = `${height}px`;
  iframeDoc.body.appendChild(clone);

  // 4. Wait for fonts and images to be ready
  try {
    await iframeDoc.fonts.ready;
  } catch {
    // fonts API unavailable – continue
  }

  const imgs = clone.querySelectorAll("img");
  if (imgs.length > 0) {
    await Promise.all(
      Array.from(imgs).map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete && img.naturalWidth > 0) return resolve();
            img.onload = () => resolve();
            img.onerror = () => resolve();
          }),
      ),
    );
  }
  await new Promise((r) => setTimeout(r, 120));

  // 5. Capture – html2canvas reads ownerDocument (the iframe), never sees oklch
  try {
    const canvas = await html2canvas(clone, {
      width,
      height,
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: bgColor,
      logging: false,
    });
    return canvas;
  } finally {
    document.body.removeChild(iframe);
  }
}

/* ------------------------------------------------------------------ */
/*  Capture a slide                                                    */
/* ------------------------------------------------------------------ */

function findSceneRoot(): HTMLDivElement | null {
  return document.querySelector<HTMLDivElement>('[data-slide-scene="true"]');
}

function resolveBackground(bg: string): string {
  if (!bg || bg === "transparent") return "#ffffff";
  if (bg.startsWith("#") || bg.startsWith("rgb")) return bg;
  // Resolve oklch / exotic colours
  const tmp = document.createElement("div");
  tmp.style.cssText = `color:${bg};position:fixed;left:-99999px;`;
  document.body.appendChild(tmp);
  const resolved = window.getComputedStyle(tmp).color;
  document.body.removeChild(tmp);
  return resolved;
}

async function captureCurrentSlide(
  scene: EditorScene,
): Promise<HTMLCanvasElement> {
  const W = scene.width > 0 ? scene.width : 1600;
  const H = scene.height > 0 ? scene.height : 900;
  const bgColor = resolveBackground(scene.background);

  const sceneRoot = findSceneRoot();
  if (!sceneRoot) {
    throw new Error("Scene root not found in DOM.");
  }

  // Clone the live scene
  const clone = sceneRoot.cloneNode(true) as HTMLDivElement;

  // Reset transform (the live scene is scaled to fit viewport)
  clone.style.transform = "none";
  clone.style.width = `${W}px`;
  clone.style.height = `${H}px`;
  clone.style.overflow = "hidden";
  clone.style.background = bgColor;
  clone.removeAttribute("data-slide-scene");

  // Remove selection outlines
  clone.querySelectorAll("[data-element-wrapper]").forEach((el) => {
    (el as HTMLElement).style.outline = "none";
    (el as HTMLElement).style.outlineOffset = "";
  });

  // Remove non-element children (guides, spacing markers)
  Array.from(clone.children).forEach((child) => {
    if (!child.hasAttribute("data-element-wrapper")) {
      child.remove();
    }
  });

  // Remove selection handles inside wrappers (children after content)
  clone.querySelectorAll("[data-element-wrapper]").forEach((wrapper) => {
    const children = Array.from(wrapper.children);
    for (let i = 1; i < children.length; i++) {
      children[i].remove();
    }
  });

  // Mount the clone temporarily to the main document so
  // getComputedStyle can resolve all colours including oklch → rgb
  clone.style.position = "fixed";
  clone.style.left = "-30000px";
  clone.style.top = "0";
  clone.style.zIndex = "-9999";
  document.body.appendChild(clone);

  // Bake every computed colour into inline rgb styles
  bakeComputedStyles(clone);

  // Detach from main document
  document.body.removeChild(clone);

  // Render inside a clean iframe (no oklch stylesheets)
  return renderInIframe(clone, W, H, bgColor);
}

/* ------------------------------------------------------------------ */
/*  Off-screen scene render (no DOM navigation needed)                  */
/* ------------------------------------------------------------------ */

/**
 * Renders a scene via StaticSceneRenderer into a hidden container,
 * bakes styles, then captures via html2canvas in a clean iframe.
 * No slide navigation → instant, works for any slide in any order.
 */
async function renderSceneToCanvas(scene: EditorScene): Promise<HTMLCanvasElement> {
  const W = scene.width || 1600;
  const H = scene.height || 900;
  const bgColor = resolveBackground(scene.background || "#ffffff");

  const container = document.createElement("div");
  container.style.cssText = `position:fixed;left:-30000px;top:0;width:${W}px;height:${H}px;overflow:hidden;z-index:-9999;`;
  document.body.appendChild(container);

  const root = createRoot(container);
  flushSync(() => {
    root.render(createElement(StaticSceneRenderer, { scene }));
  });

  bakeComputedStyles(container);

  try {
    return await renderInIframe(container, W, H, bgColor);
  } finally {
    root.unmount();
    document.body.removeChild(container);
  }
}

/* ------------------------------------------------------------------ */
/*  Export to PDF                                                       */
/* ------------------------------------------------------------------ */

export async function exportToPdf(
  presentation: Presentation,
  _setSlide: (index: number) => void,
): Promise<void> {
  _colorCache.clear();
  const slides = presentation.slides;
  if (!slides || slides.length === 0)
    throw new Error("Aucune slide a exporter.");

  const pageW = 338.67; // 16:9 in mm
  const pageH = 190.5;

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [pageW, pageH],
  });

  for (let i = 0; i < slides.length; i++) {
    if (i > 0) pdf.addPage([pageW, pageH], "landscape");
    const canvas = await renderSceneToCanvas(slides[i].editor_scene);
    const imgData = canvas.toDataURL("image/jpeg", 0.92);
    pdf.addImage(imgData, "JPEG", 0, 0, pageW, pageH);
  }

  const filename = sanitizeFilename(presentation.presentation_title);
  pdf.save(`${filename}.pdf`);
}

/* ------------------------------------------------------------------ */
/*  Scene → PPTX native elements                                        */
/*  Each editor_scene element maps to a real PowerPoint object so the   */
/*  exported .pptx is fully editable — no flat screenshot per slide.    */
/* ------------------------------------------------------------------ */

const PPTX_W_IN = 13.33; // LAYOUT_WIDE width  (inches)
const PPTX_H_IN = 7.5;   // LAYOUT_WIDE height (inches)

interface SceneConverters {
  x: (px: number) => number;
  y: (px: number) => number;
  w: (px: number) => number;
  h: (px: number) => number;
  /** Scene-pixel font size → PPTX points */
  pt: (px: number) => number;
}

function makeConverters(sceneW: number, sceneH: number): SceneConverters {
  return {
    x:  (px) => (px / sceneW) * PPTX_W_IN,
    y:  (px) => (px / sceneH) * PPTX_H_IN,
    w:  (px) => (px / sceneW) * PPTX_W_IN,
    h:  (px) => (px / sceneH) * PPTX_H_IN,
    pt: (px) => Math.max(6, Math.round((px / sceneW) * PPTX_W_IN * 72)),
  };
}

function isTransparentColor(c: string): boolean {
  const v = (c || "").trim().toLowerCase();
  return v === "transparent" || v === "none" || v === "";
}

/** Fonts that exist in Microsoft Office / WPS Office. Any web font falls back to Calibri. */
const OFFICE_SAFE_FONTS = new Set([
  "Arial", "Arial Narrow", "Arial Black",
  "Calibri", "Calibri Light",
  "Cambria", "Cambria Math",
  "Comic Sans MS",
  "Courier New",
  "Georgia",
  "Helvetica",
  "Impact",
  "Palatino Linotype",
  "Segoe UI", "Segoe UI Light", "Segoe UI Semibold",
  "Tahoma",
  "Times New Roman",
  "Trebuchet MS",
  "Verdana",
]);

/** Map a CSS font-family stack to an Office-safe font name. */
function toFontFace(cssFontFamily: string): string {
  for (const token of (cssFontFamily || "").split(",")) {
    const name = token.trim().replace(/["']/g, "");
    if (OFFICE_SAFE_FONTS.has(name)) return name;
  }
  return "Calibri";
}

/** Normalize any CSS color to a 6-char hex string without '#'. */
function toHex6(color: string): string {
  if (!color) return "000000";
  const c = color.trim();
  if (c.startsWith("#")) {
    const h = c.slice(1);
    if (h.length === 3)
      return (h[0] + h[0] + h[1] + h[1] + h[2] + h[2]).toUpperCase();
    return h.slice(0, 6).padEnd(6, "0").toUpperCase();
  }
  const m = c.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (m)
    return [m[1], m[2], m[3]]
      .map((n) => parseInt(n).toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase();
  return "000000";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PptxSlide = any;

function addElementToSlide(
  page: PptxSlide,
  el: SlideElement,
  c: SceneConverters,
): void {
  if (!el.visible) return;

  const pos = {
    x: c.x(el.x),
    y: c.y(el.y),
    w: c.w(el.width),
    h: c.h(el.height),
    rotate: el.rotation ? Math.round(el.rotation) : undefined,
  };

  switch (el.type) {

    // ── Background ──────────────────────────────────────────────────
    case "background": {
      const isSolid = !el.accent || el.fill === el.accent;
      page.addShape("rect", {
        x: 0, y: 0, w: PPTX_W_IN, h: PPTX_H_IN,
        fill: isSolid
          ? { color: toHex6(el.fill) }
          : {
              type: "grad",
              stops: [
                { position: 0,   color: toHex6(el.fill) },
                { position: 100, color: toHex6(el.accent) },
              ],
              angle: 135,
            },
        line: { type: "none" },
      });
      break;
    }

    // ── Text ─────────────────────────────────────────────────────────
    case "text": {
      page.addText(el.text || " ", {
        ...pos,
        h:        c.h(Math.max(el.height, 60)),
        fontSize: c.pt(el.fontSize),
        fontFace: toFontFace(el.fontFamily),
        bold:     el.fontWeight >= 600,
        italic:   el.fontStyle === "italic",
        color:    toHex6(el.color),
        align:    el.align,
        autoFit:  true,
        wrap:     true,
      });
      break;
    }

    // ── Shape (rect / ellipse) ────────────────────────────────────────
    case "shape": {
      const shapeKind = el.shape === "ellipse" ? "ellipse" : "rect";
      const opacity01 = typeof el.opacity === "number" ? el.opacity : 1;
      const transparencyPct = opacity01 < 1 ? Math.round((1 - opacity01) * 100) : undefined;

      const fill = isTransparentColor(el.fill)
        ? { type: "none" }
        : {
            color: toHex6(el.fill),
            ...(transparencyPct !== undefined ? { transparency: transparencyPct } : {}),
          };

      const line = el.strokeWidth > 0
        ? {
            color: toHex6(el.stroke),
            pt: Math.max(0.5, c.pt(el.strokeWidth)),
            ...(transparencyPct !== undefined ? { transparency: transparencyPct } : {}),
          }
        : { type: "none" };

      if (el.label.trim()) {
        page.addText(el.label, {
          ...pos,
          shape:    shapeKind,
          fill,
          line,
          color:    toHex6(el.textColor),
          fontSize: c.pt(el.fontSize),
          bold:     el.fontWeight >= 600,
          align:    el.textAlign,
          valign:   "middle",
          wrap:     true,
        });
      } else {
        page.addShape(shapeKind, { ...pos, fill, line });
      }
      break;
    }

    // ── List ─────────────────────────────────────────────────────────
    case "list": {
      const spacing = Math.round(
        c.pt(el.fontSize) * Math.max(0, el.lineHeight - 1) * 4,
      );
      page.addText(
        el.items.map((item) => ({
          text: item,
          options: {
            bullet: el.ordered ? { type: "number" } : { type: "bullet" },
            paraSpaceBefore: spacing,
          },
        })),
        {
          ...pos,
          color:    toHex6(el.color),
          fontSize: c.pt(el.fontSize),
          fontFace: toFontFace(el.fontFamily),
          bold:     el.fontWeight >= 600,
          autoFit:  true,
          wrap:     true,
        },
      );
      break;
    }

    // ── Table ─────────────────────────────────────────────────────────
    case "table": {
      const headerRow = el.headers.map((h) => ({
        text: h,
        options: {
          bold:  true,
          color: toHex6(el.textColor),
          fill:  { color: toHex6(el.headerFill) },
        },
      }));
      const dataRows = el.rows.map((row) =>
        el.headers.map((_, ci) => ({
          text:    row[ci] ?? "",
          options: { color: toHex6(el.textColor) },
        })),
      );
      page.addTable([headerRow, ...dataRows], {
        x: pos.x,
        y: pos.y,
        w: pos.w,
        colW: el.headers.map(() => pos.w / Math.max(1, el.headers.length)),
        border:   { type: "solid", pt: 0.5, color: toHex6(el.borderColor) },
        fontSize: c.pt(el.fontSize),
        autoPage: false,
      });
      break;
    }

    // ── Media (image) ─────────────────────────────────────────────────
    case "media": {
      if (el.src && el.mediaKind === "image") {
        const imgOpts: Record<string, unknown> = { ...pos };
        if (el.src.startsWith("data:")) imgOpts.data = el.src;
        else imgOpts.path = el.src;
        page.addImage(imgOpts);
      }
      break;
    }

    // ── Chart ─────────────────────────────────────────────────────────
    case "chart": {
      page.addChart(
        el.chartKind === "line" ? "line" : "bar",
        [{ name: "Data", labels: el.labels, values: el.values }],
        { x: pos.x, y: pos.y, w: pos.w, h: pos.h, barDir: "col" },
      );
      break;
    }

    // ── Columns ───────────────────────────────────────────────────────
    case "columns": {
      const count = Math.max(1, el.columns.length);
      const colPxW = (el.width - el.gap * (count - 1)) / count;

      el.columns.forEach((column, ci) => {
        const [title, ...bodyLines] = column;
        const runs: Array<{ text: string; options: Record<string, unknown> }> = [];
        if (title)
          runs.push({
            text: bodyLines.length > 0 ? title + "\n" : title,
            options: { bold: true, fontSize: c.pt(22), color: toHex6(el.titleColor) },
          });
        if (bodyLines.length > 0)
          runs.push({
            text: bodyLines.join("\n"),
            options: { bold: false, fontSize: c.pt(20), color: toHex6(el.textColor) },
          });
        if (runs.length === 0) return;

        page.addText(runs, {
          x:      c.x(el.x + ci * (colPxW + el.gap)),
          y:      c.y(el.y),
          w:      c.w(colPxW),
          h:      c.h(el.height),
          border: { type: "solid", pt: 0.5, color: "CBD5E1" },
          fill:   { color: "FFFFFF" },
          inset:  0.12,
          valign: "top",
          wrap:   true,
        });
      });
      break;
    }

    // ── Icon ──────────────────────────────────────────────────────────
    case "icon": {
      const char = (() => {
        const k = el.iconName.toLowerCase();
        if (k.includes("check"))                   return "✓";
        if (k.includes("alert") || k.includes("warning")) return "⚠";
        if (k.includes("rocket"))                  return "🚀";
        if (k.includes("idea") || k.includes("light"))    return "💡";
        return "✦";
      })();
      page.addText(char, {
        ...pos,
        shape:    "ellipse",
        fill:     { color: toHex6(el.background) },
        line:     { type: "none" },
        color:    toHex6(el.color),
        fontSize: c.pt(el.fontSize),
        align:    "center",
        valign:   "middle",
      });
      break;
    }

    // ── Group ─────────────────────────────────────────────────────────
    case "group": {
      page.addShape("rect", {
        ...pos,
        fill: { type: "none" },
        line: { type: "dash", pt: 1, color: toHex6(el.borderColor) },
      });
      if (el.label.trim()) {
        page.addText(el.label, {
          ...pos,
          color:    "475569",
          fontSize: c.pt(22),
          bold:     true,
          valign:   "top",
          inset:    0.1,
        });
      }
      break;
    }
  }
}

/* ------------------------------------------------------------------ */
/*  Export to PowerPoint — fully editable native elements               */
/* ------------------------------------------------------------------ */

export async function exportToPptx(
  presentation: Presentation,
  _setSlide: (index: number) => void,
): Promise<void> {
  const slides = presentation.slides;
  if (!slides || slides.length === 0)
    throw new Error("Aucune slide a exporter.");

  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "MyTopic";
  pptx.title = presentation.presentation_title || "Presentation";
  pptx.subject = presentation.presentation_title || "Presentation";

  for (const slide of slides) {
    const scene = slide.editor_scene;
    const c = makeConverters(scene.width || 1600, scene.height || 900);
    const page = pptx.addSlide();

    const sorted = [...scene.elements]
      .filter((el) => el.visible !== false)
      .sort((a, b) => a.zIndex - b.zIndex);

    for (const el of sorted) {
      try {
        addElementToSlide(page, el, c);
      } catch {
        // One failing element must not abort the entire slide
      }
    }

    if (slide.speaker_notes) {
      page.addNotes(slide.speaker_notes);
    }
  }

  const filename = sanitizeFilename(presentation.presentation_title);
  await pptx.writeFile({ fileName: `${filename}.pptx` });
}
