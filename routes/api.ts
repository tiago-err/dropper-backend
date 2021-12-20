import {Express} from "express-serve-static-core";
import * as IndexController from "../controllers/index.controller";
import {validate} from "../middlewares/validators/wrapper.validator";
import {indexValidator} from "../middlewares/validators/index.validations";

/**
 *
 * @param app
 */
export const api = (app: Express) => {
	app.get("/api/", IndexController.index);
	app.get("/api/drops", IndexController.drops);
	app.post("/api/drops", IndexController.postDrop);
	app.delete("/api/drops", IndexController.deleteDrop);
	app.get("/api/stores", IndexController.stores);
};
