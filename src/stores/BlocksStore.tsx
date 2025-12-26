import { generateEmptyBlock } from "@/factories";
import type { BlockId, TBlock } from "@/types";
import { create } from "zustand";

type useBlocksStoreState = {
  blocks: TBlock[];
  addAfter: (id: BlockId) => void;
  addEmptyToLast: () => void;
  deleteSelected: (selected: Set<BlockId>) => void;
};

const addAfter = (blocks: TBlock[], id: BlockId) => {
  const index = blocks.findIndex((b) => b.id === id);
  if (index === -1) return blocks;

  return [
    ...blocks.slice(0, index + 1),
    generateEmptyBlock(),
    ...blocks.slice(index + 1),
  ];
};

const addEmptyToLast = (blocks: TBlock[]): TBlock[] => {
  return [...blocks, generateEmptyBlock()];
};

const deleteSelected = (blocks: TBlock[], selected: Set<BlockId>): TBlock[] => {
  return blocks.filter((block) => !selected.has(block.id));
};

const useBlocksStore = create<useBlocksStoreState>((set) => ({
  blocks: [generateEmptyBlock()],
  addAfter: (id) =>
    set((state) => ({
      blocks: addAfter(state.blocks, id),
    })),
  addEmptyToLast: () =>
    set((state) => ({
      blocks: addEmptyToLast(state.blocks),
    })),
  deleteSelected: (selected) =>
    set((state) => ({ blocks: deleteSelected(state.blocks, selected) })),
}));

export default useBlocksStore;
