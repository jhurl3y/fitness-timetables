import { generateEvents } from "../../../lib/openai";
import { getHTMLFromURL } from "../../../lib/scraping";
import { formatTime } from "../../../lib/time";
import { getWeeklyHIITEvents } from "../../../lib/hiit";
import { getRandomTailwindBgClass } from "../../../lib/utils";
// import { schedule } from "../../../data/schedule";

/**
 * The runtime environment.
 *
 * @see https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes#edge-runtime
 */
export const runtime = "edge";

const URLS = [
  "https://www.romulomelobjj.com/schedule-pricing",
  "https://marinarunclub.com/products/marina-run-club-membership-dues",
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function addColorToEvents(events: any[]): any[] {
  const color = getRandomTailwindBgClass();
  return events.map((event) => ({
    ...event,
    color,
  }));
}

export async function GET() {
  try {
    const eventsArray = await Promise.all(
      URLS.map(async (url) => {
        const htmlContent = await getHTMLFromURL(url);
        const events = await generateEvents(htmlContent);

        // Add random background color to each event
        return events ? addColorToEvents(events) : [];
      })
    );

    // Fetch the HIIT events for the week
    const weeklyHIITEvents = await getWeeklyHIITEvents();

    const allEvents = formatTime([
      ...eventsArray.flat(),
      ...addColorToEvents(weeklyHIITEvents),
    ]);

    return new Response(JSON.stringify({ data: allEvents }), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "s-maxage=300, stale-while-revalidate",
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
