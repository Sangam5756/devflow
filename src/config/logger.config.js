const winston = require("winston");
const { MONGO_URI } = require("./server.config");
require("winston-mongodb"); // <-- important

const allowedTransports = [];

// The below transport configuration enables logging on the console
allowedTransports.push(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
      }),
      // Second argument to the combine method, which defines what is exactly going to be printed in log
      winston.format.printf(
        (log) => `${log.timestamp} [${log.level}]: ${log.message}`,
      ),
    ),
  }),
);

if (process.env.NODE_ENV === "development") {
  allowedTransports.push(
    new winston.transports.File({
      filename: `./logs/app.log`,
    }),
  );
}

// Persistance Storing the logs in database
allowedTransports.push(
  new winston.transports.MongoDB({
    level: "info",
    db: MONGO_URI,
    options: { useUnifiedTopology: true },
    collection: "logs",
    format: winston.format.metadata(),
    tryReconnect: true,
  }),
);

const logger = winston.createLogger({
  // default formatting
  format: winston.format.combine(
    // First argument to the combine method is defining how we want the timestamp to come up
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    // Second argument to the combine method, which defines what is exactly going to be printed in log
    winston.format.printf(
      (log) => `${log.timestamp} [${log.level.toUpperCase()}]: ${log.message}`,
    ),
  ),
  transports: allowedTransports,
});

module.exports = logger;
