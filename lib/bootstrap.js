var Promise = require('bluebird');
var config = require('config');

var Grabber = require('./grabber.js');

var DEFAULT_FREQUENCY = 1;

module.exports = new Promise(function (resolve, reject) {
    // setting Grabber up
    try {
        var url = config.get('camera.url');
    }
    catch (e) {
        reject(e);
    }

    var frequency = config.get('camera.frequency') || DEFAULT_FREQUENCY;
    var grabber = new Grabber(url, frequency);

    resolve({
        grabber: grabber
    });
});
