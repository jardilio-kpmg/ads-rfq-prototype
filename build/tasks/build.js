/**
 * This is the build task that is responsible for compiling all
 * generated files to the temporary directory.
 *
 * This will read in the settings from settings.json to determine
 * which buildmode to use (ie uglify vs browserify).
 *
 * It will generate default options for watch in the event that
 * this task is used in the same stream as the watch task.
 *
 * DO NOT MODIFY THIS FILE IN YOUR PROJECT! INSTEAD, YOU CAN COPY
 * THE CONFIGURATION DATA AND PLACE THAT INTO YOUR gruntfile.js
 * THEN MODIFY ONLY THE PORTIONS YOU NEED. THIS WILL ALLOW YOUR
 * PROJECT TO BE UPDATED WITH CONFLICT TO NEWER VERSIONS.
 */
module.exports = function (grunt) {

    'use strict';

    var currentTarget = null,
        settings = grunt.config('settings'),
        bowerdir = grunt.config('bowerrc').directory,
        aliasify = require('aliasify');

    grunt.config.merge({
        build: {
            options: {
                nomocks: grunt.option('nomocks'),
                watch: grunt.option('watch'),
                specs: grunt.option('specs'),
                dist: grunt.option('dist'),
                temp: '<%= settings.dir.temp %>'
            }
        },
        clean: {
            build: [
                '{.,platforms/*}/<%= build.options.temp %>/<%= settings.dir.app %>',
                '{.,platforms/*}/<%= settings.dir.app %>/**/*.generated.css'//from styleify
            ]
        },
        concat: {
            //calculated at runtime
            libs: {},
            modules: {}
        }
    });

    grunt.registerTask('build', function (target) {
        var options = this.options(),
            clean = grunt.file.expand({cwd: options.temp, filter: 'isDirectory'}, [settings.dir.app, 'platforms']);
        clean.forEach(function (dir) {
            grunt.file.delete(options.temp + '/' + dir);
        });
        grunt.config('build-after', grunt.config('build'));
        grunt.task.run([
            'install:auto',
            'clean:build',
            'localization-bundle',
            'sprite',
            'font',
            'apicodegen',
            'build-after' + (target ? ':' + target : '')
        ]);
    });

    grunt.registerTask('build-after', function (target) {
        var options = this.options(),
            libs = {},
            _ = require('lodash'),
            libsources = [],
            globalaliases = {},
            config = {
                concat: {
                    libs: {
                        files: {},
                        options: {
                            sourceMap: false
                        }
                    },
                    modules: {
                        files: {},
                        options: {
                            separator: ';',
                            sourceMap: true
                        }
                    }
                },
                browserify: {
                    options: {
                        keepAlive: false,
                        //these will execute before anything defined in package.json
                        transform: (options.specs ?
                            [__dirname + '/libs/instrumentify'] : //this should be first thing we do
                            []
                        ),
                        watch: options.watch, //do not use this, when we rebuild it duplicates listeners
                        watchifyOptions: {
                            poll: true
                        }
                    }
                }
            },
            modules = grunt.file.expand({filter: 'isDirectory', cwd: settings.dir.app + '/modules'}, '*'),
            platformDirs = [settings.dir.app].concat(grunt.file.expand({filter: 'isDirectory'}, settings.dir.cordova + '/platforms/*/www'));

        if (options.watch) {
            config.watch = {
                libs: {
                    files: ['bower.json'],
                    tasks: ['concat:libs']
                }
            };
        }
        else {
            config.watch = {};
        }

        //set this so if we are reloaded in a watch we execute the same previous target
        target = target || currentTarget;
        currentTarget = target;

        function parseBowerFile(dir) {
            dir = dir || '';
            var path = require('path');
            var file = grunt.file.exists(path.resolve(dir, 'bower.json')) ?
                path.resolve(dir, 'bower.json') :
                grunt.file.exists(path.resolve(dir, '.bower.json')) ?
                    path.resolve(dir, '.bower.json') :
                    path.resolve(dir, 'package.json');
            var bower = {};
            try {
                bower = JSON.parse(grunt.file.read(file));
                addBowerDependencies(bower.dependencies);
            }
            catch (error) {
                grunt.log.writeln('Could not parse bower package: ' + file);
            }
            return bower;
        }

        function addBowerDependencies(dependencies) {
            for (var dependency in dependencies) {
                addBowerComponent(dependency);
            }
        }

        function addBowerComponent(name) {
            if (!libs[name]) {
                var bowerPath = bowerdir + '/' + name + '/',
                    bower = parseBowerFile(bowerPath),
                    main = bower.main,
                    files = [];

                if (!main) {
                    main = bowerPath + name + '.js';
                }

                if (typeof(main) === 'string') {
                    main = [main];
                }

                main.forEach(function (file) {
                    if (/\.js$/.test(file)) {
                        files.push(bowerPath + file);
                    }
                    else if (grunt.file.exists(bowerPath + file + '.js')) {
                        //fix if library didn't add .js extension to main file
                        files.push(bowerPath + file + '.js');
                    }
                });

                libs[name] = files;
            }
        }

        function getAliasify(aliases) {
            return function (b) {
                b.transform(aliasify.configure({
                    aliases: aliases,//_.extend(pkg.aliasify.aliases, aliases),
                    configDir: process.cwd()
                }));
            };
        }

        parseBowerFile();

        _.forEach(libs, function (files, name) {
            //concatenate all bower dependencies in dependency order it libs.js
            libsources = libsources.concat(files);
            //expose all bower dependencies as modules
            //globalaliases[name] = './' + files[0];
            //this should now use browserify global shims in package.json
        });

        var task = this;

        platformDirs.forEach(function (platformDir) {
            var platform = (platformDir.match(/platforms\/([A-Za-z0-9\._-]*)\/www/) || [])[1] || settings.dir.app;

            if (target && target !== platform) {
                return;//we are not a target match to this platform
            }

            if (!grunt.file.expand(platformDir + '/**/*').length) {
                //empty directory we are not building, move on
                return;
            }

            var path = require('path');
            var cwd = process.cwd();

            var aliases = _.extend({
                //TODO: we should remove libs and modules alias in favor of relative paths
                libs: './' + platformDir + '/../' + bowerdir,
                modules: './' + platformDir + '/modules',
                config: './' + options.temp + '/config'
            }, globalaliases);

            //allow configuration option to isolate certain modules from main modules bundle
            var isolateModules = task.options({
                isolateModules: []
            }).isolateModules;

            //always exclude the preloader
            if (!_.contains(isolateModules, "preloader")) {
                isolateModules.push('preloader');
            }

            config.concat.libs.files[options.temp + '/' + platformDir + '/../<%= bowerrc.directory %>/libs.js'] = libsources;

            var modulesDir = platformDir + '/modules',
                modules = grunt.file.expand({cwd: modulesDir, filter: 'isDirectory'}, '*'),
                bundles = ['modules'].concat(isolateModules);

            bundles.forEach(function (moduleName) {
                //main modules bundle excludes only isolate modules, isolate modules exclude all other modules
                var othermodules = moduleName === 'modules' ? isolateModules : _.without(modules, moduleName);
                var excludes = _.map(othermodules, function (module) {
                    return modulesDir + '/' + module + '/**/*';
                });
                var includes = [
                    modulesDir + settings.globs.scripts,
                    (options.nomocks ? '!' : '') + modulesDir + settings.globs.mocks,
                    (options.specs ? '' : '!') + modulesDir + settings.globs.specs,
                    //never include tests since those should be executed against the app, not include in it
                    '!' + modulesDir + settings.globs.e2e
                ].concat(_.map(excludes, function (pattern) {
                        return '!' + pattern;
                    }));
                grunt.log.debug(moduleName + ' excludes:\n\t' + excludes.join('\n\t'));
                config.browserify[platformDir + '-' + moduleName] = {
                    src: [],//don't use any source (entry) files yet, we'll do that during config
                    dest: options.temp + '/' + platformDir + '/modules/' + moduleName + '.js',
                    options: {
                        //issue: https://github.com/substack/node-browserify/issues/1031
                        //when we use entry and expose options, browserify doesn't include the require= prefix to externally reference require
                        //banner: 'require=',//grunt-browserify forces a new line char which offsets debug breakpoints by 1 line
                        postBundleCB: function (err, buf, next) {
                            if (buf) {
                                buf = Buffer.concat([new Buffer('require=', 'utf8'), buf]);
                            }
                            next(err,buf);
                        },
                        configure: function (b) {
                            var _aliases = _.clone(aliases);
                            grunt.file.expand({filter: 'isFile'}, includes).forEach(function (file) {
                                file = file.split('\\').join('/');
                                grunt.log.debug('exposing: ' + file);
                                b.require('./' + file, {expose: '/'+ file, entry: true});
                            });
                            grunt.file.expand({filter: 'isFile'}, excludes).forEach(function (file) {
                                file = file.split('\\').join('/');
                                grunt.log.debug('externalizing: ' + file);
                                b.external('/' + file, {basedir: cwd});
                            });
                            b.transform(aliasify.configure({
                                aliases: _aliases,
                                configDir: cwd
                            }), {global: true});
                        },
                        browserifyOptions: {
                            fullPaths: false,
                            basedir: cwd,
                            bundleExternal: true,
                            debug: !options.dist
                        }
                    }
                };
            });
        });

        var tasks = [
            'browserify',
            'concat:libs',
            'concat:modules'
        ];

        if (options.dist) {
            tasks.push('compact');
        }

        grunt.config.merge(config);

        config = _.extend({}, grunt.config('profiles.default.config'));

        if (grunt.option('profile')) {
            config = _.extend(config, grunt.config('profiles.' + grunt.option('profile') + '.config'));
        }

        grunt.file.write(options.temp + '/config.js', 'module.exports = ' + JSON.stringify(config, null, 2) + ';', {encoding: 'utf8'});

        grunt.task.run(tasks);
    });

};
