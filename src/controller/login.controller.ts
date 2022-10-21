import { User } from "./../models/user.model";
import { Logger } from "./../utils/logger.utils";
import express from "express";
import bcrypt from "bcrypt";
import { CreateError } from "@middleware/errorHandlers";
import jwt from "jsonwebtoken";

export const loginController = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { username, password } = req.body;
    const userDetails = await User.findOne({ username: username });
    if (!userDetails) {
      throw CreateError.BadRequest(
        "Invalid username or password. Please enter valid details"
      );
    }
    const passwordValid = await bcrypt.compare(
      password,
      userDetails.password as string
    );
    if (!passwordValid) {
      throw CreateError.BadRequest(
        "Invalid username or password. Please enter valid details"
      );
    }

    const accessJwt = jwt.sign(
      {
        user_id: userDetails._id,
      },
      process.env.ACCESS_JWT_SECRET as string,
      {
        expiresIn: Number(process.env.ACCESS_JWT_TIMEOUT),
      }
    );

    const refreshJwt = jwt.sign(
      {
        user_id: userDetails._id,
      },
      process.env.REFRESH_JWT_SECRET as string,
      {
        expiresIn: Number(process.env.REFRESH_JWT_TIMEOUT),
      }
    );
    res.cookie("refreshJwt", refreshJwt, {
      sameSite: "strict",
      httpOnly: process.env.ENV == "prod" ? true : false,
      secure: process.env.ENV == "prod" ? true : false,
      maxAge: Number(process.env.REFRESH_COOKIE_TIMEOUT),
    });

    res.status(200).json({
      status: 200,
      data: {
        message: `User details added successfully`,
        refreshJwt: refreshJwt,
        accessJwt: accessJwt,
      },
    });
  } catch (err) {
    Logger.error(err);
    next(err);
  }
};
