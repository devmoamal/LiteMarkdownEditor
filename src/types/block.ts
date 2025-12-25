export type BlockType = "Text" | "Heading";

export type TextColor = `#${string}`; // Hex color ex : #ffffff

export type BlockProps = {
  textSize?: number; // pixel value ex : 10 that means 10px
  textColor?: TextColor;
};

export type TBlock = {
  id: string;
  type: BlockType;
  props?: BlockProps;
  content: string;
};
