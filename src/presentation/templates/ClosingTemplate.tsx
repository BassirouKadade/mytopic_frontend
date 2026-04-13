import { TemplateCanvas } from "@/presentation/primitives";
import type { SlideTemplateProps } from "@/presentation/types";
import { TemplateFooter } from "./shared";

/**
 * Rend la slide de fermeture/conclusion avec contenu multi-paragraphe.
 * @param props Proprietes normalisees de rendu d'une slide.
 * @returns Une conclusion lisible avec recapitulatif structure.
 * Securite:
 * - Le composant se limite au rendu de donnees deja normalisees.
 */
export function ClosingTemplate(props: SlideTemplateProps) {
  const paragraphs = props.slide.main_content
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 4);

  const fallbackText =
    props.slide.purpose ||
    paragraphs[0] ||
    props.presentation.presentation_title;

  return (
    <TemplateCanvas {...props}>
      <div className="flex h-full flex-col justify-between">
        <div className="flex flex-1 items-center justify-center">
          <div className="max-w-4xl space-y-4 text-center">
            {props.resolvedSemanticType === "closure.thank_you" ? (
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Thank you
              </p>
            ) : null}
            <h2 className="text-[clamp(22px,2.8vw,34px)] font-semibold leading-tight tracking-[-0.03em] text-slate-950">
              {props.slide.title}
            </h2>
            <div className="space-y-2.5">
              {(paragraphs.length > 0 ? paragraphs : [fallbackText]).map(
                (item, index) => (
                  <p
                    key={`${item}-${index}`}
                    className="text-[14px] leading-7 text-slate-600"
                  >
                    {item}
                  </p>
                ),
              )}
            </div>
          </div>
        </div>
        <TemplateFooter {...props} />
      </div>
    </TemplateCanvas>
  );
}
