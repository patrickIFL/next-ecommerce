import Redis from "ioredis"
import dotenv from "dotenv"
dotenv.config()

// const redis = new Redis(process.env.UPSTASH_REDIS_URL);
const redis = new Redis("rediss://default:AT9jAAIncDIyOThhNWZjYmI1MTc0NmMxOGZjYzA2N2Y5YmY0ZjJiMXAyMTYyMjc@exotic-dove-16227.upstash.io:6379");

export default redis;