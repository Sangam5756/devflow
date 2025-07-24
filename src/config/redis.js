const Redis = require('ioredis');
const { REDIS_URL } = require('./server.config');

const redisClient = new Redis(REDIS_URL, {
  maxRetriesPerRequest: null,
});

redisClient.on('connect', () => {
  console.log('ioredis connected');
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err.message);
});

module.exports = redisClient;
