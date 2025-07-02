const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL, // or your Redis cloud URL
});

redisClient.on("error", (err) => console.error("Redis Error:", err));
redisClient.connect();

module.exports = redisClient;
