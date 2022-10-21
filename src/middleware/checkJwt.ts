import { CreateError } from "./errorHandlers";
import { Logger } from "./../utils/logger.utils";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

export const checkJwt: RequestHandler = async (req, _res, next) => {
  try {
    const accessJwtToken = req.headers.authorization;
    const refreshJwtToken = req.cookies.refreshJwt;
    if (!accessJwtToken) {
      jwt.verify(refreshJwtToken, process.env.REFRESH_JWT_SECRET as string);
    }
    next();
  } catch (err: any) {
    Logger.error(`Error checking auth: ${err}`);
    next(CreateError.Unauthorized(err?.message) || "Error authenticating user");
  }
};
