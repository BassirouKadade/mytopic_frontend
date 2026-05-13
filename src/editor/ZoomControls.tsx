import { useCallback, useEffect, useRef, useState } from "react";
import { Minus, Maximize, Plus } from "lucide-react";
import { useControls } from "react-zoom-pan-pinch";

const ZOOM_PRESETS = [25, 50, 75, 100, 125, 150, 200, 300];
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.25;

interface ZoomControlsProps {
  zoom: number;
}

export function ZoomControls({ zoom }: ZoomControlsProps) {
  const { zoomIn, zoomOut, centerView } = useControls();

  const percent = Math.round(zoom * 100);

  const handleZoomIn = useCallback(() => {
    zoomIn(ZOOM_STEP, 120);
  }, [zoomIn]);

  const handleZoomOut = useCallback(() => {
    zoomOut(ZOOM_STEP, 120);
  }, [zoomOut]);

  const handleReset = useCallback(() => {
    centerView(1, 160);
  }, [centerView]);

  const handlePreset = useCallback(
    (targetPercent: number) => {
      const targetScale = targetPercent / 100;
      // centerView(scale, animationTime) — sets zoom & re-centers content
      centerView(targetScale, 200);
    },
    [centerView],
  );

  /* preset dropdown */
  const [showPresets, setShowPresets] = useState(false);
  const presetsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showPresets) return;
    const close = (e: MouseEvent) => {
      if (
        presetsRef.current &&
        !presetsRef.current.contains(e.target as Node)
      ) {
        setShowPresets(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [showPresets]);

  return (
    <div
      className="absolute bottom-4 right-4 z-50 flex items-center gap-1 rounded-lg border border-white/60 bg-white/95 px-1.5 py-1 shadow-lg backdrop-blur-xl"
      style={{
        boxShadow:
          "0 2px 12px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onWheel={(e) => e.stopPropagation()}
    >
      {/* zoom out */}
      <button
        onClick={handleZoomOut}
        disabled={zoom <= MIN_ZOOM}
        className="flex size-9 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Dezoomer"
      >
        <Minus className="size-4" strokeWidth={2} />
      </button>

      {/* percentage label / preset picker */}
      <div className="relative" ref={presetsRef}>
        <button
          onClick={() => setShowPresets((v) => !v)}
          className="min-w-14 rounded-md px-2 py-2 text-center text-sm font-semibold tabular-nums text-slate-700 transition-colors hover:bg-slate-100"
        >
          {percent}%
        </button>

        {showPresets && (
          <div className="absolute bottom-full right-0 z-50 mb-2 rounded-xl border border-slate-200/80 bg-white/95 p-1 shadow-xl backdrop-blur-xl min-w-25">
            {ZOOM_PRESETS.map((p) => (
              <button
                key={p}
                onClick={() => {
                  handlePreset(p);
                  setShowPresets(false);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-[11px] cursor-pointer transition-colors ${
                  p === percent
                    ? "bg-primary/10 font-semibold text-primary"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span>{p}%</span>
                {p === 100 && (
                  <span className="text-[9px] text-slate-400 ml-2">reset</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* zoom in */}
      <button
        onClick={handleZoomIn}
        disabled={zoom >= MAX_ZOOM}
        className="flex size-9 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Zoomer"
      >
        <Plus className="size-4" strokeWidth={2} />
      </button>

      {/* divider */}
      <div className="mx-0.5 h-5 w-px bg-slate-200" />

      {/* fit / reset */}
      <button
        onClick={handleReset}
        className="flex size-9 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
        aria-label="Ajuster a l'ecran"
        title="Ajuster (100%)"
      >
        <Maximize className="size-4" strokeWidth={2} />
      </button>
    </div>
  );
}
