import Redis, { RedisOptions } from 'ioredis';

const configuration = {
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
  port: process.env.REDIS_PORT,
  db: 0
}


function getRedisConfiguration() {
  return configuration;
}

export function createRedisInstance(
  config = getRedisConfiguration()
) {
  try {
    const options = {
      host: config.host,
      lazyConnect: true,
      showFriendlyErrorStack: true,
      enableAutoPipelining: true,
      maxRetriesPerRequest: 0,
      retryStrategy: (times) => {
        if (times > 3) {
          throw new Error(`[Redis] Could not connect after ${times} attempts`);
        }

        return Math.min(times * 200, 1000);
      },
    };

    if (config.port) {
      options.port = config.port;
    }

    if (config.password) {
      options.password = config.password;
    }

    const redis = new Redis(options);

    redis.on('error', (error) => {
      console.warn('[Redis] Error connecting', error);
    });

    return redis;
  } catch (e) {
    throw new Error(`[Redis] Could not create a Redis instance`);
  }
}


if ( typeof window !== 'undefined' ) {
  throw new Error('[Redis] should be only on backend side')
}
export const redis = createRedisInstance();