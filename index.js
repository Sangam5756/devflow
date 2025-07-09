const express = require("express");
const { PORT } = require("./config/server.config");
const { appRouter } = require("./routes");
const errorHandler = require("./utils/errorHandler");
const connectDB = require("./config/db.config");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", appRouter);

app.get("/", (req, res) => {
  res.status(200).send("server is running");
});

console.log("server is started")
app.use(errorHandler);

connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
