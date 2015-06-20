<%
if(!obj.recursive) { %> // THIS FILE IS AUTO-GENERATED. DO NOT MODIFY.  RUN 'grunt server:apidesigner' TO EDIT THE SPECIFICATION
//this is not included if the --nomocks flag is set during build
angular.module('<%= filename %>').requires.push('ngMockE2E');
angular.module('<%= filename %>').run(function ($httpBackend) {<%
} //if(!obj.recursive
_.each(api.resources, function (resource) {
  //go recursive first because we need to define most specific URL's first
  if (_.has(resource, 'resources')) {
    // recursively handle nested resources
    var childContext = new obj.constructor();
    _.extend(childContext, _.cloneDeep(obj));
    childContext.recursive = true;
    childContext.api.parentDisplayName = resource.displayName;
    childContext.api.parentRelativeUri = resource.relativeUri;
    childContext.api.resources = resource.resources;
    childContext.api.baseUri = api.baseUri + resource.relativeUri;
    print(templateFn(childContext));
  }//if(_.has(resource
  _.each(resource.methods, function (method) { %>
  // <%= resource.displayName + ':' + method.method %>
  <% if (_.contains(resource.is, 'mock')) { %>$httpBackend.when('<%= method.method.toUpperCase() %>', <%=  regexUrl(api.baseUri + resource.relativeUri) %>).respond(<%= getResponseExample(method) %>);<% } //if (_.has(resource.is, 'mock')
  else { %>$httpBackend.when('<%= method.method.toUpperCase() %>', <%=  regexUrl(api.baseUri + resource.relativeUri) %>).passThrough();<% } //else
  }); //_.each(resource.methods
}); //_.each(api.resources
if(!obj.recursive) { %>
});//angular.module
<% } //if(!obj.recursive %>
