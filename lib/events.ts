import { getEventsPrompt } from "./prompts";
import { generateCompletion } from "./openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { Event } from "./types";

export async function generateEvents(
  htmlContent: string | null,
  model: string = "gpt-4o-mini-2024-07-18",
  max_tokens: number = 16384
): Promise<Event[] | null> {
  const eventTypeStructure = `
    title: string; // The name of the class or event
    time: string;  // The time the event takes place
    day: number;   // The day of the week as a number where 0 = Monday, 1 = Tuesday, 2 = Wednesday, 3 = Thursday, 4 = Friday, 5 = Saturday, 6 = Sunday.
    type: string   // the type of class
  `;

  const exampleEvent = `
    Event {
      title: "Jiu Jitsu All Levels",
      time: "10:00 AM - 11:00 AM",
      day: 0 // Monday
      type: "bjj"
    }
  `;

  const eventFormat = z.object({
    events: z.array(
      z.object({
        title: z.string(),
        time: z.string(),
        day: z.number(),
        type: z.string(),
      })
    ),
  });

  // Call the function with the parameters
  const prompt = getEventsPrompt(
    htmlContent || "",
    eventTypeStructure,
    exampleEvent
  );

  try {
    const completion = await generateCompletion(
      prompt,
      model,
      max_tokens,
      zodResponseFormat(eventFormat, "events")
    );
    return JSON.parse(completion).events;
  } catch (error) {
    console.error("Error generating events from OpenAI:", error);
    return null;
  }
}
