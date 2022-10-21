import { userController } from "./../controller/user.controller";
import express, { Router } from "express";
import { checkJwt } from "@middleware/checkJwt";

export const userRouter: Router = express.Router();

userRouter.get("/userInfo", checkJwt, userController);
