import expressWinston from "express-winston";
import { format, transports } from "winston";
import { Request, Response } from "express-serve-static-core";

// Transport instance for console logs
const consoleTransport = new transports.Console({
  format: format.simple(),
});

const logTransport = [];

logTransport.push(consoleTransport);

const customRequestFilter = (req: Request, propName: string) => {
  if (propName !== "headers") return req[propName as keyof typeof req];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { authorization, ...rest } = req.headers;
  return rest;
};

export const auditLogMiddleware = expressWinston.logger({
  transports: logTransport,
  requestFilter: customRequestFilter,
  meta: true,
  expressFormat: true,
  colorize: true,
  level: (_req: Request, res: Response) =>
    res.statusCode >= 250 ? "error" : "info",
});
