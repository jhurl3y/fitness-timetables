import { Event } from "../../../lib/types";

/**
 * The runtime environment.
 *
 * @see https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes#edge-runtime
 */
export const runtime = "edge";

export async function GET(request: Request) {
  const events: Event[] = [
    { title: "Jiu Jitsu Class", time: "10:00 AM", day: 0 },
    { title: "Meeting with Team", time: "2:00 PM", day: 3 },
  ];

  try {
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
