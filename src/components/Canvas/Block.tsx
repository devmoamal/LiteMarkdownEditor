import useEditor from "@/hooks/useEditor";
import { cn } from "@/lib/utils";
import type { BlockId, TBlock } from "@/types";
import { GripVertical, Plus } from "lucide-react";
import { useEffect, useRef } from "react";
import IconButton from "../common/IconButton";

type BlockProps = {
  block: TBlock;
  className?: string;
  onChange?: (block: TBlock) => void;
  register?: (id: BlockId, el: HTMLElement) => void;
  unregister?: (id: BlockId) => void;
  isSelected?: boolean;
};

function Block({
  block,
  onChange,
  className,
  register,
  unregister,
  isSelected,
}: BlockProps) {
  const { addAfter, deleteSelected, focusedBlockId, setFocusedBlockId } =
    useEditor();

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Sync content with store (only if different and not currently editing)
  useEffect(() => {
    if (
      contentRef.current &&
      document.activeElement !== contentRef.current &&
      contentRef.current.innerText !== block.content
    ) {
      contentRef.current.innerText = block.content;
    }
  }, [block.content]);

  // Handle focus when requested by store
  useEffect(() => {
    if (focusedBlockId === block.id && contentRef.current) {
      contentRef.current.focus();
      // Move cursor to end of content
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(contentRef.current);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);

      setFocusedBlockId(null);
    }
  }, [focusedBlockId, block.id, setFocusedBlockId]);

  // Register DOM element for marquee / selection logic
  useEffect(() => {
    if (containerRef.current) {
      register?.(block.id, containerRef.current);
    }
    return () => {
      unregister?.(block.id);
    };
  }, [block.id, register, unregister]);

  const handleInput = () => {
    if (contentRef.current) {
      onChange?.({ ...block, content: contentRef.current.innerText });
    }
  };

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Stop propagation for all keys we handle or that shouldn't leak to the window
    if (e.key === "Enter" || e.key === "Backspace" || e.key === "Delete") {
      e.stopPropagation();
    }

    // Check if the key pressed is Enter without shift
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addAfter(block.id);
    } else if (e.key === "Backspace") {
      const content = contentRef.current?.innerText || "";
      // If the block is empty (or just whitespace/newlines), delete it
      if (content.trim() === "" || content === "\n") {
        e.preventDefault();
        deleteSelected(new Set([block.id]));
      }
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
          "absolute -left-14 top-1/2 -translate-y-1/2",
          "flex items-center gap-0.5",
          "opacity-0 group-hover:opacity-100",
          "transition-opacity duration-200"
        )}
      >
        <IconButton Icon={Plus} size={16} onClick={() => addAfter(block.id)} />
        <IconButton Icon={GripVertical} size={16} />
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
