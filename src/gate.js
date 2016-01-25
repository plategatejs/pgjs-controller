'use strict';

import config from 'config';
import request from 'request';
import logger from './logger';

const Gate = function () {
  const host = config.get('gate');

  this.open = () => new Promise((resolve) => {
    const options = {
      method: 'get',
      url: `${host}/open`
    };

    request(options)
      .on('response', () => {
        logger.info('requesting gate open');
        resolve();
      })
      .on('error', error => logger.error(error));
  });
};

export default Gate;
