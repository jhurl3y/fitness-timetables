import { Event } from "./types";

export function formatTime(events: Event[]) {
  return events?.map((event) => {
    event.time = event.time
      .toLowerCase() // Convert to lowercase
      .replace(/(\d)(am|pm)/, "$1 $2"); // Ensure single space before am/pm
    return event;
  });
}

export function convertTimeTo24Hour(time: string) {
  const timeLower = time.toLowerCase(); // Normalize to lowercase
  const [timePart, modifier] = timeLower.split(" ");
  const [hours, minutes] = timePart.split(":").map(Number); // Use 'const' instead of 'let'

  let adjustedHours = hours;
  if (modifier === "pm" && hours !== 12) adjustedHours += 12;
  if (modifier === "am" && hours === 12) adjustedHours = 0;

  return adjustedHours * 60 + (minutes || 0); // Return total minutes for easier comparison
}

export function generateCustomWeekDates(): string[] {
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  // Array to store the final week dates
  const dates: string[] = [];

  // Generate dates from today until Sunday (remaining days of the current week)
  for (let i = currentDay; i <= 6; i++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + (i - currentDay)); // Offset from today
    dates.push(formatDateYYYYMMDD(currentDate));
  }

  // Generate dates from the following Monday to yesterday (preceding days from the following week)
  for (let i = 0; i < currentDay; i++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + (7 - currentDay) + i); // Offset to next Monday
    dates.push(formatDateYYYYMMDD(currentDate));
  }

  return dates;
}

// Helper function to format date as "YYYY-MM-DD"
export function formatDateYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}
