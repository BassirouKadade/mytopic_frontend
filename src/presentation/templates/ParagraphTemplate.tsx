import { SlideHeader, TemplateCanvas } from "@/presentation/primitives";
import { getParagraphs } from "@/presentation/content";
import type { SlideTemplateProps } from "@/presentation/types";
import { TemplateFooter } from "./shared";

/**
 * Rend une slide textuelle avec paragraphs compactes.
 * @param props Proprietes normalisees du rendu de slide.
 * @returns Une zone texte lisible sans depassement vertical.
 * Securite:
 * - Affichage local uniquement, aucune operation sensible.
 */
export function ParagraphTemplate(props: SlideTemplateProps) {
  const paragraphs = getParagraphs(props.slide).slice(0, 4);

  return (
    <TemplateCanvas {...props}>
      <SlideHeader slide={props.slide} />
      <div className="mt-7 flex-1 min-h-0 overflow-y-auto space-y-3 pr-1">
        {paragraphs.map((item, index) => (
          <p
            key={`${item}-${index}`}
            className="max-w-5xl text-[14px] leading-7 text-slate-700"
          >
            {item}
          </p>
        ))}
      </div>
      <TemplateFooter {...props} />
    </TemplateCanvas>
  );
}
