import { COLORS_TW } from "./constants";

export function getRandomTailwindBgClass(): keyof typeof COLORS_TW {
  const colorKeys = Object.keys(COLORS_TW) as Array<keyof typeof COLORS_TW>;

  const randomColorKey =
    colorKeys[Math.floor(Math.random() * colorKeys.length)];

  return randomColorKey;
}
