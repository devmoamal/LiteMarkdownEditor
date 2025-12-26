import useBlocksStore from "@/stores/BlocksStore";

function useEditor() {
  const blocks = useBlocksStore((state) => state.blocks);
  const addAfter = useBlocksStore((state) => state.addAfter);
  const deleteSelected = useBlocksStore((state) => state.deleteSelected);
  const addEmptyToLast = useBlocksStore((state) => state.addEmptyToLast);

  return { blocks, addAfter, addEmptyToLast, deleteSelected };
}

export default useEditor;
