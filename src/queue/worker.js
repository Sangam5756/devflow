const { Worker } = require("bullmq");
const sendEmail = require("../utils/notification");
const redisClient = require("../config/redis");

new Worker(
  "emailQueue",
  async (job) => {
    await sendEmail(job.data);
    console.log(job.id)
  },
  {
    connection:redisClient,
    concurrency: 5,
  }
);
