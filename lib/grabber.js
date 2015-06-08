var chalk = require('chalk');
var util = require('util');
var http = require('http');

var Grabber = function (url, frequency) {
    this.url = url;
    this.delay = Math.pow(frequency, -1) * 1000;
    this.running = false;

    this.listeners = {
        image: [],
        error: []
    };
};

Grabber.prototype.log = function (message) {
    var date = new Date();

    console.log(util.format(
        '[%s:%s:%s] Grabber: %s.',
        date.getHours() < 10 ? '0' + date.getHours() : '' + date.getHours(),
        date.getMinutes() < 10 ? '0' + date.getMinutes() : '' + date.getMinutes(),
        date.getSeconds() < 10 ? '0' + date.getSeconds() : '' + date.getSeconds(),
        message
    ));
};

Grabber.prototype.fire = function (event, data) {
    Grabber.prototype.log.call(this, chalk.blue('firing ' + event + ' event'));

    this.listeners[event].forEach(function (callback) {
        callback(data);
    });
};

Grabber.prototype.loop = function () {
    var _this = this;

    http.get(_this.url, function (response) {
        var image = new Buffer(parseInt(response.headers['content-length']));
        var i = 0;

        response.setEncoding('binary');

        response.on('error', function (error) {
            _this.fire('error', error);
        });

        response.on('data', function (data) {
            image.write(data, i, data.length, 'binary');
            i += data.length;
        });

        response.on('end', function () {
            _this.fire('image', image);
            setTimeout(_this.loop.bind(_this), _this.delay);
        });
    }).on('error', function (error) {
        Grabber.prototype.fire.call(_this, 'error', error);
    });
};

Grabber.prototype.on = function (event, callback) {
    if (event == 'image') {
        this.listeners.image.push(callback);
    }
    else if (event == 'error') {
        this.listeners.error.push(callback);
    }
};

Grabber.prototype.start = function () {
    if (!this.running) {
        this.log(chalk.green('started'));

        this.running = true;
        this.loop();
    }
};

Grabber.prototype.stop = function () {
    if (this.running) {
        this.log(chalk.yellow('stopped'));
        this.running = false;
    }
};

module.exports = Grabber;
