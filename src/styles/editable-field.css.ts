import { tokens } from "@/configs/vanilla.css";
import { style, styleVariants } from "@vanilla-extract/css";

const baseStyle = style({
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
    { 
      outline: "1px solid red", 
      paddingLeft: "10px", 
      minWidth: '150px', 
      minHeight: '20px', 
      paddingRight: "10px", 
      display: "inline-block",
      position: "relative",
      "-webkit-text-fill-color": "red",
      ":after": {
        content: 'attr(data-placeholder)', // Use the `attr()` function to display the placeholder value
        color: "red",
        position: "absolute",
        top: "-16px",
        left: "0",
        fontSize: "12px",
        background: '#f8dddd',
        padding: '0px 2px',
        borderRadius: '2px',
        "-webkit-text-fill-color": "red",
        fontFamily: "'__Raleway_88131f', '__Raleway_Fallback_88131f'",
        fontWeight: 500,
      },
    },
  ],
});
