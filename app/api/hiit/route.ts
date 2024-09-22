import { formatTime } from "../../../lib/time";
import { getWeeklyHIITEvents } from "../../../lib/hiit";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    // Parse URL to get the venue_id from query parameters
    const url = new URL(request.url);
    const venueIdParam = url.searchParams.get("venue_id");

    // Convert venue_id to a number, or return an error if invalid
    const venueId = venueIdParam ? Number(venueIdParam) : undefined;

    // Fetch the HIIT events for the week, optionally filtering by venue_id
    const weeklyHIITEvents = await getWeeklyHIITEvents(venueId); // Assuming your getWeeklyHIITEvents can take a venueId as a param
    const allEvents = formatTime(weeklyHIITEvents);

    return new Response(JSON.stringify({ data: allEvents }), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "s-maxage=3600, stale-while-revalidate",
      },
      status: 200,
      statusText: "OK",
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: `${error}` }), {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
}
