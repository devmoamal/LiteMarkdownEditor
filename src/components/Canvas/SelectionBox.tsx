import type { SelectionRect } from "@/types";

type Props = {
  rect: SelectionRect;
};

export function SelectionBox({ rect }: Props) {
  return (
    <div
      className="absolute border border-blue-500/50 bg-blue-500/10 pointer-events-none rounded-sm z-50 backdrop-blur-[1px]"
      style={{
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      }}
    />
  );
}
