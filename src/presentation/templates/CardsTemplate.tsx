import { SlideHeader, TemplateCanvas } from "@/presentation/primitives";
import { getCardItems } from "@/presentation/content";
import type { SlideTemplateProps } from "@/presentation/types";
import { TemplateFooter } from "./shared";

/**
 * Rend une slide a cartes textuelles avec espacement minimaliste.
 * @param props Proprietes normalisees du rendu de slide.
 * @returns Une pile de cartes lisibles sans surcharge de padding.
 * Securite:
 * - Aucune operation critique, rendu client uniquement.
 */
export function CardsTemplate(props: SlideTemplateProps) {
  const cards = getCardItems(props.slide).slice(0, 6);

  return (
    <TemplateCanvas {...props}>
      <SlideHeader slide={props.slide} />
      <div className="mt-7 flex-1 min-h-0 overflow-y-auto pr-1">
        <div className="space-y-3">
          {cards.map((item) => (
            <div key={item.title} className="border-b border-slate-200 pb-3">
              <p className="text-base font-semibold tracking-[-0.02em] text-slate-950">
                {item.title}
              </p>
              <p className="mt-1.5 text-[14px] leading-7 text-slate-700">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      <TemplateFooter {...props} />
    </TemplateCanvas>
  );
}
