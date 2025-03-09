import { style, globalStyle } from "@vanilla-extract/css";
import { tokens } from "@/configs/vanilla.css";

export const switchContainer = style({
  display: "flex",
  justifyContent: "flex-end",
  padding: tokens.size.sm, // Corresponds to "0.5rem"
});

export const switchLabel = style({
  position: "relative",
  display: "inline-block",
  width: tokens.size.xxl, // Corresponds to "2.5rem"
  height: tokens.size.xl, // Corresponds to "1.75rem"
});

globalStyle(`${switchLabel} input`, {
  opacity: tokens.size.zero,
  width: tokens.size.zero,
  height: tokens.size.zero,
});

export const slider = style({
  position: "absolute",
  cursor: "pointer",
  top: tokens.size.zero,
  left: tokens.size.zero,
  right: tokens.size.zero,
  bottom: tokens.size.zero,
  backgroundColor: "#ccc",
  transition: "0.4s",
  borderRadius: tokens.size.xl, // Corresponds to "1.75rem"
});

export const sliderBefore = style({
  position: "absolute",
  content: '""',
  height: tokens.size.lg, // Corresponds to "1.5rem"
  width: tokens.size.lg, // Corresponds to "1.5rem"
  left: tokens.size.xs, // Corresponds to "0.25rem"
  bottom: tokens.size.xs, // Corresponds to "0.25rem"
  backgroundColor: "white",
  transition: "0.4s",
  borderRadius: "50%",
});

globalStyle(`${switchLabel} input:checked + .${slider}`, {
  backgroundColor: "#2196f3",
});

globalStyle(`${switchLabel} input:checked + .${slider}::before`, {
  transform: `translateX(${tokens.size.lg})`, // Corresponds to "1.5rem"
});