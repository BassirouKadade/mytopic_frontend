import { Panel, SlideHeader, TemplateCanvas } from "@/presentation/primitives";
import { MiniDiagram } from "@/presentation/KonvaScene";
import { stripBulletPrefix } from "@/presentation/content";
import type { SlideTemplateProps } from "@/presentation/types";
import { TemplateFooter } from "./shared";

export function ArchitectureTemplate(props: SlideTemplateProps) {
  return (
    <TemplateCanvas {...props}>
      <SlideHeader slide={props.slide} eyebrow="Architecture" />
      <div className="mt-8 grid flex-1 gap-5 md:grid-cols-[1.1fr_0.9fr]">
        <MiniDiagram mode="architecture" items={props.slide.main_content} />
        <div className="space-y-4">
          {props.slide.main_content.slice(0, 4).map((item, index) => (
            <Panel key={`${item}-${index}`}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                Layer {index + 1}
              </p>
              <p className="mt-3 text-[15px] leading-7 text-slate-700">
                {stripBulletPrefix(item)}
              </p>
            </Panel>
          ))}
        </div>
      </div>
      <TemplateFooter {...props} />
    </TemplateCanvas>
  );
}
