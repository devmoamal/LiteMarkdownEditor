import useEditor from "@/hooks/useEditor";
import { cn } from "@/lib/utils";
import type { BlockId, TBlock } from "@/types";
import { GripVertical, Plus } from "lucide-react";
import { useEffect, useRef } from "react";

type BlockProps = {
  block: TBlock;
  className?: string;
  onChange?: (block: TBlock) => void;
  register?: (id: BlockId, el: HTMLElement) => void;
  isSelected?: boolean;
};

function Block({
  block,
  onChange,
  className,
  register,
  isSelected,
}: BlockProps) {
  const { addAfter, deleteSelected } = useEditor();
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Sync content with store (only if different and not currently editing)
  useEffect(() => {
    if (contentRef.current && contentRef.current.innerText !== block.content) {
      contentRef.current.innerText = block.content;
    }
  }, [block.content]);

  // Register DOM element for marquee / selection logic
  useEffect(() => {
    if (containerRef.current) {
      register?.(block.id, containerRef.current);
    }
  }, [block.id, register]);

  const handleInput = () => {
    if (contentRef.current) {
      onChange?.({ ...block, content: contentRef.current.innerText });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addAfter(block.id);
    } else if (e.key === "Backspace" && block.content === "") {
      e.preventDefault();
      deleteSelected(new Set([block.id]));
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative group my-1 py-1 px-2 rounded-lg transition-colors duration-200",
        isSelected
          ? "bg-blue-500/10 ring-1 ring-blue-500/30"
          : "hover:bg-black/5 dark:hover:bg-white/5",
        className
      )}
    >
      {/* Side Controls */}
      <div
        className={cn(
          "absolute -left-12 top-1/2 -translate-y-1/2",
          "flex items-center gap-0.5",
          "opacity-0 group-hover:opacity-100",
          "transition-opacity duration-200"
        )}
      >
        <button
          onClick={() => addAfter(block.id)}
          className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 text-text-hint hover:text-text transition-colors"
        >
          <Plus size={16} />
        </button>
        <div className="p-1 cursor-grab text-text-hint hover:text-text">
          <GripVertical size={16} />
        </div>
      </div>

      {/* Editable Content */}
      <div
        ref={contentRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        data-placeholder="Start typing..."
        className={cn(
          "block outline-none w-full max-w-none prose dark:prose-invert",
          "empty:before:content-[attr(data-placeholder)] empty:before:text-text-hint empty:before:pointer-events-none"
        )}
      />
    </div>
  );
}

export default Block;
