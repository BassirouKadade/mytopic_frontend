import { Panel, SlideHeader, TemplateCanvas } from "@/presentation/primitives";
import { getComparisonItems } from "@/presentation/content";
import type { SlideTemplateProps } from "@/presentation/types";
import { TemplateFooter } from "./shared";

export function ObjectivesResultsTemplate(props: SlideTemplateProps) {
  const items = getComparisonItems(props.slide);

  return (
    <TemplateCanvas {...props}>
      <SlideHeader slide={props.slide} eyebrow="Objectives / Results" />
      <div className="mt-8 grid flex-1 gap-5 md:grid-cols-2">
        <Panel>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            Objectives
          </p>
          <div className="mt-4 space-y-3">
            {items.slice(0, 2).map((item) => (
              <p
                key={`objective-${item.title}`}
                className="text-[15px] leading-7 text-slate-700"
              >
                {item.title}: {item.description}
              </p>
            ))}
          </div>
        </Panel>
        <Panel>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            Results
          </p>
          <div className="mt-4 space-y-3">
            {items.slice(2, 4).map((item) => (
              <p
                key={`result-${item.title}`}
                className="text-[15px] leading-7 text-slate-700"
              >
                {item.title}: {item.description}
              </p>
            ))}
            {items.length < 3 && (
              <p className="text-[15px] leading-7 text-slate-700">
                {props.slide.purpose || props.slide.main_content.at(-1)}
              </p>
            )}
          </div>
        </Panel>
      </div>
      <TemplateFooter {...props} />
    </TemplateCanvas>
  );
}
