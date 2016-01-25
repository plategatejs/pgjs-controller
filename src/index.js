'use strict';

import Camera from './camera';
import Recognizer from './recognizer';
import Authenticator from './authenticator';
import Gate from './gate';

export default () => {
  const camera = new Camera;
  const recognizer = new Recognizer;
  const gate = new Gate;
  const authenticator = new Authenticator;

  camera.on('image', image => recognizer.enqueue(image));

  recognizer
    .on('plates', (plates) => {
      authenticator
        .check(plates)
        .then(() => gate.open());
    })
    .start();

  camera.start();
};
