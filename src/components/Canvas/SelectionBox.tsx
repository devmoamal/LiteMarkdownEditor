import type { SelectionRect } from "@/types";

type Props = {
  rect: SelectionRect;
};

export function SelectionBox({ rect }: Props) {
  return (
    <div
      className="absolute border border-blue-500 bg-blue-500/20 pointer-events-none"
      style={{
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      }}
    />
  );
}
