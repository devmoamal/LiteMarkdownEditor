import useBlocksStore from "@/stores/BlocksStore";

function useEditor() {
  const title = useBlocksStore((state) => state.title);
  const blocks = useBlocksStore((state) => state.blocks);

  const focusedBlockId = useBlocksStore((state) => state.focusedBlockId);

  // Block Actions
  const addAfter = useBlocksStore((state) => state.addAfter);
  const deleteSelected = useBlocksStore((state) => state.deleteSelected);
  const addEmptyToLast = useBlocksStore((state) => state.addEmptyToLast);

  // Setter
  const setTitle = useBlocksStore((state) => state.setTitle);
  const setBlock = useBlocksStore((state) => state.setBlock);
  const setFocusedBlockId = useBlocksStore((state) => state.setFocusedBlockId);

  return {
    // Variables
    title,
    blocks,
    focusedBlockId,

    // Block Actions
    addAfter,
    addEmptyToLast,
    deleteSelected,

    // Setter
    setTitle,
    setBlock,
    setFocusedBlockId,
  };
}

export default useEditor;
