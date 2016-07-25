const redis = require('redis');
let client;

module.exports = {
    getClient: () => client,
    createClient: () => {
        client = redis.createClient(process.env.REDIS_URL);
    }
};
