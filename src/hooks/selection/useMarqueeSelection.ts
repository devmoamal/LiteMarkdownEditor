import type { BlockId } from "@/types";
import { useEffect, useRef, useState } from "react";

type Rect = {
  left: number;
  top: number;
  width: number;
  height: number;
  right: number;
  bottom: number;
};

export function useMarqueeSelection(
  containerRef: React.RefObject<HTMLElement | null>,
  registryRef: React.RefObject<Map<BlockId, HTMLElement>>
) {
  const DRAG_THRESHOLD = 4;

  const drag = useRef({
    armed: false,
    active: false,
    startX: 0,
    startY: 0,
    x: 0,
    y: 0,
  });

  const [rect, setRect] = useState<Rect | null>(null);
  const [selected, setSelected] = useState<Set<BlockId>>(new Set());

  const cancelSelection = () => {
    drag.current.armed = false;
    drag.current.active = false;
    setRect(null);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || !containerRef.current) return;

    const bounds = containerRef.current.getBoundingClientRect();
    drag.current = {
      armed: true,
      active: false,
      startX: e.clientX - bounds.left,
      startY: e.clientY - bounds.top,
      x: e.clientX - bounds.left,
      y: e.clientY - bounds.top,
    };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!drag.current.armed || !containerRef.current) return;

    const bounds = containerRef.current.getBoundingClientRect();
    drag.current.x = e.clientX - bounds.left;
    drag.current.y = e.clientY - bounds.top;

    const dx = Math.abs(drag.current.x - drag.current.startX);
    const dy = Math.abs(drag.current.y - drag.current.startY);

    if (!drag.current.active) {
      if (dx < DRAG_THRESHOLD && dy < DRAG_THRESHOLD) return;
      drag.current.active = true;
    }

    const left = Math.min(drag.current.startX, drag.current.x);
    const top = Math.min(drag.current.startY, drag.current.y);
    const width = Math.abs(drag.current.startX - drag.current.x);
    const height = Math.abs(drag.current.startY - drag.current.y);

    setRect({
      left,
      top,
      width,
      height,
      right: left + width,
      bottom: top + height,
    });
  };

  const onMouseUp = (e: MouseEvent | React.MouseEvent) => {
    if (!drag.current.armed) return;

    if (!drag.current.active) {
      if (containerRef.current && e.target === containerRef.current) {
        setSelected(new Set());
      }
      drag.current.armed = false;
      return;
    }

    if (!rect || !containerRef.current) {
      cancelSelection();
      return;
    }

    drag.current.armed = false;
    drag.current.active = false;

    const containerBounds = containerRef.current.getBoundingClientRect();
    const next = new Set<BlockId>();

    registryRef.current.forEach((el, id) => {
      const box = el.getBoundingClientRect();
      const b = {
        left: box.left - containerBounds.left,
        top: box.top - containerBounds.top,
        right: box.right - containerBounds.left,
        bottom: box.bottom - containerBounds.top,
      };

      // Check if marquee rect intersects with element bounds
      const intersects = !(
        rect.right < b.left ||
        rect.left > b.right ||
        rect.bottom < b.top ||
        rect.top > b.bottom
      );

      if (intersects) next.add(id);
    });

    setSelected(next);
    setRect(null);
  };

  const onMouseLeave = () => {
    if (drag.current.armed) cancelSelection();
  };

  useEffect(() => {
    const handleWindowMouseUp = (e: MouseEvent) => {
      if (drag.current.armed) onMouseUp(e);
    };
    window.addEventListener("mouseup", handleWindowMouseUp);
    return () => window.removeEventListener("mouseup", handleWindowMouseUp);
  });

  return {
    rect,
    selected,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onMouseLeave,
  };
}
