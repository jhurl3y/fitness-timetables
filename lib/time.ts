import { Event } from "./types";

export function formatTime(events: Event[]) {
  return events?.map((event) => {
    event.time = event.time
      .toLowerCase() // Convert to lowercase
      .replace(/(\d)(am|pm)/, "$1 $2"); // Ensure single space before am/pm
    return event;
  });
}

export const convertTimeTo24Hour = (time: string) => {
  const timeLower = time.toLowerCase(); // Normalize to lowercase
  const [timePart, modifier] = timeLower.split(" ");
  const [hours, minutes] = timePart.split(":").map(Number); // Use 'const' instead of 'let'

  let adjustedHours = hours;
  if (modifier === "pm" && hours !== 12) adjustedHours += 12;
  if (modifier === "am" && hours === 12) adjustedHours = 0;

  return adjustedHours * 60 + (minutes || 0); // Return total minutes for easier comparison
};
