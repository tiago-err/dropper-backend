import express from "express";
import {ValidationChain, validationResult} from "express-validator";
import {VALIDATION_FAIL_CODE} from "../../constants/error.constants";
import * as methods from "../../helpers/methods";

/**
 * sequential processing, stops running validations chain if the previous one have failed.
 * @param validations
 */
export const validate = (validations: ValidationChain[]) => {
	return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
		for (let validation of validations) {
			const result = await validation.run(req);
			// @ts-ignore
			if (result.errors.length) break;
		}

		const errors = validationResult(req);
		if (errors.isEmpty()) {
			return next();
		}

		// @ts-ignore
		res.status(VALIDATION_FAIL_CODE).json(methods.failResponse("Validation failed", errors.array()));
	};
};
