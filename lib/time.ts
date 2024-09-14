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
  let [hours, minutes] = timePart.split(":").map(Number);

  if (modifier === "pm" && hours !== 12) hours += 12;
  if (modifier === "am" && hours === 12) hours = 0;

  return hours * 60 + (minutes || 0); // Return total minutes for easier comparison
};
