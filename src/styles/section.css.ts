import { tokens } from "@/configs/vanilla.css";
import { globalStyle, style } from "@vanilla-extract/css";

export const sectionStyle = style({
  flex: 3,
});

export const sectionDetailsStyle = style({
  minHeight: `calc(${tokens.size.full} - 250px)`,
  backgroundColor: tokens.colors.white,
  borderRadius: tokens.radii.md,
  padding: `${tokens.space.sm} ${tokens.space.xxl}`,
});

export const sectionDetailsTitleStyle = style({
  margin: 0,
  display: "flex",
  alignItems: "center",
  gap: "40px",
});

globalStyle(`${sectionDetailsTitleStyle} > span`, {
  height: "2px",
  width: "20%",
  backgroundImage: `-webkit-linear-gradient(${tokens.colors.orange}, ${tokens.colors.fireEngineRed})`,
  display: "block",
  borderRadius: tokens.radii.sm
});
