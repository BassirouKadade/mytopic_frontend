import { SlideHeader, TemplateCanvas } from "@/presentation/primitives";
import { getComparisonItems } from "@/presentation/content";
import type { SlideTemplateProps } from "@/presentation/types";
import { TemplateFooter } from "./shared";

/**
 * Rend une slide de comparaison compacte pour limiter les debordements.
 * @param props Proprietes normalisees de rendu d'une slide.
 * @returns Une grille de comparaison lisible dans un espace reduit.
 * Securite:
 * - Composant de presentation sans manipulation de donnees sensibles.
 */
export function ComparisonTemplate(props: SlideTemplateProps) {
  const items = getComparisonItems(props.slide).slice(0, 4);
  const columns = items.length > 2 ? 2 : items.length;

  return (
    <TemplateCanvas {...props}>
      <SlideHeader slide={props.slide} eyebrow="Comparison" />
      <div className="mt-7 flex-1 min-h-0 overflow-y-auto pr-1">
        <div
          className={columns === 1 ? "grid gap-5" : "grid gap-5 md:grid-cols-2"}
        >
          {items.map((item) => (
            <div key={item.title} className="border-t border-slate-300 pt-4">
              <p className="text-lg font-semibold text-slate-950">
                {item.title}
              </p>
              <p className="mt-2 text-[14px] leading-7 text-slate-700">
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
