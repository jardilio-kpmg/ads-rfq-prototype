/**
 * Runs a server configured for different scenarios (ie app, test, dist, docs),
 * will open a browser and start a watch task so that all subtasks can watch for changes, update
 * then trigger live reload (if enabled in settings.json).
 *
 * DO NOT MODIFY THIS FILE IN YOUR PROJECT! INSTEAD, YOU CAN COPY
 * THE CONFIGURATION DATA AND PLACE THAT INTO YOUR gruntfile.js
 * THEN MODIFY ONLY THE PORTIONS YOU NEED. THIS WILL ALLOW YOUR
 * PROJECT TO BE UPDATED WITH CONFLICT TO NEWER VERSIONS.
 */
module.exports = function (grunt) {

    'use strict';

    var path = require('path'),
        settings = grunt.config('settings'),
        livereload = require('connect-livereload'),
        proxyRequest = require('grunt-connect-proxy/lib/utils').proxyRequest,
        bodyParser = require('body-parser'),
        fs = require('fs-extra');

    function mountFolder(connect, dir) {
        if (!grunt.file.exists(dir)) {
            grunt.file.mkdir(dir);
        }
        return connect.static(path.resolve(dir));
    }

    grunt.config.merge({
        server: {
            options: {
                watch: true
            }
        },
        open: {
            www: {
                path: 'http://localhost:<%= connect.www.options.port %>'
            },
            e2e: {
                path: 'http://localhost:<%= connect.e2e.options.port %>/test-reports/e2e/report.html'
            },
            test: {
                path: 'http://localhost:<%= connect.test.options.port %>/test-reports'
            },
            coverage: {
                path: 'http://localhost:<%= connect.test.options.port %>/test-reports/coverage'
            },
            dist: {
                path: 'http://localhost:<%= connect.dist.options.port %>'
            },
            docs: {
                path: 'http://localhost:<%= connect.docs.options.port %>'
            },
            apidesigner: {
                path: 'http://localhost:<%= connect.apidesigner.options.port %>'
            }
        },
        connect: {
            www: {
                options: {
                    port: 9000,
                    hostname: '*',
                    middleware: function (connect) {
                        return [
                            proxyRequest,
                            livereload({port: 8000}),
                            mountFolder(connect, settings.dir.temp + '/' + settings.dir.app),
                            mountFolder(connect, settings.dir.app)
                        ];
                    }
                }
            },
            e2e: {
                options: {
                    port: 9000,
                    hostname: '*',
                    middleware: function (connect) {
                        return [
                            proxyRequest,
                            livereload({port: 8000}),
                            mountFolder(connect, settings.dir.temp),
                            mountFolder(connect, settings.dir.temp + '/' + settings.dir.app),
                            mountFolder(connect, settings.dir.app)
                        ];
                    }
                }
            },
            test: {
                options: {
                    port: 9001,
                    hostname: '*',
                    middleware: function (connect) {
                        return [
                            proxyRequest,
                            livereload({
                                port: 8001,
                                ignore: [/.*test\-reports\/+$/]
                            }),
                            mountFolder(connect, settings.dir.temp + '/test'),
                            mountFolder(connect, settings.dir.temp)
                        ];
                    }
                }
            },
            dist: {
                options: {
                    port: 9002,
                    hostname: '*',
                    middleware: function (connect) {
                        return [
                            proxyRequest,
                            livereload({port: 8002}),
                            mountFolder(connect, settings.dir.temp + '/' + settings.dir.app),
                            mountFolder(connect, settings.dir.app)
                        ];
                    }
                }
            },
            docs: {
                options: {
                    port: 9003,
                    hostname: '*',
                    middleware: function (connect) {
                        return [
                            proxyRequest,
                            livereload({port: 8003}),
                            mountFolder(connect, settings.dir.docs)
                        ];
                    }
                }
            },
            apidesigner: {
                options: {
                    port: 9004,
                    keepalive: true,
                    open: "http://localhost:9004/#edit",
                    hostname: '*',
                    middleware: function (connect) {
                        return [
                            proxyRequest,
                            bodyParser.json(),
                            require('connect-route')(function(app){

                                var dir = path.resolve('./api');

                                app.get('/',function(req, res){
                                    res.end(fs.readFileSync('./build/tasks/api-designer.html', {encoding: 'utf8'}));
                                });
                                app.get('/files', function(req, res) {
                                    var filelist = [];
                                    var processDirectory = function(node, relativePath) {
                                        var allFiles = fs.readdirSync(relativePath);
                                        for(var i in allFiles){
                                            if (!allFiles.hasOwnProperty(i)) continue;
                                            var name = relativePath+'/'+allFiles[i],
                                                relativeName = name.replace(dir, '');
                                            var entry = {
                                                name: relativeName,
                                                path: relativeName,
                                                meta: {
                                                    created: Math.round(new Date().getTime() / 1000.0)
                                                }
                                            };
                                            node.push(entry);

                                            if (!fs.statSync(name).isDirectory()){
                                                entry.type = 'file';
                                            } else {
                                                entry.type = 'folder';
                                                entry.children = [];
                                                processDirectory(entry.children, name);
                                            }
                                        }
                                    };

                                    processDirectory(filelist, dir);

                                    res.end(JSON.stringify({
                                        path: '/',
                                        name: '',
                                        type: 'folder',
                                        children: filelist,
                                        meta: {
                                            created: Math.round(new Date().getTime() / 1000.0)
                                        }
                                    }));
                                });

                                app.get('/files/:id', function(req, res) {
                                    var id = req.params.id.replace(/!/g, '/');
                                    if(id.indexOf('.meta')>0) {
                                        res.end(JSON.stringify({
                                            created: Math.round(new Date().getTime() / 1000.0)
                                        }));
                                        return;
                                    }
                                    res.end(fs.readFileSync(dir + '/' + id, {encoding: 'utf8'}));
                                });

                                app.post('/files/:id', function(req, res) {
                                    var id = req.params.id.replace(/!/g, '/');
                                    fs.ensureFileSync(dir+'/' + id);
                                    fs.writeFileSync(dir+'/' + id, req.body.contents);
                                    res.end(JSON.stringify({status:'success'}));
                                });

                                app.delete('/files/:id', function(req, res) {
                                    var id = req.params.id.replace(/!/g, '/');
                                    fs.deleteSync(dir+'/' + id);
                                    res.end(JSON.stringify({status:'success'}));
                                });
                            }),
                            mountFolder(connect, path.resolve('./node_modules/api-designer/dist'))
                        ]
                    }
                }
            }
        }
    });

    grunt.registerTask('server', function (target) {
        target = target || 'www';
        grunt.config.merge({
            watch: {
                server: {
                    files: [
                        '<%= settings.dir.app %>/*.html',
                        '<%= settings.dir.temp %>/<%= settings.dir.app %>/**/*.*',
                        '<%= settings.dir.temp %>/test-reports/*/index.html',
                        '<%= settings.dir.docs %>'
                    ]
                },
                options: {
                    livereload: grunt.config('connect')[target].options.port - 1000
                }
            }
        });

        //force continue for livereload
        grunt.option('force', true);
        grunt.config('build.options.specs', target === 'test');
        grunt.config('build.options.dist', target === 'dist' || grunt.option('dist'));
        grunt.config('build.options.watch', true);

        var tasks = [];

        switch(target) {
        case 'docs':
            tasks.push('docs');
            break;
        case 'test':
            tasks.push('test:server');
            break;
        default:
            tasks.push('build:www');
            break;
        }

        tasks.push('connect:' + target);

        if (target === 'e2e') {
            grunt.config('protractor.options.args.baseUrl', grunt.config('open.www.path'));
            tasks.push('e2e:server');
        }

        if (this.options().watch) {
            tasks.push('open:' + target);
            tasks.push('watch');
        }

        grunt.task.run(tasks);
    });

};
