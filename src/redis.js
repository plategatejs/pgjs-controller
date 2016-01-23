'use strict';

import redis from 'redis';
import config from 'config';
import logger from './logger';

const url = config.get('redis.url');
const client = redis.createClient(url);

client.on('ready', () => logger.info('connected to redis'));
client.on('end', () => logger.warn('disconnected from redis'));
client.on('error', ({message}) => logger.error(`redis ${message}`));

export default client;
