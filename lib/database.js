var includeAll = require('include-all');
var mongoose = require('mongoose');
var config = require('config');
var path = require('path');
var util = require('util');

module.exports = function (callback) {
    var models = includeAll({
        dirname: path.resolve(__dirname, 'models'),
        filter: /(.+)\.js$/
    }) || {};

    for (var name in models) {
        if (models.hasOwnProperty(name)) {
            var schema = new mongoose.Schema(models[name]());
            mongoose.model(name, schema);
        }
    }

    var uri = util.format(
        'mongodb://%s:%s@%s:%d/%s',
        config.get('mongodb.username'),
        config.get('mongodb.password'),
        config.get('mongodb.host'),
        config.get('mongodb.port'),
        config.get('mongodb.database')
    );

    mongoose.connect(uri);

    var connection = mongoose.connection;
    connection.on('open', function () {
        callback(mongoose);
    });
};
