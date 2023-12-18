import axios from "axios";
import { JSDOM } from "jsdom";
import jsonld from "jsonld";

async function fetchHtml(url: string | null): Promise<string> {
    if (!url) {
        return "";
    }

    const response = await axios.get(url);
    return response.data;
}

/***
 * Scrapes a recipe from a given URL
 * @param url - URL of the recipe to scrape
 * @returns void
 * @throws Error if the recipe cannot be scraped
 * @example
 * scrapeRecipe('https://example-recipe-website.com');
 */
export async function scrapeRecipe(url: string) {
    const html = await fetchHtml(url);
    const dom = new JSDOM(html);
    const document = dom.window.document;
    // Parsing logic goes here
    scanForjsonLD(document);
}

async function scanForjsonLD(document: Document) {
    const jsonLDs = document.querySelectorAll(
        "script[type=\"application/ld+json\"]"
    );
    for (const script of jsonLDs) {
        try {
            if (!script.textContent) {
                continue;
            }
            const jsonData = JSON.parse(script.textContent);
            const compactedData = await jsonld.compact(jsonData, {});
            console.log(compactedData);
            // Additional processing can be done here
        } catch (error) {
            console.error("Error parsing JSON-LD:", error);
        }
    }
}