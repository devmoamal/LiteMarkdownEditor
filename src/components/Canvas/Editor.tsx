import "@/assets/editor.css";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import Block from "./Block";
import { useMarqueeSelection } from "@/hooks/selection/useMarqueeSelection";
import { SelectionBox } from "@/components/Canvas/SelectionBox";
import useEditor from "@/hooks/useEditor";
import type { BlockId, TBlock } from "@/types";
import Title from "./Title";

type EditorProps = {
  className?: string;
};

function Editor({ className }: EditorProps) {
  const { blocks, deleteSelected, addEmptyToLast, setBlock } = useEditor();

  const containerRef = useRef<HTMLDivElement>(null);
  const registryRef = useRef<Map<BlockId, HTMLElement>>(new Map());

  const onChangeBlock = (block: TBlock) => {
    setBlock(block);

    // Check if the last block not empty to create new block
    if (block.content.length > 0 && blocks[blocks.length - 1].id == block.id)
      addEmptyToLast();
  };

  // Marquee selection hook: rect, selected ids, mouse handlers
  const { rect, selected, onMouseDown, onMouseMove, onMouseUp, onMouseLeave } =
    useMarqueeSelection(containerRef, registryRef);

  // Keyboard deletion of selected blocks
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selected.size === 0) return;
      if (e.key === "Backspace" || e.key === "Delete") {
        e.preventDefault();
        deleteSelected(selected);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [deleteSelected, selected]);

  // Ensure editor always has at least one block
  useEffect(() => {
    if (blocks.length === 0) addEmptyToLast();
  }, [addEmptyToLast, blocks]);

  return (
    <div
      ref={containerRef} // container ref for marquee
      className={cn(
        "relative flex flex-col flex-1 pt-[7.5%] pb-[2.5%] px-[10%] sm:px-[12.5%] lg:px-[15%] text-text bg-editor-background select-none overflow-x-hidden",
        className
      )}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      <Title />
      <hr className="my-2 text-text-hint" />
      {blocks.map((block) => (
        <Block
          key={block.id}
          block={block}
          onChange={onChangeBlock}
          register={(id, el) => registryRef.current.set(id, el)} // register block for selection
          isSelected={selected.has(block.id)}
        />
      ))}
      {rect && <SelectionBox rect={rect} />} {/* render marquee rectangle */}
    </div>
  );
}

export default Editor;
