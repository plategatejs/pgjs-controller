'use strict';

import EventEmitter from 'events';
import config from 'config';
import request from 'request';
import logger from './logger';

const Camera = function () {
  EventEmitter.call(this);

  const { url, time } = config.get('camera');

  let running = false;
  let timeout = null;

  const requestImage = (options) => new Promise((resolve, reject) => {
    request(options)
      .on('response', (response) => {
        const length = +response.headers['content-length'];
        const image = new Buffer(length);
        let size = 0;

        response.on('data', (data) => {
          image.write(data.toString('binary'), size, data.length, 'binary');
          size += data.length;
        });

        response.on('end', () => resolve(image));
      })
      .on('error', error => reject(error));
  });

  const worker = () => {
    const options = {
      method: 'get',
      encoding: null,
      url
    };

    requestImage(options)
      .then(image => {
        if (running) {
          this.emit('image', image);
        }
      })
      .catch(error => logger.error(error))
      .then(() => timeout = setTimeout(worker, time));
  };

  this.start = () => {
    if (!running) {
      setTimeout(worker);
    }
    running = true;
    return this;
  };

  this.stop = () => {
    clearTimeout(timeout);
    running = false;
    return this;
  };
};

Camera.prototype = Object.create(EventEmitter.prototype);
Camera.prototype.constructor = Camera;

export default Camera;
