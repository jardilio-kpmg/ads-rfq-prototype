module.exports = function (grunt) {

    'use strict';

    var pattern = ['{.,platforms/*}/<%= settings.dir.app %>/modules/**/*.js'],
        templatePath = 'node_modules/grunt-jsdoc/node_modules/ink-docstrap/template',
        _ = require('lodash'),
        path = require('path');

    grunt.config.merge({
        clean: {
            docs: ['<%= settings.dir.docs %>']
        },
        copy: {
            docs: {
                files: [{
                    src: __dirname + '/docs.html',
                    dest: '<%= settings.dir.docs %>/index.html'
                }]
            }
        },
        jsdoc: {
            all: {
                //src: pattern //@see https://github.com/krampstudio/grunt-jsdoc/issues/59
                src: 'www/modules'
            },
            options: {
                destination: '<%= settings.dir.docs %>/js',
                template : templatePath,
                configure : 'jsdoc.conf.json',
                private: false,
                recurse: true
            }
        }
    });

    grunt.registerTask('apidocs', function(){
        var raml2html = require('raml2html'),
            ramlparser = require('raml-parser'),
            fs = require('fs-extra'),
            config = raml2html.getDefaultConfig(),
            dir = grunt.config('settings.dir.docs') + '/api',
            done = this.async();

        if (!grunt.file.isDir(dir)) {
            grunt.file.mkdir(dir);
        }

        config.template = require('./api-docs.handlebars');
        config.partials.resourceDetails = require('./api-docs-resourceDetails.handlebars');
        config.helpers.methodToBootstrapContext = function(method) {
            switch(method.toLowerCase()){
                case 'get':
                    return 'info';
                case 'post':
                    return 'success';
                case 'delete':
                    return 'danger';
                case 'put':
                    return 'warning';
                default:
                    return 'primary';
            }
        };

        var ramlRootFiles = grunt.file.expand('./api/*.raml'),
            doneCount = 0,
            fileDone = function() {
                doneCount++;
                if(doneCount === ramlRootFiles.length) {
                    done();
                }
            };


        var docsHtml = grunt.file.read(dir + '/../index.html'),
            context = {apis: []};

        _.each(ramlRootFiles, function(rootFile) {
            var api = {};
            api.name = path.basename(rootFile, '.raml');
            api.prettyname = (api.name.charAt(0).toUpperCase() + api.name.substr(1)).replace(/\./g, ' ');
            api.id = api.name.replace(/\./g, '-');
            context.apis.push(api);

            ramlparser.loadFile(rootFile).then(
                function (data) {
                    raml2html.render(data, config,
                        function (output) {
                            //@see https://github.com/intesso/connect-livereload/issues/48
                            output = output.replace('<!DOCTYPE HTML>', '<!doctype HTML>');
                            fs.ensureDirSync(dir);
                            fs.writeFileSync(dir + '/' + api.name + '.html', output, {encoding: 'utf-8'});
                            fileDone();
                        },
                        function (error) {
                            console.log('ERROR: [' + api.name + '] ' + JSON.stringify(error, null, 2));
                            fileDone();
                        });
                },
                function (error) {
                    console.log('ERROR: [' + api.name + '] ' + JSON.stringify(error, null, 2));
                    fileDone();
                }
            );
        });

        grunt.file.write(dir + '/../index.html', _.template(docsHtml)(context));

    });

    grunt.registerTask('docs', function() {
        grunt.config('watch.jsdoc', {
            files: pattern,
            tasks: 'jsdoc'
        });
        grunt.task.run(['clean:docs', 'copy:docs', 'apicodegen', 'jsdoc', 'apidocs']);
    });



};
