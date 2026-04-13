import { Panel, SlideHeader, TemplateCanvas } from "@/presentation/primitives";
import type { SlideTemplateProps } from "@/presentation/types";
import { TemplateFooter } from "./shared";

export function SectionTemplate(props: SlideTemplateProps) {
  return (
    <TemplateCanvas {...props}>
      <div className="flex h-full flex-col justify-between">
        <div className="grid flex-1 items-center gap-8 md:grid-cols-[0.32fr_1fr]">
          <div className="rounded-[30px] bg-slate-950 p-6 text-white">
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/60">
              Transition
            </p>
            <div className="mt-6 h-24 w-px bg-white/20" />
          </div>
          <div className="space-y-6">
            <SlideHeader slide={props.slide} eyebrow="Section" />
            <Panel className="max-w-2xl">
              <p className="text-[15px] leading-7 text-slate-700">
                {props.slide.main_content[0] ||
                  props.slide.purpose ||
                  "This section sets up the next movement of the story."}
              </p>
            </Panel>
          </div>
        </div>
        <TemplateFooter {...props} />
      </div>
    </TemplateCanvas>
  );
}
