import winston from "winston";

// Define log format with timestamp and color for better readability in dev
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(
    ({ timestamp, level, message, stack }) =>
      `${timestamp} [${level.toUpperCase()}]: ${stack || message}`
  )
);

// Create the logger instance
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [],
});

// Add console logging in development
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), logFormat),
    })
  );
}

// Optional: Add file logging in production (uncomment if needed)
// logger.add(new winston.transports.File({ filename: "logs/error.log", level: "error" }));
// logger.add(new winston.transports.File({ filename: "logs/combined.log" }));

export default logger;
