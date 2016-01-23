'use strict';

import EventEmitter from 'events';
import config from 'config';
import redis from './redis';

const Recognizer = function () {
  EventEmitter.call(this);

  const channels = config.get('redis.channels.images');

  this.enqueue = (image) => redis.publish(channels.images, image.toString('base64'));
};

Recognizer.prototype = Object.create(EventEmitter.prototype);
Recognizer.prototype.constructor = Recognizer;

export default Recognizer;
