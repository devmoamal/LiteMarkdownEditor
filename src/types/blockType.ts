export type TextColor = `#${string}`; // Hex color ex : #ffffff

export type TextingColorType = {
  color?: TextColor;
};

export type TextingSizeType = {
  textSize?: number; // pixel value ex : 10 that means 10px
};

export type TextingLevelType = {
  level?: 1 | 2 | 3;
};

// Regular Text Props
export type TextProps = TextingColorType & TextingSizeType;

// Heading Props
export type HeadingProps = TextingColorType &
  TextingSizeType &
  TextingLevelType;

export type BlockProps = TextProps | HeadingProps;

export type BlockType = "Text" | "Heading";
