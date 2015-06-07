var bootstrap = require('./lib/bootstrap.js');

bootstrap
    .then(function (data) {
        var grabber = data.grabber;

        // TODO putting received images on queue

        grabber.on('image', function (image) {
            console.log('received image');
        });

        grabber.on('error', function (error) {
            console.log('error: ' + error);
        });

        grabber.start();
    })
    .catch(function (e) {
        console.log(e);
    });
