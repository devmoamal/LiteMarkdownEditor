import type { TBlock } from "@/types";
import { generateUUID } from "@/utils/uuid";

export function generateEmptyBlock(): TBlock {
  return {
    id: generateUUID(),
    type: "Text",
    content: "",
  };
}
