var crypto = require('crypto'),
    fs = require('fs'),
    path = require('path');

module.exports = function (file, contents, newExtension) {
    if (!contents) {
        contents = fs.readFileSync(file);
    }
    var originalExt = path.extname(file);
    var hash = crypto.createHash('sha1');
    newExtension = newExtension || originalExt;
    hash.setEncoding('hex');
    hash.write(contents);
    hash.end();
    return path.resolve(path.dirname(file), hash.read().substr(0,10) + '.' + path.basename(file,originalExt) + newExtension);
};
