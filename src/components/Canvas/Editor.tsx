import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { TBlock } from "@/types";
import Block from "./Block";
import { generateEmptyBlock } from "@/factories";
import { useMarqueeSelection } from "@/hooks/selection/useMarqueeSelection";
import { SelectionBox } from "@/components/Canvas/SelectionBox";

type EditorProps = {
  className?: string;
};

function Editor({ className }: EditorProps) {
  const [blocks, setBlocks] = useState<TBlock[]>([generateEmptyBlock()]);

  const containerRef = useRef<HTMLDivElement>(null);
  const registryRef = useRef<Map<string, HTMLElement>>(new Map());

  const onChangeBlock = (id: string, text: string) => {
    if (text.length > 0 && blocks[blocks.length - 1].id === id) {
      setBlocks([...blocks, generateEmptyBlock()]);
    }
  };

  const { rect, selected, onMouseDown, onMouseMove, onMouseUp, onMouseLeave } =
    useMarqueeSelection(containerRef, registryRef);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selected.size === 0) return;
      if (e.key === "Backspace" || e.key === "Delete") {
        e.preventDefault();
        setBlocks((prev) => prev.filter((block) => !selected.has(block.id)));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selected]);

  useEffect(() => {
    // Check if there is no block generate empty block
    if (blocks.length == 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBlocks([generateEmptyBlock()]);
    }
  }, [blocks]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative h-screen p-2 rounded-sm text-text bg-editor-background select-none",
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
          register={(id, el) => registryRef.current.set(id, el)}
          selected={selected.has(block.id)}
        />
      ))}
      {rect && <SelectionBox rect={rect} />}
    </div>
  );
}

export default Editor;
