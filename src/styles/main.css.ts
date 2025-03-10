import { tokens } from "@/configs/vanilla.css";
import { style } from "@vanilla-extract/css";

export const bodyStyle = style({
  margin: tokens.size.zero,
  fontFamily: "Arial, sans-serif",
  backgroundColor: tokens.colors.background,
});

export const mainStyle = style({
  background: tokens.colors.background,
  height: tokens.size.full,
  display: "flex",
  flexDirection: "column",
  padding: "0 100px",
  "@media": {
    "screen and (max-width: 767px)": {
      padding: `${tokens.space.sm} ${tokens.space.md}`,
    },
    "screen and (min-width: 768px) and (max-width: 1024px)": {
      padding: `${tokens.space.md} ${tokens.space.lg}`,
    },
    "screen and (min-width: 1025px)": {
      padding: "0 100px",
    },
  },
});

export const containerStyle = style({
  display: "flex",
  columnGap: tokens.space.md,
  height: "calc(100% - 100px)",
  "@media": {
    "screen and (max-width: 767px)": {
      flexDirection: "column",
    },
  },
});
