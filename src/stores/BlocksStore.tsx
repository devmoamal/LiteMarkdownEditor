import { generateEmptyBlock } from "@/factories";
import type { BlockId, TBlock } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// TODO: Fix cannot update text in localstorage

type useBlocksStoreState = {
  title: string;
  blocks: TBlock[];

  // Block Actions
  addAfter: (id: BlockId) => void;
  addEmptyToLast: () => void;
  deleteSelected: (selected: Set<BlockId>) => void;

  // Sets
  setTitle: (title: string) => void;
  setBlock: (block: TBlock) => void;
};

/**
 * Insert a new empty block immediately after the block with `id`.
 * Returns the original array if the id is not found.
 */
const addAfter = (blocks: TBlock[], id: BlockId) => {
  const index = blocks.findIndex((b) => b.id === id);
  if (index === -1) return blocks;

  return [
    ...blocks.slice(0, index + 1),
    generateEmptyBlock(),
    ...blocks.slice(index + 1),
  ];
};

/** Append a new empty block at the end of the blocks array. */
const addEmptyToLast = (blocks: TBlock[]): TBlock[] => {
  return [...blocks, generateEmptyBlock()];
};

/**
 * Remove all blocks whose ids appear in `selected`.
 * Operates immutably and returns a new array.
 */
const deleteSelected = (blocks: TBlock[], selected: Set<BlockId>): TBlock[] => {
  return blocks.filter((block) => !selected.has(block.id));
};

// Create the zustand store. Methods delegate to pure helpers above so
// business logic stays testable and side-effect free.
const useBlocksStore = create<useBlocksStoreState>()(
  persist(
    (set) => ({
      title: "",
      blocks: [generateEmptyBlock()], // Start with empty array to let persist handle initial state

      // Block Actions
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

      // Sets
      setTitle: (title) => set(() => ({ title: title })),
      setBlock: (block) =>
        set((state) => ({
          blocks: state.blocks.map((_block) =>
            _block.id === block.id ? block : _block
          ),
        })),
    }),
    {
      name: "text-editor",
    }
  )
);

export default useBlocksStore;
