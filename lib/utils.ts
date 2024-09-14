import { COLORS } from "./constants";

export function getRandomTailwindBgClass(): string {
  const colors = Object.keys(COLORS);

  // Randomly pick a color from the colors array
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  // Return the full Tailwind class name
  return randomColor;
}
