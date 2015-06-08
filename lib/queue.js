var bramqp = require('bramqp'),
    chalk = require('chalk'),
    util = require('util'),
    net = require('net');

var AMQP_SPECIFICATION = 'rabbitmq/full/amqp0-9-1.stripped.extended';
var IMAGE_EXCHANGE_NAME = 'image-exchange';
var PLATE_QUEUE_NAME = 'plate-queue';

var Queue = function (host, port, username, password) {
    this.host = host;
    this.port = port;
    this.username = username;
    this.password = password;

    this.initialized = false;
    this.handle = null;

    this.listeners = [];
};

Queue.prototype.connect = function (callback) {
    if (this.initialized) {
        callback();
    }

    var socket = net.connect(this.port, this.host);
    var _this = this;

    bramqp.initialize(socket, AMQP_SPECIFICATION, function (error, handle) {
        if (error) {
            throw error;
        }

        handle.openAMQPCommunication(_this.username, _this.password, true, function () {
            _this.initialized = true;
            _this.handle = handle;

            var tag;

            var contentHandler = function (channel, className, properties, content) {
                _this.fire(JSON.parse(content.toString()));
                handle.basic.ack(1, tag);
            };

            var deliveryHandler = function (channel, method, data) {
                tag = data['delivery-tag'];
                handle.once('content', contentHandler);
            };

            var registerHandler = function () {
                handle.on('basic.deliver', deliveryHandler);
            };

            handle.basic.consume(1, PLATE_QUEUE_NAME, null);
            handle.once('basic.consume-ok', registerHandler);

            _this.log(chalk.green('connected'));
            callback();
        });
    });
};

Queue.prototype.enqueueImage = function (image, callback) {
    callback = callback || function () {};

    if (!this.initialized) {
        throw new Error('Queue has not been initialized yet');
    }

    var _this = this;

    this.handle.basic.publish(1, IMAGE_EXCHANGE_NAME, null, true, false, function () {
        _this.handle.content(1, 'basic', {}, image, callback);
    });
};

Queue.prototype.log = function (message) {
    var date = new Date();

    console.log(util.format(
        '[%s:%s:%s] Queue: %s.',
        date.getHours() < 10 ? '0' + date.getHours() : '' + date.getHours(),
        date.getMinutes() < 10 ? '0' + date.getMinutes() : '' + date.getMinutes(),
        date.getSeconds() < 10 ? '0' + date.getSeconds() : '' + date.getSeconds(),
        message
    ));
};

Queue.prototype.onPlates = function (callback) {
    this.listeners.push(callback);
};

Queue.prototype.fire = function (plates) {
    this.log(chalk.blue('firing plates event'));

    this.listeners.forEach(function (listener) {
        listener(plates);
    });
};

module.exports = Queue;
