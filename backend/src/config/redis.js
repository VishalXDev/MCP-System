// backend/src/config/redis.js
import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

console.log(
  "🔍 Connecting to Redis at",
  process.env.REDIS_URL + ":" + process.env.REDIS_PORT
);

const redis = new Redis({
  host: "redis-12388.c301.ap-south-1-1.ec2.redns.redis-cloud.com",
  port: 12388,
  username: "default",
  password: "BTKJ2kD0ByWoyN1qdMACv8winE9YOMVN",
  tls: {
    rejectUnauthorized: false,
  },
  connectTimeout: 10000,
});

redis.on("connect", () => {
  console.log("✅ Redis Connected Successfully!");
});

redis.on("error", (err) => {
  console.error("❌ Redis Connection Error:", err);
});

export default redis;
