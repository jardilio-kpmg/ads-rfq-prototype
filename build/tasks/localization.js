module.exports = function (grunt) {
    'use strict';

    var _ = require('lodash'),
        defaultLocale = grunt.config('defaultlocale') || 'en';

    grunt.config.merge({
        localization: {
            fromRESX: {
                expand: true,
                src: ['<%= settings.dir.app %>/modules/*/locales/*/*.resx'],
                mode: 'fromRESX'
            },
            toRESX: {
                expand: true,
                src: ['<%= settings.dir.app %>/modules/*/locales/*/*.json'],
                mode: 'toRESX'
            }
        }
    });

    function saveUpdatedStrings(jsonFilename, updatedStrings) {
        // parser stream is done, and ready to have more stuff written to it.
        var _ = require('lodash'),
            json = grunt.file.exists(jsonFilename) ? grunt.file.readJSON(jsonFilename) : {},
            keysToRemove = _.omit(json, _.keys(updatedStrings)),
            keysToAdd = _.omit(updatedStrings, _.keys(json)),
            changes = {};


        _.each(_.keys(updatedStrings), function(key) {
           if(json[key] && updatedStrings[key] !== json[key]) {
               changes[key] = {
                   'old': json[key],
                   'new': updatedStrings[key]
               };
           }
        });

        grunt.log.writeln('Updating ' + jsonFilename);
        if (_.size(keysToAdd)) {
            grunt.log.ok('Added:');
            grunt.log.ok(JSON.stringify(keysToAdd, null, '\t'));
        }
        if (_.size(changes)) {
            grunt.log.ok('Changed:');
            grunt.log.ok(JSON.stringify(changes, null, '\t'));
        }
        if (_.size(keysToRemove)) {
            grunt.log.warn('Removed:');
            grunt.log.warn(JSON.stringify(keysToRemove, null, '\t'));
        }
        grunt.file.write(jsonFilename, JSON.stringify(updatedStrings, null, '\t'));
    }

    function resxToJson(resxFilename) {
        var sax = require('sax'),
            jsonFilename = resxFilename.replace('.resx', '.json'),
            xml = grunt.file.read(resxFilename),
            parser = sax.parser(true),
            inDataTag = false,
            inDataValueTag = false,
            key = null,
            parsedResx = {};

        parser.onerror = function (e) {
            grunt.log.error('Could not parse ' + resxFilename + ': ' + JSON.stringify(e));
        };
        parser.ontext = function (t) {
            // got some text.  t is the string of text.
            if (inDataValueTag) {
                parsedResx[key] = t;
            }
        };
        parser.onopentag = function (node) {
            // opened a tag.  node has "name" and "attributes"
            if (node.name === 'data') {
                inDataTag = true;
                key = node.attributes.name;
            } else if (inDataTag && node.name === 'value') {
                inDataValueTag = true;
            }
        };
        parser.onclosetag = function (name) {
            // closed a tag
            if (name === 'data') {
                inDataTag = false;
            } else if (name === 'value') {
                inDataValueTag = false;
            }
        };
        parser.onend = function () {
            saveUpdatedStrings(jsonFilename, parsedResx);
        };

        parser.write(xml).close();
    }

    function jsonToResx(jsonFilename) {
        var _ = require('lodash'),
            resxFilename = jsonFilename.replace('.json', '.resx'),
            template = grunt.file.read(__dirname + '/localization.resx'),
            json = grunt.file.readJSON(jsonFilename),
            resxValues = _.reduce(json, function(result, value, key) {
                return result + '\t<data name="' + key + '" xml:space="preserve"><value>'+value+'</value></data>\n'
            },'\n');

        grunt.file.write(resxFilename, template.replace('<!--PLACEHOLDER-->', resxValues));
    }

    grunt.registerMultiTask('localization', 'import/export various formats of localized strings', function(){

        switch(this.data.mode){
            case 'fromRESX':
                this.filesSrc.forEach(resxToJson);
                break;
            case 'toRESX':
                this.filesSrc.forEach(jsonToResx);
                break;
                break;
            default:
                grunt.log.error('Must specify "fromRESX" or "toRESX" target');
        }
    });

    //bundle all resource files from all modules into single bundles
    grunt.registerTask('localization-bundle', function () {
        var settings = grunt.config('settings'),
            filesGlob = settings.dir.app + '/modules/**/locales/*/*.json',
            files = grunt.file.expand(filesGlob),
            temp = grunt.config('build.options.temp'),
            destContents = {};

        grunt.file.delete(temp + '/' + settings.dir.app + '/locales/');

        files.forEach(function (file) {
            var parts = file.split('/'),
                lang = parts[parts.length-2],
                filename = parts[parts.length-1],
                dest = temp + '/' + settings.dir.app + '/locales/' + lang + '/' + filename;

            if (!destContents[dest]) {
                destContents[dest] = grunt.file.exists(dest) ? grunt.file.readJSON(dest) : {};
            }
            _.merge(destContents[dest], grunt.file.readJSON(file));
        });

        _.forEach(destContents, function (contents, file) {
            grunt.file.write(file, JSON.stringify(contents, null, 2));
        });

        grunt.config.merge({
            watch: {
                'localization-bundle': {
                    files: [filesGlob],
                    tasks: ['localization-bundle']
                }
            }
        });

        grunt.task.run('localization-pseudoloc');
    });

    //make a phony translation for testing purposes, don't use grunt-pseudoloc as it fails with complex json objects
    grunt.registerTask('localization-pseudoloc', function () {
        var settings = grunt.config('settings'),
            defaultlocale = grunt.config('defaultlocale') || 'en',
            temp = grunt.config('build.options.temp'),
            filesGlob = temp + '/' + settings.dir.app + '/locales/' + defaultlocale + '/*.json',
            files = grunt.file.expand(filesGlob),
            pseudoloc = require('pseudoloc');

        //this is the delimiter used for variables in i18next by default
        pseudoloc.option.delimiter = '__';

        //walk the object structure recursively for translations
        function translate(obj) {
            if (typeof(obj) === 'string') {
                return pseudoloc.str(obj);
            }
            else if (obj instanceof Array) {
                for (var i = 0; i < obj.length; i++) {
                    obj[i] = translate(obj);
                }
            }
            else if (obj instanceof Object) {
                for(var prop in obj) {
                    obj[prop] = translate(obj[prop]);
                }
            }
            return obj;
        }

        console.log(filesGlob + ' = ' + files.toString());

        files.forEach(function (file) {
            var parts = file.split('/'),
                filename = parts[parts.length-1],
                dest = temp + '/' + settings.dir.app + '/locales/qps/' + filename,
                contents = grunt.file.readJSON(file);

            grunt.file.write(dest, JSON.stringify(translate(contents), null, 2));
        });
    });
};
