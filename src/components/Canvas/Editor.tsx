import "@/assets/editor.css";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import Block from "./Block";
import { useMarqueeSelection } from "@/hooks/selection/useMarqueeSelection";
import { SelectionBox } from "@/components/Canvas/SelectionBox";
import useEditor from "@/hooks/useEditor";
import type { BlockId } from "@/types";

type EditorProps = {
  className?: string;
};

function Editor({ className }: EditorProps) {
  const { blocks, deleteSelected, addEmptyToLast } = useEditor();

  const containerRef = useRef<HTMLDivElement>(null);
  const registryRef = useRef<Map<BlockId, HTMLElement>>(new Map());

  const onChangeBlock = (id: string, text: string) => {
    // Add new empty block if last block receives input
    if (text.length > 0 && blocks[blocks.length - 1].id === id)
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
        "relative h-screen p-2 justify-center rounded-sm text-text bg-editor-background select-none",
        className
      )}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      {blocks.map((block) => (
        <Block
          key={block.id}
          block={block}
          onChange={onChangeBlock}
          register={(id, el) => registryRef.current.set(id, el)} // register block for selection
          selected={selected.has(block.id)}
        />
      ))}
      {rect && <SelectionBox rect={rect} />} {/* render marquee rectangle */}
    </div>
  );
}

export default Editor;
