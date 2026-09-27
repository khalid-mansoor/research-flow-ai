import { google } from "@ai-sdk/google";

import { generateText, Output, streamText } from "ai";
import { z } from "zod";
import { searchWeb } from "@/tools";
import { fetchPage } from "@/tools";

// SCHEMA FOR STRUCTURED OUTPUT
const researchSchema = z.object({
    title: z.string(),
    overview: z.string(),
    whyItMatters: z.string(),
    developments: z.array(z.string()),
    challenges: z.array(z.string()),
    sources: z.array(
        z.object({
            title: z.string(),
            url: z.string(),
        })
    ),
});

// API ROUTE
export async function POST(req) {
    const { topic } = await req.json();

    const result = await streamText({
        model: google("gemini-3-pro-preview"),

        tools: {
            searchWeb, fetchPage
        },

        stopWhen: ({ steps }) => {
            console.log("Current step count:", steps.length);

            return steps.length >= 3;
        },

        output: Output.object({
            schema: researchSchema,
        }),

        prompt: `
        Research this topic:

        ${topic}

        You MUST use the searchWeb tool before creating the final
        research report.

        Use the information returned by searchWeb to create the report.

        For the sources section, ONLY use URLs that were actually
        returned by the searchWeb tool.

        Do not invent or modify source URLs.

        Create a concise but useful research report.
        `,
    });
    return result.toTextStreamResponse(); //this one in case of streamText
    //Below will be incase of generate Text to get overall response at once
    // return Response.json({
    //     result: result.output,
    // });
}