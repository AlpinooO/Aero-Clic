const redis = require('redis');

let redisClient = null;

const getRedisClient = async () => {
  if (redisClient) return redisClient;

  try {
    redisClient = redis.createClient({
      url: `redis://${process.env.REDIS_HOST || 'redis'}:${process.env.REDIS_PORT || 6379}`
    });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    await redisClient.connect();
    console.log('Redis connected successfully');
    return redisClient;
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    return null;
  }
};

module.exports = { getRedisClient };
