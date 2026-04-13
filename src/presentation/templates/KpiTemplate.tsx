import { Panel, SlideHeader, TemplateCanvas } from "@/presentation/primitives";
import { getMetricItems } from "@/presentation/content";
import type { SlideTemplateProps } from "@/presentation/types";
import { CardGrid, TemplateFooter } from "./shared";

/**
 * Rend une slide KPI avec cartes compactes et chiffres priorises.
 * @param props Proprietes normalisees du rendu de slide.
 * @returns Une grille de metriques lisible dans un espace reduit.
 * Securite:
 * - Rendu visuel local sans manipulation sensible.
 */
export function KpiTemplate(props: SlideTemplateProps) {
  const metrics = getMetricItems(props.slide).slice(0, 4);

  return (
    <TemplateCanvas {...props}>
      <SlideHeader slide={props.slide} eyebrow="Highlights" />
      <div className="mt-7 flex-1 min-h-0 overflow-y-auto space-y-4 pr-1">
        <CardGrid columns={metrics.length > 3 ? 2 : 3}>
          {metrics.map((metric) => (
            <Panel key={metric.label} className="min-h-[120px] p-3.5">
              <p className="text-[24px] font-semibold tracking-[-0.04em] text-slate-950">
                {metric.value}
              </p>
              <p className="mt-2 text-[13px] font-semibold leading-5 text-slate-800">
                {metric.label}
              </p>
              <p className="mt-1.5 text-[12px] leading-5 text-slate-600">
                {metric.note}
              </p>
            </Panel>
          ))}
        </CardGrid>
      </div>
      <TemplateFooter {...props} />
    </TemplateCanvas>
  );
}
