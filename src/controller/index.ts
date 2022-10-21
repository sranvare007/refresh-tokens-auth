import { loginService } from "./../service/index";
import { Logger } from "@utils/logger.utils";
import { Request, Response, NextFunction } from "express";

export const loginController = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await loginService(5000);
    res.status(200).send({
      value: data,
    });
  } catch (error: any) {
    Logger.error(`Error logging in: ${error}`);
    next(error.message);
  }
};
