import { Event } from "./types";
import { TIMEZONE } from "./constants";

export function getCurrentDateInPST() {
  const currentUTCDate = new Date();
  const pstDate = new Date(
    currentUTCDate.toLocaleString("en-US", { timeZone: TIMEZONE })
  );
  return getDayWithTz(pstDate);
}

export function getDayWithTz(theDate: Date) {
  // Use Intl.DateTimeFormat to get the day in the 'America/Los_Angeles' timezone
  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: TIMEZONE,
  });

  // Get the day as a string ("Mon", "Tue", etc.)
  const dayInPacific = formatter.format(theDate);

  // Convert day string into a number (0 = Monday, 6 = Sunday)
  const dayMap: { [key: string]: number } = {
    Mon: 0,
    Tue: 1,
    Wed: 2,
    Thu: 3,
    Fri: 4,
    Sat: 5,
    Sun: 6,
  };

  return dayMap[dayInPacific];
}

// Helper function to get the current date in PST
function getPSTDate(): Date {
  const date = new Date();
  const pstDateString = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);

  return new Date(pstDateString);
}

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
  const today = getPSTDate();
  const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  // Array to store the final week dates
  const currentWeek: string[] = [];
  const nextWeek: string[] = [];

  // Generate dates from today until Sunday (remaining days of the current week)
  for (let i = currentDay; i <= 6; i++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + (i - currentDay)); // Offset from today
    currentWeek.push(formatDateYYYYMMDD(currentDate));
  }

  // Generate dates from the following Monday to yesterday (preceding days from the following week)
  for (let i = 0; i < currentDay; i++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + (7 - currentDay) + i); // Offset to next Monday
    nextWeek.push(formatDateYYYYMMDD(currentDate));
  }

  // Return next week's dates first, followed by the current week's dates
  return [...nextWeek, ...currentWeek];
}

// Helper function to format date as "YYYY-MM-DD" in PST
export function formatDateYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}
