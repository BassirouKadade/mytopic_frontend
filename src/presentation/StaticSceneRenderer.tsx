import type React from "react";
import type { EditorScene, SlideElement } from "@/services/api";

/**
 * Rend une EditorScene en lecture seule, à sa taille native.
 * Reproduit fidèlement le rendu de SlideEditorCanvas (mêmes positions,
 * mêmes styles, mêmes éléments) mais sans interactions, sans handles,
 * sans inline editing — destiné à être scalé pour faire des vignettes
 * fidèles à l'aperçu réel de la présentation.
 */

function iconFor(name: string): string {
  const key = name.toLowerCase();
  if (key.includes("check")) return "✓";
  if (key.includes("alert") || key.includes("warning")) return "!";
  if (key.includes("rocket")) return "🚀";
  if (key.includes("idea") || key.includes("light")) return "💡";
  return "✦";
}

function renderElement(el: SlideElement) {
  if (el.type === "text") {
    return el.text;
  }

  if (el.type === "shape") {
    if (!el.label.trim()) return null;
    return (
      <div
        style={{
          width: "100%",
          color: el.textColor,
          fontSize: el.fontSize,
          fontWeight: el.fontWeight,
          textAlign: el.textAlign,
          lineHeight: 1.2,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          padding: "2px 6px",
        }}
      >
        {el.label}
      </div>
    );
  }

  if (el.type === "list") {
    const ListTag = el.ordered ? "ol" : "ul";
    return (
      <ListTag
        style={{
          margin: 0,
          paddingInlineStart: 26,
          color: el.color,
          fontSize: el.fontSize,
          fontFamily: el.fontFamily,
          fontWeight: el.fontWeight,
          lineHeight: el.lineHeight,
        }}
      >
        {el.items.map((item, index) => (
          <li key={`${el.id}-${index}`}>{item}</li>
        ))}
      </ListTag>
    );
  }

  if (el.type === "table") {
    return (
      <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: el.fontSize,
            color: el.textColor,
            background: "#ffffff",
          }}
        >
          <thead>
            <tr>
              {el.headers.map((header, index) => (
                <th
                  key={`${el.id}-h-${index}`}
                  style={{
                    border: `1px solid ${el.borderColor}`,
                    background: el.headerFill,
                    padding: "8px 10px",
                    textAlign: "left",
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {el.rows.map((row, rowIndex) => (
              <tr key={`${el.id}-r-${rowIndex}`}>
                {el.headers.map((_, columnIndex) => (
                  <td
                    key={`${el.id}-c-${rowIndex}-${columnIndex}`}
                    style={{
                      border: `1px solid ${el.borderColor}`,
                      padding: "8px 10px",
                    }}
                  >
                    {row[columnIndex] ?? ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (el.type === "media") {
    const commonStyle: React.CSSProperties = {
      width: "100%",
      height: "100%",
      objectFit: el.fit,
      borderRadius: el.borderRadius,
      background: el.background,
    };

    if (el.mediaKind === "video") {
      return el.src ? (
        <video style={commonStyle} src={el.src} />
      ) : (
        <div style={commonStyle} />
      );
    }

    return el.src ? (
      <img style={commonStyle} src={el.src} alt={el.alt || "image"} />
    ) : (
      <div style={commonStyle} />
    );
  }

  if (el.type === "icon") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: el.fontSize,
          color: el.color,
          background: el.background,
          borderRadius: 18,
        }}
      >
        {iconFor(el.iconName)}
      </div>
    );
  }

  if (el.type === "chart") {
    const max = Math.max(...el.values, 1);
    const count = Math.max(el.values.length, 1);
    return (
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${el.width} ${el.height}`}
        role="img"
        aria-label="chart"
      >
        <rect
          x={0}
          y={0}
          width={el.width}
          height={el.height}
          fill="#ffffff"
          rx={16}
        />
        {el.chartKind === "bar" &&
          el.values.map((value, index) => {
            const barWidth = (el.width - 80) / count - 12;
            const x = 50 + index * ((el.width - 80) / count);
            const h = ((el.height - 120) * value) / max;
            const y = el.height - 50 - h;
            return (
              <g key={`${el.id}-bar-${index}`}>
                <rect
                  x={x}
                  y={y}
                  width={Math.max(20, barWidth)}
                  height={h}
                  rx={8}
                  fill={el.palette[index % el.palette.length] ?? "#0ea5e9"}
                />
                <text
                  x={x + barWidth / 2}
                  y={el.height - 20}
                  textAnchor="middle"
                  fontSize={16}
                  fill="#334155"
                >
                  {el.labels[index] ?? ""}
                </text>
              </g>
            );
          })}
        {el.chartKind === "line" && (
          <>
            <polyline
              fill="none"
              stroke={el.strokeColor}
              strokeWidth={4}
              points={el.values
                .map((value, index) => {
                  const px =
                    40 +
                    index *
                      ((el.width - 80) / Math.max(el.values.length - 1, 1));
                  const py =
                    el.height - 50 - ((el.height - 120) * value) / max;
                  return `${px},${py}`;
                })
                .join(" ")}
            />
            {el.values.map((value, index) => {
              const px =
                40 +
                index * ((el.width - 80) / Math.max(el.values.length - 1, 1));
              const py = el.height - 50 - ((el.height - 120) * value) / max;
              return (
                <circle
                  key={`${el.id}-line-${index}`}
                  cx={px}
                  cy={py}
                  r={6}
                  fill={el.palette[index % el.palette.length] ?? "#0ea5e9"}
                />
              );
            })}
          </>
        )}
      </svg>
    );
  }

  if (el.type === "columns") {
    const columnWidth =
      (el.width - el.gap * (el.columns.length - 1)) /
      Math.max(el.columns.length, 1);
    return (
      <div
        style={{
          display: "flex",
          gap: el.gap,
          width: "100%",
          height: "100%",
        }}
      >
        {el.columns.map((column, index) => (
          <div
            key={`${el.id}-column-${index}`}
            style={{
              width: columnWidth,
              background: "#ffffff",
              border: "1px solid #cbd5e1",
              borderRadius: 16,
              padding: 18,
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                color: el.titleColor,
                fontWeight: 700,
                fontSize: 22,
                marginBottom: 8,
              }}
            >
              {column[0] ?? `Colonne ${index + 1}`}
            </div>
            <div
              style={{
                color: el.textColor,
                fontSize: 20,
                lineHeight: 1.35,
                whiteSpace: "pre-wrap",
              }}
            >
              {column.slice(1).join("\n")}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (el.type === "group") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          border: `2px dashed ${el.borderColor}`,
          borderRadius: 18,
          background: el.fill,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          padding: 10,
          color: "#475569",
          fontWeight: 600,
        }}
      >
        {el.label}
      </div>
    );
  }

  if (el.type === "background") {
    const pattern =
      el.pattern === "grid"
        ? "linear-gradient(90deg, rgba(15,23,42,0.08) 1px, transparent 1px), linear-gradient(0deg, rgba(15,23,42,0.08) 1px, transparent 1px)"
        : el.pattern === "dots"
          ? "radial-gradient(circle, rgba(15,23,42,0.14) 1px, transparent 1px)"
          : "none";
    const backgroundSize = el.pattern === "grid" ? "28px 28px" : "20px 20px";
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: `linear-gradient(135deg, ${el.fill}, ${el.accent})`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {el.pattern !== "none" && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: pattern,
              backgroundSize,
              opacity: 0.35,
            }}
          />
        )}
      </div>
    );
  }

  return null;
}

interface StaticSceneRendererProps {
  scene: EditorScene;
}

/**
 * Wrapper qui rend la scène à ses dimensions natives (scene.width × scene.height).
 * À utiliser dans un conteneur scalé via CSS transform pour faire des vignettes.
 */
export function StaticSceneRenderer({ scene }: StaticSceneRendererProps) {
  const sortedElements = [...scene.elements]
    .filter((el) => el.visible !== false)
    .sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div
      style={{
        width: scene.width,
        height: scene.height,
        position: "relative",
        background: scene.background || "#ffffff",
        overflow: "hidden",
      }}
    >
      {sortedElements.map((el) => {
        const isText = el.type === "text";
        const isShape = el.type === "shape";

        const baseStyle: React.CSSProperties = {
          position: "absolute",
          zIndex: el.zIndex,
          left: el.x,
          top: el.y,
          opacity: el.opacity,
          transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
          transformOrigin: "center center",
          boxSizing: "border-box",
          ...(isText
            ? {
                width: "max-content",
                maxWidth: el.width,
                minWidth: 20,
                color: el.color,
                fontSize: el.fontSize,
                fontFamily: el.fontFamily,
                fontWeight: el.fontWeight,
                fontStyle: el.fontStyle === "italic" ? "italic" : "normal",
                textAlign: el.align as React.CSSProperties["textAlign"],
                lineHeight: el.lineHeight,
                whiteSpace: "pre-wrap" as const,
                wordBreak: "break-word" as const,
                overflow: "visible" as const,
              }
            : {
                width: el.width,
                height: el.height,
              }),
          ...(isShape
            ? {
                backgroundColor: el.fill,
                border:
                  el.strokeWidth > 0
                    ? `${Math.max(1.5, el.strokeWidth)}px solid ${el.stroke}`
                    : undefined,
                borderRadius:
                  el.shape === "ellipse"
                    ? "50%"
                    : el.cornerRadius > 0
                      ? el.cornerRadius
                      : undefined,
                display: "flex",
                alignItems: "center",
                justifyContent:
                  el.textAlign === "left"
                    ? "flex-start"
                    : el.textAlign === "right"
                      ? "flex-end"
                      : "center",
                padding: 10,
              }
            : {}),
        };

        return (
          <div key={el.id} style={baseStyle}>
            {renderElement(el)}
          </div>
        );
      })}
    </div>
  );
}
