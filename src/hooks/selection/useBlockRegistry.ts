import { useRef } from "react";
import type { BlockId } from "@/types";

export function useBlockRegistry() {
  const registry = useRef<Map<BlockId, HTMLElement>>(new Map());

  const register = (id: BlockId, el: HTMLElement) => {
    registry.current.set(id, el);
  };

  const unregister = (id: BlockId) => {
    registry.current.delete(id);
  };

  return {
    registry,
    register,
    unregister,
  };
}
