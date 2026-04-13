import { Panel, SlideHeader, TemplateCanvas } from "@/presentation/primitives";
import { MiniDiagram } from "@/presentation/KonvaScene";
import { stripBulletPrefix } from "@/presentation/content";
import type { SlideTemplateProps } from "@/presentation/types";
import { CardGrid, TemplateFooter } from "./shared";

/**
 * Rend une roadmap avec espacement serre entre phases.
 * @param props Proprietes normalisees de la slide.
 * @returns Une vue roadmap compacte et lisible.
 * Securite:
 * - Aucune manipulation sensible; composant presentatif.
 */
export function RoadmapTemplate(props: SlideTemplateProps) {
  return (
    <TemplateCanvas {...props}>
      <SlideHeader slide={props.slide} eyebrow="Roadmap" />
      <div className="mt-7 flex-1 min-h-0 space-y-3 overflow-y-auto pr-1">
        <MiniDiagram mode="timeline" items={props.slide.main_content} />
        <CardGrid columns={props.slide.main_content.length > 4 ? 3 : 2}>
          {props.slide.main_content.slice(0, 6).map((item, index) => (
            <Panel key={`${item}-${index}`}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Phase {index + 1}
              </p>
              <p className="mt-2 text-[13px] leading-6 text-slate-700">
                {stripBulletPrefix(item)}
              </p>
            </Panel>
          ))}
        </CardGrid>
      </div>
      <TemplateFooter {...props} />
    </TemplateCanvas>
  );
}
