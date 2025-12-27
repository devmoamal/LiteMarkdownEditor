import useEditor from "@/hooks/useEditor";
import { cn } from "@/lib/utils";
import { Ellipsis, Moon, Sun } from "lucide-react";
import IconButton from "./common/IconButton";
import useTheme from "@/hooks/useTheme";

type NavbarProps = {
  className?: string;
};

function Navbar({ className }: NavbarProps) {
  const { title } = useEditor();
  const { theme, toggle } = useTheme();

  return (
    <div
      className={cn(
        "flex p-2 bg-editor-background items-center justify-between",
        className
      )}
    >
      <p className="text-text font-bold truncate w-2/3">{title}</p>
      <div className="flex items-center gap-2">
        <IconButton
          className="text-text"
          Icon={theme === "dark" ? Moon : Sun}
          size={18}
          onClick={toggle}
        />
        <IconButton className="text-text" Icon={Ellipsis} size={18} />
      </div>
    </div>
  );
}

export default Navbar;
