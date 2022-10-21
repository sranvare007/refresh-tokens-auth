import { registerController } from "./../controller/register.controller";
import { loginController } from "@controller/login.controller";
import express, { Router } from "express";

export const authRouter: Router = express.Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
