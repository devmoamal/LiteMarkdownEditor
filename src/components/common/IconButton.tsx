import { cn } from "@/lib/utils";
import { type LucideIcon, type LucideProps } from "lucide-react";

type IconButtonProps = {
  Icon: LucideIcon;

  className?: string;
  onClick?: () => void;
} & LucideProps;

function IconButton({
  Icon,
  onClick,
  className,
  ...iconProps
}: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "p-1",
        "cursor-pointer",
        "hover:bg-button-hover",
        "focus:outline-none",
        className
      )}
    >
      <Icon {...iconProps} />
    </button>
  );
}

export default IconButton;
