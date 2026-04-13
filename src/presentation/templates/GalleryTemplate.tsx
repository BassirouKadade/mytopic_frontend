import { Panel, SlideHeader, TemplateCanvas } from "@/presentation/primitives";
import { getCardItems } from "@/presentation/content";
import type { SlideTemplateProps } from "@/presentation/types";
import { TemplateFooter } from "./shared";

/**
 * Rend une slide galerie sous forme de cartes visuelles coherentes.
 * @param props Proprietes normalisees de rendu d'une slide.
 * @returns Une grille de visuels textuels harmonisee avec le theme.
 * Securite:
 * - Aucune operation sensible; rendu purement presentatif cote client.
 */
export function GalleryTemplate(props: SlideTemplateProps) {
  const cards = getCardItems(props.slide).slice(0, 4);

  return (
    <TemplateCanvas {...props}>
      <SlideHeader slide={props.slide} eyebrow="Gallery" />
      <div className="mt-8 grid flex-1 gap-4 md:grid-cols-2">
        {cards.map((item, index) => (
          <Panel key={item.title} className="overflow-hidden p-0">
            <div className="h-32 bg-gradient-to-br from-primary/15 via-white to-sky-100" />
            <div className="space-y-3 p-5">
              <p className="text-sm font-semibold text-slate-950">
                Visual {index + 1}: {item.title}
              </p>
              <p className="text-[15px] leading-7 text-slate-700">
                {item.description}
              </p>
            </div>
          </Panel>
        ))}
      </div>
      <TemplateFooter {...props} />
    </TemplateCanvas>
  );
}
