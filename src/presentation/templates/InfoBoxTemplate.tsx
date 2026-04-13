import { SlideHeader, TemplateCanvas } from "@/presentation/primitives";
import { splitLeadAndSupporting } from "@/presentation/content";
import type { SlideTemplateProps } from "@/presentation/types";
import { TemplateFooter } from "./shared";

/**
 * Rend une slide de mise en avant avec espacement compact.
 * @param props Proprietes normalisees de la slide.
 * @returns Un bloc lead et des paragraphes secondaires denses.
 * Securite:
 * - Composant de rendu local sans traitement sensible.
 */
export function InfoBoxTemplate(props: SlideTemplateProps) {
  const { lead, supporting } = splitLeadAndSupporting(props.slide);

  return (
    <TemplateCanvas {...props}>
      <SlideHeader slide={props.slide} />
      <div className="mt-7 flex-1 min-h-0 space-y-3 overflow-y-auto pr-1">
        <div className="border-l-4 border-slate-900 pl-4">
          <p className="text-[18px] leading-8 tracking-[-0.03em] text-slate-950">
            {lead}
          </p>
        </div>
        {supporting.slice(0, 3).map((item, index) => (
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
