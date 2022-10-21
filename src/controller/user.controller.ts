import express from "express";
import { Logger } from "./../utils/logger.utils";

export const userController = async (
  _req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    res.send("User info");
  } catch (err) {
    Logger.error(`Error getting user info: ${err}`);
    next(err);
  }
};
