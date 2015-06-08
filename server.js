var config = require('config');

// setting Image Grabber up
var url = config.get('image.url'),
    frequency = config.get('image.frequency');

var Grabber = require('./lib/grabber.js'),
    grabber = new Grabber(url, frequency);

// setting AMQP Queue up
var host = config.get('amqp.host'),
    port = config.get('amqp.port'),
    username = config.get('amqp.username'),
    password = config.get('amqp.password');

var Queue = require('./lib/queue.js'),
    queue = new Queue(host, port, username, password);

queue.connect(function () {
    grabber.start();

    grabber.on('image', function (image) {
        queue.enqueueImage(image);
    });
});
