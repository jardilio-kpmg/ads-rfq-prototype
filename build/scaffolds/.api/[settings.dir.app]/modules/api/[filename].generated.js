/*jshint -W101 */
<%
if(!obj.recursive) { %> // THIS FILE IS AUTO-GENERATED. DO NOT MODIFY.  RUN 'gulp api' TO EDIT THE SPECIFICATION
  /**
   * @namespace <%= filename %>
   */

  /**
   * @callback <%= filename %>.ISuccessCallback
   * @param {*} result - The result of executed operation
   * @param {string} [status] - The status code returned on the response
   * @param {object} [headers] - The headers returned on the response
   * @param {object} [config] - The config object used to create the request
   */

  /**
   * @callback <%= filename %>.IErrorCallback
   * @param {*} error - The error of executed operation
   * @param {string} [status] - The status code returned on the response
   * @param {object} [headers] - The headers returned on the response
   * @param {object} [config] - The config object used to create the request
   */

  /**
   * @class <%= filename %>.Promise
   * @function
   * @methodOf <%= filename %>.Promise
   * @name <%= filename %>.Promise#then
   * @param {<%= filename %>.ISuccessCallback} [success] - Success callback function
   * @param {<%= filename %>.IErrorCallback} [error] - Error callback function
   */
<% _.each(getSchemas(api), function (schema) {
    _.each(schema, function (definition) {
      var name = definition.id;
      if (definition.type === 'array') { %>
        /**
         <%= commentBlock(definition.description, ' * ') %>
         * @class <%= filename %>.I<%= camelCase(name) %>
         * @extends {<%= filename %>.I<%= camelCase(name) %>Item[]}
         */
      <%
        //continue to process the items for this collection
        name += 'Item';
        definition = definition.items;
      } //if (definition.type === 'array'
      var properties = getMemberProperties(definition); %>
      /*
      <%= JSON.stringify(definition, null, 2) %>
       */
      /**
       <%= commentBlock(definition.description, ' * ') %>
       * @class <%= filename %>.I<%= camelCase(name) %>
       * @extends <%= definition.type %><% _.each(properties, function (property) { %>
       * @property <%= typeDoc(property) %><% }); //_.each(properties %>
       */
      <% }); //_.each(schema
  });//_.each(api.schemas %>
  var angular = require('angular'),
      module = angular.module('<%= filename %>', ['ngResource']),
      config = require('config');<%
}//if(!obj.recursive)
_.each(api.resources, function(resource) {
  var relativeUri = resource.relativeUri.substr(1),
    camelCaseName = camelCase(api.parentDisplayName) + camelCase(resource.displayName),
    relativeUri = getAngularUrl(api.baseUri + resource.relativeUri);
  %>
  /**
   <%= commentBlock(resource.description, ' * ') %>
   * @class <%= filename %>.<%= camelCaseName %>
   * @extends <%= filename %>.I<%= camelCase(resource.displayName) %>
   * @property {<%= filename %>.Promise} $promise - The promise associated with the async operation.
   */
   /* istanbul ignore next */
  module.factory('<%= camelCaseName %>', function ($resource) {
      var servicesBaseUrl = config.server;
      return $resource(
        servicesBaseUrl + '<%= relativeUri %>',
        {},
        {<% _.each(resource.methods, function (method) {
          var action = getActionName(method, resource, true),
            params = extractParams(resource, method, api.parentUriParameters);
          if (method.method === 'get') { %>
            /**
             <%= commentBlock(method.description, ' * ') %>
             * @function
             * @methodOf <%= filename %>.<%= camelCaseName %>
             * @name <%= filename %>.<%= camelCaseName %>.<%= action %>
             * @param {object} <%= optionalize('params', hasRequiredFields(params.url)) %> - Input parameters<% _.each(params.url, function (param) { %>
         * @param <%= typeDoc(param, 'params.') %><% }); //_.each(params.url %>
             * @param {<%= filename %>.ISuccessCallback} [success] - Success callback function
             * @param {<%= filename %>.IErrorCallback} [error] - Error callback function
             * @returns {<%= filename %>.<%= camelCaseName + (action.indexOf('query') === 0 ? '[]' : '') %>}
             * @example
             * function Controller(<%= camelCaseName %>) {
         *  var result = <%= camelCaseName %>.<%= action %>({<% _.each(params.url, function (param) { %>
         *    <%= param.displayName %>: '',<% }); //_.each(params.url %>
         *  });
         * }
             */
          <% } //if (method.method === 'get'
          else { %>
            /**
             <%= commentBlock(method.description, ' * ') %>
             * @function
             * @methodOf <%= filename %>.<%= camelCaseName %>
             * @name <%= filename %>.<%= camelCaseName %>#$<%= action %>
             * @param {object} <%= optionalize('params', hasRequiredFields(params.url)) %> - Input parameters<% _.each(params.url, function (param) { %>
         * @param <%= typeDoc(param, 'params.') %><% }); //_.each(params.url %>
             * @param {<%= filename %>.ISuccessCallback} [success] - Success callback function
             * @param {<%= filename %>.IErrorCallback} [error] - Error callback function
             * @returns {<%= filename %>.<%= camelCaseName + (action.indexOf('query') === 0 ? '[]' : '') %>}
             * @example
             * function Controller(<%= camelCaseName %>) {
         *  var result = new <%= camelCaseName %>();<% _.each(params.uri, function (param) { %>
         *  result.<%= param.displayName %> = '';<% }); //_.each(params.uri %>
         *  result.$<%= action %>(params);
         * }
             */
          <% } %>
          '<%= action %>': {
            method: '<%= method.method.toUpperCase() %>',
              isArray: <%= action.indexOf('query') === 0 %>,
              params: {<%_.each(params.uri, function (param) { %>
              <%= param.displayName %>: '@<%= param.displayName %>',<% }); //_.each(params.uri %>
            }
          },
          <% }); //_.each(resource.methods
      _.each(resource.resources, function (child) { _.each(child.methods, function (method) {
        var action = getActionName(method, child),
          params = extractParams(child, method, api.parentUriParameters);
        if (method.method === 'get') { %>
          /**
           <%= commentBlock(method.description, ' * ') %>
           * @function
           * @methodOf <%= filename %>.<%= camelCaseName %>
           * @name <%= filename %>.<%= camelCaseName %>.<%= action %>
           * @param {object} <%= optionalize('params', hasRequiredFields(params.url)) %> - Input parameters<% _.each(params.url, function (param) { %>
         * @param <%= typeDoc(param, 'params.') %><% }); //_.each(params.url %>
           * @param {<%= filename %>.ISuccessCallback} [success] - Success callback function
           * @param {<%= filename %>.IErrorCallback} [error] - Error callback function
           * @returns {<%= filename %>.<%= camelCaseName + (action.indexOf('query') === 0 ? '[]' : '') %>}
           * @example
           * function Controller(<%= camelCaseName %>) {
         *  var result = <%= camelCaseName %>.<%= action %>({<% _.each(params.url, function (param) { %>
         *    <%= param.displayName %>: '',<% }); //_.each(params.url %>
         *  });
         * }
           */
        <% } //if (method.method === 'get'
        else { %>
          /**
           <%= commentBlock(method.description, ' * ') %>
           * @function
           * @methodOf <%= filename %>.<%= camelCaseName %>
           * @name <%= filename %>.<%= camelCaseName %>#$<%= action %>
           * @param {object} <%= optionalize('params', hasRequiredFields(params.url)) %> - Input parameters<% _.each(params.url, function (param) { %>
         * @param <%= typeDoc(param, 'params.') %><% }); //_.each(params.url %>
           * @param {<%= filename %>.ISuccessCallback} [success] - Success callback function
           * @param {<%= filename %>.IErrorCallback} [error] - Error callback function
           * @returns {<%= filename %>.<%= camelCaseName + (action.indexOf('query') === 0 ? '[]' : '') %>}
           * @example
           * function Controller(<%= camelCaseName %>) {
         *  var result = new <%= camelCaseName %>();<% _.each(params.uri, function (param) { %>
         *  result.<%= param.displayName %> = '';<% }); //_.each(params.uri %>
         *  result.$<%= action %>(params);
         * }
           */
        <% } %>
        '<%= action %>': {
          url: servicesBaseUrl + '<%= relativeUri %><%= getAngularUrl(child.relativeUri) %>',
            method: '<%= method.method.toUpperCase() %>',
            isArray: <%= action.indexOf('query') === 0 %>,
            params: {<%_.each(params.uri, function (param) { %>
            <%= param.displayName %>: '@<%= param.displayName %>',<% }); //_.each(params.uri %>
          }
        },<% }); }); //_.each(getFlattenedResources %>
    },
    {
      stripTrailingSlashes: true
    }
  );
});
<%
_.each(resource.resources, function (child) {
  if (_.has(child, 'resources')) {
    // recursively handle nested resources
    var childContext = new obj.constructor();
    _.extend(childContext, _.cloneDeep(obj));
    childContext.recursive = true;
    childContext.api.parentDisplayName = child.displayName;
    childContext.api.resources = child.resources;
    childContext.api.parentUriParameters = _.extend({}, api.parentUriParameters || {}, child.uriParameters);
    childContext.api.baseUri = api.baseUri + resource.relativeUri + child.relativeUri;
    print(templateFn(childContext));
  }//if(_.has(child
});
}); //_.each(api.resources
%>
