/**
 * @see https://docs.angularjs.org/api/ngMockE2E
 */
angular.module('ngMockE2E').run(function (/**ngMockE2E.$httpBackend*/ $httpBackend) {



    //TODO: register expects and/or when conditions for upcService http service

    $httpBackend.whenGET(new RegExp('/server/upc-service/data')).respond(
        function (method, url, data) {
            data = {
                name: 'upcService'
            };
            return [200, data];
        }
    );

});
