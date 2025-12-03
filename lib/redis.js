import Redis from 'ioredis'
import { env } from "prisma/config";
import "dotenv/config";

const redis = new Redis(env("UPSTASH_REDIS_URL"));

export default redis
