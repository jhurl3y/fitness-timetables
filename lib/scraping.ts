import * as cheerio from "cheerio";

export async function getHTMLFromURL(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch HTML. Status: ${response.status}`);
    }

    // Get the HTML content as a string
    const html = await response.text();
    return cleanHTML(html);
  } catch (error) {
    console.error("Error fetching HTML:", error);
    return null;
  }
}

// Function to clean and minify HTML: remove <style>, <script>, <meta>, comments, and extra whitespace
export function cleanHTML(html: string): string {
  // Load the HTML into Cheerio
  const $ = cheerio.load(html);

  // Strip unnecessary tags from the document
  $("meta, link, script, style, img, footer, header").remove();

  // Remove comments
  $("*")
    .contents()
    .each(function () {
      if (this.type === "comment") {
        $(this).remove();
      }
    });

  // Get the cleaned HTML content
  const cleanedHTML = $.html();

  // Minify by removing extra whitespace
  return cleanedHTML.replace(/\s+/g, " ").trim();
}
