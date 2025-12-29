import useEditor from "@/hooks/useEditor";
import { cn } from "@/lib/utils";
import type { BlockId, TBlock } from "@/types";
import { GripVertical, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import IconButton from "../common/IconButton";
import BlockMenu from "./BlockMenu";

type BlockProps = {
  block: TBlock;
  className?: string;
  onChange?: (block: TBlock) => void;
  register?: (id: BlockId, el: HTMLElement) => void;
  unregister?: (id: BlockId) => void;
  isSelected?: boolean;
};

/**
 * Individual block component that handles its own editing state,
 * focus management, and rendering based on its type.
 */
function Block({
  block,
  onChange,
  className,
  register,
  unregister,
  isSelected,
}: BlockProps) {
  const {
    addAfter,
    deleteSelected,
    focusedBlockId,
    setFocusedBlockId,
    setBlock,
  } = useEditor();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  /**
   * Sync initial content and external changes to the DOM.
   * Avoids overwriting content while the user is actively typing.
   */
  useEffect(() => {
    if (
      contentRef.current &&
      document.activeElement !== contentRef.current &&
      contentRef.current.innerText !== block.content
    ) {
      contentRef.current.innerText = block.content;
    }
  }, [block.content]);

  /**
   * Handle programmatic focus requests (e.g., when adding a new block).
   * Places the cursor at the end of the content.
   */
  useEffect(() => {
    if (focusedBlockId === block.id && contentRef.current) {
      contentRef.current.focus();
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(contentRef.current);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);

      setFocusedBlockId(null);
    }
  }, [focusedBlockId, block.id, setFocusedBlockId]);

  /**
   * Register the block's DOM element for external logic (like marquee selection).
   */
  useEffect(() => {
    if (containerRef.current) {
      register?.(block.id, containerRef.current);
    }
    return () => {
      unregister?.(block.id);
    };
  }, [block.id, register, unregister]);

  /**
   * Trigger the onChange callback when text content changes.
   */
  const handleInput = () => {
    if (contentRef.current) {
      onChange?.({ ...block, content: contentRef.current.innerText });
    }
  };

  /**
   * Handle block-level keyboard interactions.
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "Backspace" || e.key === "Delete") {
      e.stopPropagation();
    }

    // New block on Enter
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addAfter(block.id);
    }
    // Delete block on backspace if empty
    else if (e.key === "Backspace") {
      const content = contentRef.current?.innerText || "";
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
        isMenuOpen ? "z-50" : "z-0",
        isSelected
          ? "bg-blue-500/10 ring-1 ring-blue-500/30"
          : "hover:bg-black/5 dark:hover:bg-white/5",
        className
      )}
    >
      {/* Block controls visible on hover */}
      <div
        className={cn(
          "absolute -left-14 top-1/2 -translate-y-1/2",
          "flex items-center gap-0.5",
          "transition-opacity duration-200",
          isMenuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
      >
        <IconButton Icon={Plus} size={16} onClick={() => addAfter(block.id)} />
        <div className="relative">
          <IconButton
            Icon={GripVertical}
            size={16}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={cn(isMenuOpen && "bg-button-hover")}
          />
          <BlockMenu
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            onSelect={(type, props) => setBlock({ ...block, type, props })}
          />
        </div>
      </div>

      {/* Main editable area */}
      <div
        ref={contentRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        data-placeholder="Start typing..."
        className={cn(
          "block outline-none w-full max-w-none prose dark:prose-invert",
          "empty:before:content-[attr(data-placeholder)] empty:before:text-text-hint empty:before:pointer-events-none",
          // Type-specific styling
          block.type === "Heading" && [
            (block.props as import("@/types").HeadingProps)?.level === 1 &&
              "text-4xl font-bold",
            (block.props as import("@/types").HeadingProps)?.level === 2 &&
              "text-3xl font-bold",
            (block.props as import("@/types").HeadingProps)?.level === 3 &&
              "text-2xl font-bold",
          ]
        )}
      />
    </div>
  );
}

export default Block;
