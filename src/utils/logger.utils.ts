import winston, { createLogger, transports } from "winston";
import { format } from "winston";

const { printf, combine, timestamp, colorize } = format;

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
  },
  colors: {
    error: "red",
    warn: "yellow",
    info: "green",
  },
};

const loggerFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

export const Logger = createLogger({
  levels: customLevels.levels,
  exitOnError: false,
  handleExceptions: true,
  transports: [
    new transports.Console({
      format: combine(colorize(), timestamp(), loggerFormat),
    }),
  ],
});

winston.addColors(customLevels.colors);
