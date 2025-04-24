import { style, globalStyle } from "@vanilla-extract/css";
import { tokens } from "@/configs/vanilla.css";

export const switchContainer = style({
  display: "flex",
  alignItems: "center",
  gap: tokens.size.xs,
  padding: tokens.size.xs,
});

export const switchLabel = style({
  position: "relative",
  display: "inline-block",
  width: "70px", // Increased width for more text space
  height: "30px", // Increased height for better proportions
});

globalStyle(`${switchLabel} input`, {
  opacity: 0,
  width: 0,
  height: 0,
});

export const slider = style({
  position: "absolute",
  cursor: "pointer",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "#ccc",
  transition: "0.3s",
  borderRadius: "34px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontSize: "14px",
  fontWeight: "bold",
  color: "#fff",
  padding: "0 10px", // Ensures text stays inside
});

export const sliderBefore = style({
  position: "absolute",
  content: '""',
  height: "24px",
  width: "24px",
  left: "3px",
  bottom: "3px",
  backgroundColor: "white",
  transition: "0.3s",
  borderRadius: "50%",
  boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
});

globalStyle(`${switchLabel} input:checked + .${slider}`, {
  backgroundColor: "#2196F3",
});

globalStyle(`${switchLabel} input:checked + .${slider}::before`, {
  transform: "translateX(38px)", // Adjust movement for bigger switch
});

globalStyle(`${switchLabel} input + .${slider}::after`, {
  content: '"اردو"', // Default text inside switch
  display: "block",
  margin: '0 auto',
  left: "10px",
  color: "#000",
});

globalStyle(`${switchLabel} input:checked + .${slider}::after`, {
  content: '"English"', // Urdu text inside when switched
  position: "absolute",
  right: "10px",
  color: "#fff",
});
