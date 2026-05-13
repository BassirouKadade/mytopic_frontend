import { useLayoutEffect, useRef, useState } from "react";
import { StaticSceneRenderer } from "@/presentation/StaticSceneRenderer";
import type { Presentation } from "@/services/api";
import { cn } from "@/lib/utils";

interface SlideThumbnailProps {
  presentation: Presentation;
  slideIndex?: number;
  className?: string;
}

/**
 * Affiche une vignette fidèle de la VRAIE slide telle qu'elle apparaît
 * dans la PresentationPage. Rend l'EditorScene à sa taille native
 * (scene.width × scene.height — typiquement 1280×720) puis applique
 * un transform: scale pour rentrer dans le conteneur. Aspect ratio
 * 16/9 préservé.
 */
export function SlideThumbnail({
  presentation,
  slideIndex = 0,
  className,
}: SlideThumbnailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  const slide = presentation.slides[slideIndex];
  const scene = slide?.editor_scene;
  const sceneWidth = scene?.width ?? 1280;

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const w = el.clientWidth;
      if (w > 0) setScale(w / sceneWidth);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [sceneWidth]);

  if (!slide || !scene) return null;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full overflow-hidden bg-white pointer-events-none select-none",
        className,
      )}
      style={{ aspectRatio: `${scene.width} / ${scene.height}` }}
    >
      {scale > 0 && (
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <StaticSceneRenderer scene={scene} />
        </div>
      )}
    </div>
  );
}
