'use strict';

import redis from 'redis';
import config from 'config';
import logger from './logger';

const url = config.get('redis.url');
const clients = ['publish', 'subscribe'];

const [ publishClient, subscribeClient ] = clients.map(name => {
  const client = redis.createClient(url);
  client.on('ready', () => logger.info(`connected to ${name} redis`));
  client.on('end', () => logger.warn(`disconnected from ${name} redis`));
  client.on('error', ({message}) => logger.error(`${name} redis ${message}`));
  return client;
});

export { publishClient, subscribeClient };
