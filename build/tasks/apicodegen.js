/**
 * This file invokes the /build/scaffolds/_api scaffold based on parsed RAML files
 */
module.exports = function (grunt) {
    grunt.config.merge({
        clean: {
            apicodegen: [
                '<%= settings.dir.app %>/**/*.generated*.js'
            ]
        },
        watch: {
            apicodegen: {
                files: ['api/**/*.raml', 'build/scaffolds/.api/**/*.js'],
                tasks: ['apicodegen'],
                options: {
                    spawn: false
                }
            }
        }
    });
    grunt.registerTask('apicodegen', ['clean:apicodegen','_apicodegen']);
    grunt.registerTask('_apicodegen', function(){
    var path = require('path'),
        fs = require('fs-extra'),
        raml = require('raml-parser'),
        _ = require('lodash'),
        files = grunt.file.expand('./api/*.raml'),
        Context = require('./libs/TemplateContext'),
        Engine = require('./libs/TemplateEngine');

        if (!files.length) {
            return;
        }

        var done = this.async(),
        doneCount = 0,
        fileDone = function(){
            doneCount++;
            if(doneCount >= files.length) {
                done();
            }
        };

        files.forEach(function (file) {
            raml.loadFile(file).then(
                function(data) {
                    try {
                        var context = new Context({
                            filename: path.basename(file, '.raml'),
                            api: data,
                            settings: grunt.config('settings'),
                            scaffold: {task: '.api'},
                            methodMap: {
                                get: 'get',
                                put: 'update',
                                post: 'create',
                                delete: 'remove'
                            },
                            getSchemas: function (object) {
                                return [];//TODO: need to get all schema definitions at all levels
                                var schemas = [], self = this;
                                _.forEach(object, function (child, property) {
                                    if (property === 'schema') {
                                        try {
                                            schemas.push(JSON.parse(child));
                                        }
                                        catch (error) {
                                            //silent
                                        }
                                    }
                                    else if (property === 'schemas') {
                                        schemas = schemas.concat(child);
                                        child.forEach(function (schema) {
                                            try {
                                                schemas.push(JSON.parse(schema));
                                            }
                                            catch (error) {
                                                //silent
                                            }
                                        });
                                    }
                                    else if (typeof(child) === 'object') {
                                        schemas = schemas.concat(self.getSchemas(child));
                                    }
                                });
                                return schemas;
                            },
                            getActionName: function (method, resource, isCollection) {
                                var isResourceMemberOfCollection = this.isResourceMemberOfCollection(resource),
                                    action = !isResourceMemberOfCollection && method.method === 'get' ? 'query' : this.methodMap[method.method],
                                    suffix = isCollection || isResourceMemberOfCollection ? '' : this.camelCase(resource.displayName);
                                return action + suffix;
                            },
                            getAngularUrl: function (url) {
                                return url.split('{').join(':').split('}').join('');
                            },
                            getRequestBodySchema: function (method) {
                                var json = {};
                                if (method.body && method.body['application/json'] && method.body['application/json'].schema) {
                                    json = method.body['application/json'].schema;
                                    try {
                                        json = JSON.parse(json);
                                    }
                                    catch (error) {
                                        console.log('error parsing: ' + json + '\n' + error);
                                    }
                                }
                                return json;
                            },
                            //determine if this is /entity/{id}
                            isResourceMemberOfCollection: function (resource) {
                                if (resource.uriParameters) {
                                    for (var name in resource.uriParameters) {
                                        if ('/{' + name + '}' === resource.relativeUri) {
                                            return true;
                                        }
                                    }
                                }
                                return false;
                            },
                            //change resource/{resourceId}/child into resource\/.*\/child
                            regexUrl: function (url) {
                                url = url.replace(/\{[^\}]*\}/g, '.*');
                                url = url.replace(/\//g, '\\/');
                                return '/' + url + '/';
                            },
                            getResponseExample: function (method) {
                                for (var code in method.responses) {
                                    if (code.indexOf('20') === 0) {
                                        return ((method.responses[code] && method.responses[code].body && method.responses[code].body['application/json'] && method.responses[code].body['application/json'].example) || '""').trim();
                                    }
                                }
                                return '""';
                            },
                            //flattends json schema for member so we can do @property {string} [root.child.grandchild] - Definition
                            getMemberProperties: function (schema, path) {
                                if (!schema) return [];
                                path = path || '';
                                var items = [], self = this;
                                if (path) {
                                    items.push({
                                        displayName: path,
                                        required: schema.required,
                                        type: schema.type,
                                        description: schema.description
                                    });
                                }
                                if (schema.properties) {
                                    path = path ? path + '.' : '';
                                    _.each(schema.properties, function (item, name) {
                                        items = items.concat(self.getMemberProperties(item, path + name));
                                    });
                                }
                                return items;
                            },
                            typeDoc: function (definition, pathPrefix) {
                                pathPrefix = pathPrefix || '';
                                return '{' + definition.type + '} ' + this.optionalize(pathPrefix + definition.displayName, definition.required) + ' - ' + definition.description;
                            },
                            optionalize: function (name, required) {
                                var optionalPrefix = required ? '' : '[',
                                    optionalSuffix = required ? '' : ']';
                                return optionalPrefix + name + optionalSuffix;
                            },
                            hasRequiredFields: function (fields) {
                                if (!fields || !fields.length) return false;
                                for (var i = 0; i < fields.length; i++) {
                                    if (fields[i].required) return true;
                                }
                                return false;
                            },
                            extractParams: function (resource, method, parentUriParameters) {
                                var params = {all: [], url: [], form: [], json: []},
                                    uriParams = _.extend({}, parentUriParameters || {}, resource.uriParameters);

                                params.query = _.map(method.queryParameters, function (param) {
                                    param.type = param.type || '';
                                    param.required = !!param.required;
                                    params.all.push(param);
                                    params.url.push(param);
                                    return param;
                                }) || [];

                                params.uri = _.map(uriParams, function (param) {
                                    param.type = param.type || '';
                                    param.required = 'required' in param ? param.required : true;
                                    params.all.push(param);
                                    params.url.push(param);
                                    return param;
                                }) || [];

                                params.headers = _.map(method.headers, function (param) {
                                    param.type = param.type || '';
                                    param.required = 'required' in param ? param.required : true;
                                    params.all.push(param);
                                    return param;
                                }) || [];

                                if (method.body && method.body['application/x-www-form-urlencoded'] && method.body['application/x-www-form-urlencoded'].formParameters) {
                                    params.form = _.map(method.body['application/x-www-form-urlencoded'].formParameters, function (param) {
                                        param.type = param.type || '';
                                        param.required = !!param.required;
                                        params.all.push(param);
                                        return param;
                                    }) || [];
                                }

                                if (method.body && method.body['application/json']) {
                                    // TODO analyze the JSON schema to make this more specific
                                    var description = 'JSON payload';
                                    var p = {
                                        type: 'Object',
                                        required: true,
                                        displayName: 'data',
                                        description: 'JSON payload',
                                        schema: method.body['application/json'].schema,
                                        example: method.body['application/json'].example
                                    };
                                    params.json = [p];
                                    params.all.push(p);
                                }

                                return params;
                            }
                        }),
                        engine = new Engine(context, 'css');

                        engine.create();
                        fileDone();

                    } catch(ex){
                        console.log("exception: " + ex);
                        fileDone();
                    }

                },
                function(error) {
                    console.log("error: " + JSON.stringify(error, null, '\t'));
                    fileDone();
                }
            );
        });

    });
};
