const express = require("express");
const { PORT } = require("./config/server.config");
const { appRouter } = require("./routes");
const errorHandler = require("./utils/errorHandler");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", appRouter);

app.get("/", (req, res) => {
  res.status(200).send("server is running");
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
