var bramqp = require('bramqp');
var net = require('net');

var AMQP_SPECIFICATION = 'rabbitmq/full/amqp0-9-1.stripped.extended';
var IMAGE_EXCHANGE_NAME = 'image-exchange';
var PLATE_EXCHANGE_NAME = 'plate-exchange';

var Queue = function (host, port, username, password) {
    this.host = host;
    this.port = port;
    this.username = username;
    this.password = password;

    this.initialized = false;
    this.handle = null;
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

    this.handle.basic.publish(1, IMAGE_EXCHANGE_NAME, '', true, false, function() {
        _this.handle.content(1, 'basic', {}, image, callback);
    });
};

module.exports = Queue;
