import { User } from "./../models/user.model";
import { Logger } from "./../utils/logger.utils";
import express from "express";
import bcrypt from "bcrypt";
import { CreateError } from "@middleware/errorHandlers";
import jwt from "jsonwebtoken";
import { globalConstants } from "@constants/globalConstants";

interface JwtDecodeResponse extends jwt.JwtPayload {
  user_id?: string;
}

export const registerController = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { username, password } = req.body;
    const userDetails = await User.findOne({ username: username });
    if (userDetails) {
      throw CreateError.Conflict(
        "Invalid username or password. Please enter valid details"
      );
    }
    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.PASSWORD_HASH_ROUNDS)
    );
    const user = new User({
      username,
      password: hashedPassword,
    });

    const accessJwt = jwt.sign(
      {
        user_id: user._id,
      },
      process.env.ACCESS_JWT_SECRET as string,
      {
        expiresIn: Number(process.env.ACCESS_JWT_TIMEOUT),
      }
    );

    const refreshJwt = jwt.sign(
      {
        user_id: user._id,
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
    await user.save();

    res.status(200).json({
      status: globalConstants.status.SUCCESS,
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
      status: globalConstants.status.SUCCESS,
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

export const accessJwtController = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const refreshJwtToken = req.cookies.refreshJwt;
    if (refreshJwtToken) {
      const decodedJwtToken: JwtDecodeResponse = jwt.verify(
        refreshJwtToken,
        process.env.REFRESH_JWT_SECRET as string
      ) as JwtDecodeResponse;
      if (decodedJwtToken) {
        const accessJwtToken = jwt.sign(
          {
            user_id: decodedJwtToken._id,
          },
          process.env.ACCESS_JWT_SECRET as string,
          {
            expiresIn: Number(process.env.ACCESS_JWT_TIMEOUT),
          }
        );
        res.status(200).send({
          status: globalConstants.status.SUCCESS,
          data: {
            message: "Created access token successfully",
            accessJwtToken,
          },
        });
      }
    } else {
      throw CreateError.Unauthorized("Unauthorized user");
    }
  } catch (err: any) {
    Logger.error(`Error generating access token: ${err}`);
    if (err?.message) {
      next(CreateError.Unauthorized(err?.message));
    } else {
      next(CreateError.Unauthorized("Error generating access token"));
    }
  }
};
