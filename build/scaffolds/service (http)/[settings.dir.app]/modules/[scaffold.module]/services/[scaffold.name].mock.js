/**
 * @see https://docs.angularjs.org/api/ngMockE2E
 */
angular.module('ngMockE2E').run(function (/**ngMockE2E.$httpBackend*/ $httpBackend) {



    //TODO: register expects and/or when conditions for <%= scaffold.name %> http service

    $httpBackend.whenGET(new RegExp('/<%= hyphenCase(scaffold.module) %>/<%= hyphenCase(scaffold.name) %>/data')).respond(
        function (method, url, data) {
            data = {
                name: '<%= scaffold.name %>'
            };
            return [200, data];
        }
    );

});
