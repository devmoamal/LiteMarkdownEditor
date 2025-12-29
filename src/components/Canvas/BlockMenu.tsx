import { cn } from "@/lib/utils";
import type { BlockProps, BlockType } from "@/types";
import {
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef } from "react";

type MenuBlockType = {
  title: string;
  type: BlockType;
  props?: BlockProps;
  icon: LucideIcon;
};

/**
 * Definition of available block types in the menu.
 */
const MenuBlockTypes: MenuBlockType[] = [
  {
    title: "Text",
    type: "Text",
    icon: Pilcrow,
  },
  {
    title: "Heading 1",
    type: "Heading",
    props: { level: 1 },
    icon: Heading1,
  },
  {
    title: "Heading 2",
    type: "Heading",
    props: { level: 2 },
    icon: Heading2,
  },
  {
    title: "Heading 3",
    type: "Heading",
    props: { level: 3 },
    icon: Heading3,
  },
];

type BlockMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: BlockType, props?: BlockProps) => void;
  className?: string;
};

/**
 * A dropdown menu that allows users to change the type of a block.
 */
function BlockMenu({ isOpen, onClose, onSelect, className }: BlockMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  /**
   * Close the menu when clicking outside of it.
   */
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className={cn(
        "absolute left-0 mt-2 min-w-48 z-100",
        "bg-editor-background border border-button-hover rounded-xl shadow-xl overflow-hidden",
        "flex flex-col p-1 animate-in fade-in zoom-in duration-200",
        className
      )}
    >
      <div className="px-2 py-1.5 text-xs font-semibold text-text-hint uppercase tracking-wider">
        Block Type
      </div>

      {MenuBlockTypes.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.title}
            onClick={() => {
              onSelect(item.type, item.props);
              onClose();
            }}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-sm text-left rounded-lg transition-colors w-full cursor-pointer",
              "hover:bg-button-hover group"
            )}
          >
            {/* Type Icon */}
            <div className="p-1 rounded bg-button-hover group-hover:bg-background/20">
              <Icon
                size={16}
                className="text-text-hint group-hover:text-text"
              />
            </div>

            {/* Type Title */}
            <span className="font-medium">{item.title}</span>
          </button>
        );
      })}
    </div>
  );
}

export default BlockMenu;
