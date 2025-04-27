import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      filename: "logs/%DATE%-combined.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
    }),
    new DailyRotateFile({
      filename: "logs/%DATE%-error.log",
      level: "error",
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
    }),
  ],
});

// Export the logger for use in other parts of the application
export default logger;