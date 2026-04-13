import { Panel, SlideHeader, TemplateCanvas } from "@/presentation/primitives";
import { getComparisonItems } from "@/presentation/content";
import type { SlideTemplateProps } from "@/presentation/types";
import { TemplateFooter } from "./shared";

export function ProblemSolutionTemplate(props: SlideTemplateProps) {
  const items = getComparisonItems(props.slide);
  const problem = items[0];
  const solution = items[1] ?? {
    title: "Solution",
    description: props.slide.main_content[1] || props.slide.purpose,
  };

  return (
    <TemplateCanvas {...props}>
      <SlideHeader slide={props.slide} eyebrow="Problem / Solution" />
      <div className="mt-8 grid flex-1 gap-5 md:grid-cols-2">
        <Panel className="bg-rose-50/80">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-rose-700">
            Problem
          </p>
          <p className="mt-5 text-lg font-semibold text-slate-950">
            {problem?.title || "Problem"}
          </p>
          <p className="mt-3 text-[15px] leading-7 text-slate-700">
            {problem?.description || props.slide.main_content[0]}
          </p>
        </Panel>
        <Panel className="bg-emerald-50/80">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700">
            Solution
          </p>
          <p className="mt-5 text-lg font-semibold text-slate-950">
            {solution.title}
          </p>
          <p className="mt-3 text-[15px] leading-7 text-slate-700">
            {solution.description}
          </p>
        </Panel>
      </div>
      <TemplateFooter {...props} />
    </TemplateCanvas>
  );
}
