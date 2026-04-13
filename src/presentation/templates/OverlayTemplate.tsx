import { Panel, TemplateCanvas } from "@/presentation/primitives";
import type { SlideTemplateProps } from "@/presentation/types";
import { TemplateFooter } from "./shared";

export function OverlayTemplate(props: SlideTemplateProps) {
  const lead = props.slide.main_content[0] || props.slide.purpose;

  return (
    <TemplateCanvas {...props}>
      <div className="flex h-full flex-col justify-between">
        <Panel className="flex-1 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-700 text-white">
          <div className="flex h-full flex-col justify-between">
            <div className="space-y-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/60">
                Immersive slide
              </p>
              <h2 className="max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.05em] text-white">
                {props.slide.title}
              </h2>
            </div>
            <div className="space-y-5">
              <p className="max-w-3xl text-lg leading-8 text-white/80">
                {lead}
              </p>
              <p className="max-w-xl text-sm leading-7 text-white/65">
                {props.slide.suggested_visual ||
                  "Use a full-bleed image with a subtle overlay and restrained text block."}
              </p>
            </div>
          </div>
        </Panel>
        <TemplateFooter {...props} />
      </div>
    </TemplateCanvas>
  );
}
