import { SlideHeader, TemplateCanvas } from "@/presentation/primitives";
import { getDefinitionItems } from "@/presentation/content";
import type { SlideTemplateProps } from "@/presentation/types";
import { ParagraphTemplate } from "./ParagraphTemplate";
import { TemplateFooter } from "./shared";

/**
 * Rend une slide de definitions avec densite typographique optimisee.
 * @param props Proprietes normalisees du rendu de slide.
 * @returns Une liste de definitions compacte et stable.
 * Securite:
 * - Le composant est purement presentatif.
 */
export function DefinitionTemplate(props: SlideTemplateProps) {
  const definitions = getDefinitionItems(props.slide).slice(0, 6);

  if (definitions.length === 0) {
    return <ParagraphTemplate {...props} />;
  }

  return (
    <TemplateCanvas {...props}>
      <SlideHeader slide={props.slide} eyebrow="Definition" />
      <div className="mt-6 flex-1 min-h-0 overflow-y-auto pr-1">
        <div className="space-y-2">
          {definitions.map((item) => (
            <div key={item.term} className="border-b border-slate-200 pb-2">
              <p className="text-base font-semibold tracking-[-0.02em] text-slate-950">
                {item.term}
              </p>
              <p className="mt-1 text-[13px] leading-6 text-slate-700">
                {item.explanation}
              </p>
            </div>
          ))}
        </div>
      </div>
      <TemplateFooter {...props} />
    </TemplateCanvas>
  );
}
