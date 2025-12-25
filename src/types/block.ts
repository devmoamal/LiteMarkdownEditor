export type TBlock = {
  id: BlockId;
  type: BlockType;
  props?: BlockProps;
  content: string;
};

// UUID Type ex : 5642b5bf-40c2-40b5-be38-2e7c83187caa
export type BlockId = `${string}-${string}-${string}-${string}-${string}`;

export type BlockType = "Text" | "Heading";

export type BlockProps = {
  textSize?: number; // pixel value ex : 10 that means 10px
  textColor?: TextColor;
};

export type TextColor = `#${string}`; // Hex color ex : #ffffff
