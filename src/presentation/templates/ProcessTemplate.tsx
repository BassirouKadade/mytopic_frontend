import { SlideHeader, TemplateCanvas } from "@/presentation/primitives";
import { MiniDiagram } from "@/presentation/KonvaScene";
import type { SlideTemplateProps } from "@/presentation/types";
import { BulletGrid, TemplateFooter } from "./shared";

/**
 * Rend un processus avec ecarts minimises entre diagramme et liste.
 * @param props Proprietes normalisees de la slide.
 * @returns Une slide process compacte sans espaces excessifs.
 * Securite:
 * - Rendu local sans donnees sensibles.
 */
export function ProcessTemplate(props: SlideTemplateProps) {
  return (
    <TemplateCanvas {...props}>
      <SlideHeader slide={props.slide} eyebrow="Process" />
      <div className="mt-7 flex-1 min-h-0 space-y-3 overflow-y-auto pr-1">
        <MiniDiagram mode="process" items={props.slide.main_content} />
        <BulletGrid items={props.slide.main_content} numbered />
      </div>
      <TemplateFooter {...props} />
    </TemplateCanvas>
  );
}
