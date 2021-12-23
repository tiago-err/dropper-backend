import {IDrop} from "../interfaces/drop";

export async function getItemFromStore(url: string, userId: string, storeId: string, storeFunction: string): Promise<IDrop> {
	return await require(`./${storeFunction}`)(url, userId, storeId);
}
