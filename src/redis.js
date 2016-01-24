'use strict';

import redis from 'redis';
import config from 'config';
import logger from './logger';

const url = config.get('redis.url');
const clients = ['publish', 'subscribe'];

const [ publishClient, subscribeClient ] = clients.map(name => {
  return redis.createClient(url)
    .on('ready', () => logger.info(`connected to ${name} redis`))
    .on('end', () => logger.warn(`disconnected from ${name} redis`))
    .on('error', ({message}) => logger.error(`${name} redis ${message}`));
});

export { publishClient, subscribeClient };
