import fs from "fs";
import path from "path";
import winston from "winston";

// Ensure that the logs directory exists
const logsDir = path.join(__dirname, "../..", "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Logger configuration
const logConfiguration = {
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === "development" ? "debug" : "info",
      format: winston.format.combine(
        winston.format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
        winston.format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`,
        ),
      ),
    }),
    new winston.transports.File({
      level: "error",
      filename: path.join(logsDir, "errors.log"),
      format: winston.format.combine(
        winston.format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
        winston.format.json(),
      ),
    }),
  ],
};

const logger = winston.createLogger(logConfiguration);

export default logger;
