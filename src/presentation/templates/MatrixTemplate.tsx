import { Panel, SlideHeader, TemplateCanvas } from "@/presentation/primitives";
import { getCardItems } from "@/presentation/content";
import type { SlideTemplateProps } from "@/presentation/types";
import { TemplateFooter } from "./shared";

export function MatrixTemplate(props: SlideTemplateProps) {
  const cards = getCardItems(props.slide).slice(0, 4);

  return (
    <TemplateCanvas {...props}>
      <SlideHeader slide={props.slide} eyebrow="Matrix" />
      <div className="mt-8 grid flex-1 gap-4 md:grid-cols-2">
        {cards.map((item, index) => (
          <Panel key={item.title} className="min-h-[170px]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              Quadrant {index + 1}
            </p>
            <p className="mt-4 text-lg font-semibold text-slate-950">
              {item.title}
            </p>
            <p className="mt-3 text-[15px] leading-7 text-slate-700">
              {item.description}
            </p>
          </Panel>
        ))}
      </div>
      <TemplateFooter {...props} />
    </TemplateCanvas>
  );
}
