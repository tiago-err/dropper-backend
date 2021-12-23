import {SupabaseClient} from "@supabase/supabase-js";
import {Request, Response} from "express";
import {failResponse, successResponse} from "../helpers/methods";
import {IDrop} from "../interfaces/drop";
import {IStore} from "../interfaces/store";
import {getItemFromStore} from "../scrapers";

/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export const index = async (req: Request, res: Response): Promise<void> => {
	res.send(
		successResponse("Express JS API Boiler Plate working like a charm...", {
			data: "here comes you payload...",
		}),
	);
};

export const stores = async (req: Request, res: Response): Promise<void> => {
	const supabase = req.app.get("supabase") as SupabaseClient;
	const response = await supabase.from<IStore>("stores").select("*");

	res.send(successResponse("Stores successfully retrieved.", response.data || []));
};

export const drops = async (req: Request, res: Response): Promise<void> => {
	const {store} = req.query;
	const {userid: userId} = req.headers;

	if (!store || !userId) {
		res.status(400).send(failResponse("No store or UserID was sent from the request"));
		return;
	}

	const supabase = req.app.get("supabase") as SupabaseClient;
	const response = await supabase
		.from<IDrop>("drops")
		.select("*")
		.match({userId: userId.toString().toLowerCase(), store: store.toString().toLowerCase()});

	res.send(successResponse("Items successfully retrieved from store.", response.data || []));
};

export const postDrop = async (req: Request, res: Response): Promise<void> => {
	interface Body {
		store: string;
		url: string;
	}

	const body: Body = req.body;
	const {userid: userId} = req.headers;

	if (!userId) {
		res.status(400).send(failResponse("No UserID was sent from the request"));
		return;
	}

	const supabase = req.app.get("supabase") as SupabaseClient;
	const storesResponse = await supabase.from<IStore>("stores").select("*").match({id: body.store}).maybeSingle();
	const store = storesResponse.data;

	if (!store) {
		res.status(404).send(failResponse("The Store ID sent does not belong to a store known to the system!"));
		return;
	}

	if (!new RegExp(store.regex).test(body.url)) {
		res.status(400).send(failResponse("The URL sent does not belong to a store known to the system!"));
		return;
	}

	try {
		const item = await getItemFromStore(body.url, userId.toString(), store.id, store.function);
		const {data, error} = await supabase.from("drops").insert(item);
		if (error) {
			res.send(failResponse("Something went wrong when saving your item.", error));
			return;
		}

		res.send(successResponse("Your item was successfully retrieved and added to the database.", item));
	} catch (_) {
		res.send(failResponse("Something went wrong with your item."));
	}
};

export const deleteDrop = async (req: Request, res: Response): Promise<void> => {
	const {drop} = req.query;
	const {userid: userId} = req.headers;

	if (!drop || !userId) {
		res.status(400).send(failResponse("No item or UserID was sent from the request"));
		return;
	}

	const supabase = req.app.get("supabase") as SupabaseClient;
	const {data, error} = await supabase.from("drops").delete().match({id: drop, userId});

	if (error) {
		res.status(404).send(failResponse("The Item ID sent does not belong to an item known to the system or belonging to that user!"));
		return;
	}

	res.send(successResponse("Your item has been successfully deleted", {}));
};

export const updateDropSize = async (req: Request, res: Response): Promise<void> => {
	const {drop} = req.query;
	const {size} = req.body;
	const {userid: userId} = req.headers;

	if (!drop || !userId) {
		res.status(400).send(failResponse("No item or UserID was sent from the request"));
		return;
	}

	const supabase = req.app.get("supabase") as SupabaseClient;
	const {data, error} = await supabase.from<IDrop>("drops").update({userSize: size}).match({id: drop, userId});

	if (error) {
		res.status(404).send(failResponse("The Item ID sent does not belong to an item known to the system or belonging to that user!"));
		return;
	}

	res.send(successResponse("Your item size has been updated!", data ? data[0] : {}));
};

/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export const indexPost = async (req: Request, res: Response): Promise<void> => {
	res.send(
		successResponse("Express JS API Boiler Plate post api working like a charm...", {
			data: "here comes you payload...",
			request: req.body,
		}),
	);
};
