export function getEventsPrompt(
  htmlContent: string, // Raw HTML content
  typeStructure: string,
  exampleEvent: string
): string {
  return `
      Extract the schedule information from the following HTML content:
      
      HTML:
      ${htmlContent}
      
      Structure the events in the following format:
      
      Event:
      {
        ${typeStructure}
      }
    
      For example:
      ${exampleEvent}
    
      Please give me the timetable for all classes listed in the provided HTML content.
      `;
}
