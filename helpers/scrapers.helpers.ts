import axios from "axios";
import puppeteer from "puppeteer";

export async function getPageHtml(library: "axios" | "puppeteer", url: string): Promise<string> {
	switch (library) {
		case "axios":
			const response = await axios.get(url);
			return await response.data;
		case "puppeteer":
			const browser = await puppeteer.launch({headless: true});
			const page = await browser.newPage();

			await page.goto(url, {waitUntil: "domcontentloaded"});
			const html = await page.content();

			await browser.close();
			return html;
		default:
			return await getPageHtml("axios", url);
	}
}
