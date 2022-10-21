import expressWinston from "express-winston";
import { auditLogMiddleware } from "./middleware/auditLog";
import { CreateError } from "./middleware/errorHandlers";
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import { parentRouter } from "./routes/parentRouter.routes";
import { HandleError } from "@middleware/errorHandlers";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Logger } from "@utils/logger.utils";
import cookieParser from "cookie-parser";

dotenv.config();

const mongooseUrl = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.abzl5u0.mongodb.net/?retryWrites=true&w=majority`;
mongoose
  .connect(mongooseUrl)
  .then(() => {
    Logger.info(`Connected to database successfully`);
  })
  .catch((err) => {
    Logger.info(`Error connecting to database: ${err}`);
  });

export const app: Application = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

expressWinston.requestWhitelist.push("body");
expressWinston.responseWhitelist.push("body");

app.use(auditLogMiddleware);
app.use("/api/v1", parentRouter);

app.use((_req, _res, next) => {
  next(CreateError.NotFound("Not found"));
});

app.use((err: CreateError, req: Request, res: Response, next: NextFunction) => {
  HandleError(err, req, res, next);
});
