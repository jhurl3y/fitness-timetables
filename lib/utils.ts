export function getRandomTailwindBgClass(): string {
  const colors = [
    "blue",
    "red",
    "green",
    "yellow",
    "purple",
    "pink",
    "indigo",
    "gray",
  ];

  // Randomly pick a color from the colors array
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  // Return the full Tailwind class name
  return randomColor;
}
