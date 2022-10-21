import expressWinston from "express-winston";
import { auditLogMiddleware } from "./middleware/auditLog";
import { CreateError } from "./middleware/errorHandlers";
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import { router } from "./routes";
import { HandleError } from "@middleware/errorHandlers";

export const app: Application = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
expressWinston.requestWhitelist.push("body");
expressWinston.responseWhitelist.push("body");
app.use(auditLogMiddleware);
app.use(router);
app.use((err: CreateError, req: Request, res: Response, next: NextFunction) => {
  HandleError(err, req, res, next);
});
