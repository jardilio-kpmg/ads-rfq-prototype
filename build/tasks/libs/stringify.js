var through = require('through'),
    _ = require('lodash'),
    path = require('path');

module.exports = function (filename, options) {

    options = _.extend({
        match: "(txt|html)$"
    }, options);

    var extensions = new RegExp(options.match, 'i');

    if (!extensions.test(filename)) {
        return through();
    }

    var content = '';

    return through(
        function (chunk) {
            content += chunk;
        },
        function () {
            this.queue("module.exports = " + JSON.stringify(content) + ";");
            this.queue(null);
        }
    );
};
