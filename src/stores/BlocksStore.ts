import { generateEmptyBlock } from "@/factories";
import type { BlockId, TBlock } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface BlocksState {
  title: string;
  blocks: TBlock[];

  // Actions
  addAfter: (id: BlockId) => void;
  addEmptyToLast: () => void;
  deleteSelected: (selected: Set<BlockId>) => void;
  setTitle: (title: string) => void;
  setBlock: (block: TBlock) => void;
}

const useBlocksStore = create<BlocksState>()(
  persist(
    (set) => ({
      title: "Untitled",
      blocks: [generateEmptyBlock()],

      addAfter: (id) =>
        set((state) => {
          const index = state.blocks.findIndex((b) => b.id === id);
          if (index === -1) return state;

          const newBlocks = [
            ...state.blocks.slice(0, index + 1),
            generateEmptyBlock(),
            ...state.blocks.slice(index + 1),
          ];
          return { blocks: newBlocks };
        }),

      addEmptyToLast: () =>
        set((state) => ({
          blocks: [...state.blocks, generateEmptyBlock()],
        })),

      deleteSelected: (selected) =>
        set((state) => {
          const newBlocks = state.blocks.filter(
            (block) => !selected.has(block.id)
          );
          // Always keep at least one block
          if (newBlocks.length === 0) {
            return { blocks: [generateEmptyBlock()] };
          }
          return { blocks: newBlocks };
        }),

      setTitle: (title) => set({ title }),

      setBlock: (updatedBlock) =>
        set((state) => ({
          blocks: state.blocks.map((block) =>
            block.id === updatedBlock.id ? updatedBlock : block
          ),
        })),
    }),
    {
      name: "lite-markdown-editor-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useBlocksStore;
