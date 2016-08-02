'use strict';

import redis from 'redis';
const isDevelopment = process.env.NODE_ENV === 'development';
let client;

export function getDBClient() {
    return client;
};

export function createDBClient() {
    client = isDevelopment ? redis.createClient() : redis.createClient(process.env.REDIS_URL);
};
