var through = require('through'),
    cssmin = require('cssmin'),
    autoprefixer = require('autoprefixer-core'),
    _ = require('lodash'),
    path = require('path'),
    watch = require('fs').watchFile,
    touch = require('touch'),
    settings = require(__dirname + '/../../../settings.json'),
    watchers = {};

function change(file) {
    watchers[file].forEach(function (target) {
        touch(target);
    });
}

/**
 * Watch the files a source file imports for changes then
 * touch the file that imported them, that way if we have
 * watchers in place for browserify, this will trigger a
 * rebuild of appropriate files.
 * @param includedFiles
 */
function watchIncludedFiles(includedFiles, fromFile) {
    includedFiles = includedFiles || [];
    includedFiles.forEach(function (file) {
        if (file === fromFile) {
            return;
        }
        if (!watchers[file]) {
            watchers[file] = [];
            watch(file, {persistent: false}, function () {
                change(file);
            });
        }
        if (!_.contains(watchers[file], fromFile)) {
            watchers[file].push(fromFile);
        }
    });
}

module.exports = function (filename, options) {

    options = _.extend({
        match: "(css|less|scss|sass)$",
        mode: 'embed',
        autoprefixer: {
            "browsers": [
                "> 1%",
                "last 2 versions",
                "Firefox ESR",
                "Opera 12.1"
            ]
        }
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
            var self = this,
                sourcepath = path.dirname(filename),
                relativesourcepath = path.relative(process.cwd(), sourcepath),
                temppath = path.resolve(process.cwd(), settings.dir.temp, relativesourcepath);
            function finish(css) {
                //fix for chrome issue: https://code.google.com/p/chromium/issues/detail?id=466094
                css = css.replace('/*# sourceMappingURL', '/*# sourceURL=' + filename + ' */\n/*# sourceMappingURL');
                css = autoprefixer(options.autoprefixer).process(css).toString();
                if (options.minify !== false) {
                    css = cssmin(css);
                }

                switch(options.mode) {
                case 'external':
                    var hashname = require('./hashname'),
                        cssfile = hashname(filename,css,'.generated.css'),
                        csspath = cssfile.substr(cssfile.indexOf(settings.dir.app)+(settings.dir.app.length+1)),
                        fs = require('fs');

                    css = '/*contents are generated, do not modify*/' + css;
                    fs.writeFileSync(cssfile, css);
                    self.queue('var style = document.createElement("link");style.setAttribute("href","'+csspath+'");style.setAttribute("rel","stylesheet");document.getElementsByTagName("head")[0].appendChild(style);module.exports = style;');
                    break;
                case 'embed':
                default:
                    self.queue("var css = " + JSON.stringify(css) + "; module.exports = require('cssify')(css);");
                    break;
                }

                self.queue(null);
            }
            switch(filename.substr(filename.lastIndexOf('.') + 1).toLowerCase()) {
            case 'less':
                var lessOpts = _.extend({
                        env: 'development',
                        dumpLineNumbers: options.minify === false ? 'all' : '',
                        sourceMap: options.minify === false ? true : false,
                        sourceMapFilename: filename + '.map',
                        filename: filename,
                        paths: [sourcepath,temppath]
                    }, options.less),
                    less = require('less'),
                    parser = new (less.Parser)(lessOpts);
                parser.parse(content, function (error, root, imports, options) {
                    if (error) {
                        self.emit('error', new Error(JSON.stringify(error)));
                    }
                    else {
                        try {
                            watchIncludedFiles(_.keys(parser.imports.files), filename);
                            finish((root && root.toCSS && root.toCSS(lessOpts)) || '');
                        }
                        catch (err) {
                            self.emit('error', err);
                        }
                    }
                });
                break;
            case 'sass':
            case 'scss':
                var stats = {},
                    sass = require('node-sass'),
                    sassOpts = _.extend({
                        stats: stats,
                        file: filename,
                        data: content,
                        sourceComments: options.minify === false,
                        includePaths: [sourcepath,temppath],
                        success: function (data) {
                            //account for api changes in node-sass
                            var css = typeof(data) === 'string' ? data : data.css,
                                includedFiles = data && data.stats ? data.stats.includedFiles : stats.includedFiles;
                            watchIncludedFiles(includedFiles, filename);
                            finish(css);
                        },
                        error: function (error) {
                            self.emit('error', new Error(JSON.stringify(error)));
                        }
                    }, options.sass);
                sass.render(sassOpts);
                break;
            case 'css':
                finish(content);
                break;
            }
        }
    );
};
