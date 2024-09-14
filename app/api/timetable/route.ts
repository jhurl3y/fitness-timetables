import { Event } from "../../../lib/types";
import { generateEvents } from "../../../lib/openai";
import { getHTMLFromURL } from "../../../lib/scraping";

/**
 * The runtime environment.
 *
 * @see https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes#edge-runtime
 */
export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const htmlContent = await getHTMLFromURL(
      "https://www.romulomelobjj.com/schedule-pricing"
    );
    const events = await generateEvents(htmlContent);
    return new Response(JSON.stringify({ data: events }), {
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
