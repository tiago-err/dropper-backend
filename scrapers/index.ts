import {IDrop} from "../interfaces/drop";

export async function getItemFromStore(url: string, size: string, userId: string, storeFunction: string): Promise<IDrop> {
	return await require(`./${storeFunction}`)({url, size: size.toLowerCase()}, userId);
}
