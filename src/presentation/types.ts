import type { Presentation, Slide } from "@/services/api";

export type SlideDensity = Slide["density"];

export type SlideSemanticType =
  | "cover.title"
  | "section.agenda"
  | "section.transition"
  | "content.paragraph"
  | "content.definition"
  | "content.definition_list"
  | "content.multi_paragraph"
  | "content.quote"
  | "content.info_box"
  | "list.bullets"
  | "list.numbered"
  | "list.takeaways"
  | "list.pros_cons"
  | "comparison.two_column"
  | "comparison.before_after"
  | "comparison.concepts"
  | "comparison.solutions"
  | "data.table"
  | "data.comparative_table"
  | "data.matrix"
  | "data.kpi"
  | "data.cards"
  | "visual.image_text"
  | "visual.overlay"
  | "visual.illustration"
  | "visual.gallery"
  | "diagram.timeline"
  | "diagram.process"
  | "diagram.workflow"
  | "diagram.orgchart"
  | "diagram.cause_effect"
  | "business.problem_solution"
  | "business.objectives_results"
  | "business.use_case"
  | "business.roadmap"
  | "business.architecture"
  | "business.product_feature"
  | "academic.definition"
  | "academic.explanation"
  | "academic.case_study"
  | "academic.summary"
  | "academic.qa"
  | "closure.conclusion"
  | "closure.thank_you";

export interface SlideTemplateProps {
  presentation: Presentation;
  slide: Slide;
  currentSlide: number;
  totalSlides: number;
  resolvedSemanticType: SlideSemanticType;
  resolvedLayoutVariant: string;
}

