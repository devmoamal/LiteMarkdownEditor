export type TextColor = `#${string}`; // Hex color ex : #ffffff

export type BaseBlockTypeProps = {
  textSize?: number; // pixel value ex : 10 that means 10px
  color?: TextColor;
};

// Regular Text type
export type TypeText = BaseBlockTypeProps;

// Heading type
export type TypeHeading = BaseBlockTypeProps & {
  level?: 1 | 2 | 3;
};
