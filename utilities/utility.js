import * as cheerio from "cheerio";


export function extractPageContent(html) {
    const $ = cheerio.load(html);

    $("script").remove();
    $("style").remove();
    $("nav").remove();
    $("footer").remove();
    $("header").remove();

    const mainContent =
        $("main").text() ||
        $("article").text() ||
        $("body").text();

    return mainContent
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 12000);
}