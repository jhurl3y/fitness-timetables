import OpenAI from "openai";
import { getEventsPrompt } from "./prompts";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { Event } from "../lib/types";

// Initialize the OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in your .env.local file
});

export async function generateCompletion(
  prompt: string,
  model: string,
  max_tokens: number = 1000,
  response_format: any
): Promise<{ events: Event[] }> {
  if (!prompt) {
    throw new Error("Prompt is required");
  }

  try {
    const chatCompletion = await client.chat.completions.create({
      model,
      max_tokens,
      messages: [{ role: "user", content: prompt }],
      response_format,
    });

    const completion = chatCompletion.choices[0].message.content || "";
    return JSON.parse(completion);
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw new Error("Failed to generate completion");
  }
}

export async function generateEvents(
  htmlContent: string | null,
  model: string = "gpt-4o-mini-2024-07-18",
  max_tokens: number = 16384
): Promise<Event[] | null> {
  const eventTypeStructure = `
  title: string; // The name of the class or event
  time: string;  // The time the event takes place
  day: number;   // The day of the week as a number where 0 = Monday, 1 = Tuesday, 2 = Wednesday, 3 = Thursday, 4 = Friday, 5 = Saturday, 6 = Sunday.
`;

  const exampleEvent = `
  Event {
    title: "Jiu Jitsu All Levels",
    time: "10:00 AM - 11:00 AM",
    day: 0 // Monday
  }
`;

  const eventFormat = z.object({
    events: z.array(
      z.object({
        title: z.string(),
        time: z.string(),
        day: z.number(),
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
    return completion.events;
  } catch (error) {
    console.error("Error generating events from OpenAI:", error);
    return null;
  }
}
