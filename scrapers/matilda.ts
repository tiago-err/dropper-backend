import cheerio from "cheerio";
import {IDrop} from "../interfaces/drop";
import {getPageHtml} from "../helpers/scrapers.helpers";
import {randomUUID} from "crypto";

export default async (item: {url: string; size: string}, userId: string, storeId: string): Promise<IDrop> => {
	const $ = cheerio.load(await getPageHtml("axios", item.url));

	const title = $(".product-single__meta > h1").text();
	const originalPrice = $(".product-single__meta .price__regular .price-item--regular").text().trim();
	const currentPrice = $(".product-single__meta .price__sale .price-item--sale").text().trim();

	const isStocked = !$(".product-single__meta .product__price .price").hasClass("price--sold-out");

	return {
		id: randomUUID(),
		userId,
		url: item.url,
		name: title,
		size: "",
		image: "",
		store: storeId,
		price: {
			original: parseFloat(originalPrice.replace(/[^\w,\.]/g, "")),
			current: parseFloat(currentPrice.replace(/[^\w,\.]/g, "")),
		},
		isStocked,
	};
};
