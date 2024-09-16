import { HIIT_VENUE } from "./constants";
import { Event } from "./types";

// Function to fetch data from the API
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchScheduleData(venue: number, date: string): Promise<any> {
  const res = await fetch("https://classpass.com/_api/v3/search/schedules", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      date: date,
      report_ineligible_classes: true,
      exclude_past_booking: true,
      venue: [venue],
    }),
  });

  const response = await res.json();
  return response;
}

// Function to parse the fetched data into Event[] format and filter out "Boxing" events
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseEvents(data: any): Event[] {
  return (
    data.schedules
      .filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (schedule: any) => !schedule.class.name.toLowerCase().includes("boxing")
      ) // Filter out events with "Boxing"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((schedule: any) => {
        const classInfo = schedule.class;
        const venueInfo = schedule.venue;
        const trainerName = schedule.teacher?.name || "Unknown Trainer"; // Fetch the trainer name, default to 'Unknown Trainer'
        const locationName = venueInfo.location?.name || "Unknown Location"; // Fetch the location name, default to 'Unknown'

        // Convert Unix timestamps to human-readable time (HH:MM AM/PM) in Pacific Time (PST/PDT)
        const startTime = new Date(
          schedule.starttime * 1000
        ).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "America/Los_Angeles", // Force the time zone to be PST/PDT
        });

        // Convert the start time to the corresponding day (0 for Monday, 6 for Sunday)
        const day = new Date(schedule.starttime * 1000).getDay();

        return {
          title: `${classInfo.name} - ${locationName} (${trainerName})`, // Append the location name and trainer name to the title
          time: startTime,
          day: day === 0 ? 6 : day - 1, // Adjust so that 0 is Monday, 6 is Sunday
          type: "hiit",
        };
      })
  );
}

// Function to get HIIT events for a specific date
async function getHIITEvents(date: string): Promise<Event[]> {
  const data = await fetchScheduleData(HIIT_VENUE, date);
  return parseEvents(data);
}

function generateCustomWeekDates(): string[] {
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
function formatDateYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Function to get all HIIT events for the week (Monday to Sunday)
export async function getWeeklyHIITEvents(): Promise<Event[]> {
  const weekDates = generateCustomWeekDates(); // Generate a list of dates from Monday to Sunday

  const allEvents: Event[] = [];
  for (const date of weekDates) {
    const dailyEvents = await getHIITEvents(date); // Get events for each day
    allEvents.push(...dailyEvents); // Append daily events to the full list
  }

  return allEvents; // Return all events for the week
}
