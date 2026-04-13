import { SlideHeader, TemplateCanvas } from "@/presentation/primitives";
import { parseTableContent } from "@/presentation/content";
import type { SlideTemplateProps } from "@/presentation/types";
import { CardsTemplate } from "./CardsTemplate";
import { TemplateFooter } from "./shared";

/**
 * Rend une slide tabulaire compacte avec protection contre le debordement.
 * @param props Proprietes normalisees du rendu de slide.
 * @returns Un tableau lisible adapte a la taille des slides.
 * Securite:
 * - Aucun acces externe; composant de rendu local.
 */
export function TableTemplate(props: SlideTemplateProps) {
  const rows = parseTableContent(props.slide.main_content);

  if (!rows) {
    return <CardsTemplate {...props} />;
  }

  const [header, ...body] = rows;

  return (
    <TemplateCanvas {...props}>
      <SlideHeader slide={props.slide} eyebrow="Structured data" />
      <div className="mt-7 flex-1 overflow-auto rounded-2xl border border-slate-200 bg-white/90">
        <table className="w-full border-collapse text-left text-[13px]">
          <thead className="bg-slate-50">
            <tr>
              {header.map((cell, index) => (
                <th
                  key={`${cell}-${index}`}
                  className="border-b border-slate-200 px-3 py-2.5 font-semibold text-slate-900"
                >
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`} className="align-top">
                {row.map((cell, cellIndex) => (
                  <td
                    key={`${rowIndex}-${cellIndex}`}
                    className="border-b border-slate-100 px-3 py-2.5 text-slate-600"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TemplateFooter {...props} />
    </TemplateCanvas>
  );
}
