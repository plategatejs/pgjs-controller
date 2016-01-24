'use strict';

import EventEmitter from 'events';
import config from 'config';
import { publishClient, subscribeClient } from './redis';

const Recognizer = function () {
  EventEmitter.call(this);

  const channels = config.get('redis.channels');

  this.enqueue = (image) => {
    publishClient.publish(channels.images, image.toString('base64'));
  };

  subscribeClient.on('message', (channel, message) => {
    if (channel === channels.plates) {
      const plates = JSON.parse(message);
      this.emit('plates', plates);
    }
  });

  this.start = () => subscribeClient.subscribe(channels.plates);
};

Recognizer.prototype = Object.create(EventEmitter.prototype);
Recognizer.prototype.constructor = Recognizer;

export default Recognizer;
