import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import jsonld from 'jsonld';

async function fetchHtml(url: string | null): Promise<string> {
    if (!url) {
        return '';
    }

    const response = await fetch(url);
    const result = await response.text();
    return result;
}

/***
 * Scrapes a recipe from a given URL
 * @param url - URL of the recipe to scrape
 * @returns void
 * @throws Error if the recipe cannot be scraped
 * @example
 * scrapeRecipe('https://example-recipe-website.com');
 */
async function scrapeRecipe(url: string) {
    const html = await fetchHtml(url);
    const dom = new JSDOM(html);
    const document = dom.window.document;
    // Parsing logic goes here
}

async function scanForjsonLD(document: Document) {
    const jsonLDs = document.querySelectorAll('script[type="application/ld+json"]');
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
            console.error('Error parsing JSON-LD:', error);
        }
    }
}