const { createClient } = require("redis");

const redisClient = createClient({
  url: "redis://localhost:6379", // or your Redis cloud URL
});

redisClient.on("error", (err) => console.error("Redis Error:", err));
redisClient.connect();

module.exports = redisClient;
