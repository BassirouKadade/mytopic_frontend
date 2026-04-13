import { SlideHeader, TemplateCanvas } from "@/presentation/primitives";
import { getCardItems } from "@/presentation/content";
import type { SlideTemplateProps } from "@/presentation/types";
import { TemplateFooter } from "./shared";

/**
 * Rend une slide de points cles avec liste compacte.
 * @param props Proprietes normalisees de la slide.
 * @returns Une liste de takeaways avec marges reduites.
 * Securite:
 * - Rendu visuel uniquement, sans donnees sensibles.
 */
export function TakeawaysTemplate(props: SlideTemplateProps) {
  const cards = getCardItems(props.slide);

  return (
    <TemplateCanvas {...props}>
      <SlideHeader slide={props.slide} eyebrow="Takeaways" />
      <div className="mt-7 flex-1 min-h-0 space-y-3 overflow-y-auto pr-1">
        <p className="max-w-5xl text-[16px] leading-7 text-slate-900">
          {props.slide.purpose || cards[0]?.description || props.slide.title}
        </p>
        <ul className="space-y-2.5">
          {cards.slice(0, 4).map((item, index) => (
            <li key={item.title} className="flex gap-3">
              <span className="min-w-7 text-sm font-semibold text-slate-400">
                {index + 1}.
              </span>
              <div>
                <p className="text-base font-medium text-slate-950">
                  {item.title}
                </p>
                <p className="mt-1 text-[14px] leading-7 text-slate-700">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <TemplateFooter {...props} />
    </TemplateCanvas>
  );
}
