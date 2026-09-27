import { tool } from "ai";
import { z } from "zod";
import { extractPageContent } from "../../utilities/utility";

export const fetchPage = tool({
    description:
        "Fetch and read the useful text content of a web page using its URL.",

    inputSchema: z.object({
        url: z
            .string()
            .url()
            .describe("The URL of the web page to read"),
    }),

    execute: async ({ url }) => {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(
                `Failed to fetch page: ${response.status}`
            );
        }

        const html = await response.text();

        const content = extractPageContent(html);

        return {
            url,
            content,
        };
    },
});