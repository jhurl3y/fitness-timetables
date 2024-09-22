import { formatTime } from "../../../lib/time";
import { getWeeklyHIITEvents } from "../../../lib/hiit";
// import { schedule } from "../../../data/schedule";

/**
 * The runtime environment.
 *
 * @see https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes#edge-runtime
 */
export const runtime = "edge";

export async function GET() {
  try {
    // Fetch the HIIT events for the week
    const weeklyHIITEvents = await getWeeklyHIITEvents();
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
