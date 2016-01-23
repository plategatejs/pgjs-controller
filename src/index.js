'use strict';

import config from 'config';
import Camera from './camera';

export default () => {
  const { url, time } = config.get('camera');
  const camera = new Camera(url, time);
};
