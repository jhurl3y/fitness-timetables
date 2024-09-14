import OpenAI from "openai";

// Initialize the OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in your .env.local file
});

export async function generateCompletion(
  prompt: string
): Promise<string | null> {
  if (!prompt) {
    throw new Error("Prompt is required");
  }

  try {
    const chatCompletion = await client.chat.completions.create({
      model: "gpt-3.5-turbo", // Use the GPT-3.5-turbo model
      messages: [{ role: "user", content: prompt }],
    });

    const completion = chatCompletion.choices[0].message.content;
    return completion;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw new Error("Failed to generate completion");
  }
}
