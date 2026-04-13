import { Panel, SlideHeader, TemplateCanvas } from "@/presentation/primitives";
import { getParagraphs } from "@/presentation/content";
import type { SlideTemplateProps } from "@/presentation/types";
import { TemplateFooter } from "./shared";

/**
 * Rend une slide questions/reponses avec marges serrées.
 * @param props Proprietes normalisees de la slide.
 * @returns Deux panneaux QA adaptes a un espace compact.
 * Securite:
 * - Aucune operation sensible; rendu purement visuel.
 */
export function QATemplate(props: SlideTemplateProps) {
  const paragraphs = getParagraphs(props.slide);
  const question = paragraphs[0] || props.slide.title;
  const answer = paragraphs[1] || props.slide.purpose;

  return (
    <TemplateCanvas {...props}>
      <SlideHeader slide={props.slide} eyebrow="Q / A" />
      <div className="mt-7 grid flex-1 min-h-0 gap-3 md:grid-cols-2">
        <Panel className="bg-slate-950 text-white">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
            Question
          </p>
          <p className="mt-3 text-[19px] leading-8 tracking-[-0.03em] text-white">
            {question}
          </p>
        </Panel>
        <Panel>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Answer
          </p>
          <p className="mt-3 text-[13px] leading-6 text-slate-700">{answer}</p>
        </Panel>
      </div>
      <TemplateFooter {...props} />
    </TemplateCanvas>
  );
}
