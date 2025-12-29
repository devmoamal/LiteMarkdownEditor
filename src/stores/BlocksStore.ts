import { generateEmptyBlock } from "@/factories";
import type { BlockId, BlockProps, TBlock } from "@/types";
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
  setBlock: (block: TBlock, props?: BlockProps) => void;
  setFocusedBlockId: (id: BlockId | null) => void;
}

/**
 * Main store for managing blocks and document state.
 * Uses zustand with persistence to local storage.
 */
const useBlocksStore = create<BlocksState>()(
  persist(
    (set) => ({
      title: "Untitled",
      blocks: [generateEmptyBlock()],
      focusedBlockId: null,

      /**
       * Adds a new empty block immediately after the specified block ID.
       */
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

      /**
       * Appends an empty block to the end of the document.
       */
      addEmptyToLast: () =>
        set((state) => {
          const newBlock = generateEmptyBlock();
          return {
            blocks: [...state.blocks, newBlock],
            focusedBlockId: newBlock.id,
          };
        }),

      /**
       * Deletes all blocks in the provided set of IDs.
       * Ensures at least one empty block remains in the document.
       */
      deleteSelected: (selected) =>
        set((state) => {
          if (selected.size === 0) return state;

          const firstSelectedIndex = state.blocks.findIndex((b) =>
            selected.has(b.id)
          );

          const newBlocks = state.blocks.filter(
            (block) => !selected.has(block.id)
          );

          // Always keep at least one block to maintain document structure
          if (newBlocks.length === 0) {
            const newBlock = generateEmptyBlock();
            return { blocks: [newBlock], focusedBlockId: newBlock.id };
          }

          // Smart focus logic: prioritize the block that shifted into the deleted position
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

      /**
       * Updates the document title.
       */
      setTitle: (title) => set({ title }),

      /**
       * Updates a specific block's content and/or properties.
       * Preserves existing props if new ones are not provided.
       */
      setBlock: (updatedBlock, props) =>
        set((state) => ({
          blocks: state.blocks.map((block) =>
            block.id === updatedBlock.id
              ? { ...updatedBlock, props: props ?? updatedBlock.props }
              : block
          ),
        })),

      /**
       * Sets the ID of the block that should receive focus.
       */
      setFocusedBlockId: (id) => set({ focusedBlockId: id }),
    }),
    {
      name: "lite-markdown-editor-storage",
      storage: createJSONStorage(() => localStorage),
      // Only persist essential document data
      partialize: (state) => ({
        title: state.title,
        blocks: state.blocks,
      }),
    }
  )
);

export default useBlocksStore;
