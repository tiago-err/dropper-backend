import cheerio from "cheerio";
import {IDrop} from "../interfaces/drop";
import * as shortUUID from "short-uuid";
import {getPageHtml} from "../helpers/scrapers.helpers";
import {randomUUID} from "crypto";

const getItem = async (url: string, userId: string, storeId: string): Promise<IDrop> => {
	const $ = cheerio.load(await getPageHtml("puppeteer", url));

	const title = $("h1").text().trim();
	const currentPrice = $(".price__amount-current").first().text().trim();
	const originalPrice = $(".price__amount--old")?.first().text()?.trim() || currentPrice;

	const sizes = Array.from($(".product-detail-size-selector__size-list > li")).map((item) => {
		const size = $(".product-detail-size-info__main-label", item).text().trim();
		const isStocked = $(item).attr("data-qa-action")?.toLowerCase().trim() === "size-in-stock" || false;

		return {[size]: isStocked};
	});

	const image = $("picture > source").first().attr("srcset")?.split("w,").pop()?.trim().split(" ")[0];

	return {
		id: randomUUID(),
		userId,
		url: url,
		userSize: "",
		name: title,
		store: storeId,
		image: image || "",
		price: {
			original: parseFloat(originalPrice.replace(/[(EUR)(\s)(,)]/g, (match) => (match === "," ? "." : ""))),
			current: parseFloat(currentPrice.replace(/[(EUR)(\s)(,)]/g, (match) => (match === "," ? "." : ""))),
		},
		sizes: sizes.reduce((previous, current) => Object.assign(previous, current)),
	};
};

module.exports = getItem;
