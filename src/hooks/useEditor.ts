import useBlocksStore from "@/stores/BlocksStore";

/**
 * Custom hook to interface with the BlocksStore.
 * Provides a clean API for components to access state and actions.
 */
function useEditor() {
  // Document State
  const title = useBlocksStore((state) => state.title);
  const blocks = useBlocksStore((state) => state.blocks);
  const focusedBlockId = useBlocksStore((state) => state.focusedBlockId);

  // Block Mutation Actions
  const addAfter = useBlocksStore((state) => state.addAfter);
  const deleteSelected = useBlocksStore((state) => state.deleteSelected);
  const addEmptyToLast = useBlocksStore((state) => state.addEmptyToLast);

  // State Setters
  const setTitle = useBlocksStore((state) => state.setTitle);
  const setBlock = useBlocksStore((state) => state.setBlock);
  const setFocusedBlockId = useBlocksStore((state) => state.setFocusedBlockId);

  return {
    // Variables
    title,
    blocks,
    focusedBlockId,

    // Actions
    addAfter,
    addEmptyToLast,
    deleteSelected,

    // Setters
    setTitle,
    setBlock,
    setFocusedBlockId,
  };
}

export default useEditor;
