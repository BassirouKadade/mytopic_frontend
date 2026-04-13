import { SlideHeader, TemplateCanvas } from "@/presentation/primitives";
import { getAgendaItems } from "@/presentation/content";
import type { SlideTemplateProps } from "@/presentation/types";
import { TemplateFooter } from "./shared";

/**
 * Rend une slide agenda compacte pour eviter les debordements visuels.
 * @param props Proprietes normalisees de rendu d'une slide.
 * @returns Une liste d'etapes stable et lisible sur la hauteur disponible.
 * Securite:
 * - Aucune donnee sensible n'est traitee; rendu local seulement.
 */
export function AgendaTemplate(props: SlideTemplateProps) {
  const items = getAgendaItems(props.slide);
  const useTwoColumns = items.length > 6;

  const leftColumnItems = useTwoColumns
    ? items.slice(0, Math.ceil(items.length / 2))
    : items;
  const rightColumnItems = useTwoColumns
    ? items.slice(Math.ceil(items.length / 2))
    : [];

  return (
    <TemplateCanvas {...props}>
      <SlideHeader slide={props.slide} eyebrow="Structure" />
      <div className="mt-5 flex min-h-0 flex-1 items-start overflow-y-auto pr-1">
        <div
          className={
            useTwoColumns ? "grid w-full gap-6 md:grid-cols-2" : "w-full"
          }
        >
          <ol className="space-y-2">
            {leftColumnItems.map((item, index) => (
              <li
                key={`${item}-${index}`}
                className="flex items-start gap-3 border-b border-slate-200/80 pb-2"
              >
                <span className="pt-0.5 text-sm font-semibold text-slate-400">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-[clamp(13px,1.5vw,17px)] font-semibold leading-tight tracking-[-0.01em] text-slate-800">
                  {item}
                </p>
              </li>
            ))}
          </ol>

          {useTwoColumns && (
            <ol className="space-y-2" start={leftColumnItems.length + 1}>
              {rightColumnItems.map((item, index) => (
                <li
                  key={`${item}-${index + leftColumnItems.length}`}
                  className="flex items-start gap-3 border-b border-slate-200/80 pb-2"
                >
                  <span className="pt-0.5 text-sm font-semibold text-slate-400">
                    {String(index + leftColumnItems.length + 1).padStart(
                      2,
                      "0",
                    )}
                  </span>
                  <p className="text-[clamp(13px,1.5vw,17px)] font-semibold leading-tight tracking-[-0.01em] text-slate-800">
                    {item}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
      <TemplateFooter {...props} />
    </TemplateCanvas>
  );
}
