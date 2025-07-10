const { createClient } = require("redis");
const { REDIS_URL } = require("./server.config");


const redisClient = createClient({
    url:REDIS_URL
})


redisClient.on("error", () => console.log("redis error",err));


(async ()=>{
    try {
        await redisClient.connect();
        console.log("redis connected");
    } catch (error) {
        console.log("redis error", err);
    }
})


module.exports = redisClient;