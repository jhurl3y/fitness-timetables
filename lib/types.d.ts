export type Event = {
  title: string;
  time: string;
  day: number; // 0 for Monday, 6 for Sunday
};

export const COLORS = {
  blue: "bg-blue-100",
  red: "bg-red-100",
  green: "bg-green-100",
  yellow: "bg-yellow-100",
  purple: "bg-purple-100",
  pink: "bg-pink-100",
  indigo: "bg-indigo-100",
  gray: "bg-gray-100",
};

export type EventWithColor = Event & {
  color: keyof typeof COLORS; // Narrow the color type to match the COLORS keys
};
