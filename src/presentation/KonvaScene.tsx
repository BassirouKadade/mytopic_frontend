import { memo } from "react";
import { Arrow, Circle, Layer, Line, Rect, Stage, Text } from "react-konva";

import { useElementSize } from "@/presentation/useElementSize";
import { cn } from "@/lib/utils";

type DiagramMode = "timeline" | "process" | "workflow" | "architecture";

interface SlideBackdropProps {
  variant: string;
}

interface MiniDiagramProps {
  mode: DiagramMode;
  items: string[];
  className?: string;
}

export const SlideBackdrop = memo(function SlideBackdrop({
  variant,
}: SlideBackdropProps) {
  const { ref, size } = useElementSize<HTMLDivElement>();

  return (
    <div ref={ref} className="absolute inset-0 pointer-events-none">
      {size.width > 0 && size.height > 0 ? (
        <Stage width={size.width} height={size.height}>
          <Layer>
            <Rect
              x={0}
              y={0}
              width={size.width}
              height={size.height}
              fillLinearGradientStartPoint={{ x: 0, y: 0 }}
              fillLinearGradientEndPoint={{ x: size.width, y: size.height }}
              fillLinearGradientColorStops={[
                0,
                "#ffffff",
                0.55,
                "#fffaf0",
                1,
                "#f8fbff",
              ]}
            />

            <Rect
              x={0}
              y={0}
              width={size.width}
              height={14}
              fillLinearGradientStartPoint={{ x: 0, y: 0 }}
              fillLinearGradientEndPoint={{ x: size.width, y: 0 }}
              fillLinearGradientColorStops={[
                0,
                "#f59e0b",
                0.55,
                "#fb7185",
                1,
                "#3b82f6",
              ]}
              opacity={0.9}
            />

            <Circle
              x={size.width * 0.82}
              y={size.height * 0.18}
              radius={Math.max(56, size.width * 0.09)}
              fill="#f59e0b"
              opacity={variant.includes("hero") ? 0.1 : 0.05}
            />
            <Circle
              x={size.width * 0.16}
              y={size.height * 0.82}
              radius={Math.max(48, size.width * 0.075)}
              fill="#2563eb"
              opacity={0.06}
            />
            <Rect
              x={size.width * 0.72}
              y={size.height * 0.62}
              width={size.width * 0.22}
              height={size.height * 0.22}
              cornerRadius={36}
              fill="#ffffff"
              stroke="#f1f5f9"
              strokeWidth={2}
              rotation={-10}
              opacity={0.75}
            />

            <Line
              points={[
                size.width * 0.1,
                size.height * 0.24,
                size.width * 0.34,
                size.height * 0.14,
                size.width * 0.56,
                size.height * 0.24,
              ]}
              stroke="#cbd5e1"
              strokeWidth={2}
              lineCap="round"
              dash={[12, 8]}
              opacity={0.45}
            />

            {variant.includes("grid") && (
              <>
                {[0, 1, 2].map((column) => (
                  <Rect
                    key={`grid-col-${column}`}
                    x={size.width * (0.58 + column * 0.08)}
                    y={size.height * 0.24}
                    width={size.width * 0.055}
                    height={size.height * 0.42}
                    cornerRadius={24}
                    fill="#ffffff"
                    stroke="#e2e8f0"
                    strokeWidth={1.5}
                    opacity={0.65}
                  />
                ))}
              </>
            )}

            {variant.includes("timeline") && (
              <>
                <Line
                  points={[
                    size.width * 0.12,
                    size.height * 0.78,
                    size.width * 0.88,
                    size.height * 0.78,
                  ]}
                  stroke="#94a3b8"
                  strokeWidth={3}
                  lineCap="round"
                  opacity={0.45}
                />
                {[0, 1, 2, 3].map((step) => (
                  <Circle
                    key={`timeline-node-${step}`}
                    x={size.width * (0.18 + step * 0.18)}
                    y={size.height * 0.78}
                    radius={10}
                    fill={step % 2 === 0 ? "#f59e0b" : "#2563eb"}
                    opacity={0.35}
                  />
                ))}
              </>
            )}

            {variant.includes("workflow") && (
              <>
                <Rect
                  x={size.width * 0.64}
                  y={size.height * 0.22}
                  width={size.width * 0.14}
                  height={size.height * 0.1}
                  cornerRadius={20}
                  fill="#ffffff"
                  stroke="#dbeafe"
                  strokeWidth={2}
                  opacity={0.7}
                />
                <Rect
                  x={size.width * 0.79}
                  y={size.height * 0.42}
                  width={size.width * 0.12}
                  height={size.height * 0.1}
                  cornerRadius={20}
                  fill="#ffffff"
                  stroke="#fee2e2"
                  strokeWidth={2}
                  opacity={0.7}
                />
                <Arrow
                  points={[
                    size.width * 0.71,
                    size.height * 0.32,
                    size.width * 0.85,
                    size.height * 0.42,
                  ]}
                  stroke="#94a3b8"
                  fill="#94a3b8"
                  pointerLength={8}
                  pointerWidth={8}
                  opacity={0.5}
                />
              </>
            )}
          </Layer>
        </Stage>
      ) : null}
    </div>
  );
});

export function MiniDiagram({ mode, items, className }: MiniDiagramProps) {
  const { ref, size } = useElementSize<HTMLDivElement>();
  const labels = items.slice(0, 4);

  return (
    <div
      ref={ref}
      className={cn(
        "relative min-h-52.5 overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/80 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.2)]",
        className,
      )}
    >
      {size.width > 0 && size.height > 0 ? (
        <Stage width={size.width} height={size.height}>
          <Layer>
            <Rect
              x={0}
              y={0}
              width={size.width}
              height={size.height}
              fillLinearGradientStartPoint={{ x: 0, y: 0 }}
              fillLinearGradientEndPoint={{ x: size.width, y: size.height }}
              fillLinearGradientColorStops={[
                0,
                "#ffffff",
                0.5,
                "#fafafa",
                1,
                "#f8fafc",
              ]}
            />

            {mode === "timeline" &&
              labels.map((item, index) => {
                const x = size.width * (0.18 + index * 0.22);
                return (
                  <>
                    {index > 0 && (
                      <Line
                        key={`timeline-line-${item}`}
                        points={[
                          x - size.width * 0.14,
                          size.height * 0.56,
                          x,
                          size.height * 0.56,
                        ]}
                        stroke="#94a3b8"
                        strokeWidth={3}
                        opacity={0.55}
                      />
                    )}
                    <Circle
                      key={`timeline-circle-${item}`}
                      x={x}
                      y={size.height * 0.56}
                      radius={14}
                      fill="#111827"
                      opacity={0.85}
                    />
                    <Text
                      key={`timeline-text-${item}`}
                      x={x - 46}
                      y={size.height * 0.18}
                      width={92}
                      text={item}
                      align="center"
                      fontSize={13}
                      fill="#334155"
                    />
                  </>
                );
              })}

            {mode === "process" &&
              labels.map((item, index) => {
                const x =
                  26 + index * (size.width / Math.max(labels.length, 1));
                return (
                  <>
                    <Rect
                      key={`process-rect-${item}`}
                      x={x}
                      y={size.height * 0.34}
                      width={Math.min(130, size.width * 0.22)}
                      height={52}
                      cornerRadius={18}
                      fill="#ffffff"
                      stroke="#111827"
                      strokeWidth={2}
                    />
                    <Text
                      key={`process-text-${item}`}
                      x={x + 14}
                      y={size.height * 0.34 + 17}
                      width={Math.min(102, size.width * 0.18)}
                      text={item}
                      fontSize={13}
                      fill="#0f172a"
                    />
                    {index < labels.length - 1 && (
                      <Arrow
                        key={`process-arrow-${item}`}
                        points={[
                          x + Math.min(130, size.width * 0.22),
                          size.height * 0.47,
                          x + Math.min(130, size.width * 0.22) + 28,
                          size.height * 0.47,
                        ]}
                        stroke="#94a3b8"
                        fill="#94a3b8"
                        pointerLength={8}
                        pointerWidth={8}
                      />
                    )}
                  </>
                );
              })}

            {mode === "workflow" &&
              labels.map((item, index) => {
                const positions = [
                  { x: size.width * 0.16, y: size.height * 0.26 },
                  { x: size.width * 0.58, y: size.height * 0.18 },
                  { x: size.width * 0.58, y: size.height * 0.62 },
                  { x: size.width * 0.18, y: size.height * 0.66 },
                ];
                const node =
                  positions[index] ?? positions[positions.length - 1];
                const next =
                  positions[(index + 1) % Math.max(labels.length, 1)];
                return (
                  <>
                    <Rect
                      key={`workflow-node-${item}`}
                      x={node.x}
                      y={node.y}
                      width={size.width * 0.22}
                      height={48}
                      cornerRadius={18}
                      fill="#ffffff"
                      stroke="#111827"
                      strokeWidth={2}
                    />
                    <Text
                      key={`workflow-text-${item}`}
                      x={node.x + 12}
                      y={node.y + 16}
                      width={size.width * 0.18}
                      text={item}
                      fontSize={13}
                      fill="#0f172a"
                    />
                    {index < labels.length - 1 && next && (
                      <Arrow
                        key={`workflow-arrow-${item}`}
                        points={[
                          node.x + size.width * 0.22,
                          node.y + 24,
                          next.x,
                          next.y + 24,
                        ]}
                        stroke="#94a3b8"
                        fill="#94a3b8"
                        pointerLength={8}
                        pointerWidth={8}
                      />
                    )}
                  </>
                );
              })}

            {mode === "architecture" && (
              <>
                <Rect
                  x={size.width * 0.33}
                  y={size.height * 0.12}
                  width={size.width * 0.34}
                  height={50}
                  cornerRadius={18}
                  fill="#ffffff"
                  stroke="#dbeafe"
                  strokeWidth={2}
                />
                <Text
                  x={size.width * 0.37}
                  y={size.height * 0.28 - 54}
                  width={size.width * 0.26}
                  text={labels[0] ?? "Core"}
                  fontSize={14}
                  align="center"
                  fill="#0f172a"
                />
                {[1, 2, 3].map((index) => {
                  const x = size.width * (0.08 + (index - 1) * 0.29);
                  const y = size.height * 0.58;
                  return (
                    <>
                      <Rect
                        key={`arch-rect-${index}`}
                        x={x}
                        y={y}
                        width={size.width * 0.22}
                        height={46}
                        cornerRadius={16}
                        fill="#ffffff"
                        stroke="#111827"
                        strokeWidth={2}
                      />
                      <Text
                        key={`arch-text-${index}`}
                        x={x + 10}
                        y={y + 14}
                        width={size.width * 0.18}
                        text={labels[index] ?? `Layer ${index}`}
                        fontSize={13}
                        align="center"
                        fill="#334155"
                      />
                      <Arrow
                        key={`arch-arrow-${index}`}
                        points={[
                          size.width * 0.5,
                          size.height * 0.36,
                          x + size.width * 0.11,
                          y,
                        ]}
                        stroke="#94a3b8"
                        fill="#94a3b8"
                        pointerLength={8}
                        pointerWidth={8}
                      />
                    </>
                  );
                })}
              </>
            )}
          </Layer>
        </Stage>
      ) : null}
    </div>
  );
}
