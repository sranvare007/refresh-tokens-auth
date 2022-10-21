import { NextFunction, Request, Response } from "express";

export class CreateError extends Error {
  public status: number;
  public serverMessage: string;

  public constructor(status: number, serverMessage: string) {
    super(serverMessage);
    this.status = status;
    this.serverMessage = serverMessage;
  }

  static NoContent(serverMessage: string) {
    return new CreateError(204, serverMessage);
  }

  static BadRequest(serverMessage: string): CreateError {
    return new CreateError(400, serverMessage);
  }

  static Unauthorized(serverMessage: string): CreateError {
    return new CreateError(401, serverMessage);
  }

  static Forbidden(serverMessage: string): CreateError {
    return new CreateError(403, serverMessage);
  }

  static NotFound(serverMessage: string): CreateError {
    return new CreateError(404, serverMessage);
  }

  static Conflict(serverMessage: string): CreateError {
    return new CreateError(409, serverMessage);
  }

  static MethodNotAllowed(serverMessage: string): CreateError {
    return new CreateError(405, serverMessage);
  }

  static TooManyRequests(serverMessage: string): CreateError {
    return new CreateError(429, serverMessage);
  }

  static InternalServerError(serverMessage: string): CreateError {
    return new CreateError(500, serverMessage);
  }
}

export const HandleError = (
  error: CreateError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = error.status;
  const message = error.serverMessage;
  return res.status(status).send({
    message,
  });
};
