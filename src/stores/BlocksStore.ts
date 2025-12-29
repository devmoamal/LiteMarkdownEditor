import { generateEmptyBlock } from "@/factories";
import type { BlockId, TBlock } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface BlocksState {
  title: string;
  blocks: TBlock[];
  focusedBlockId: BlockId | null;

  // Actions
  addAfter: (id: BlockId) => void;
  addEmptyToLast: () => void;
  deleteSelected: (selected: Set<BlockId>) => void;
  setTitle: (title: string) => void;
  setBlock: (block: TBlock) => void;
  setFocusedBlockId: (id: BlockId | null) => void;
}

const useBlocksStore = create<BlocksState>()(
  persist(
    (set) => ({
      title: "Untitled",
      blocks: [generateEmptyBlock()],
      focusedBlockId: null,

      addAfter: (id) =>
        set((state) => {
          const index = state.blocks.findIndex((b) => b.id === id);
          if (index === -1) return state;

          const newBlock = generateEmptyBlock();
          const newBlocks = [
            ...state.blocks.slice(0, index + 1),
            newBlock,
            ...state.blocks.slice(index + 1),
          ];
          return { blocks: newBlocks, focusedBlockId: newBlock.id };
        }),

      addEmptyToLast: () =>
        set((state) => {
          const newBlock = generateEmptyBlock();
          return {
            blocks: [...state.blocks, newBlock],
            focusedBlockId: newBlock.id,
          };
        }),

      deleteSelected: (selected) =>
        set((state) => {
          if (selected.size === 0) return state;

          const firstSelectedIndex = state.blocks.findIndex((b) =>
            selected.has(b.id)
          );

          const newBlocks = state.blocks.filter(
            (block) => !selected.has(block.id)
          );

          // Always keep at least one block
          if (newBlocks.length === 0) {
            const newBlock = generateEmptyBlock();
            return { blocks: [newBlock], focusedBlockId: newBlock.id };
          }

          // Find block to focus: prioritize the one that moved into the deleted block's index
          // If we deleted the last block, focus the new last block
          let focusId: BlockId | null = null;
          if (firstSelectedIndex !== -1) {
            const targetIndex = Math.min(
              firstSelectedIndex,
              newBlocks.length - 1
            );
            focusId = newBlocks[targetIndex].id;
          }

          return { blocks: newBlocks, focusedBlockId: focusId };
        }),

      setTitle: (title) => set({ title }),

      setBlock: (updatedBlock) =>
        set((state) => ({
          blocks: state.blocks.map((block) =>
            block.id === updatedBlock.id ? updatedBlock : block
          ),
        })),

      setFocusedBlockId: (id) => set({ focusedBlockId: id }),
    }),
    {
      name: "lite-markdown-editor-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        title: state.title,
        blocks: state.blocks,
      }),
    }
  )
);

export default useBlocksStore;
