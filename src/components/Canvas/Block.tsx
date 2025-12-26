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
  const { addAfter } = useEditor();
  const ref = useRef<HTMLDivElement>(null);

  // Register DOM element for marquee / selection logic
  useEffect(() => {
    if (ref.current) {
      register?.(block.id, ref.current);
    }
  }, [block.id, register]);

  return (
    <div
      ref={ref}
      className={cn(
        "relative group my-0.5",
        isSelected && "bg-blue-500/20",
        className
      )}
    >
      {/* LEFT CONTROLS (outside content flow) */}
      <div
        className="
          absolute -left-10 top-1/2 -translate-y-1/2
          flex gap-1
          opacity-0 group-hover:opacity-100
          transition-opacity
        "
      >
        <Plus
          size={18}
          className="cursor-pointer text-muted-foreground hover:text-foreground"
          onClick={() => addAfter(block.id)}
        />
        <GripVertical
          size={18}
          className="cursor-grab text-muted-foreground hover:text-foreground"
        />
      </div>

      <div
        contentEditable
        suppressContentEditableWarning
        data-placeholder="Type something..."
        onInput={(e) =>
          onChange?.({ ...block, content: e.currentTarget.innerText })
        }
        className="
          block
          outline-none
          w-2/3
        "
      />
      {block.content}
    </div>
  );
}

export default Block;
