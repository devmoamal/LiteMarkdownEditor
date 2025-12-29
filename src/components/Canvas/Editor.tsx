import "@/assets/editor.css";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import Block from "./Block";
import { useMarqueeSelection } from "@/hooks/selection/useMarqueeSelection";
import { SelectionBox } from "@/components/Canvas/SelectionBox";
import useEditor from "@/hooks/useEditor";
import type { TBlock, BlockId } from "@/types";
import Title from "./Title";

type EditorProps = {
  className?: string;
};

function Editor({ className }: EditorProps) {
  const { blocks, deleteSelected, addEmptyToLast, setBlock } = useEditor();

  const containerRef = useRef<HTMLDivElement>(null);
  const registryRef = useRef<Map<string, HTMLElement>>(new Map());

  const onChangeBlock = (block: TBlock) => {
    setBlock(block);
  };

  const { rect, selected, onMouseDown, onMouseMove, onMouseUp, onMouseLeave } =
    useMarqueeSelection(containerRef, registryRef);

  // Keyboard deletion of selected blocks
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selected.size === 0) return;
      if (e.key === "Backspace" || e.key === "Delete") {
        // Only delete if multiple are selected or if not focused on anything specific
        if (selected.size > 1 || document.activeElement === document.body) {
          e.preventDefault();
          deleteSelected(selected as Set<BlockId>);
        }
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
      ref={containerRef}
      className={cn(
        "relative flex flex-col flex-1 pb-20 px-4 sm:px-[15%] lg:px-[20%] text-text bg-editor-background select-none overflow-y-auto overflow-x-hidden",
        className
      )}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      <div className="max-w-4xl mx-auto w-full pt-[10%]">
        <Title />
        <hr className="my-6 border-text-hint/20" />
        <div className="flex flex-col gap-1">
          {blocks.map((block) => (
            <Block
              key={block.id}
              block={block}
              onChange={onChangeBlock}
              register={(id, el) => registryRef.current.set(id, el)}
              isSelected={selected.has(block.id)}
            />
          ))}
        </div>
      </div>
      {rect && <SelectionBox rect={rect} />}
    </div>
  );
}

export default Editor;
