'use strict';

import config from 'config';
import request from 'request';
import logger from './logger';

const Authenticator = function () {
  const host = config.get('console');

  this.check = (plates) => new Promise((resolve) => {
    const options = {
      method: 'post',
      url: `${host}/plates/check`,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(plates)
    };

    request(options)
      .on('response', (response) => {
        if (response.statusCode === 200) {
          response.on('data', (data) => {
            const plate = JSON.parse(data.toString());
            logger.info(`successfully authenticated plate ${plate}`);
            resolve(plate);
          });
        }
      })
      .on('error', error => logger.error(error));
  });
};

export default Authenticator;
