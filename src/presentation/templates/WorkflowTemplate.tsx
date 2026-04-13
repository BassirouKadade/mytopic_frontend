import { Panel, SlideHeader, TemplateCanvas } from "@/presentation/primitives";
import { MiniDiagram } from "@/presentation/KonvaScene";
import { stripBulletPrefix } from "@/presentation/content";
import type { SlideTemplateProps } from "@/presentation/types";
import { TemplateFooter } from "./shared";

/**
 * Rend une slide workflow en priorisant la lisibilite des etapes.
 * @param props Proprietes normalisees du rendu de slide.
 * @returns Une mise en page flux + noeuds avec densite controlee.
 * Securite:
 * - Aucun traitement de donnees sensibles; rendu local.
 */
export function WorkflowTemplate(props: SlideTemplateProps) {
  return (
    <TemplateCanvas {...props}>
      <SlideHeader slide={props.slide} eyebrow="Flow" />
      <div className="mt-7 grid flex-1 min-h-0 gap-4 md:grid-cols-[1.05fr_0.95fr]">
        <MiniDiagram
          mode={
            props.resolvedSemanticType === "business.architecture"
              ? "architecture"
              : "workflow"
          }
          items={props.slide.main_content}
        />
        <div className="space-y-3 overflow-y-auto pr-1">
          {props.slide.main_content.slice(0, 4).map((item, index) => (
            <Panel key={`${item}-${index}`}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Node {index + 1}
              </p>
              <p className="mt-2 text-[13px] leading-6 text-slate-700">
                {stripBulletPrefix(item)}
              </p>
            </Panel>
          ))}
        </div>
      </div>
      <TemplateFooter {...props} />
    </TemplateCanvas>
  );
}
