import { SlideHeader, TemplateCanvas } from "@/presentation/primitives";
import { getParagraphs } from "@/presentation/content";
import type { SlideTemplateProps } from "@/presentation/types";
import { TemplateFooter } from "./shared";

export function VisualSplitTemplate(props: SlideTemplateProps) {
  const paragraphs = getParagraphs(props.slide);

  return (
    <TemplateCanvas {...props}>
      <SlideHeader slide={props.slide} />
      <div className="mt-8 grid flex-1 gap-5 md:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          {paragraphs.slice(0, 3).map((item, index) => (
            <p
              key={`${item}-${index}`}
              className="text-[15px] leading-7 text-slate-700"
            >
              {item}
            </p>
          ))}
        </div>
        <div className="flex items-center justify-center border border-slate-200 bg-slate-50 p-6 text-center text-sm leading-7 text-slate-500">
          {props.slide.suggested_visual || "Visuel de support"}
        </div>
      </div>
      <TemplateFooter {...props} />
    </TemplateCanvas>
  );
}
