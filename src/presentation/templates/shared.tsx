import type { ReactNode } from "react";

import { Panel } from "@/presentation/primitives";
import { stripBulletPrefix } from "@/presentation/content";
import type { SlideTemplateProps } from "@/presentation/types";

/**
 * Affiche une grille de points avec densite adaptee aux slides compactes.
 * @param items Liste des elements textuels.
 * @param numbered Active la numerotation si vrai.
 * @returns Une grille de cartes concise, limitee pour eviter les depassements.
 * Securite:
 * - Rendu visuel sans manipulation de donnees sensibles.
 */
export function BulletGrid({
  items,
  numbered = false,
}: {
  items: string[];
  numbered?: boolean;
}) {
  const visibleItems = items.slice(0, 4);

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {visibleItems.map((item, index) => (
        <Panel key={`${item}-${index}`} className="flex gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-xs font-semibold text-white">
            {numbered ? index + 1 : "\u2022"}
          </div>
          <p className="pt-1 text-[13px] leading-6 text-slate-700">
            {stripBulletPrefix(item)}
          </p>
        </Panel>
      ))}
    </div>
  );
}

/**
 * Organise des cartes en grille responsive avec ecarts compacts.
 * @param children Contenu enfant des cartes.
 * @param columns Nombre de colonnes prefere.
 * @returns Une grille 2 ou 3 colonnes selon le contexte.
 * Securite:
 * - Aucun traitement sensible; encapsulation de layout uniquement.
 */
export function CardGrid({
  children,
  columns = 2,
}: {
  children: ReactNode;
  columns?: 2 | 3;
}) {
  return (
    <div
      className={
        columns === 3
          ? "grid gap-4 md:grid-cols-3"
          : "grid gap-4 md:grid-cols-2"
      }
    >
      {children}
    </div>
  );
}

/**
 * Desactive le footer interne des templates pour alleger le bas de slide.
 * @param props Proprietes de slide transmises par le renderer.
 * @returns `null` afin de supprimer les elements parasites de bas de slide.
 * Securite:
 * - Aucun traitement de donnees sensibles, comportement purement visuel.
 */
export function TemplateFooter(props: SlideTemplateProps) {
  void props;
  return null;
}
