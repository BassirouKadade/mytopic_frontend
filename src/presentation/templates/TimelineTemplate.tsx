import { Panel, SlideHeader, TemplateCanvas } from "@/presentation/primitives";
import { MiniDiagram } from "@/presentation/KonvaScene";
import { stripBulletPrefix } from "@/presentation/content";
import type { SlideTemplateProps } from "@/presentation/types";
import { TemplateFooter } from "./shared";

/**
 * Rend une slide de type timeline avec etapes numerotees.
 * @param props Proprietes normalisees de rendu d'une slide.
 * @returns Une composition timeline lisible avec diagramme de support.
 * Securite:
 * - Le composant affiche uniquement du contenu deja prepare cote application.
 */
export function TimelineTemplate(props: SlideTemplateProps) {
  return (
    <TemplateCanvas {...props}>
      <SlideHeader slide={props.slide} eyebrow="Timeline" />
      <div className="mt-8 grid flex-1 gap-5 md:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          {props.slide.main_content.slice(0, 4).map((item, index) => (
            <Panel key={`${item}-${index}`} className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-sm font-semibold text-primary">
                {index + 1}
              </div>
              <p className="pt-1 text-[15px] leading-7 text-slate-700">
                {stripBulletPrefix(item)}
              </p>
            </Panel>
          ))}
        </div>
        <MiniDiagram mode="timeline" items={props.slide.main_content} />
      </div>
      <TemplateFooter {...props} />
    </TemplateCanvas>
  );
}
