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

// setting database up
var database = require('./lib/database.js');

// plate recognition logic
var onPlatesRecognized = function (mongoose) {
    return function (plates) {
        var results = plates.results || [];
        results = Array.isArray(results) ? results : [];

        var platesToCheck = [];

        results.forEach(function (result) {
            var candidates = result.candidates || [];
            candidates = Array.isArray(candidates) ? candidates.slice(0, 10) : [];

            candidates.forEach(function (candidate) {
                platesToCheck.push(candidate.plate);
            });
        });

        var Plate = mongoose.model('plate');

        // checking whether at least one of the recognized plates is allowed to enter
        Plate.find({
            value: {
                '$in': platesToCheck
            }
        }, function (err, plates) {
            if (!err && !!plates.length) {
                console.log('Opening the gate.');
            }
        });
    };
};

database(function (mongoose) {
    queue.onPlates(onPlatesRecognized(mongoose));
});

queue.connect(function () {
    grabber.start();

    grabber.on('image', function (image) {
        queue.enqueueImage(image);
    });
});
