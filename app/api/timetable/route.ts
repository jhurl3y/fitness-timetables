import { generateEvents } from "../../../lib/events";
import { getHTMLFromURL } from "../../../lib/scraping";
import { formatTime } from "../../../lib/time";
import { TIMETABLE_URLS } from "../../../lib/constants";
// import { schedule } from "../../../data/schedule";

/**
 * The runtime environment.
 *
 * @see https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes#edge-runtime
 */
export const runtime = "edge";

export async function GET() {
  try {
    const eventsArray = await Promise.all(
      TIMETABLE_URLS.map(async (url) => {
        const htmlContent = await getHTMLFromURL(url);
        const events = await generateEvents(htmlContent);

        // Add random background color to each event
        return events ? events : [];
      })
    );
    const allEvents = formatTime(eventsArray.flat());

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
