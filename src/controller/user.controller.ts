import { globalConstants } from "./../constants/globalConstants";
import express from "express";
import { Logger } from "./../utils/logger.utils";

export const userController = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    res.status(200).json({
      status: globalConstants.status.SUCCESS,
      userId: req.user_id,
    });
  } catch (err) {
    Logger.error(`Error getting user info: ${err}`);
    next(err);
  }
};
