# pgjs-controller

[PlateGateJS](https://github.com/plategatejs/pgjs-docs) module which binds all remaining modules together.

## Summary

This module:

* Passively requests [pgjs-camera](https://github.com/plategatejs/pgjs-camera) (or any other url) for images (every 1 second by default)
* Publishes those images to [Redis](http://redis.io) channel for plate recognition
* Subscribes to [Redis](http://redis.io) channel for already recognized plates
* Asks [pgjs-console](https://github.com/plategatejs/pgjs-console) if particular plates should be allowed to enter
* If the previous step is successfully fulfilled, asks [pgjs-gate](https://github.com/plategatejs/pgjs-gate) to open the gate

Api:

* Image resource should be a JPEG image (or any other understandable by [OpenAlpr](https://github.com/openalpr/openalpr)) which can by accessed by HTTP GET
* Outgoing images will be _base64_ encoded, binary string
* Incoming plates should be _JSON_ array of strings
* Channel names, by default, are _images_ and _plates_
* Controller will try to authenticate plates by requesting [pgjs-console](https://github.com/plategatejs/pgjs-console), using POST _/plates/check_ endpoint and providing _JSON_ array of plate strings. Response status code of 200 will be treated as success.
* On successful authentication, gate open request will be send to [pgjs-gate](https://github.com/plategatejs/pgjs-gate) using GET _/open_ endpoint

## Basic setup

Node.js ~5.0.0+ and Npm are required.

```
npm install
npm start
```

## License
[MIT](license.md)
