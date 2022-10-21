import { CreateError } from "./errorHandlers";
import { Logger } from "./../utils/logger.utils";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

interface JwtDecodeResponse extends jwt.JwtPayload {
  user_id?: string;
}

export const checkJwt: RequestHandler = async (req, _res, next) => {
  try {
    const accessJwtToken = req.headers.authorization;
    const refreshJwtToken = req.cookies.refreshJwt;
    if (!accessJwtToken) {
      const decodedData: JwtDecodeResponse = jwt.verify(
        refreshJwtToken,
        process.env.REFRESH_JWT_SECRET as string
      ) as JwtDecodeResponse;
      req.user_id = decodedData?.user_id as string;
    }
    next();
  } catch (err: any) {
    Logger.error(`Error checking auth: ${err}`);
    next(CreateError.Unauthorized(err?.message) || "Error authenticating user");
  }
};
