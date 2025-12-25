import { cn } from "@/lib/utils";
import type { TBlock } from "@/types";
import { GripVertical, Plus } from "lucide-react";
import { useEffect, useRef } from "react";

type BlockProps = {
  block: TBlock;

  className?: string;
  onChange?: (id: string, text: string) => void;
  register?: (id: string, el: HTMLElement) => void;
  selected?: boolean;
};
function Block({ block, onChange, className, register, selected }: BlockProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Register this block's DOM element for marquee selection
  useEffect(() => {
    if (ref.current) {
      register?.(block.id, ref.current);
    }
  }, [block.id, register]);

  return (
    <div
      ref={ref} // element ref for selection registry
      className={cn(
        "flex m-0.5 gap-0.5 items-center group",
        selected && "bg-blue-500/20", // highlight if selected
        className
      )}
    >
      <Plus size={20} className="invisible group-hover:visible" />
      <GripVertical size={20} className="invisible group-hover:visible" />

      <div
        contentEditable
        suppressContentEditableWarning
        data-placeholder="Type something..."
        onInput={(e) => onChange?.(block.id, e.currentTarget.innerText)}
        className="block outline-none"
      />
    </div>
  );
}

export default Block;
