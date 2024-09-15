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
        };
      })
  );
}

// Function to get HIIT events for a specific date
async function getHIITEvents(date: string): Promise<Event[]> {
  const data = await fetchScheduleData(HIIT_VENUE, date);
  return parseEvents(data);
}

function getNextMonday(): Date {
  const today = new Date();
  const day = today.getDay(); // Sunday is 0, Monday is 1, ..., Saturday is 6

  if (day === 1) {
    // If today is Monday, return today's date
    return today;
  } else {
    // Otherwise, calculate the date of the next Monday
    const distanceToNextMonday = day === 0 ? 1 : 8 - day; // If today is Sunday, move to next day (Monday), otherwise move to the next Monday
    today.setDate(today.getDate() + distanceToNextMonday);
    today.setHours(0, 0, 0, 0); // Set time to the start of the day
    return today;
  }
}

function generateWeekDates(monday: Date): string[] {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(monday);
    currentDate.setDate(monday.getDate() + i);
    dates.push(currentDate.toISOString().split("T")[0]); // Format date as YYYY-MM-DD
  }
  return dates;
}

// Function to get all HIIT events for the week (Monday to Sunday)
export async function getWeeklyHIITEvents(): Promise<Event[]> {
  const monday = getNextMonday(); // Get the Monday of the current week
  const weekDates = generateWeekDates(monday); // Generate a list of dates from Monday to Sunday

  const allEvents: Event[] = [];
  for (const date of weekDates) {
    const dailyEvents = await getHIITEvents(date); // Get events for each day
    allEvents.push(...dailyEvents); // Append daily events to the full list
  }

  return allEvents; // Return all events for the week
}
