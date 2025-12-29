import type { BlockProps, BlockType } from "./index";

// UUID Type ex : 5642b5bf-40c2-40b5-be38-2e7c83187caa
export type BlockId = `${string}-${string}-${string}-${string}-${string}`;

export type TBlock = {
  id: BlockId;
  type: BlockType;
  props?: BlockProps;
  content: string;
};
