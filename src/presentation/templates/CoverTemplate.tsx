import type { SlideTemplateProps } from "@/presentation/types";

export function CoverTemplate(props: SlideTemplateProps) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-white">
      {/* Decorative background shapes */}
      <div className="absolute inset-0">
        <div className="absolute -top-20 -right-20 size-[400px] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute -bottom-32 -left-20 size-[350px] rounded-full bg-primary/8 blur-[80px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] rounded-full bg-slate-100/70 blur-[60px]" />
      </div>

      {/* Accent line top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/80 to-primary/40" />

      {/* Content */}
      <div className="relative flex h-full flex-col justify-between px-12 py-10">
        {/* Top badge */}
        <div className="flex items-center gap-2">
          <div className="size-1.5 rounded-full bg-primary" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Presentation
          </span>
        </div>

        {/* Center content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 px-8">
          <h1 className="text-[clamp(32px,4vw,56px)] font-bold leading-[1.05] tracking-[-0.04em] text-slate-950 max-w-4xl">
            {props.slide.title}
          </h1>

          {(props.presentation.presentation_subtitle ||
            props.slide.purpose) && (
            <p className="text-[clamp(14px,1.5vw,18px)] leading-relaxed text-slate-600 max-w-2xl">
              {props.presentation.presentation_subtitle || props.slide.purpose}
            </p>
          )}

          <div className="flex items-center gap-3 pt-2">
            <div className="h-px w-8 bg-primary/60" />
            <span className="text-[11px] font-medium tracking-wider text-primary/80 uppercase">
              {props.presentation.target_audience ||
                props.presentation.tone ||
                ""}
            </span>
            <div className="h-px w-8 bg-primary/60" />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-400 font-mono">
            {props.totalSlides} slides
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {props.currentSlide + 1} / {props.totalSlides}
          </span>
        </div>
      </div>
    </div>
  );
}
