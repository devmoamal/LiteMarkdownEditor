import { cn } from "@/lib/utils";
import Editor from "./Canvas/Editor";
import Navbar from "./Navbar";
import useTheme from "@/hooks/useTheme";
import { useEffect } from "react";

type LayoutProps = {
  className?: string;
};

function Layout({ className }: LayoutProps) {
  const { theme } = useTheme();

  // Update dom background color
  useEffect(() => {
    document.body.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div className={cn("flex flex-col flex-1 overflow-hidden", className)}>
      <Navbar />
      <Editor />
    </div>
  );
}

export default Layout;
