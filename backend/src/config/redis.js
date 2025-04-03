import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  tls: {}, // Required for Redis Cloud
});

redis.on("connect", () => {
  console.log("✅ Redis Connected Successfully!");
});

redis.on("error", (err) => {
  console.error("❌ Redis Connection Error:", err);
});

export default redis;
