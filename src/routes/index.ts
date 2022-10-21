import { loginController } from "./../controller/index";
import { validationHandler, validators } from "./../middleware/validator";
import express, { Router } from "express";

export const router: Router = express.Router();

router.post("/", validationHandler(validators.loginValidator), loginController);
