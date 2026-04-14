import type { EditorScene, SlideElement } from "@/services/api";

export interface SnapGuide {
  orientation: "vertical" | "horizontal";
  value: number;
}

export interface SpacingMarker {
  orientation: "horizontal" | "vertical";
  start: number;
  end: number;
  at: number;
  label: string;
}

export interface GuideElementBounds {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GuideModel {
  x: number[];
  y: number[];
  elements: GuideElementBounds[];
}

export interface SnapResult {
  x: number;
  y: number;
  guides: SnapGuide[];
  spacingMarkers: SpacingMarker[];
}

const SNAP_THRESHOLD = 8;

function uniqueSorted(values: number[]): number[] {
  return [...new Set(values.map((item) => Math.round(item)))].sort(
    (a, b) => a - b,
  );
}

function nearest(
  value: number,
  candidates: number[],
): { value: number; distance: number } {
  let best = candidates[0] ?? value;
  let bestDistance = Math.abs(value - best);

  for (let index = 1; index < candidates.length; index += 1) {
    const candidate = candidates[index];
    const distance = Math.abs(value - candidate);
    if (distance < bestDistance) {
      best = candidate;
      bestDistance = distance;
    }
  }

  return { value: best, distance: bestDistance };
}

function overlap(
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number,
): number {
  return Math.max(0, Math.min(aEnd, bEnd) - Math.max(aStart, bStart));
}

function buildSpacingMarkers(
  x: number,
  y: number,
  width: number,
  height: number,
  elements: GuideElementBounds[],
): SpacingMarker[] {
  const markers: SpacingMarker[] = [];
  const boxLeft = x;
  const boxRight = x + width;
  const boxTop = y;
  const boxBottom = y + height;

  let bestHorizontal: {
    start: number;
    end: number;
    at: number;
    gap: number;
  } | null = null;
  let bestVertical: {
    start: number;
    end: number;
    at: number;
    gap: number;
  } | null = null;

  for (const element of elements) {
    const elementLeft = element.x;
    const elementRight = element.x + element.width;
    const elementTop = element.y;
    const elementBottom = element.y + element.height;

    const overlapY = overlap(boxTop, boxBottom, elementTop, elementBottom);
    if (overlapY > 0) {
      const atY = Math.round(Math.max(boxTop, elementTop) + overlapY / 2);
      if (boxRight <= elementLeft) {
        const gap = elementLeft - boxRight;
        if (!bestHorizontal || gap < bestHorizontal.gap) {
          bestHorizontal = {
            start: boxRight,
            end: elementLeft,
            at: atY,
            gap,
          };
        }
      }
      if (elementRight <= boxLeft) {
        const gap = boxLeft - elementRight;
        if (!bestHorizontal || gap < bestHorizontal.gap) {
          bestHorizontal = {
            start: elementRight,
            end: boxLeft,
            at: atY,
            gap,
          };
        }
      }
    }

    const overlapX = overlap(boxLeft, boxRight, elementLeft, elementRight);
    if (overlapX > 0) {
      const atX = Math.round(Math.max(boxLeft, elementLeft) + overlapX / 2);
      if (boxBottom <= elementTop) {
        const gap = elementTop - boxBottom;
        if (!bestVertical || gap < bestVertical.gap) {
          bestVertical = {
            start: boxBottom,
            end: elementTop,
            at: atX,
            gap,
          };
        }
      }
      if (elementBottom <= boxTop) {
        const gap = boxTop - elementBottom;
        if (!bestVertical || gap < bestVertical.gap) {
          bestVertical = {
            start: elementBottom,
            end: boxTop,
            at: atX,
            gap,
          };
        }
      }
    }
  }

  if (bestHorizontal && bestHorizontal.gap <= 320) {
    markers.push({
      orientation: "horizontal",
      start: Math.round(bestHorizontal.start),
      end: Math.round(bestHorizontal.end),
      at: bestHorizontal.at,
      label: `${Math.round(bestHorizontal.gap)} px`,
    });
  }

  if (bestVertical && bestVertical.gap <= 220) {
    markers.push({
      orientation: "vertical",
      start: Math.round(bestVertical.start),
      end: Math.round(bestVertical.end),
      at: bestVertical.at,
      label: `${Math.round(bestVertical.gap)} px`,
    });
  }

  return markers;
}

export function collectGuides(
  scene: EditorScene,
  movingIds: string[],
  movingWidth = 0,
  movingHeight = 0,
): GuideModel {
  const xGuides: number[] = [0, scene.width / 2, scene.width];
  const yGuides: number[] = [0, scene.height / 2, scene.height];
  const movingSet = new Set(movingIds);

  const visible = scene.elements
    .filter((element) => !movingSet.has(element.id) && element.visible)
    .map((element) => ({
      id: element.id,
      x: element.x,
      y: element.y,
      width: element.width,
      height: element.height,
    }));

  visible.forEach((element) => {
    xGuides.push(
      element.x,
      element.x + element.width / 2,
      element.x + element.width,
    );
    yGuides.push(
      element.y,
      element.y + element.height / 2,
      element.y + element.height,
    );
  });

  const byX = [...visible].sort((a, b) => a.x - b.x);
  for (let index = 0; index < byX.length - 1; index += 1) {
    const left = byX[index];
    const right = byX[index + 1];
    const gap = right.x - (left.x + left.width);
    if (gap <= 0 || gap > 420) continue;

    xGuides.push(right.x + right.width + gap);
    xGuides.push(left.x - gap - movingWidth);
  }

  const byY = [...visible].sort((a, b) => a.y - b.y);
  for (let index = 0; index < byY.length - 1; index += 1) {
    const top = byY[index];
    const bottom = byY[index + 1];
    const gap = bottom.y - (top.y + top.height);
    if (gap <= 0 || gap > 320) continue;

    yGuides.push(bottom.y + bottom.height + gap);
    yGuides.push(top.y - gap - movingHeight);
  }

  const grid = 40;
  for (let x = grid; x < scene.width; x += grid) xGuides.push(x);
  for (let y = grid; y < scene.height; y += grid) yGuides.push(y);

  return {
    x: uniqueSorted(xGuides),
    y: uniqueSorted(yGuides),
    elements: visible,
  };
}

export function snapPosition(
  x: number,
  y: number,
  width: number,
  height: number,
  guides: GuideModel,
): SnapResult {
  const xCandidates = [x, x + width / 2, x + width];
  const yCandidates = [y, y + height / 2, y + height];

  let snappedX = x;
  let snappedY = y;
  const activeGuides: SnapGuide[] = [];

  const xHits = xCandidates
    .map((candidate) => ({
      ...nearest(candidate, guides.x),
      original: candidate,
    }))
    .sort((a, b) => a.distance - b.distance);
  const yHits = yCandidates
    .map((candidate) => ({
      ...nearest(candidate, guides.y),
      original: candidate,
    }))
    .sort((a, b) => a.distance - b.distance);

  const bestX = xHits[0];
  const bestY = yHits[0];

  if (bestX && bestX.distance <= SNAP_THRESHOLD) {
    const offset = bestX.value - bestX.original;
    snappedX = x + offset;
    activeGuides.push({ orientation: "vertical", value: bestX.value });
  }

  if (bestY && bestY.distance <= SNAP_THRESHOLD) {
    const offset = bestY.value - bestY.original;
    snappedY = y + offset;
    activeGuides.push({ orientation: "horizontal", value: bestY.value });
  }

  return {
    x: snappedX,
    y: snappedY,
    guides: activeGuides,
    spacingMarkers:
      activeGuides.length > 0
        ? buildSpacingMarkers(
            snappedX,
            snappedY,
            width,
            height,
            guides.elements,
          )
        : [],
  };
}

export function distributeHorizontally(
  elements: SlideElement[],
): SlideElement[] {
  if (elements.length < 3) return elements;

  const sorted = [...elements].sort((a, b) => a.x - b.x);
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const totalWidth = sorted.reduce((sum, item) => sum + item.width, 0);
  const available = last.x + last.width - first.x - totalWidth;
  const gap = available / (sorted.length - 1);

  let cursor = first.x;
  return sorted.map((item, index) => {
    if (index === 0) {
      cursor += item.width + gap;
      return item;
    }

    const nextItem = {
      ...item,
      x: Math.round(cursor),
    };
    cursor += item.width + gap;
    return nextItem;
  });
}

export function alignLeft(elements: SlideElement[]): SlideElement[] {
  if (elements.length < 2) return elements;
  const minX = Math.min(...elements.map((item) => item.x));
  return elements.map((item) => ({ ...item, x: minX }));
}
