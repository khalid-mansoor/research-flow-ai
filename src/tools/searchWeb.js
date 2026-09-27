import { tool } from "ai";
import { z } from "zod";

async function getSearchResults(query) {
    const response = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            api_key: process.env.TAVILY_API_KEY,
            query,
            search_depth: "basic",
            max_results: 5,
        }),
    });

    if (!response.ok) {
        throw new Error(`Tavily search failed: ${response.status}`);
    }

    const data = await response.json();
    return data.results;
}

function filterSearchResults(rawResults) {
    return rawResults.map((result) => ({
        title: result.title,
        url: result.url,
        snippet: result.content,
    }));
}

export const searchWeb = tool({
    description:
        "Search for information about a research topic. Use this when current or additional information is needed.",

    inputSchema: z.object({
        query: z
            .string()
            .describe("The search query to research"),
    }),

    execute: async ({ query }) => {
        const rawResults = await getSearchResults(query);
        const filteredResults = filterSearchResults(rawResults);

        return {
            query,
            results: filteredResults,
        };
    },
});

