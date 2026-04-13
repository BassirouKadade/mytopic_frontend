import { TemplateCanvas } from "@/presentation/primitives";
import type { SlideTemplateProps } from "@/presentation/types";
import { TemplateFooter } from "./shared";

export function QuoteTemplate(props: SlideTemplateProps) {
  const quote = props.slide.main_content[0] || props.slide.purpose;
  const supporting = props.slide.main_content.slice(1, 3);

  return (
    <TemplateCanvas {...props}>
      <div className="flex h-full flex-col justify-between">
        <div className="flex flex-1 items-center">
          <div className="w-full space-y-8">
            <div className="space-y-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Key message
              </p>
              <blockquote className="max-w-4xl text-4xl font-semibold leading-[1.25] tracking-[-0.05em] text-slate-950">
                &ldquo;{quote}&rdquo;
              </blockquote>
            </div>
            {supporting.map((item, index) => (
              <p
                key={`${item}-${index}`}
                className="max-w-4xl text-[16px] leading-8 text-slate-600"
              >
                {item}
              </p>
            ))}
          </div>
        </div>
        <TemplateFooter {...props} />
      </div>
    </TemplateCanvas>
  );
}
