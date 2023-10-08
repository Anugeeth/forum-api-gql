import { RedisModuleOptions  } from '@songkeys/nestjs-redis';
import 'dotenv/config';

export const redisConfig: RedisModuleOptions = {
  config: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10),
  },
}
