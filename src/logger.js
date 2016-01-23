'use strict';

import winston from 'winston';
import config from 'config';

const name = 'runtime';
const logger = winston.loggers.add(name, config.get('logger'));

export default logger;
