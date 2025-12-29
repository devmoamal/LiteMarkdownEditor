import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import Block from "./Block";
import { useMarqueeSelection } from "@/hooks/selection/useMarqueeSelection";
import { SelectionBox } from "@/components/Canvas/SelectionBox";
import useEditor from "@/hooks/useEditor";
import type { TBlock, BlockId } from "@/types";
import Title from "./Title";
import { useBlockRegistry } from "@/hooks/selection/useBlockRegistry";

type EditorProps = {
  className?: string;
};

/**
 * Main editor canvas where blocks are rendered and managed.
 */
function Editor({ className }: EditorProps) {
  const { blocks, deleteSelected, addEmptyToLast, setBlock } = useEditor();
  const { registry, register, unregister } = useBlockRegistry();

  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * Initialize marquee selection logic.
   */
  const { rect, selected, onMouseDown, onMouseMove, onMouseUp, onMouseLeave } =
    useMarqueeSelection(containerRef, registry);

  /**
   * Handle global keyboard shortcuts, like deleting multiple selected blocks.
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selected.size === 0) return;
      if (e.key === "Backspace" || e.key === "Delete") {
        // Only delete if multiple are selected or if the focus is lost (on body)
        if (selected.size > 1 || document.activeElement === document.body) {
          e.preventDefault();
          deleteSelected(selected as Set<BlockId>);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [deleteSelected, selected]);

  /**
   * Ensure there's always at least one editable block in the editor.
   */
  useEffect(() => {
    if (blocks.length === 0) addEmptyToLast();
  }, [addEmptyToLast, blocks]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex flex-col flex-1 px-[12.5%] sm:px-[15%] lg:px-[20%] text-text bg-editor-background select-none overflow-y-auto overflow-x-hidden",
        className
      )}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      <div className="max-w-4xl mx-auto w-full pt-[10%] pb-20">
        <Title className="mb-4 w-full" />
        <hr className="border-text-hint/20 w-full mb-6" />

        <div className="flex flex-col gap-1">
          {blocks.map((block) => (
            <Block
              key={block.id}
              block={block}
              onChange={(updated: TBlock) => setBlock(updated)}
              register={register}
              unregister={unregister}
              isSelected={selected.has(block.id)}
            />
          ))}
        </div>
      </div>

      {/* Marquee selection visual tool */}
      {rect && <SelectionBox rect={rect} />}
    </div>
  );
}

export default Editor;
