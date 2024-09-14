import { generateEvents } from "../../../lib/openai";
import { getHTMLFromURL } from "../../../lib/scraping";
import { formatTime } from "../../../lib/time";

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

export async function GET(request: Request) {
  try {
    const eventsArray = await Promise.all(
      URLS.map(async (url) => {
        const htmlContent = await getHTMLFromURL(url);
        const events = await generateEvents(htmlContent);
        return events ? events : [];
      })
    );
    const formattedEvents = formatTime(eventsArray.flat());

    return new Response(JSON.stringify({ data: formattedEvents }), {
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
