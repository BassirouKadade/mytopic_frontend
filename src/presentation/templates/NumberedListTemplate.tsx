import { SlideHeader, TemplateCanvas } from "@/presentation/primitives";
import { stripBulletPrefix } from "@/presentation/content";
import type { SlideTemplateProps } from "@/presentation/types";
import { TemplateFooter } from "./shared";

/**
 * Rend une slide de liste numerotee avec gestion du debordement vertical.
 * @param props Proprietes normalisees de rendu d'une slide.
 * @returns Une liste ordonnee stable meme avec beaucoup de contenu.
 * Securite:
 * - Le composant ne traite aucune information sensible.
 */
export function NumberedListTemplate(props: SlideTemplateProps) {
  const visibleItems = props.slide.main_content.slice(0, 8);

  return (
    <TemplateCanvas {...props}>
      <SlideHeader slide={props.slide} eyebrow="Ordered steps" />
      <div className="mt-7 flex-1 min-h-0 overflow-y-auto pr-1">
        <ol className="space-y-2.5">
          {visibleItems.map((item, index) => (
            <li key={`${item}-${index}`} className="flex gap-3">
              <span className="min-w-7 text-base font-semibold text-slate-400">
                {index + 1}.
              </span>
              <p className="text-[14px] leading-6 text-slate-700">
                {stripBulletPrefix(item)}
              </p>
            </li>
          ))}
        </ol>
      </div>
      <TemplateFooter {...props} />
    </TemplateCanvas>
  );
}
