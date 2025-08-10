const express = require("express");
const { PORT, FRONTEND_URL } = require("./src/config/server.config");
const { appRouter } = require("./src/routes");
const errorHandler = require("./src/utils/errorHandler");
const connectDB = require("./src/config/db.config");
const cookieparser = require("cookie-parser");
const cors = require("cors");

require("./src/queue/worker");

const app = express();

app.use(cookieparser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:3000", FRONTEND_URL],
    credentials: "include",
  })
);
app.use("/api", appRouter);

app.get("/", (req, res) => {
  res.status(200).send("server is running");
});

app.use(errorHandler);

connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, async () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
