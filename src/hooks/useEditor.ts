import useBlocksStore from "@/stores/BlocksStore";

function useEditor() {
  const title = useBlocksStore((state) => state.title);
  const blocks = useBlocksStore((state) => state.blocks);

  // Block Actions
  const addAfter = useBlocksStore((state) => state.addAfter);
  const deleteSelected = useBlocksStore((state) => state.deleteSelected);
  const addEmptyToLast = useBlocksStore((state) => state.addEmptyToLast);

  // Setter
  const setTitle = useBlocksStore((state) => state.setTitle);
  const setBlock = useBlocksStore((state) => state.setBlock);

  return {
    // Variables
    title,
    blocks,

    // Block Actions
    addAfter,
    addEmptyToLast,
    deleteSelected,

    // Setter
    setTitle,
    setBlock,
  };
}

export default useEditor;
