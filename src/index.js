'use strict';

import config from 'config';
import Camera from './camera';
import Recognizer from './recognizer';

export default () => {
  const camera = new Camera;
  const recognizer = new Recognizer;

  camera.on('image', image => recognizer.enqueue(image));

  recognizer
    .on('plates', plates => console.log(plates))
    .start();

  camera.start();
};
