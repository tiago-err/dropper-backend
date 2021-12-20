import cheerio from "cheerio";
import {IDrop} from "../interfaces/drop";
import * as shortUUID from "short-uuid";
import {getPageHtml} from "../helpers/scrapers.helpers";
import {randomUUID} from "crypto";

const getItem = async (item: {url: string; size: string}, userId: string): Promise<IDrop> => {
	const $ = cheerio.load(await getPageHtml("puppeteer", item.url));

	const title = $("h1").text().trim();
	const currentPrice = $(".price__amount-current").first().text().trim();
	const originalPrice = $(".price__amount--old")?.first().text()?.trim() || currentPrice;

	const sizes = Array.from($(".product-detail-size-selector__size-list > li")).map((item) => {
		const size = $(".product-detail-size-info__main-label", item).text().toLowerCase().trim();
		const isStocked = $(item).attr("data-qa-action")?.toLowerCase().trim() === "size-in-stock" || false;

		return {size, isStocked};
	});

	return {
		id: randomUUID(),
		userId,
		url: item.url,
		size: item.size.toUpperCase(),
		name: title,
		price: {
			original: parseFloat(originalPrice.replace(/[(EUR)(\s)(,)]/g, (match) => (match === "," ? "." : ""))),
			current: parseFloat(currentPrice.replace(/[(EUR)(\s)(,)]/g, (match) => (match === "," ? "." : ""))),
		},
		isStocked: sizes.find((size) => size.size === item.size.toLowerCase())?.isStocked || false,
	};
};

module.exports = getItem;
