var request = require('request');
var chalk = require('chalk');
var util = require('util');

var Grabber = function (url, frequency) {
    this.url = url;
    this.delay = Math.pow(frequency, -1) * 1000;
    this.running = false;

    this.listeners = {
        image: [],
        error: []
    };

    var _this = this;

    this.fire = function (event, data) {
        _this.log(chalk.blue('firing ' + event + ' event'));

        _this.listeners[event].forEach(function (callback) {
            callback(data);
        })
    };

    this.loop = function () {
        request.get(_this.url, function (error, response, body) {
            if (error) {
                _this.fire('error', error);
            }
            else {
                _this.fire('image', body);
            }

            if (_this.running) {
                setTimeout(_this.loop, _this.delay);
            }
        });
    };

    this.log = function (message) {
        var date = new Date();
        console.log(util.format(
            '[%s:%s:%s] Grabber: %s.',
            date.getHours() < 10 ? '0' + date.getHours() : '' + date.getHours(),
            date.getMinutes() < 10 ? '0' + date.getMinutes() : '' + date.getMinutes(),
            date.getSeconds() < 10 ? '0' + date.getSeconds() : '' + date.getSeconds(),
            message
        ));
    };
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
