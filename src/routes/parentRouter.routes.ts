import { authRouter } from "./auth.routes";
import express, { Router } from "express";
import { userRouter } from "./user.routes";

export const parentRouter: Router = express.Router();

parentRouter.use("/auth", authRouter);
parentRouter.use(userRouter);
