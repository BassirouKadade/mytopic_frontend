import type { ReactNode } from "react";

import { getSlideLabel } from "@/presentation/content";
import type { SlideTemplateProps } from "@/presentation/types";
import { cn } from "@/lib/utils";

export const SLIDE_ASPECT_RATIO = "16 / 9";

interface TemplateCanvasProps extends SlideTemplateProps {
  children: ReactNode;
  className?: string;
}

/**
 * Fournit le canevas standard des slides avec marges internes compactes.
 * @param children Contenu principal du template.
 * @param className Classes additionnelles optionnelles.
 * @returns Un conteneur de slide stable et sans debordement.
 * Securite:
 * - Rendu purement presentatif, sans acces a des donnees sensibles.
 */
export function TemplateCanvas({ children, className }: TemplateCanvasProps) {
  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden bg-white",
        className,
      )}
    >
      <div className="flex h-full min-h-0 w-full flex-col overflow-hidden px-8 py-6">
        {children}
      </div>
    </div>
  );
}

/**
 * Rend l'en-tete normalise d'une slide avec hierarchie typographique coherente.
 * @param slide Donnees de la slide active.
 * @param eyebrow Libelle court optionnel au-dessus du titre.
 * @param subtitle Sous-titre optionnel remplaçant le purpose.
 * @param align Alignement gauche ou centre.
 * @returns Un en-tete compact adapte aux slides reduites.
 * Securite:
 * - Aucune operation sensible, seulement du rendu texte.
 */
export function SlideHeader({
  slide,
  eyebrow,
  subtitle,
  align = "left",
}: {
  slide: SlideTemplateProps["slide"];
  eyebrow?: string;
  subtitle?: string;
  align?: "left" | "center";
}) {
  const label = eyebrow ?? getSlideLabel(slide.slide_type);

  return (
    <header className={cn("space-y-2.5", align === "center" && "text-center")}>
      {label && (
        <div
          className={cn(
            "inline-flex items-center gap-2 rounded-full bg-primary/8 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-primary",
            align === "center" && "mx-auto",
          )}
        >
          <span className="size-1 rounded-full bg-primary" />
          {label}
        </div>
      )}
      <div
        className={cn("space-y-1.5", align === "center" && "mx-auto max-w-4xl")}
      >
        <h2 className="text-[clamp(20px,2.5vw,30px)] font-bold leading-[1.12] tracking-[-0.02em] text-slate-900">
          {slide.title}
        </h2>
        {(subtitle ?? slide.purpose) && (
          <p className="max-w-3xl text-[12px] leading-relaxed text-slate-500">
            {subtitle ?? slide.purpose}
          </p>
        )}
      </div>
    </header>
  );
}

/**
 * Rend un panneau utilitaire avec padding minimaliste et style uniforme.
 * @param children Contenu du panneau.
 * @param className Classes additionnelles.
 * @returns Un bloc visuel reutilisable.
 * Securite:
 * - Composant statique sans traitement de donnees sensibles.
 */
export function Panel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-100 bg-slate-50/50 p-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function MetaChip({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  if (!value) {
    return null;
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600">
      <span className="font-medium text-slate-500">{label}</span>
      <span className="h-1 w-1 rounded-full bg-slate-300" />
      <span className="font-semibold text-slate-800">{value}</span>
    </div>
  );
}

export function FooterBar({
  currentSlide,
  totalSlides,
}: {
  currentSlide: number;
  totalSlides: number;
  semantic: string;
  transition?: string;
}) {
  return (
    <div className="mt-auto flex items-center justify-between pt-4">
      <div className="h-0.5 flex-1 rounded-full bg-slate-100 mr-4">
        <div
          className="h-full rounded-full bg-primary/40 transition-all duration-300"
          style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
        />
      </div>
      <span className="text-[10px] font-mono text-slate-400 shrink-0">
        {currentSlide + 1} / {totalSlides}
      </span>
    </div>
  );
}
