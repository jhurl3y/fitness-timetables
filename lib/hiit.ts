import { HIIT_VENUE, TIMEZONE } from "./constants";
import { generateCustomWeekDates, getDayWithTz } from "./time";
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
        const theDate = new Date(schedule.starttime * 1000);
        const startTime = theDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: TIMEZONE, // Force the time zone to be PST/PDT
        });

        // Convert the start time to the corresponding day (0 for Monday, 6 for Sunday)
        const day = getDayWithTz(theDate);

        return {
          title: `${classInfo.name} - ${locationName} (${trainerName})`, // Append the location name and trainer name to the title
          time: startTime,
          day: day,
          type: "hiit",
        };
      })
  );
}

// Function to get all HIIT events for the week (Monday to Sunday)
export async function getWeeklyHIITEvents(
  venueId: number = HIIT_VENUE
): Promise<Event[]> {
  const weekDates = generateCustomWeekDates(); // Generate a list of dates from Monday to Sunday
  const allEvents: Event[] = [];
  for (const date of weekDates) {
    const data = await fetchScheduleData(venueId, date);
    const dailyEvents = parseEvents(data);
    allEvents.push(...dailyEvents); // Append daily events to the full list
  }

  return allEvents; // Return all events for the week
}
