import OpenAI from "openai";

// Initialize the OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in your .env.local file
});

export async function generateCompletion(
  prompt: string,
  model: string,
  max_tokens: number = 1000,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response_format: any
): Promise<string> {
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

    return chatCompletion.choices[0].message.content || "";
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw new Error("Failed to generate completion");
  }
}
