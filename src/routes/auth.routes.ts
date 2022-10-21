import {
  accessJwtController,
  loginController,
  registerController,
} from "@controller/login.controller";
import express, { Router } from "express";

export const authRouter: Router = express.Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.post("/generateAccessJwt", accessJwtController);
