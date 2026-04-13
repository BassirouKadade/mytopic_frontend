import {
  resolveLayoutVariant,
  resolveSemanticType,
} from "@/presentation/content";
import { templateRegistry } from "@/presentation/registry";
import type { SlideTemplateProps } from "@/presentation/types";

export function SlideRenderer(
  props: Omit<
    SlideTemplateProps,
    "resolvedSemanticType" | "resolvedLayoutVariant"
  >,
) {
  const resolvedSemanticType = resolveSemanticType(props.slide);
  const resolvedLayoutVariant = resolveLayoutVariant(
    props.slide,
    resolvedSemanticType,
  );
  const Template = templateRegistry[resolvedSemanticType];

  return (
    <div className="h-full w-full">
      <Template
        {...props}
        resolvedSemanticType={resolvedSemanticType}
        resolvedLayoutVariant={resolvedLayoutVariant}
      />
    </div>
  );
}
