import { tokens } from "@/configs/vanilla.css";
import { style, styleVariants } from "@vanilla-extract/css";

const baseStyle = style({
  height: "100px",
  justifyContent: "space-between",
  alignItems: "center",
  outlineOffset: "8px",
  cursor: "text",

  borderRadius: tokens.radii.sm,
  ":hover": {
    outline: `1px solid  ${tokens.colors.lightGray}`,
  },
});

export const editableFieldStyle = styleVariants({
  default: [baseStyle, { outline: "none" }],
  editing: [
    baseStyle,
    {
      outline: `1px solid  ${tokens.colors.lightGray}`,
    },
  ],
  error: [
    baseStyle,
    { outline: "1px solid red", paddingLeft: "10px", paddingRight: "10px" },
  ],
});
