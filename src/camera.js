'use strict';

import EventEmitter from 'events';
import request from 'request';
import logger from './logger';

const Camera = function (url, time) {
  EventEmitter.call(this);

  let running = false;
  let timeout = null;

  const grabImage = () => {
    const options = {
      method: 'get',
      encoding: null,
      url
    };

    request(options, (error, res, body) => {
      if (error) {
        return logger.error(error);
      }

      if (running) {
        this.emit('image', body);
      }
    });

    timeout = setTimeout(grabImage, time);
  };

  this.start = () => {
    if (!running) {
      grabImage();
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
