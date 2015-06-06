var Promise = require('bluebird');
var config = require('config');
var amqp = require('amqp');

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

    // setting AMQP up
    try {
        var settings = {
            host: config.get('amqp.host'),
            port: config.get('amqp.port'),
            login: config.get('amqp.username'),
            password: config.get('amqp.password')
        };
    }
    catch (e) {
        reject(e);
    }

    var amqpConnection = amqp.createConnection(settings);

    resolve({
        grabber: grabber,
        amqpConnection: amqpConnection
    });
});
