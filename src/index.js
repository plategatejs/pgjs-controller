'use strict';

import config from 'config';
import Camera from './camera';
import Recognizer from './recognizer';

export default () => {
  const { url, time } = config.get('camera');
  const camera = new Camera(url, time);
  const recognizer = new Recognizer;

  camera
    .on('image', image => recognizer.enqueue(image))
    .start();
};
