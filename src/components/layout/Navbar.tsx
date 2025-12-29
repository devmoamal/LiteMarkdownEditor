import useEditor from "@/hooks/useEditor";
import { cn } from "@/lib/utils";
import { Ellipsis, Moon, Sun } from "lucide-react";
import IconButton from "../common/IconButton";
import useTheme from "@/hooks/useTheme";

import logo from "@/../public/logo.png";

type NavbarProps = {
  className?: string;
};

function Navbar({ className }: NavbarProps) {
  const { title } = useEditor();
  const { theme, toggle } = useTheme();

  // Open github page when click on logo ...
  const onClickLogo = () =>
    window.open("https://github.com/devmoamal/LiteMarkdownEditor");

  return (
    <div
      className={cn(
        "flex p-2 bg-editor-background items-center justify-between",
        className
      )}
    >
      <div className="flex items-center gap-1 min-w-0 flex-1">
        <img
          className="w-6 h-6 hover:opacity-60 cursor-pointer"
          src={logo}
          onClick={onClickLogo}
        />
        <p className="text-text font-bold truncate">
          {title ? title : "Untitled"}
        </p>
      </div>
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
