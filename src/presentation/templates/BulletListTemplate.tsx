import { SlideHeader, TemplateCanvas } from "@/presentation/primitives";
import { stripBulletPrefix } from "@/presentation/content";
import type { SlideTemplateProps } from "@/presentation/types";
import { TemplateFooter } from "./shared";

/**
 * Rend une slide de liste a puces avec zone defilable interne.
 * @param props Proprietes normalisees de rendu d'une slide.
 * @returns Une liste lisible qui evite les debordements hors slide.
 * Securite:
 * - Aucun acces reseau ou donnee sensible; rendu local uniquement.
 */
export function BulletListTemplate(props: SlideTemplateProps) {
  const visibleItems = props.slide.main_content.slice(0, 8);

  return (
    <TemplateCanvas {...props}>
      <SlideHeader slide={props.slide} eyebrow="Key points" />
      <div className="mt-7 flex-1 min-h-0 overflow-y-auto pr-1">
        <ul className="space-y-2.5">
          {visibleItems.map((item, index) => (
            <li key={`${item}-${index}`} className="flex gap-3">
              <span className="pt-1.5 text-slate-500">&bull;</span>
              <p className="text-[14px] leading-6 text-slate-700">
                {stripBulletPrefix(item)}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <TemplateFooter {...props} />
    </TemplateCanvas>
  );
}
