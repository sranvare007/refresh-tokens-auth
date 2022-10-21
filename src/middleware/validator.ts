import express from "express";
import { check, ValidationChain, validationResult } from "express-validator";
import { CreateError } from "./errorHandlers";

export const validators = {
  loginValidator: [
    check("username")
      .exists()
      .toLowerCase()
      .withMessage("Valid username is required"),
    check("password")
      .exists()
      .toLowerCase()
      .withMessage("Password is required"),
  ],
};

export const validationHandler =
  (validations: ValidationChain[]) =>
  async (
    req: express.Request,
    _res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    try {
      await Promise.all(validations.map((validation) => validation.run(req)));
      const validationErrors = validationResult(req);
      if (validationErrors.isEmpty()) {
        return next();
      }
      const error = validationErrors.array();
      return next(CreateError.BadRequest(error[0].msg));
    } catch (error: any) {
      return next(CreateError.BadRequest(error));
    }
  };
