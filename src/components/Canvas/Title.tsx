import useEditor from "@/hooks/useEditor";
import { cn } from "@/lib/utils";

type TitleProps = {
  className?: string;
};

function Title({ className }: TitleProps) {
  const { title, setTitle } = useEditor();
  return (
    <input
      className={cn("text-2xl font-bold placeholder:text-text-hint", className)}
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder="Title"
    />
  );
}

export default Title;
