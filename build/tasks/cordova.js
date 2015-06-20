module.exports = function (grunt) {

    'use strict';

    var settings = grunt.config('settings'),
        platforms = grunt.file.expand({filter: 'isDirectory', cwd: settings.dir.cordova + '/platforms/'}, '*'),
        q = require('q'),
        exec = require('child_process').exec,
        isConfiged = grunt.file.exists(settings.dir.cordova + '/config.xml'),
        path = require('path'),
        livereload = require('connect-livereload'),
        proxyRequest = require('grunt-connect-proxy/lib/utils').proxyRequest,
        _ = require('lodash');

    function mountFolder(connect, dir) {
        return connect.static(path.resolve(dir));
    }

    grunt.config.merge({
        copy: {
            cordovabuild: {
                files: [
                    {
                        cwd: '<%= settings.dir.temp %>/platforms',
                        expand: true,
                        src: [
                            '**/*'
                        ],
                        dest: 'platforms/'
                    }
                ]
            }
        },
        clean: {
            cordovabuild: [
                'platforms/*/www/modules/*/scripts/**/*',
                'platforms/*/www/modules/*/specs/**/*',
                'platforms/*/www/**/*.{less,scss,sass}'
            ]
        },
        connect: {
            cordova: {
                options: {
                    port: 9010,
                    hostname: '*',
                    middleware: function (connect) {
                        return [
                            proxyRequest,
                            livereload({port: 8010}),
                            mountFolder(connect, settings.dir.cordova + '/platforms')
                        ];
                    }
                }
            }
        },
        cordova: {
            config: {}
        },
        prompt: {
            cordovadefault: {
                options: {
                    questions: [
                        {
                            config: 'cordova.target',
                            type: 'list',
                            message: 'What ' + 'task'.cyan + ' do you want to run?',
                            default: 'emulate',
                            choices: [
                                {
                                    name: 'Run on Emulator',
                                    value: 'emulate'
                                },
                                {
                                    name: 'Run on Device',
                                    value: 'run'
                                }
                            ]
                        },
                        {
                            config: 'cordova.platform',
                            type: 'list',
                            message: 'What ' + 'platform'.cyan + ' do you want to run?',
                            choices: platforms,
                            when: function () {
                                return platforms && platforms.length > 1;
                            }
                        },
                        {
                            config: 'cordova.dist',
                            type: 'list',
                            message: 'Do you want to compile a ' + 'debug'.cyan + ' build?',
                            default: false,
                            choices: [
                                {
                                    value: false,
                                    name: 'Development (minimal concatination)'
                                },
                                {
                                    value: true,
                                    name: 'Production (concatination and minification'
                                }
                            ]
                        }
                    ],
                    then: function (answers) {
                        if (answers['cordova.platform']) {
                            grunt.option('platform', answers['cordova.platform']);
                        }
                        if (answers['cordova.dist']) {
                            grunt.option('dist', true);
                        }
                        grunt.task.run('cordova:' + answers['cordova.target']);
                    }
                }
            },
            cordovainit: {
                options: {
                    questions: [
                        {
                            config: 'cordova.title',
                            type: 'input',
                            message: 'What is the ' + 'title'.cyan + ' to give your application?',
                            default: '<%= package.name %>',
                            when: function () {
                                return !isConfiged;
                            }
                        },
                        {
                            config: 'cordova.identifier',
                            type: 'input',
                            message: 'What is the ' + 'identifier'.cyan + ' to give your application?',
                            default: '<%= "com." + package.name %>',
                            when: function () {
                                return !isConfiged;
                            }
                        },
                        {
                            config: 'cordova.platforms',
                            type: 'checkbox',
                            message: 'What ' + 'platforms'.cyan + ' do you need to support?',
                            choices: [
                                {
                                    name: 'ios',
                                    checked: platforms.indexOf('ios') > -1
                                },
                                {
                                    name: 'android',
                                    checked: platforms.indexOf('android') > -1
                                },
                                {
                                    name: 'amazon-fireos',
                                    checked: platforms.indexOf('amazon-fireos') > -1
                                },
                                {
                                    name: 'blackberry10',
                                    checked: platforms.indexOf('blackberry10') > -1
                                },
                                {
                                    name: 'firefoxos',
                                    checked: platforms.indexOf('firefoxos') > -1
                                },
                                {
                                    name: 'wp8',
                                    checked: platforms.indexOf('wp8') > -1
                                },
                                {
                                    name: 'windows8',
                                    checked: platforms.indexOf('windows8') > -1
                                }
                            ]
                        }
                        //TODO: prompt for popular plugins?
                    ],
                    then: function () {
                        grunt.task.run('cordova:setup');
                    }
                }
            }
        }
    });

    grunt.registerTask('cordova', function (target) {
        if (target !== 'init' && target !== 'setup' && !isConfiged) {
            grunt.task.run(['cordova:init','cordova:' + target]);
            return;
        }
        switch(target) {
        case 'after_prepare':
            if (grunt.option('livereload')) {
                updateConfigLiveReload();
            }
            if (grunt.option('dist')) {
                grunt.config('build.options.dist', true);
            }
            var build = grunt.option('platform') ? 'build:' + grunt.option('platform') : 'build';
            grunt.task.run([build,'clean:cordovabuild','copy:cordovabuild']);
            break;
        case 'init':
            grunt.task.run(['prompt:cordovainit']);
            break;
        case 'setup':
            var done = this.async();
            grunt.task.run([
                'scaffold:.cordova-init,create,browser,browser',
                'cordova-hook-permissions'
            ]);
            installCordova()
                .then(initCordova)
                .then(syncPlatforms)
                .then(function () {
                    isConfiged = true;
                    done();
                });
            break;
        case 'emulate':
        case 'run':
            grunt.config.merge({
                build: {
                    options: {
                        //because of merges, we have to do this ourselves and rebuild everything
                        watch: false
                    }
                }
            });
            grunt.task.run('connect:cordova','cordova-' + target,'watch');
            break;
        default:
            grunt.task.run(['prompt:cordovadefault']);
            break;
        }
    });

    grunt.registerTask('cordova-prepare', function (target) {
        var done = this.async();
        target = target || getTargetPlatform();

        exec('cordova prepare ' + target + ' --livereload', {cwd: './' + settings.dir.cordova}, function(error, stdout) {
            grunt.log.writeln(stdout);
            if (error) {
                grunt.fail.warn('Unable to prepare cordova platform ' + target + ': ' + error);
                done();
            }
            else {
                done();
            }
        });
    });

    grunt.registerTask('cordova-emulate', function (target) {
        var done = this.async();
        target = target || getTargetPlatform();

        exec('cordova emulate ' + target + ' --livereload', {cwd: './' + settings.dir.cordova}, function(error, stdout) {
            grunt.log.writeln(stdout);
            if (error) {
                grunt.fail.warn('Unable to emulate cordova platform ' + target + ': ' + error);
                done();
            }
            else {
                setupWatches(target);
                done();
            }
        });
    });

    grunt.registerTask('cordova-run', function (target) {
        var done = this.async();
        target = target || getTargetPlatform();

        exec('cordova run ' + target + ' --livereload', {cwd: './' + settings.dir.cordova}, function(error, stdout) {
            grunt.log.writeln(stdout);
            if (error) {
                grunt.fail.warn('Unable to run cordova platform ' + target + ': ' + error);
                done();
            }
            else {
                setupWatches(target);
                done();
            }
        });
    });

    grunt.registerTask('cordova-hook-permissions', function () {
        var fs = require('fs'),
            files = grunt.file.expand('hooks/**/*.js');

        files.forEach(function (file) {
            fs.chmodSync(file, '777');
        });
    });

    function getTargetPlatform() {
        return grunt.option('platform') ? grunt.option('platform') : platforms[0];
    }

    //adjust config.xml to point to server for platform and allow for live reload
    function updateConfigLiveReload() {
        var configs = grunt.file.expand(settings.dir.cordova + '/platforms/**/config.xml');
        var interfaces = require('os').networkInterfaces(),
            baseUrl = null;

        for (var name in interfaces) {
            var option = _.find(interfaces[name], {internal: false, family: "IPv4"});
            if (option) {
                baseUrl = 'http://' + option.address + ':9010/';
                break;
            }
        }
        configs.forEach(function (file) {
            var data = grunt.file.read(file),
                platform = file.match(/platforms\/([A-Za-z0-9\._-]*)\/./)[1];
            data = data.replace('<content src="', '<content src="' + baseUrl + platform + '/www/');
            grunt.file.write(file, data);
        });
    }

    function setupWatches(platform) {
        //force continue for livereload
        grunt.option('force', true);
        grunt.config.merge({
            watch: {
                cordova: {
                    files: [
                        '<%= settings.dir.app %>/**/*',
                        'platforms/' + platform + '/platform_www/**/*',
                        'bower.json',
                        '!**/libs/**/*'
                    ],
                    tasks: ['cordova-prepare:' + platform],
                    options: {
                        spawn: true
                    }
                },
                cordovaprepare: {
                    files: [
                        'platforms/' + platform + '/www/modules/modules.js'
                    ],
                    options: {
                        livereload: 8010,
                        event: ['added','changed']
                    }
                }
            }
        });
    }

    function installCordova() {
        var deferred = q.defer();
        grunt.log.debug('Checking if cordova is installed...');
        exec('cordova help', function (error) {
            if (error) {
                grunt.log.debug('cordova is not installed, installing now...');
                exec('npm install cordova -g', function (error) {
                    if (error) {
                        grunt.fail.warn('Unable to install cordova: ' + error);
                        deferred.reject();
                    }
                    else {
                        grunt.log.debug('cordova is now installed.');
                        deferred.resolve();
                    }
                });
            }
            else {
                grunt.log.debug('cordova is installed already.');
                deferred.resolve();
            }
        });
        return deferred.promise;
    }

    function initCordova() {
        var deferred = q.defer();
        grunt.log.debug('Checking if cordova project is initialized...');
        if (!isConfiged) {
            var config = grunt.config('cordova'),
                installDir = settings.dir.temp + '/cordova';
            grunt.log.debug('project is not yet initialized, initializing now...');
            if (grunt.file.exists(installDir)) {
                grunt.file.delete(installDir);
            }
            if (!grunt.file.exists(settings.dir.temp)) {
                grunt.file.mkdir(settings.dir.temp);
            }
            exec('cordova create ' + installDir + ' ' + config.identifier + ' ' + config.title, function (error) {
                if (error) {
                    grunt.fail.warn('Unable to initialize cordova project: ' + error);
                    deferred.reject();
                }
                else {
                    var files = grunt.file.expand({filter: 'isFile', cwd: installDir, dot: true}, [
                        '**/*',
                        '!www/**/*'
                    ]);
                    files.forEach(function (file) {
                        grunt.file.copy(installDir + '/' + file, './' + file);
                    });
                    var dirs = grunt.file.expand({filter: 'isDirectory', cwd: installDir, dot: true}, '*');
                    dirs.forEach(function (dir) {
                        if (!grunt.file.exists(dir)) {
                            //make empty directories back on project root
                            grunt.file.mkdir(dir);
                        }
                    });
                    grunt.file.delete(installDir);
                    grunt.log.debug('project is now initialized.');
                    deferred.resolve();
                }
            });
        }
        else {
            grunt.log.debug('project is already initialized.');
            deferred.resolve();
        }
        return deferred.promise;
    }

    function syncPlatforms() {
        var deferred = q.defer(),
            currentPlatorms = platforms || [],
            neededPlatforms = grunt.config('cordova.platforms') || [],
            promises = [];

        currentPlatorms.forEach(function (platform) {
            if (neededPlatforms.indexOf(platform) === -1) {
                promises.push(removePlatform(platform));
            }
        });

        neededPlatforms.forEach(function (platform) {
            if (currentPlatorms.indexOf(platform) === -1) {
                promises.push(addPlatform(platform));
            }
        });

        platforms = neededPlatforms;

        q.all(promises).done(deferred.resolve);

        return deferred.promise;
    }

    function addPlatform(name) {
        var deferred = q.defer();
        grunt.log.debug('adding platorm ' + name);
        exec('cordova platform add ' + name, {cwd: settings.dir.cordova}, function (error) {
            if (error) {
                grunt.fail.warn('Unable to add platform ' + name + ': ' + error);
                deferred.reject();
            }
            else {
                grunt.log.debug('platform ' + name + ' added.');
                if (name === 'ios') {
                    exec('npm install ios-sim -g', function (err) {
                        deferred.resolve();
                    });
                }
                else {
                    deferred.resolve();
                }
            }
        });
        return deferred.promise;
    }

    function removePlatform(name) {
        var deferred = q.defer();
        grunt.log.debug('removing platorm ' + name);
        exec('cordova platform remove ' + name, {cwd: settings.dir.cordova}, function (error) {
            if (error) {
                grunt.fail.warn('Unable to remove platform ' + name + ': ' + error);
                deferred.reject();
            }
            else {
                grunt.log.debug('platform ' + name + ' removed.');
                deferred.resolve();
            }
        });
        return deferred.promise;
    }
};